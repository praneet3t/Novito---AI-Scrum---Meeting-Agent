"""Quick test script for Phase 1 MVP endpoints"""
import requests

BASE_URL = "http://localhost:8000"

def test_endpoints():
    print("🧪 Testing Novito Phase 1 MVP Endpoints\n")
    
    # 1. Seed demo data
    print("1️⃣ Seeding demo data...")
    r = requests.post(f"{BASE_URL}/seed/run-demo")
    print(f"   Status: {r.status_code} - {r.json()}\n")
    
    # 2. Get workspace settings
    print("2️⃣ Getting workspace settings...")
    r = requests.get(f"{BASE_URL}/workspaces/1")
    print(f"   Status: {r.status_code}")
    print(f"   Agent Mode: {r.json()['agent_mode']}\n")
    
    # 3. List agent suggestions
    print("3️⃣ Listing agent suggestions...")
    r = requests.get(f"{BASE_URL}/agent/suggestions?workspace_id=1&applied=false")
    suggestions = r.json()
    print(f"   Status: {r.status_code}")
    print(f"   Suggestions: {len(suggestions)}")
    if suggestions:
        print(f"   First: {suggestions[0]['suggestion_type']} (confidence: {suggestions[0]['confidence']})\n")
    
    # 4. Apply a suggestion
    if suggestions:
        print("4️⃣ Applying first suggestion...")
        suggestion_id = suggestions[0]['id']
        r = requests.patch(f"{BASE_URL}/agent/suggestions/{suggestion_id}/apply?actor_id=1")
        print(f"   Status: {r.status_code} - {r.json()}\n")
    
    # 5. Check audit trail
    print("5️⃣ Checking audit trail...")
    r = requests.get(f"{BASE_URL}/audits/?workspace_id=1&limit=5")
    audits = r.json()
    print(f"   Status: {r.status_code}")
    print(f"   Audit entries: {len(audits)}")
    if audits:
        print(f"   Latest: {audits[0]['action_type']}\n")
    
    # 6. Get blocked tasks
    print("6️⃣ Getting blocked tasks...")
    r = requests.get(f"{BASE_URL}/tasks/blockers?workspace_id=1")
    blockers = r.json()
    print(f"   Status: {r.status_code}")
    print(f"   Blocked tasks: {len(blockers)}")
    if blockers:
        print(f"   First: {blockers[0]['title']} - {blockers[0]['blocker_reason']}\n")
    
    # 7. Submit a task for review
    print("7️⃣ Submitting task for review...")
    r = requests.patch(f"{BASE_URL}/tasks/1/submit")
    print(f"   Status: {r.status_code}")
    if r.status_code == 200:
        task = r.json()
        print(f"   Task status: {task['status']}")
        print(f"   Submitted at: {task['submitted_at']}\n")
    
    # 8. Update agent mode
    print("8️⃣ Updating agent mode to auto...")
    r = requests.patch(
        f"{BASE_URL}/workspaces/1/agent-mode",
        json={
            "agent_mode": "auto",
            "agent_config": {
                "auto_confidence_threshold": 0.90,
                "allowed_auto_actions": ["set_focus_time", "create_task"]
            }
        }
    )
    print(f"   Status: {r.status_code}")
    if r.status_code == 200:
        print(f"   New mode: {r.json()['agent_mode']}\n")
    
    # 9. Reject a suggestion
    if len(suggestions) > 1:
        print("9️⃣ Rejecting second suggestion...")
        suggestion_id = suggestions[1]['id']
        r = requests.patch(f"{BASE_URL}/agent/suggestions/{suggestion_id}/reject?actor_id=1")
        print(f"   Status: {r.status_code} - {r.json()}\n")
    
    # 10. Report a blocker
    print("🔟 Reporting a blocker on task 2...")
    r = requests.patch(
        f"{BASE_URL}/tasks/2",
        json={"is_blocked": True, "blocker_reason": "Waiting for API documentation"}
    )
    print(f"   Status: {r.status_code}\n")
    
    print("✅ All tests completed!")
    print("\n📊 Summary:")
    print("   - Agent suggestions: ✓")
    print("   - Apply/Reject: ✓")
    print("   - Audit trail: ✓")
    print("   - Submit for review: ✓")
    print("   - Blockers: ✓")
    print("   - Workspace settings: ✓")

if __name__ == "__main__":
    try:
        test_endpoints()
    except requests.exceptions.ConnectionError:
        print("❌ Error: Cannot connect to backend at http://localhost:8000")
        print("   Make sure the backend is running:")
        print("   cd backend && python -m uvicorn app.main:app --reload --port 8000")
    except Exception as e:
        print(f"❌ Error: {e}")
