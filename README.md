# Novito - AI Meeting Assistant & Task Manager

Transform your meetings into actionable tasks automatically. Novito uses AI to extract tasks from meeting transcripts, streamlines approval workflows, and tracks completion across your entire organization.

## 🎯 What It Does

1. **Record Your Meeting** - Upload meeting transcript or audio
2. **AI Extracts Tasks** - Automatically identifies action items, owners, and deadlines
3. **Review & Approve** - Admin reviews and approves AI-generated tasks
4. **Assign & Track** - Tasks distributed to team members with progress tracking
5. **Monitor Progress** - Real-time dashboards show task completion and bottlenecks

## 🌐 Works for Any Industry

- **Healthcare** - Patient care tasks, treatment plans, staff assignments
- **Construction** - Project milestones, safety checks, material orders
- **Education** - Curriculum planning, student activities, administrative tasks
- **Finance** - Audit items, compliance checks, client deliverables
- **Manufacturing** - Production schedules, quality checks, maintenance tasks
- **Retail** - Inventory management, customer service, store operations
- **Legal** - Case tasks, document reviews, client meetings
- **Ocean Services** - Vessel maintenance, crew assignments, safety inspections
- **Any Organization** - Meeting follow-ups, project tasks, team coordination

## 🚀 Key Features

### For Administrators
- **☀️ Smart Daily Briefing** - AI-generated morning summary with insights
- **Meeting Upload** - Upload transcripts or audio files
- **AI Task Review** - Review AI-extracted tasks before approval
- **🤖 Smart Actions** - Proactive risk detection, workload rebalancing, auto-prioritization
- **Task Assignment** - Assign tasks to team members
- **Progress Monitoring** - Track completion across organization
- **Team Management** - Manage users and permissions
- **Audit Trail** - Full history with undo capability
- **Reports & Analytics** - View productivity metrics

### For Team Members
- **☀️ Personal Briefing** - Your focus list and quick wins
- **My Tasks** - View assigned tasks with priorities
- **Update Progress** - Mark tasks in progress or complete
- **Submit for Review** - Mark work ready for QA
- **Report Blockers** - Flag stuck tasks with reasons
- **View Deadlines** - See upcoming due dates
- **Quick Wins** - Small tasks for momentum

### For Managers
- **☀️ Team Briefing** - Daily summary of team health
- **Team Dashboard** - Monitor team task completion
- **🤖 Smart Actions** - Auto-detect risks and rebalance workload
- **Blocker Resolution** - See and resolve blocked tasks
- **Workload View** - Balance task distribution
- **Performance Metrics** - Track team productivity
- **Resource Planning** - Allocate resources effectively

## 💡 Example Use Cases

### Ocean Services Company
**Meeting**: Weekly operations review
**AI Extracts**:
- "Inspect vessel hull by Friday" → Task for maintenance crew
- "Order new navigation equipment" → Task for procurement
- "Schedule crew training next month" → Task for HR manager
- "Review safety protocols" → Task for safety officer

### Healthcare Clinic
**Meeting**: Patient care coordination
**AI Extracts**:
- "Schedule follow-up for Patient X" → Task for receptionist
- "Order lab tests for Patient Y" → Task for nurse
- "Review treatment plan" → Task for doctor
- "Update insurance records" → Task for admin

### Construction Company
**Meeting**: Project status update
**AI Extracts**:
- "Complete foundation inspection" → Task for site engineer
- "Order concrete delivery" → Task for procurement
- "Update client on timeline" → Task for project manager
- "Schedule safety training" → Task for safety coordinator

## 🎯 Quick Start

### Prerequisites
- Node.js 18+
- Python 3.9+

### Installation

**1. Start Backend**
```bash
cd backend
python -m venv venv
venv\Scripts\activate  # Windows
pip install -r requirements.txt
python -m uvicorn app.main:app --reload --port 8000
```

