"""Smart proactive agent actions"""
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import datetime, timedelta
from ..database import get_db
from ..models import Task, User, AgentSuggestion
from ..services.agent_service import create_suggestion

router = APIRouter(prefix="/smart", tags=["smart"])

@router.post("/detect-risks")
def detect_risks(workspace_id: int, db: Session = Depends(get_db)):
    """Auto-detect at-risk tasks and create suggestions"""
    today = datetime.utcnow()
    suggestions_created = []
    
    # Find tasks at risk
    tasks = db.query(Task).filter(
        Task.workspace_id == workspace_id,
        Task.status.in_(["todo", "in_progress"]),
        Task.is_potential_risk == False
    ).all()
    
    for task in tasks:
        risk_detected = False
        risk_reason = None
        
        # High priority, low progress, due soon
        if task.priority and task.priority >= 8 and task.progress < 30:
            if task.due_date and task.due_date < today + timedelta(days=2):
                risk_detected = True
                risk_reason = "High priority task with low progress and approaching deadline"
        
        # Large task not started
        if task.effort_tag == "large" and task.progress == 0:
            days_old = (today - task.created_at).days
            if days_old > 3:
                risk_detected = True
                risk_reason = "Large task not started after 3 days"
        
        # Task stuck (no progress update in 3 days)
        if task.progress > 0 and task.progress < 100:
            days_since_update = (today - task.updated_at).days
            if days_since_update > 3:
                risk_detected = True
                risk_reason = "No progress update in 3+ days"
        
        if risk_detected:
            task.is_potential_risk = True
            task.risk_reason = risk_reason
            
            suggestion = create_suggestion(
                db, workspace_id, "flag_risk",
                {"task_id": task.id, "reason": risk_reason, "action": "escalate_or_split"},
                0.82
            )
            suggestions_created.append(suggestion.id)
    
    db.commit()
    return {"risks_detected": len(suggestions_created), "suggestion_ids": suggestions_created}

@router.post("/suggest-rebalance")
def suggest_rebalance(workspace_id: int, db: Session = Depends(get_db)):
    """Detect overloaded users and suggest task redistribution"""
    # Get user workloads
    user_loads = db.query(
        Task.assignee_id,
        func.count(Task.id).label('task_count'),
        func.sum(Task.story_points).label('total_points')
    ).filter(
        Task.workspace_id == workspace_id,
        Task.status.in_(["todo", "in_progress"]),
        Task.assignee_id.isnot(None)
    ).group_by(Task.assignee_id).all()
    
    suggestions_created = []
    
    for user_id, task_count, total_points in user_loads:
        if task_count > 5 or (total_points and total_points > 20):
            # Find tasks that could be reassigned
            tasks = db.query(Task).filter(
                Task.workspace_id == workspace_id,
                Task.assignee_id == user_id,
                Task.status == "todo",
                Task.priority < 8
            ).order_by(Task.priority).limit(2).all()
            
            for task in tasks:
                suggestion = create_suggestion(
                    db, workspace_id, "rebalance_task",
                    {
                        "task_id": task.id,
                        "current_assignee": user_id,
                        "reason": f"User has {task_count} tasks ({total_points} points)",
                        "action": "reassign_to_available_member"
                    },
                    0.75
                )
                suggestions_created.append(suggestion.id)
    
    db.commit()
    return {"rebalance_suggestions": len(suggestions_created), "suggestion_ids": suggestions_created}

@router.post("/find-dependencies")
def find_dependencies(workspace_id: int, db: Session = Depends(get_db)):
    """Auto-detect task dependencies based on titles and descriptions"""
    tasks = db.query(Task).filter(
        Task.workspace_id == workspace_id,
        Task.status.in_(["todo", "in_progress"])
    ).all()
    
    suggestions_created = []
    keywords = ["after", "depends on", "requires", "needs", "blocked by", "waiting for"]
    
    for task in tasks:
        text = f"{task.title} {task.description}".lower()
        
        # Simple keyword detection
        for keyword in keywords:
            if keyword in text:
                suggestion = create_suggestion(
                    db, workspace_id, "add_dependency",
                    {
                        "task_id": task.id,
                        "detected_keyword": keyword,
                        "suggestion": "Review task description to identify dependency",
                        "action": "manual_review_recommended"
                    },
                    0.65
                )
                suggestions_created.append(suggestion.id)
                break
    
    db.commit()
    return {"dependencies_detected": len(suggestions_created), "suggestion_ids": suggestions_created}

@router.get("/quick-wins")
def get_quick_wins(workspace_id: int, user_id: int = None, db: Session = Depends(get_db)):
    """Find easy tasks that can be completed quickly"""
    query = db.query(Task).filter(
        Task.workspace_id == workspace_id,
        Task.effort_tag == "small",
        Task.status == "todo"
    )
    
    if user_id:
        query = query.filter(Task.assignee_id == user_id)
    
    quick_wins = query.order_by(Task.priority.desc()).limit(5).all()
    
    return {
        "quick_wins": [
            {
                "id": t.id,
                "title": t.title,
                "priority": t.priority,
                "estimated_time": t.suggested_focus_time or 2,
                "impact": "high" if t.priority and t.priority >= 8 else "medium"
            }
            for t in quick_wins
        ],
        "total_time_estimate": sum([t.suggested_focus_time or 2 for t in quick_wins]),
        "ai_tip": "Complete these small tasks to build momentum and clear your backlog"
    }

@router.post("/auto-prioritize")
def auto_prioritize(workspace_id: int, db: Session = Depends(get_db)):
    """Auto-suggest priority adjustments based on deadlines and dependencies"""
    today = datetime.utcnow()
    suggestions_created = []
    
    # Find tasks with no priority set
    tasks = db.query(Task).filter(
        Task.workspace_id == workspace_id,
        Task.priority.is_(None),
        Task.status == "todo"
    ).all()
    
    for task in tasks:
        suggested_priority = 5  # default
        
        # Increase priority if due soon
        if task.due_date:
            days_until_due = (task.due_date - today).days
            if days_until_due <= 1:
                suggested_priority = 10
            elif days_until_due <= 3:
                suggested_priority = 8
            elif days_until_due <= 7:
                suggested_priority = 6
        
        # Increase if large effort
        if task.effort_tag == "large":
            suggested_priority = min(10, suggested_priority + 2)
        
        if suggested_priority >= 6:
            suggestion = create_suggestion(
                db, workspace_id, "set_priority",
                {"task_id": task.id, "suggested_priority": suggested_priority},
                0.80
            )
            suggestions_created.append(suggestion.id)
    
    db.commit()
    return {"priorities_suggested": len(suggestions_created), "suggestion_ids": suggestions_created}
