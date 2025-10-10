"""FastAPI main application"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import engine, Base
from .routers import auth, meetings, tasks, sprints, analytics, agent

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Novito API", version="1.0.0")

# CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router)
app.include_router(meetings.router)
app.include_router(tasks.router)
app.include_router(sprints.router)
app.include_router(analytics.router)
app.include_router(agent.router)

@app.get("/")
def root():
    return {"message": "Novito API", "version": "1.0.0"}

@app.get("/health")
def health():
    return {"status": "healthy"}

# Seed data endpoint
@app.post("/seed/run-demo")
def run_demo_seed():
    """Run seed data script"""
    from .seed_data import seed_all
    from .database import SessionLocal
    
    db = SessionLocal()
    try:
        seed_all(db)
        return {"success": True, "message": "Demo data seeded"}
    finally:
        db.close()
