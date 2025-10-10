# Novito - Documentation Index

Quick navigation to all project documentation.

## 🚀 Start Here

| Document | Purpose | Time |
|----------|---------|------|
| **[QUICKSTART.md](QUICKSTART.md)** | Get running in 5 minutes | 5 min |
| **[README.md](README.md)** | Complete setup and usage guide | 15 min |
| **[DELIVERY_SUMMARY.md](DELIVERY_SUMMARY.md)** | What was delivered | 5 min |

## 📖 Detailed Documentation

| Document | Contents |
|----------|----------|
| **[ARCHITECTURE.md](ARCHITECTURE.md)** | System architecture, data flow, diagrams |
| **[SCHEMAS.md](SCHEMAS.md)** | JSON schemas, prompt templates, validation |
| **[PROJECT_SUMMARY.md](PROJECT_SUMMARY.md)** | Complete file tree, tech stack, features |
| **[ACCEPTANCE_CHECKLIST.md](ACCEPTANCE_CHECKLIST.md)** | All 30 criteria verified ✅ |

## 🎯 By Use Case

### I want to run the app
→ **[QUICKSTART.md](QUICKSTART.md)** - 5-minute guide

### I want to understand the code
→ **[ARCHITECTURE.md](ARCHITECTURE.md)** - System design  
→ **[PROJECT_SUMMARY.md](PROJECT_SUMMARY.md)** - File structure

### I want to use the Gemini API
→ **[SCHEMAS.md](SCHEMAS.md)** - Prompts and schemas  
→ **[README.md](README.md)** - API key setup

### I want to verify completeness
→ **[ACCEPTANCE_CHECKLIST.md](ACCEPTANCE_CHECKLIST.md)** - All criteria  
→ **[DELIVERY_SUMMARY.md](DELIVERY_SUMMARY.md)** - Deliverables

### I want to extend the project
→ **[ARCHITECTURE.md](ARCHITECTURE.md)** - Design patterns  
→ Code comments in `backend/app/` and `frontend/src/`

## 📂 Code Organization

### Backend Entry Points
```
backend/app/main.py              # FastAPI app
backend/app/ai/gemini_client.py  # Gemini integration
backend/app/services/agent_service.py  # Nova engine
backend/app/seed_data.py         # Demo data
```

### Frontend Entry Points
```
frontend/src/App.tsx             # React app
frontend/src/pages/Dashboard.tsx # Main dashboard
frontend/src/services/api.ts     # API client
```

### Tests
```
backend/tests/test_parser.py     # Unit tests
backend/tests/test_integration.py # Integration tests
```

## 🔧 Configuration Files

```
backend/requirements.txt         # Python dependencies
frontend/package.json            # Node dependencies
docker-compose.yml               # Docker setup
.gitignore                       # Git ignore rules
```

## 🎬 Quick Commands

### Start Application
```bash
# Windows
start-backend.bat
start-frontend.bat

# Unix/macOS
./start-backend.sh
./start-frontend.sh
```

### Run Tests
```bash
cd backend
pytest tests/ -v
```

### Load Demo Data
```bash
# Via UI: Dashboard → "Run Demo" button
# Via API:
curl -X POST http://localhost:8000/seed/run-demo
```

## 📊 Key Features

1. **AI Task Extraction** - Process meetings with Gemini
2. **Review Queue** - Approve AI suggestions
3. **Task Management** - Full CRUD with progress
4. **Analytics** - Charts and briefings
5. **Agent (Nova)** - Suggestion engine with undo
6. **Scrum Workflow** - Sprints, epics, velocity

## 🔑 Demo Accounts

- **admin** / admin123
- **product_owner** / po123
- **dev1** / dev123
- **qa1** / qa123

## 🌐 URLs

- Frontend: http://localhost:5173
- Backend API: http://localhost:8000
- API Docs: http://localhost:8000/docs

## 📞 Support

- Check README.md for detailed docs
- Review QUICKSTART.md for common issues
- Check inline code comments
- All acceptance criteria in ACCEPTANCE_CHECKLIST.md

## ✅ Status

**Project Status:** Complete ✅  
**All Deliverables:** Delivered ✅  
**Tests:** Passing ✅  
**Documentation:** Complete ✅  

---

**Choose your path above and start exploring Novito!**
