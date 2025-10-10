# Novito - Technical Summary

## Overview

Novito is a domain-neutral meeting-to-task automation platform. It uses AI to extract actionable tasks from meeting transcripts, provides admin approval workflow, and tracks task completion across any organization.

## Core Workflow

```
Meeting Transcript → AI Extraction → Admin Review → Task Assignment → Progress Tracking
```

## Architecture

```
Frontend (React + TypeScript)
    ↓ HTTP/REST
Backend (FastAPI + Python)
    ↓
Database (SQLite)
    ↓
AI (Google Gemini - Optional)
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
├── DELIVERY.md                  # Delivery summary
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
        │   ├── Dashboard.tsx
        │   ├── MeetingsPage.tsx
        │   ├── ReviewQueue.tsx
        │   ├── TasksPage.tsx
        │   ├── ReportsPage.tsx
        │   └── TeamPage.tsx
        ├── components/         # Reusable components
        └── services/           # API client
```

## Database Schema

**Core Tables**
- users (id, username, password, role)
- meetings (id, title, transcript, date)
- tasks (id, title, description, assignee, status, priority, progress)
- teams (id, name, members)

## User Roles

**Administrator**
- Process meetings with AI
- Review and approve extracted tasks
- Assign tasks to team members
- Manage team members
- View all tasks and reports

**Manager**
- View team tasks
- Monitor team performance
- Access reports and analytics
- Process meetings

**Team Member**
- View assigned tasks
- Update task progress
- Mark tasks complete

## Key Features

### 1. Meeting Processing
- Upload meeting transcript
- AI extracts tasks automatically
- Identifies assignees, priorities, deadlines
- Confidence scoring for each task

### 2. Review & Approval
- Admin reviews AI-extracted tasks
- Edit task details before approval
- Approve or reject suggestions
- Bulk approval options

### 3. Task Management
- View tasks by status (To Do, In Progress, Done)
- Update progress with slider
- Change task status
- Filter and search tasks

### 4. Team Management
- Add/edit team members
- View member workload
- Track individual performance
- Assign tasks to members

### 5. Reports & Analytics
- Task completion trends
- Team performance metrics
- Productivity charts
- Export capabilities

## API Endpoints

**Authentication**
- POST /auth/login
- GET /auth/me

**Meetings**
- POST /meetings/process
- GET /meetings/

**Tasks**
- GET /tasks/
- GET /tasks/{id}
- PATCH /tasks/{id}
- POST /tasks/

**Analytics**
- GET /analytics/briefing
- GET /analytics/velocity
- GET /analytics/distribution

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
- manager / manager123
- member / member123

## Domain Neutral Design

Works for ANY organization:
- Healthcare (patient care tasks)
- Construction (inspections, orders)
- Education (curriculum planning)
- Ocean Services (vessel maintenance)
- Finance (audit items)
- Manufacturing (production schedules)
- Retail (inventory management)
- Legal (case tasks)

## Environment Variables

```bash
# Backend (optional)
GEMINI_API_KEY=your-key  # For AI features
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
2. Run backend with production server
3. Serve static files

## Security Notes

⚠️ Demo authentication only - not production ready
- Plain text passwords
- No JWT tokens
- No rate limiting

For production, implement proper security.

## Performance

- Frontend: Vite HMR for fast development
- Backend: Async FastAPI
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
**Lines of Code**: ~4,000+  
**API Endpoints**: 20+  
**Database Tables**: 10+  
**User Roles**: 3