**2. Start Frontend**
```bash
cd frontend
npm install
npm run dev
```

**3. Access Application**
Open http://localhost:5173

### Demo Accounts

| Role | Username | Password |
|------|----------|----------|
| Administrator | admin | admin123 |
| Manager | product_owner | po123 |
| Team Member | dev1 | dev123 |

**4. Seed Demo Data**
```bash
curl -X POST http://localhost:8000/seed/run-demo
```
Or visit: http://localhost:8000/docs and run the `/seed/run-demo` endpoint

## 📊 How It Works

### 1. Meeting Processing
```
Meeting Transcript/Audio
    ↓
AI Analysis (Google Gemini)
    ↓
Extracted Tasks with:
- Task description
- Suggested assignee
- Estimated deadline
- Priority level
- Dependencies
```

### 2. Review & Approval
```
Admin Reviews Tasks
    ↓
Edit/Modify if needed
    ↓
Approve for assignment
    ↓
Tasks created in system
```

### 3. Task Management
```
Tasks assigned to team
    ↓
Members update progress
    ↓
Real-time tracking
    ↓
Completion & reporting
```

## 🛠️ Technology Stack

**Frontend**
- React 18 with TypeScript
- Vite for fast builds
- Tailwind CSS for styling
- Recharts for analytics
- Responsive design

**Backend**
- FastAPI (Python)
- SQLAlchemy ORM
- SQLite database
- Google Gemini AI
- RESTful API

**AI Integration**
- Google Gemini API for task extraction
- Natural language processing
- Confidence scoring
- Fallback to manual entry

## 📁 Core Features

### Meeting Management
- Upload meeting transcripts
- Audio file support (future)
- Meeting history
- Search past meetings

### AI Task Extraction
- Automatic action item detection
- Assignee identification
- Deadline extraction
- Priority assessment
- Dependency detection

### Task Management
- Create, edit, delete tasks
- Assign to team members
- Set priorities and deadlines
- Track progress (0-100%)
- Mark as blocked
- Add comments and notes

### Analytics & Reporting
- Task completion rates
- Team productivity metrics
- Overdue task alerts
- Workload distribution
- Performance trends

### User Management
- Role-based access (Admin, Manager, Member)
- Team organization
- Permission management
- Activity tracking

## 🔧 Configuration

### Environment Variables

**Backend**
```bash
GEMINI_API_KEY=your-api-key  # Optional - uses mock mode if not set
DATABASE_URL=sqlite:///./novito.db
```

**Frontend**
No configuration needed for local development.

## 🧪 Testing

**Test Phase 1 MVP Endpoints**
```bash
python test_endpoints.py
```

**Run Backend Tests**
```bash
cd backend
pip install -r requirements-test.txt
pytest tests/ -v
```

## 🐳 Docker Deployment

```bash
docker-compose up
```

## 📝 Documentation

**API Documentation**
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

**Feature Documentation**
- [FEATURES.md](FEATURES.md) - Complete feature specifications
- [IMPLEMENTATION_STATUS.md](IMPLEMENTATION_STATUS.md) - What's built and working
- [PROJECT_SUMMARY.md](PROJECT_SUMMARY.md) - Technical architecture
- [DELIVERY.md](DELIVERY.md) - Delivery summary

## 🔐 Security Note

⚠️ **Demo Mode**: Uses simplified authentication. For production:
- Implement password hashing
- Add JWT tokens
- Enable HTTPS
- Add rate limiting
- Implement CSRF protection

## 🤝 Customization

Easily customize for your industry:
- Modify task fields (add custom fields)
- Adjust AI prompts for domain-specific terms
- Customize roles and permissions
- Add industry-specific workflows
- Integrate with existing tools

## 📄 License

MIT License - For demonstration and educational purposes

## 🆘 Support

For questions or issues:
1. Check documentation
2. Review API docs at /docs
3. Open an issue on GitHub

---

**Built to transform meetings into action for any organization**
