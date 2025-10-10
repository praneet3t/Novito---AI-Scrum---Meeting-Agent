# Novito - Quick Start Guide (5 Minutes)

Get Novito running and see all features in 5 minutes.

## Step 1: Start Backend (1 minute)

### Windows
```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

### macOS/Linux
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

**Wait for**: `Application startup complete`

## Step 2: Start Frontend (1 minute)

Open a new terminal:

```bash
cd frontend
npm install
npm run dev
```

**Wait for**: `Local: http://localhost:5173/`

## Step 3: Login (30 seconds)

1. Open browser: `http://localhost:5173`
2. Click **"Admin"** button (or any demo account)
3. You're in!

## Step 4: Load Demo Data (30 seconds)

1. Click **"🎬 Run Demo"** button on dashboard
2. Confirm the dialog
3. Wait for success message
4. Refresh the page

**You now have**: 6 tasks, 3 sprints, 3 meetings, 2 suggestions

## Step 5: Try Key Features (2 minutes)

### A. View Dashboard Analytics
- See **Blockers** (1 blocked task)
- See **Sprint Velocity** chart
- See **Task Distribution** pie chart

### B. Process a Meeting
1. Click **"Meetings"** in nav
2. Click **"Use Sample"** button
3. Click **"🤖 Process with AI"**
4. See extracted tasks with confidence scores

### C. Review AI Suggestions
1. Click **"Review"** in nav
2. See 2+ pending suggestions
3. Click **"✓ Approve"** on first suggestion
4. Task is created!

### D. Manage Tasks
1. Click **"Tasks"** in nav
2. Click any task card
3. Move progress slider
4. Change status dropdown
5. See updates immediately

## What You Just Saw

✅ **AI Task Extraction** - Gemini processed transcript  
✅ **Review Queue** - Human-in-the-loop approval  
✅ **Task Management** - Full CRUD with progress tracking  
✅ **Analytics** - Charts and briefings  
✅ **Demo Data** - Realistic seed data  

## Mock Mode (No API Key)

By default, Novito runs in **mock mode** - no Gemini API key needed!

Mock mode returns deterministic AI responses, perfect for:
- Development
- Testing
- Demos
- CI/CD

## Optional: Use Real Gemini API

1. Get API key: https://ai.google.dev/
2. Set environment variable:

**Windows:**
```bash
set GEMINI_API_KEY=your-key-here
```

**macOS/Linux:**
```bash
export GEMINI_API_KEY=your-key-here
```

3. Restart backend
4. Process a meeting - now uses real Gemini!

## Demo Accounts

| Username | Password | Role |
|----------|----------|------|
| admin | admin123 | Admin |
| product_owner | po123 | Product Owner |
| dev1 | dev123 | Developer |
| qa1 | qa123 | QA Engineer |

## Troubleshooting

### Backend won't start
- Check Python version: `python --version` (need 3.9+)
- Try: `pip install --upgrade pip`
- Try: `pip install -r requirements.txt --force-reinstall`

### Frontend won't start
- Check Node version: `node --version` (need 18+)
- Delete `node_modules` and run `npm install` again
- Try: `npm cache clean --force`

### Database errors
- Delete `backend/novito.db` file
- Restart backend (will recreate DB)
- Click "Run Demo" again

### Port already in use
- Backend: Change port in command: `--port 8001`
- Frontend: Change in `vite.config.ts`: `port: 5174`

## Next Steps

1. **Read README.md** - Full documentation
2. **Check SCHEMAS.md** - See all prompts and schemas
3. **Run tests** - `pytest backend/tests/ -v`
4. **Explore code** - Start with `backend/app/ai/`
5. **Customize prompts** - Edit `backend/app/ai/prompts.py`

## Key Files to Review

```
backend/app/ai/gemini_client.py  # Gemini integration
backend/app/ai/prompts.py        # Prompt templates
backend/app/ai/parser.py         # JSON validation
backend/app/seed_data.py         # Demo data
frontend/src/pages/              # React pages
```

## API Endpoints to Try

```bash
# Health check
curl http://localhost:8000/health

# Get briefing
curl http://localhost:8000/analytics/briefing?workspace_id=1

# List tasks
curl http://localhost:8000/tasks/?workspace_id=1

# Run suggestions
curl -X POST http://localhost:8000/agent/run-suggestions?workspace_id=1
```

## Features Checklist

Try these workflows:

- [ ] Login with demo account
- [ ] Load demo data
- [ ] View dashboard charts
- [ ] Process meeting transcript
- [ ] Review AI suggestions
- [ ] Approve a suggestion
- [ ] View created task
- [ ] Update task progress
- [ ] Change task status
- [ ] Run suggestion engine
- [ ] View blocked tasks
- [ ] Check sprint velocity

## Questions?

- Check **README.md** for detailed docs
- Check **ACCEPTANCE_CHECKLIST.md** for verification
- Check **SCHEMAS.md** for API details
- Review inline code comments

---

**You're all set! Enjoy exploring Novito! 🚀**
