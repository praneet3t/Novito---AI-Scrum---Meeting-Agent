# Novito - AI-Powered Project Management Platform

Novito is an intelligent project management platform that streamlines team collaboration with AI-powered features. Built for modern teams, it provides role-based dashboards, automated task management, and comprehensive project tracking.

## 🚀 Key Features

### For All Roles
- **Smart Dashboard** - Personalized view with role-specific metrics and quick actions
- **Real-time Collaboration** - Work together seamlessly across teams
- **Task Management** - Create, assign, track, and complete tasks efficiently
- **Analytics & Reporting** - Visual insights with charts and performance metrics

### For Administrators
- **User Management** - Add, edit, and manage user accounts and permissions
- **System Settings** - Configure platform-wide settings and integrations
- **Audit Logs** - Track all system activities and changes
- **Reports** - Generate comprehensive system and usage reports

### For Product Owners
- **Product Backlog** - Prioritize and manage product backlog items
- **Sprint Planning** - Plan sprints, set goals, and track velocity
- **Roadmap Management** - Visualize product timeline and milestones
- **Stakeholder Communication** - Manage stakeholder feedback and updates

### For Developers
- **Task Board** - View and manage assigned development tasks
- **Code Reviews** - Review and approve code changes
- **Pull Requests** - Create and manage pull requests
- **Documentation** - Access technical docs and best practices

### For QA Engineers
- **Test Cases** - Create and manage test cases and suites
- **Bug Tracking** - Report, track, and verify bug fixes
- **Test Automation** - Manage automated testing scripts
- **Quality Metrics** - Monitor test coverage and quality KPIs

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
# source venv/bin/activate  # macOS/Linux
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
Open http://localhost:5173 in your browser

### Demo Accounts

| Role | Username | Password |
|------|----------|----------|
| Administrator | admin | admin123 |
| Product Owner | product_owner | po123 |
| Developer | dev1 | dev123 |
| QA Engineer | qa1 | qa123 |

## 📊 Role-Based Features

### Admin Dashboard
- User activity monitoring
- System health metrics
- Security alerts
- Configuration management

### Product Owner Dashboard
- Backlog items count
- Sprint progress
- Epic tracking
- Release planning

### Developer Dashboard
- Active tasks
- Code review requests
- Pull request status
- Build information

### QA Dashboard
- Test execution results
- Bug statistics
- Automation coverage
- Quality trends

## 🛠️ Technology Stack

**Frontend**
- React 18 with TypeScript
- Vite for fast builds
- Tailwind CSS for styling
- Recharts for data visualization
- React Router for navigation

**Backend**
- FastAPI (Python)
- SQLAlchemy ORM
- SQLite database
- Pydantic validation
- Google Gemini AI integration

## 📁 Project Structure

```
Novito/
├── backend/          # Python FastAPI backend
│   ├── app/
│   │   ├── routers/  # API endpoints
│   │   ├── services/ # Business logic
│   │   ├── ai/       # AI integration
│   │   └── models.py # Database models
│   └── tests/        # Backend tests
│
└── frontend/         # React TypeScript frontend
    └── src/
        ├── pages/    # Page components
        ├── components/ # Reusable components
        └── services/ # API client
```

## 🔧 Configuration

### Environment Variables

**Backend** (optional)
```bash
GEMINI_API_KEY=your-api-key  # For AI features
DATABASE_URL=sqlite:///./novito.db
```

**Frontend**
No configuration needed for local development.

## 🧪 Testing

```bash
cd backend
pip install -r requirements-test.txt
pytest tests/ -v
```

## 🐳 Docker Deployment (Optional)

```bash
docker-compose up
```

## 📝 API Documentation

Once the backend is running, visit:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## 🔐 Security Note

⚠️ **Demo Mode**: This application uses simplified authentication for demonstration purposes. For production use, implement:
- Password hashing (bcrypt)
- JWT tokens with expiration
- HTTPS/TLS encryption
- Rate limiting
- CSRF protection

## 🤝 Contributing

This is a demonstration project. For production use, consider:
- Adding comprehensive test coverage
- Implementing proper authentication
- Adding database migrations
- Setting up CI/CD pipelines
- Implementing monitoring and logging

## 📄 License

MIT License - For demonstration and educational purposes

## 🆘 Support

For issues or questions:
1. Check the documentation in `/docs`
2. Review the API documentation at `/docs` endpoint
3. Open an issue on GitHub

---

**Built with modern web technologies for efficient team collaboration**
