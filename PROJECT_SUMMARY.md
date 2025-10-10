# Novito - Technical Summary

## Overview

Novito is a role-based project management platform with AI capabilities. Built with React + TypeScript frontend and FastAPI backend, it provides customized experiences for Admins, Product Owners, Developers, and QA Engineers.

## Architecture

```
Frontend (React + TypeScript)
    ↓ HTTP/REST
Backend (FastAPI + Python)
    ↓
Database (SQLite)
```

## Tech Stack

**Frontend**
- React 18 + TypeScript
- Vite (build tool)
- Tailwind CSS
- Recharts (charts)
- React Router v6

**Backend**
- FastAPI
- SQLAlchemy ORM
- SQLite database
- Pydantic validation
- Google Gemini AI (optional)

## File Structure

```
Novito/
├── README.md                    # Product documentation
├── PROJECT_SUMMARY.md           # This file
├── SCHEMAS.md                   # API schemas
├── backend/
│   ├── app/
│   │   ├── main.py             # FastAPI app
│   │   ├── models.py           # Database models
│   │   ├── routers/            # API endpoints
│   │   ├── services/           # Business logic
│   │   └── ai/                 # AI integration
│   └── tests/                  # Unit tests
└── frontend/
    └── src/
        ├── App.tsx             # Main app
        ├── pages/              # Page components
        ├── components/         # Reusable components
        └── services/           # API client
```

## Database Schema

**Core Tables**
- users (id, username, password, role)
- workspaces (id, name, settings)
- teams (id, workspace_id, name)
- tasks (id, title, status, assignee_id, priority)
- sprints (id, name, start_date, end_date)
- meetings (id, title, transcript)
- audits (id, action, user_id, timestamp)

## API Endpoints

**Authentication**
- POST /auth/login
- GET /auth/me

**Tasks**
- GET /tasks/
- GET /tasks/{id}
- PATCH /tasks/{id}
- POST /tasks/

**Analytics**
- GET /analytics/briefing
- GET /analytics/velocity
- GET /analytics/distribution

**Admin**
- POST /seed/run-demo

## Role-Based Access

**Admin**
- User Management
- System Settings
- Reports
- Audit Logs

**Product Owner**
- Backlog Management
- Sprint Planning
- Roadmap
- Stakeholder Communication

**Developer**
- Task Board
- Code Reviews
- Pull Requests
- Documentation

**QA Engineer**
- Test Cases
- Bug Reports
- Test Automation
- Quality Metrics

## Quick Start

```bash
# Backend
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python -m uvicorn app.main:app --reload --port 8000

# Frontend
cd frontend
npm install
npm run dev
```

Access: http://localhost:5173

## Demo Accounts

- admin / admin123
- product_owner / po123
- dev1 / dev123
- qa1 / qa123

## Key Features

1. **Role-Based Dashboards** - Each role sees relevant metrics and actions
2. **Task Management** - Create, assign, track tasks with progress
3. **Analytics** - Charts showing velocity, distribution, trends
4. **Responsive UI** - Works on desktop and mobile
5. **Real-time Updates** - Instant feedback on actions

## Development

**Run Tests**
```bash
cd backend
pytest tests/ -v
```

**Build for Production**
```bash
cd frontend
npm run build
```

## Environment Variables

```bash
# Backend (optional)
GEMINI_API_KEY=your-key
DATABASE_URL=sqlite:///./novito.db

# Frontend
# No env vars needed
```

## Deployment

**Docker**
```bash
docker-compose up
```

**Manual**
1. Build frontend: `npm run build`
2. Serve static files with backend
3. Run backend with production server (gunicorn)

## Security Notes

⚠️ Demo authentication only - not production ready
- Plain text passwords
- No JWT tokens
- No rate limiting
- No HTTPS enforcement

For production, implement proper security measures.

## Performance

- Frontend: Vite HMR for fast development
- Backend: Async FastAPI for concurrent requests
- Database: SQLite for simple deployment
- Charts: Recharts with optimized rendering

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## License

MIT License - Demo/Educational purposes

---

**Total Files**: 50+  
**Lines of Code**: ~3,500+  
**API Endpoints**: 20+  
**Database Tables**: 15+
