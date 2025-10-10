"""Integration test for meeting -> review -> approve -> task flow"""
import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.database import SessionLocal
from app.seed_data import seed_all

client = TestClient(app)

@pytest.fixture(scope="module")
def setup_db():
    """Setup test database with seed data"""
    db = SessionLocal()
    seed_all(db)
    db.close()
    yield
    # Cleanup would go here

def test_full_workflow(setup_db):
    """Test complete workflow: login -> process meeting -> review -> approve"""
    
    # 1. Login
    login_response = client.post("/auth/login", json={
        "username": "admin",
        "password": "admin123"
    })
    assert login_response.status_code == 200
    token = login_response.json()["token"]
    
    # 2. Process meeting
    meeting_response = client.post("/meetings/process", json={
        "workspace_id": 1,
        "title": "Test Meeting",
        "meeting_date": "2025-01-15T10:00:00",
        "transcript": "Dev1: I will implement the new feature by Friday."
    })
    assert meeting_response.status_code == 200
    assert "candidates" in meeting_response.json()
    
    # 3. Get review queue
    review_response = client.get("/tasks/review?workspace_id=1")
    assert review_response.status_code == 200
    suggestions = review_response.json()
    assert len(suggestions) > 0
    
    # 4. Approve first suggestion
    first_suggestion = suggestions[0]
    approve_response = client.patch(f"/tasks/{first_suggestion['id']}/approve")
    assert approve_response.status_code == 200
    
    # 5. Verify task was created
    tasks_response = client.get("/tasks/?workspace_id=1")
    assert tasks_response.status_code == 200
    tasks = tasks_response.json()
    assert len(tasks) > 0

def test_analytics_endpoints(setup_db):
    """Test analytics endpoints return data"""
    
    # Briefing
    briefing = client.get("/analytics/briefing?workspace_id=1&days=7")
    assert briefing.status_code == 200
    data = briefing.json()
    assert "blockers" in data
    assert "overdue" in data
    
    # Velocity
    velocity = client.get("/analytics/velocity?workspace_id=1")
    assert velocity.status_code == 200
    
    # Distribution
    dist = client.get("/analytics/distribution?workspace_id=1")
    assert dist.status_code == 200

if __name__ == "__main__":
    pytest.main([__file__, "-v"])
