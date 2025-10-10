# Novito - Architecture Overview

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         Frontend                             │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │ Login    │  │Dashboard │  │ Meetings │  │  Review  │   │
│  │  Page    │  │  Charts  │  │ Process  │  │  Queue   │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
│                                                              │
│  React 18 + TypeScript + Tailwind + Recharts               │
└──────────────────────┬──────────────────────────────────────┘
                       │ HTTP/REST
                       │
┌──────────────────────▼──────────────────────────────────────┐
│                      FastAPI Backend                         │
│  ┌────────────────────────────────────────────────────┐    │
│  │              API Routers                            │    │
│  │  auth │ meetings │ tasks │ sprints │ analytics │   │    │
│  │       │          │       │         │ agent     │   │    │
│  └───────┬──────────┬───────┬─────────┬───────────┘    │
│          │          │       │         │                     │
│  ┌───────▼──────────▼───────▼─────────▼───────────┐    │
│  │              Services Layer                      │    │
│  │  task_service │ analytics_service │ agent_service│    │
│  └───────┬──────────┬───────────────┬──────────────┘    │
│          │          │               │                     │
│  ┌───────▼──────────▼───────────────▼──────────────┐    │
│  │           SQLAlchemy Models                      │    │
│  │  User │ Task │ Meeting │ Sprint │ Suggestion    │    │
│  └───────┬──────────────────────────────────────────┘    │
│          │                                                 │
│  ┌───────▼──────────────────────────────────────────┐    │
│  │              AI Module                            │    │
│  │  ┌──────────────┐  ┌──────────┐  ┌──────────┐  │    │
│  │  │gemini_client │  │ prompts  │  │  parser  │  │    │
│  │  └──────────────┘  └──────────┘  └──────────┘  │    │
│  └───────┬──────────────────────────────────────────┘    │
└──────────┼──────────────────────────────────────────────┘
           │
           │ API Call
           │
┌──────────▼──────────────────────────────────────────────┐
│              Google Gemini API                           │
│              (gemini-pro model)                          │
│                                                           │
│  Task Extraction │ Dependencies │ RICE │ Chat           │
└───────────────────────────────────────────────────────────┘
```

## Data Flow: Meeting → Tasks

```
1. User Input
   └─> Meeting transcript (text)

2. Frontend
   └─> POST /meetings/process
       └─> {workspace_id, title, date, transcript}

3. Backend Router
   └─> meetings.py: process_meeting()
       └─> Store meeting in DB
       └─> Call gemini_client.generate_tasks_from_transcript()

4. AI Module
   └─> gemini_client.py
       ├─> Format prompt from prompts.py
       ├─> Call Gemini API (or mock)
       ├─> Receive JSON response
       └─> parser.py: validate against schema
           ├─> Valid? Return tasks
           └─> Invalid? Use fallback_task_extractor()

5. Service Layer
   └─> Create AgentSuggestion for each task
       └─> Store in agent_suggestions table

6. Response
   └─> Return candidates to frontend
       └─> Display in review queue

7. User Approval
   └─> PATCH /tasks/{id}/approve
       └─> agent_service.apply_suggestion()
           ├─> Create Task in DB
           ├─> Create Audit log
           └─> Mark suggestion as applied
```

## Agent (Nova) Decision Flow

```
┌─────────────────────────────────────────────────────┐
│         Suggestion Engine Triggered                  │
│  (Manual or Scheduled)                              │
└──────────────────┬──────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────┐
│  Analyze Workspace                                   │
│  - Find tasks without focus_time                    │
│  - Find large tasks to split                        │
│  - Find blocked tasks to escalate                   │
└──────────────────┬──────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────┐
│  Generate Suggestions                                │
│  - Calculate confidence scores                      │
│  - Create suggestion payload                        │
│  - Store in agent_suggestions table                 │
└──────────────────┬──────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────┐
│  Check Agent Mode                                    │
│  ┌─────────────┬─────────────┬─────────────┐       │
│  │    OFF      │   SUGGEST   │    AUTO     │       │
│  │  (skip)     │  (queue)    │  (evaluate) │       │
│  └─────────────┴─────────────┴──────┬──────┘       │
└─────────────────────────────────────┼──────────────┘
                                      │
                   ┌──────────────────┴──────────────┐
                   │                                  │
                   ▼                                  ▼
        ┌──────────────────┐              ┌──────────────────┐
        │  SUGGEST Mode    │              │   AUTO Mode      │
        │  - Show in UI    │              │  - Check conf.   │
        │  - Wait approval │              │  - Check allowed │
        │                  │              │  - Auto-apply    │
        └──────────────────┘              │  - Create audit  │
                                          └──────────────────┘
```

## Database Schema Relationships

```
┌──────────┐
│  User    │
└────┬─────┘
     │ 1:N
     ├──────────────┐
     │              │
     ▼              ▼
┌──────────┐   ┌──────────┐
│  Task    │   │  Audit   │
│(assignee)│   │ (actor)  │
└────┬─────┘   └──────────┘
     │
     │ N:1
     ▼
