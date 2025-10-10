"""Analytics service for dashboards and briefings"""
from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import datetime, timedelta
from typing import List, Dict, Any
from ..models import Task, Sprint, TaskStatus

def get_briefing(db: Session, workspace_id: int, days: int = 7) -> Dict[str, Any]:
    """Generate executive briefing"""
    cutoff_date = datetime.utcnow() - timedelta(days=days)
    
    # Blocked tasks
    blockers = db.query(Task).filter(
        Task.workspace_id == workspace_id,
        Task.is_blocked == True,
        Task.status.in_([TaskStatus.todo, TaskStatus.in_progress])
    ).all()
    
    # Overdue tasks
    overdue = db.query(Task).filter(
        Task.workspace_id == workspace_id,
        Task.due_date < datetime.utcnow(),
        Task.status.in_([TaskStatus.todo, TaskStatus.in_progress])
    ).all()
    
    # Risky chains (tasks with dependencies that are blocked)
    risky_chains = []
    
    # SLA breaches (tasks in QA past verification deadline)
    sla_breaches = db.query(Task).filter(
        Task.workspace_id == workspace_id,
        Task.status == TaskStatus.qa,
        Task.verification_deadline_at < datetime.utcnow()
    ).all()
    
    return {
        "blockers": blockers,
        "overdue": overdue,
        "risky_chains": risky_chains,
        "sla_breaches": [{"task_id": t.id, "title": t.title} for t in sla_breaches]
    }

def get_burndown_data(db: Session, sprint_id: int) -> List[Dict[str, Any]]:
    """Generate burndown chart data"""
    sprint = db.query(Sprint).filter(Sprint.id == sprint_id).first()
    if not sprint:
        return []
    
    tasks = db.query(Task).filter(Task.sprint_id == sprint_id).all()
    total_points = sum(t.story_points or 0 for t in tasks)
    completed_points = sum(t.story_points or 0 for t in tasks if t.status == TaskStatus.done)
    
    # Simple burndown - in real app would track daily
    days = (sprint.end_date - sprint.start_date).days
    return [
        {"day": i, "remaining": total_points - (completed_points * i / days)}
        for i in range(days + 1)
    ]

def get_velocity_data(db: Session, workspace_id: int) -> List[Dict[str, Any]]:
    """Get velocity trend for last sprints"""
    sprints = db.query(Sprint).filter(
        Sprint.workspace_id == workspace_id,
        Sprint.velocity.isnot(None)
    ).order_by(Sprint.start_date.desc()).limit(6).all()
    
    return [{"sprint": s.name, "velocity": s.velocity} for s in reversed(sprints)]

def get_task_distribution(db: Session, workspace_id: int) -> Dict[str, int]:
    """Get task count by status"""
    result = db.query(
        Task.status,
        func.count(Task.id)
    ).filter(
        Task.workspace_id == workspace_id
    ).group_by(Task.status).all()
    
    return {status.value: count for status, count in result}
