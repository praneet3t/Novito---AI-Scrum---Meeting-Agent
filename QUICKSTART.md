# Novito - Quick Start Guide

## 🚀 Get Running in 5 Minutes

### Step 1: Start Backend (Terminal 1)
```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python -m uvicorn app.main:app --reload --port 8000
```

Wait for: `Application startup complete`

### Step 2: Start Frontend (Terminal 2)
```bash
cd frontend
npm install
npm run dev
```

Wait for: `Local: http://localhost:5173/`

### Step 3: Seed Demo Data (Terminal 3)
```bash
curl -X POST http://localhost:8000/seed/run-demo
```

Or visit: http://localhost:8000/docs → `/seed/run-demo` → Try it out → Execute

### Step 4: Login
Open http://localhost:5173

**Admin:** `admin` / `admin123`  
**Manager:** `product_owner` / `po123`  
**Member:** `dev1` / `dev123`

---

## ✅ 5-Minute Demo Flow

### As Admin (2 minutes)

1. **Login** as `admin` / `admin123`

2. **Review AI Suggestions**
   - Click "Review Tasks" in nav
   - See 2 AI suggestions with confidence scores
   - Click "✓ Approve" on first suggestion
   - Task created!

3. **Check Audit Trail**
   - Click "Audit Trail" in nav
   - See the action you just took
   - Click "↶ Undo" to revert
   - Suggestion back in queue!

4. **Configure Agent**
   - Click "Settings" in nav
   - Change mode to "Auto"
   - Set threshold to 90%
   - Enable "set_focus_time"
   - Click "Save Settings"

### As Team Member (2 minutes)

5. **Logout** → Login as `dev1` / `dev123`

6. **View My Tasks**
   - Click "My Tasks" in nav
   - See 3 assigned tasks
   - Click on "Implement OAuth2 login"

7. **Submit for Review**
   - Move progress slider to 100%
   - Click "✓ Submit for Review"
   - Task status → QA

8. **Report Blocker**
   - Click on another task
   - Click "🚫 Report Blocker"
   - Enter: "Waiting for API keys"
   - Blocker reported!

### As Manager (1 minute)

9. **Logout** → Login as `product_owner` / `po123`

10. **Resolve Blocker**
    - Click "Blockers" in nav
    - See the blocked task with reason
    - Click "✓ Mark Resolved"
    - Blocker cleared!

---

## 🧪 Verify Everything Works

Run automated tests:
```bash
python test_endpoints.py
```

Should see:
```
✅ All tests completed!

📊 Summary:
   - Agent suggestions: ✓
   - Apply/Reject: ✓
   - Audit trail: ✓
   - Submit for review: ✓
   - Blockers: ✓
   - Workspace settings: ✓
```

---

## 📚 What to Explore Next

### Admin Features
- **Review Queue** (`/review`) - Approve/reject AI suggestions
- **Audit Trail** (`/audit`) - See all actions + undo
- **Settings** (`/settings`) - Configure agent behavior
- **All Tasks** (`/tasks`) - View all workspace tasks
- **Team** (`/team`) - Manage team members
- **Reports** (`/reports`) - View analytics

### Manager Features
- **Blockers** (`/blockers`) - Resolve blocked tasks
- **Review Queue** (`/review`) - Review suggestions
- **Team Tasks** (`/tasks`) - Monitor team progress
- **Reports** (`/reports`) - Team analytics

### Team Member Features
- **My Tasks** (`/tasks`) - View assigned work
- **Submit for Review** - Mark work complete
- **Report Blocker** - Flag stuck tasks
- **My Stats** (`/reports`) - Personal metrics

---

## 🎯 Key Concepts

### Agent Modes
- **Off** - No AI suggestions
- **Suggest** - AI suggests, human approves (default)
- **Auto** - AI auto-applies high-confidence suggestions

### Confidence Scores
- **90-100%** - Very confident, safe to auto-apply
- **80-89%** - Confident, review recommended
- **70-79%** - Moderate, careful review needed
- **<70%** - Low confidence, likely needs editing

### Audit Trail
- Every action logged
- Shows before/after state
- Reversible actions can be undone
- Tracks both human and AI actions

### Task Lifecycle
```
Todo → In Progress → Submit for Review → QA → Done
                ↓
            Report Blocker → Manager Resolves
```

---

## 🔧 Troubleshooting

### Backend won't start
```bash
# Check Python version (need 3.9+)
python --version

# Reinstall dependencies
pip install -r requirements.txt --force-reinstall
```

### Frontend won't start
```bash
# Check Node version (need 18+)
node --version

# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

### No demo data
```bash
# Reseed database
curl -X POST http://localhost:8000/seed/run-demo
```

### Can't connect to backend
- Check backend is running on port 8000
- Visit http://localhost:8000/health
- Should see: `{"status": "healthy"}`

---

## 📖 Documentation

- **[README.md](README.md)** - Project overview
- **[FEATURES.md](FEATURES.md)** - Complete feature specs
- **[IMPLEMENTATION_STATUS.md](IMPLEMENTATION_STATUS.md)** - What's built
- **[USER_GUIDE.md](USER_GUIDE.md)** - Feature walkthroughs
- **[PHASE1_COMPLETE.md](PHASE1_COMPLETE.md)** - Phase 1 summary

---

## 🎉 You're Ready!

Phase 1 MVP is fully functional with:
- ✅ AI suggestion review & approval
- ✅ Audit trail with undo
- ✅ Task submission workflow
- ✅ Blocker reporting & resolution
- ✅ Agent configuration
- ✅ Role-based access

**Start exploring and building your workflows!**