┌──────────┐       ┌──────────────┐
│Workspace │◄──────│AgentSuggestion│
└────┬─────┘       └──────────────┘
     │
     │ 1:N
     ├──────────────┬──────────────┬──────────────┐
     │              │              │              │
     ▼              ▼              ▼              ▼
┌──────────┐   ┌──────────┐   ┌──────────┐   ┌──────────┐
│  Sprint  │   │   Epic   │   │ Meeting  │   │Incident  │
└────┬─────┘   └────┬─────┘   └──────────┘   └──────────┘
     │              │
     │ 1:N          │ 1:N
     ▼              ▼
┌──────────┐   ┌──────────┐
│  Task    │   │  Task    │
└──────────┘   └──────────┘
```

## Component Hierarchy (Frontend)

```
App
├── LoginPage (unauthenticated)
│
└── Layout (authenticated)
    ├── Navigation
    │   ├── Dashboard
    │   ├── Meetings
    │   ├── Review
    │   └── Tasks
    │
    └── Routes
        ├── Dashboard
        │   ├── BriefingCards
        │   ├── VelocityChart (Recharts)
        │   ├── DistributionChart (Recharts)
        │   └── BlockedTasksList
        │
        ├── MeetingsPage
        │   ├── TranscriptInput
        │   ├── ProcessButton
        │   └── CandidatesDisplay
        │
        ├── ReviewQueue
        │   ├── SuggestionCard[]
        │   │   ├── ApproveButton
        │   │   └── RejectButton
        │   └── RunEngineButton
        │
        └── TasksPage
            ├── FilterButtons
            ├── TaskCard[]
            └── TaskDetailModal
                ├── ProgressSlider
                └── StatusDropdown
```

## Security Model (Demo)

```
┌─────────────────────────────────────────────────────┐
│  Frontend                                            │
│  - localStorage stores token                        │
│  - Token sent with each request (future)            │
└──────────────────┬──────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────┐
│  Backend                                             │
│  - In-memory session dict (demo only)               │
│  - Plain-text passwords (demo only)                 │
│  - No JWT validation (demo only)                    │
│                                                      │
│  ⚠️  NOT PRODUCTION READY                           │
└─────────────────────────────────────────────────────┘
```

## Deployment Options

### Option 1: Local Development (Default)
```
Terminal 1: uvicorn app.main:app --reload
Terminal 2: npm run dev
Database: SQLite file (novito.db)
```

### Option 2: Docker Compose
```
docker-compose up
- Backend: http://localhost:8000
- Frontend: http://localhost:5173
- Database: SQLite in container volume
```

### Option 3: Production (Future)
```
- Backend: Gunicorn + Uvicorn workers
- Frontend: Static build (npm run build)
- Database: PostgreSQL
- Reverse Proxy: Nginx
- HTTPS: Let's Encrypt
```

## Technology Decisions

| Component | Choice | Rationale |
|-----------|--------|-----------|
| Backend Framework | FastAPI | Modern, async, auto docs, Pydantic |
| Database | SQLite | Simple, file-based, no setup |
| ORM | SQLAlchemy | Industry standard, flexible |
| AI Provider | Gemini | Free tier, good JSON output |
| Frontend Framework | React 18 | Popular, mature, TypeScript support |
| Build Tool | Vite | Fast, modern, great DX |
| Styling | Tailwind | Utility-first, rapid development |
| Charts | Recharts | React-native, composable |
| Validation | Pydantic + jsonschema | Type safety + runtime validation |

## Performance Considerations

### Backend
- SQLite: Fast for demo, single-file
- Async FastAPI: Non-blocking I/O
- Background tasks: For long-running operations
- Connection pooling: SQLAlchemy handles

### Frontend
- Vite: Fast HMR and builds
- Code splitting: React Router lazy loading (future)
- Memoization: React.memo for expensive components (future)

### AI
- Mock mode: Zero latency for development
- Caching: Could cache common prompts (future)
- Streaming: Could stream responses (future)

## Error Handling Strategy

### AI Module
1. Try Gemini API call
2. If fails → Log error → Use mock
3. Parse JSON response
4. If invalid → Log raw → Use fallback
5. Validate schema
6. If invalid → Log data → Use fallback

### API Layer
1. Pydantic validates request
2. Service layer executes
3. If error → Log → Return 4xx/5xx
4. SQLAlchemy handles DB errors
5. Return structured error response

### Frontend
1. API call with try/catch
2. If error → Show user message
3. Log to console (future: send to backend)
4. Graceful degradation

## Testing Strategy

### Unit Tests
- Parser validation (test_parser.py)
- Schema validation
- Fallback extractors
- Mock Gemini responses

### Integration Tests
- Full workflow (test_integration.py)
- API endpoints
- Database operations
- Authentication flow

### Manual Testing
- Demo data seed
- UI workflows
- Chart rendering
- Agent suggestions

## Future Enhancements

### Phase 2
- Real-time updates (WebSockets)
- Advanced dependency graphs
- Slack/Teams integration
- Multi-workspace support

### Phase 3
- Advanced RBAC
- Audit trail UI
- Export reports (PDF/Excel)
- Mobile app

### Phase 4
- AI-powered sprint planning
- Predictive analytics
- Risk detection ML models
- Voice-to-task (speech recognition)
