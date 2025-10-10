# Novito - AI Scrum Master & Meeting Agent

Novito is a complete meeting-to-task automation system powered by Google Gemini API. It converts meeting transcripts into actionable tasks, runs full Scrum workflows, provides rich dashboards, and includes an agentic assistant "Nova" that suggests actions and can be opted into safe automation.

## Features

- 🤖 **AI-Powered Task Extraction**: Process meeting transcripts with Gemini API to automatically extract tasks
- 📋 **Review Queue**: Human-in-the-loop approval for AI suggestions
- 🎯 **Full Scrum Workflow**: Sprints, epics, backlogs, velocity tracking, burndown charts
- 📊 **Rich Dashboards**: Analytics, blockers, overdue tasks, SLA breaches
- 🤝 **Nova Assistant**: Agentic AI that suggests actions (opt-in automation available)
- 🔄 **Undo Support**: All agent actions are logged and reversible
- 🧪 **QA Integration**: Test cases, test runs, incident tracking
- 🔒 **Safe by Default**: Suggestions only; automation requires explicit opt-in

## Tech Stack

**Backend:**
- FastAPI (Python)
- SQLAlchemy + SQLite
- Google Gemini API
- Pydantic for validation

**Frontend:**
- React 18 + TypeScript
- Vite
- Tailwind CSS
- Recharts for analytics

## Prerequisites

