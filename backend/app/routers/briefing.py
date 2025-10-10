"""Smart daily briefing router"""
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import datetime, timedelta
from ..database import get_db
from ..models import Task, AgentSuggestion, User

router = APIRouter(prefix="/briefing", tags=["briefing"])

@router.get("/daily")
def get_daily_briefing(workspace_id: int, user_id: int = None, db: Session = Depends(get_db)):
    """AI-generated daily briefing with priorities and risks"""
    today = datetime.utcnow()
    
    # Overdue tasks
    overdue = db.query(Task).filter(
        Task.workspace_id == workspace_id,
        Task.due_date < today,
        Task.status.in_(["todo", "in_progress"])
    ).all()
    
    # Blocked tasks
    blocked = db.query(Task).filter(
        Task.workspace_id == workspace_id,
        Task.is_blocked == True
    ).all()
    
    # At-risk tasks (high priority, low progress, due soon)
    at_risk = db.query(Task).filter(
        Task.workspace_id == workspace_id,
        Task.priority >= 8,
        Task.progress < 50,
        Task.due_date.between(today, today + timedelta(days=3)),
        Task.status.in_(["todo", "in_progress"])
    ).all()
    
    # Pending reviews (submitted tasks)
    pending_review = db.query(Task).filter(
        Task.workspace_id == workspace_id,
        Task.status == "qa",
        Task.submitted_at.isnot(None)
    ).all()
    
    # Quick wins (small tasks, high priority)
    quick_wins = db.query(Task).filter(
        Task.workspace_id == workspace_id,
        Task.effort_tag == "small",
        Task.priority >= 7,
        Task.status == "todo"
    ).limit(3).all()
    
    # Pending suggestions
    suggestions_count = db.query(func.count(AgentSuggestion.id)).filter(
        AgentSuggestion.workspace_id == workspace_id,
        AgentSuggestion.applied == False
    ).scalar()
    
    # User-specific if provided
    my_tasks_today = []
    if user_id:
        my_tasks_today = db.query(Task).filter(
            Task.workspace_id == workspace_id,
            Task.assignee_id == user_id,
            Task.status.in_(["todo", "in_progress"]),
            Task.priority >= 7
        ).order_by(Task.priority.desc()).limit(5).all()
    
    return {
        "date": today.isoformat(),
        "summary": {
            "overdue_count": len(overdue),
            "blocked_count": len(blocked),
            "at_risk_count": len(at_risk),
            "pending_review_count": len(pending_review),
            "suggestions_pending": suggestions_count
        },
        "overdue_tasks": [{"id": t.id, "title": t.title, "priority": t.priority} for t in overdue],
        "blocked_tasks": [{"id": t.id, "title": t.title, "blocker_reason": t.blocker_reason} for t in blocked],
        "at_risk_tasks": [{"id": t.id, "title": t.title, "priority": t.priority, "progress": t.progress} for t in at_risk],
        "pending_reviews": [{"id": t.id, "title": t.title, "submitted_at": t.submitted_at} for t in pending_review],
        "quick_wins": [{"id": t.id, "title": t.title, "priority": t.priority} for t in quick_wins],
        "my_focus_today": [{"id": t.id, "title": t.title, "priority": t.priority} for t in my_tasks_today],
        "ai_insight": generate_insight(len(overdue), len(blocked), len(at_risk), suggestions_count)
    }

def generate_insight(overdue, blocked, at_risk, suggestions):
    """Generate AI insight message"""
    if overdue > 3:
        return f"⚠️ Critical: {overdue} overdue tasks need immediate attention"
    elif blocked > 2:
        return f"🚫 {blocked} tasks are blocked - prioritize unblocking"
    elif at_risk > 0:
        return f"⚡ {at_risk} high-priority tasks at risk of missing deadline"
    elif suggestions > 5:
        return f"💡 {suggestions} AI suggestions waiting for review"
    else:
        return "✅ All systems running smoothly - great work!"