- Python 3.9+
- Node.js 18+
- (Optional) Google Gemini API key - [Get one here](https://ai.google.dev/)

## Quick Start

### 1. Clone and Setup Backend

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# Unix/macOS:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# (Optional) Set Gemini API key
# Windows:
set GEMINI_API_KEY=your-api-key-here
# Unix/macOS:
export GEMINI_API_KEY=your-api-key-here

# Run backend
uvicorn app.main:app --reload --port 8000
```

The backend will start at `http://localhost:8000`

**Note:** If you don't set `GEMINI_API_KEY`, the app runs in **mock mode** with deterministic AI responses for development.

### 2. Setup Frontend

```bash
cd frontend

# Install dependencies
npm install

# Run frontend
npm run dev
```

The frontend will start at `http://localhost:5173`

### 3. Load Demo Data

Open your browser to `http://localhost:5173` and:

1. Click any demo account button (e.g., "Admin" or "Developer")
2. Click the **"🎬 Run Demo"** button on the dashboard
3. Confirm to load seed data

This populates the database with:
- Demo users (admin, product_owner, dev1, qa1)
- Sample workspace and teams
- 3 sprints with velocity data
- 6 tasks across different statuses
- 3 meeting transcripts
- Test cases and incidents
- Pre-generated agent suggestions

## Demo Accounts

| Username | Password | Role |
|----------|----------|------|
| admin | admin123 | Admin |
| product_owner | po123 | Product Owner |
| dev1 | dev123 | Developer |
| qa1 | qa123 | QA Engineer |

**⚠️ Security Note:** These are demo credentials only. Plain-text passwords and localStorage tokens are NOT production-ready.

## Usage Guide

### Process a Meeting

1. Go to **Meetings** page
2. Click "Use Sample" or paste your own transcript
3. Click **"🤖 Process with AI"**
4. View extracted task candidates
5. Go to **Review** page to approve tasks

### Review AI Suggestions

1. Go to **Review** page
2. See all pending suggestions (task creation, splitting, focus time)
3. Click **✓ Approve** to create tasks or **✗ Reject** to dismiss
4. Click **"🤖 Run Suggestion Engine"** to generate new suggestions

### Manage Tasks

1. Go to **Tasks** page
2. Filter by status (todo, in_progress, qa, done)
3. Click a task to view details
4. Update progress slider or change status
5. View blockers and dependencies

### View Analytics

1. Go to **Dashboard**
2. See blockers, overdue tasks, SLA breaches
3. View sprint velocity chart
4. View task distribution pie chart
5. Drill down into blocked tasks

## Agent (Nova) Configuration

Nova operates in three modes:

- **off**: No suggestions generated
- **suggest** (default): Suggestions generated, human must approve
- **auto**: Low-risk suggestions auto-applied if confidence ≥ threshold

Configure in workspace settings (admin only):
- `agent_mode`: "off" | "suggest" | "auto"
- `auto_confidence_threshold`: 0.85 (default)
- `allowed_auto_actions`: ["set_focus_time"] (safe actions only)

All agent actions are logged in the `audits` table and can be undone via API:

```bash
POST /agent/audits/{audit_id}/undo
```

## API Endpoints

### Authentication
- `POST /auth/login` - Login with username/password
- `GET /auth/me` - Get current user

### Meetings
- `POST /meetings/process` - Process transcript with AI
- `GET /meetings/` - List meetings

### Tasks
- `GET /tasks/review` - Get review queue
- `PATCH /tasks/{id}/approve` - Approve AI candidate
- `GET /tasks/` - List tasks (with filters)
- `GET /tasks/{id}` - Get task details
- `PATCH /tasks/{id}` - Update task
- `POST /tasks/capture` - Quick capture task

### Analytics
- `GET /analytics/briefing` - Executive briefing
- `GET /analytics/burndown/{sprint_id}` - Burndown data
- `GET /analytics/velocity` - Velocity trend
- `GET /analytics/distribution` - Task distribution

### Agent
- `POST /agent/run-suggestions` - Run suggestion engine
- `POST /agent/chat` - Chat with Nova
- `POST /agent/audits/{id}/undo` - Undo agent action

### Admin
- `POST /seed/run-demo` - Load demo data

## Gemini API Integration

### Prompt Templates

All prompts are centralized in `backend/app/ai/prompts.py`:

- **Task Extraction**: Extracts tasks from transcripts
- **Dependency Detection**: Finds task dependencies
- **RICE Scoring**: Estimates reach, impact, confidence, effort
- **Assistant Chat**: Nova conversational responses
- **Meeting Summary**: Generates meeting summaries

### JSON Schema Validation

All Gemini responses are validated against strict JSON schemas in `backend/app/ai/parser.py`:

- If parsing fails, logs raw response
- Falls back to rule-based extractor (spaCy/regex)
- Never auto-applies malformed suggestions

### Mock Mode

When `GEMINI_API_KEY` is not set or `AI_MODE=mock`:

- Returns deterministic mock responses
- Useful for development and CI/CD
- No API calls or costs

## Testing

### Run Unit Tests

```bash
cd backend
pip install -r requirements-test.txt
pytest tests/test_parser.py -v
```

### Run Integration Tests

```bash
pytest tests/test_integration.py -v
```

Tests cover:
- Parser validation with mock Gemini outputs
- Malformed JSON handling
- Full workflow: meeting → review → approve → task
- Analytics endpoints

## Project Structure

```
Novito/
├── backend/
│   ├── app/
│   │   ├── main.py              # FastAPI app
│   │   ├── config.py            # Environment config
│   │   ├── database.py          # SQLAlchemy setup
│   │   ├── models.py            # Database models
│   │   ├── schemas.py           # Pydantic schemas
│   │   ├── routers/             # API endpoints
│   │   ├── services/            # Business logic
│   │   ├── ai/
│   │   │   ├── gemini_client.py # Gemini API client
│   │   │   ├── prompts.py       # Prompt templates
│   │   │   └── parser.py        # JSON validation
│   │   └── seed_data.py         # Demo data
│   └── tests/                   # Unit & integration tests
├── frontend/
│   └── src/
│       ├── pages/               # React pages
│       ├── components/          # React components
│       └── services/api.ts      # API client
└── README.md
```

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `GEMINI_API_KEY` | (empty) | Google Gemini API key (optional) |
| `AI_MODE` | "mock" | "gemini" or "mock" |
| `DATABASE_URL` | sqlite:///./novito.db | Database connection |
| `AGENT_AUTO_CONFIDENCE` | 0.85 | Auto-apply threshold |

## Acceptance Checklist

✅ App runs locally with two commands (backend + frontend)  
✅ README includes setup steps and Gemini API key instructions  
✅ POST /meetings/process calls Gemini and returns valid JSON  
✅ Mock mode works without API key  
✅ Review queue shows candidates; Accept creates tasks  
✅ Agent suggestions stored and visible  
✅ Auto-mode applies safe actions when enabled  
✅ Every agent action has audit log and is undoable  
✅ Seed script populates users, meetings, tasks, sprints, etc.  
✅ Run Demo button triggers seed  
✅ Parser unit tests pass with mock outputs  
✅ UI displays charts and allows task management  

## Roadmap

- [ ] Real-time collaboration with WebSockets
- [ ] Advanced dependency graph visualization
- [ ] Slack/Teams integration
- [ ] Multi-workspace support
- [ ] Advanced RBAC
- [ ] Export reports (PDF/Excel)

## License

MIT License - Demo/Educational purposes

## Support

For issues or questions, please open a GitHub issue.

---

**Built with ❤️ using Google Gemini API**
