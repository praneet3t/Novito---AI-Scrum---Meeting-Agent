"""Conversational AI agent for database queries and analytics"""
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func, and_
from datetime import datetime, timedelta
from ..database import get_db
from ..models import Task, User, Sprint, Meeting, AgentSuggestion
from typing import Dict, Any
import re

router = APIRouter(prefix="/chat", tags=["chat-agent"])

@router.post("/query")
def chat_query(question: str, workspace_id: int, db: Session = Depends(get_db)):
    """Natural language query interface"""
    question_lower = question.lower()
    
    # Route to appropriate handler
    if any(word in question_lower for word in ['overdue', 'late', 'missed deadline']):
        return handle_overdue_query(workspace_id, db)
    
    elif any(word in question_lower for word in ['blocked', 'stuck', 'blocker']):
        return handle_blocked_query(workspace_id, db)
    
    elif any(word in question_lower for word in ['velocity', 'sprint', 'completion']):
        return handle_velocity_query(workspace_id, db)
    
    elif any(word in question_lower for word in ['workload', 'capacity', 'busy', 'overloaded']):
        return handle_workload_query(workspace_id, db)
    
    elif any(word in question_lower for word in ['risk', 'at risk', 'danger']):
        return handle_risk_query(workspace_id, db)
    
    elif any(word in question_lower for word in ['who', 'assigned', 'working on']):
        return handle_assignment_query(question, workspace_id, db)
    
    elif any(word in question_lower for word in ['when', 'deadline', 'due']):
        return handle_deadline_query(question, workspace_id, db)
    
    elif any(word in question_lower for word in ['how many', 'count', 'total']):
        return handle_count_query(question, workspace_id, db)
    
    elif any(word in question_lower for word in ['status', 'progress', 'update']):
        return handle_status_query(question, workspace_id, db)
    
    elif any(word in question_lower for word in ['suggest', 'recommend', 'should']):
        return handle_recommendation_query(question, workspace_id, db)
    
    else:
        return {
            "response": "I can help you with questions about overdue tasks, blockers, velocity, workload, risks, assignments, deadlines, counts, status, and recommendations. What would you like to know?",
            "type": "help"
        }

def handle_overdue_query(workspace_id: int, db: Session) -> Dict[str, Any]:
    """Handle overdue task queries"""
    overdue = db.query(Task).filter(
        Task.workspace_id == workspace_id,
        Task.due_date < datetime.utcnow(),
        Task.status.in_(["todo", "in_progress"])
    ).all()
    
    if not overdue:
        return {
            "response": "No overdue tasks. All deadlines are being met.",
            "type": "success",
            "data": []
        }
    
    high_priority = [t for t in overdue if t.priority and t.priority >= 8]
    
    response = f"There are {len(overdue)} overdue tasks"
    if high_priority:
        response += f", including {len(high_priority)} high-priority items"
    response += ". "
    
    if high_priority:
        response += f"Most critical: '{high_priority[0].title}' (Priority {high_priority[0].priority})"
    
    return {
        "response": response,
        "type": "alert",
        "data": [{"id": t.id, "title": t.title, "priority": t.priority, "days_overdue": (datetime.utcnow() - t.due_date).days} for t in overdue[:5]]
    }

def handle_blocked_query(workspace_id: int, db: Session) -> Dict[str, Any]:
    """Handle blocked task queries"""
    blocked = db.query(Task).filter(
        Task.workspace_id == workspace_id,
        Task.is_blocked == True
    ).all()
    
    if not blocked:
        return {
            "response": "No blocked tasks. Work is flowing smoothly.",
            "type": "success",
            "data": []
        }
    
    response = f"There are {len(blocked)} blocked tasks. "
    if blocked:
        response += f"Top blocker: '{blocked[0].title}' - {blocked[0].blocker_reason}"
    
    return {
        "response": response,
        "type": "warning",
        "data": [{"id": t.id, "title": t.title, "reason": t.blocker_reason} for t in blocked]
    }

def handle_velocity_query(workspace_id: int, db: Session) -> Dict[str, Any]:
    """Handle velocity and sprint queries"""
    current_sprint = db.query(Sprint).filter(
        Sprint.workspace_id == workspace_id,
        Sprint.end_date > datetime.utcnow()
    ).first()
    
    if not current_sprint:
        return {
            "response": "No active sprint found.",
            "type": "info",
            "data": {}
        }
    
    committed = db.query(func.sum(Task.story_points)).filter(
        Task.sprint_id == current_sprint.id,
        Task.story_points.isnot(None)
    ).scalar() or 0
    
    completed = db.query(func.sum(Task.story_points)).filter(
        Task.sprint_id == current_sprint.id,
        Task.status == "done",
        Task.story_points.isnot(None)
    ).scalar() or 0
    
    completion_rate = (completed / committed * 100) if committed > 0 else 0
    days_left = (current_sprint.end_date - datetime.utcnow()).days
    
    response = f"Current sprint '{current_sprint.name}': {completed}/{committed} points completed ({completion_rate:.0f}%). "
    response += f"{days_left} days remaining. "
    
    if completion_rate > 80:
        response += "On track for successful completion."
    elif completion_rate > 60:
        response += "Moderate risk - monitor closely."
    else:
        response += "High risk - intervention recommended."
    
    return {
        "response": response,
        "type": "info",
        "data": {
            "sprint": current_sprint.name,
            "committed": committed,
            "completed": completed,
            "completion_rate": round(completion_rate, 1),
            "days_remaining": days_left
        }
    }

def handle_workload_query(workspace_id: int, db: Session) -> Dict[str, Any]:
    """Handle workload queries"""
    workloads = db.query(
        User.display_name,
        func.count(Task.id).label('task_count'),
        func.sum(Task.story_points).label('points')
    ).join(Task, Task.assignee_id == User.id).filter(
        Task.workspace_id == workspace_id,
        Task.status.in_(["todo", "in_progress"])
    ).group_by(User.display_name).all()
    
    if not workloads:
        return {
            "response": "No active task assignments found.",
            "type": "info",
            "data": []
        }
    
    overloaded = [w for w in workloads if w.task_count > 5]
    
    response = f"Team workload: {len(workloads)} members with active tasks. "
    if overloaded:
        response += f"{len(overloaded)} members overloaded. "
        response += f"Highest load: {overloaded[0].display_name} with {overloaded[0].task_count} tasks."
    else:
        response += "Workload well balanced across team."
    
    return {
        "response": response,
        "type": "warning" if overloaded else "success",
        "data": [{"name": w.display_name, "tasks": w.task_count, "points": w.points or 0} for w in workloads]
    }

def handle_risk_query(workspace_id: int, db: Session) -> Dict[str, Any]:
    """Handle risk queries"""
    at_risk = db.query(Task).filter(
        Task.workspace_id == workspace_id,
        Task.is_potential_risk == True
    ).all()
    
    if not at_risk:
        return {
            "response": "No tasks currently flagged as at-risk. System health is good.",
            "type": "success",
            "data": []
        }
    
    response = f"{len(at_risk)} tasks at risk. "
    if at_risk:
        response += f"Primary concern: '{at_risk[0].title}' - {at_risk[0].risk_reason}"
    
    return {
        "response": response,
        "type": "alert",
        "data": [{"id": t.id, "title": t.title, "reason": t.risk_reason} for t in at_risk]
    }

def handle_assignment_query(question: str, workspace_id: int, db: Session) -> Dict[str, Any]:
    """Handle assignment queries"""
    # Extract name from question
    users = db.query(User).all()
    target_user = None
    
    for user in users:
        if user.display_name.lower() in question.lower() or user.username.lower() in question.lower():
            target_user = user
            break
    
    if not target_user:
        return {
            "response": "Please specify a team member name.",
            "type": "info",
            "data": []
        }
    
    tasks = db.query(Task).filter(
        Task.workspace_id == workspace_id,
        Task.assignee_id == target_user.id,
        Task.status.in_(["todo", "in_progress"])
    ).all()
    
    response = f"{target_user.display_name} has {len(tasks)} active tasks. "
    if tasks:
        high_priority = [t for t in tasks if t.priority and t.priority >= 8]
        if high_priority:
            response += f"{len(high_priority)} are high priority."
    
    return {
        "response": response,
        "type": "info",
        "data": [{"id": t.id, "title": t.title, "priority": t.priority, "status": t.status} for t in tasks[:5]]
    }

def handle_deadline_query(question: str, workspace_id: int, db: Session) -> Dict[str, Any]:
    """Handle deadline queries"""
    # Check for time frame
    if 'today' in question.lower():
        end_date = datetime.utcnow().replace(hour=23, minute=59)
        timeframe = "today"
    elif 'tomorrow' in question.lower():
        end_date = datetime.utcnow() + timedelta(days=1)
        timeframe = "tomorrow"
    elif 'week' in question.lower():
        end_date = datetime.utcnow() + timedelta(days=7)
        timeframe = "this week"
    else:
        end_date = datetime.utcnow() + timedelta(days=30)
        timeframe = "next 30 days"
    
    tasks = db.query(Task).filter(
        Task.workspace_id == workspace_id,
        Task.due_date.isnot(None),
        Task.due_date <= end_date,
        Task.status.in_(["todo", "in_progress"])
    ).order_by(Task.due_date).all()
    
    response = f"{len(tasks)} tasks due {timeframe}. "
    if tasks:
        response += f"Next deadline: '{tasks[0].title}' on {tasks[0].due_date.strftime('%Y-%m-%d')}"
    
    return {
        "response": response,
        "type": "info",
        "data": [{"id": t.id, "title": t.title, "due_date": t.due_date.isoformat()} for t in tasks[:5]]
    }

def handle_count_query(question: str, workspace_id: int, db: Session) -> Dict[str, Any]:
    """Handle counting queries"""
    question_lower = question.lower()
    
    if 'done' in question_lower or 'completed' in question_lower:
        count = db.query(func.count(Task.id)).filter(
            Task.workspace_id == workspace_id,
            Task.status == "done"
        ).scalar()
        return {
            "response": f"{count} tasks completed.",
            "type": "info",
            "data": {"count": count, "type": "completed"}
        }
    
    elif 'todo' in question_lower or 'pending' in question_lower:
        count = db.query(func.count(Task.id)).filter(
            Task.workspace_id == workspace_id,
            Task.status == "todo"
        ).scalar()
        return {
            "response": f"{count} tasks pending.",
            "type": "info",
            "data": {"count": count, "type": "pending"}
        }
    
    else:
        total = db.query(func.count(Task.id)).filter(
            Task.workspace_id == workspace_id
        ).scalar()
        return {
            "response": f"{total} total tasks in workspace.",
            "type": "info",
            "data": {"count": total, "type": "total"}
        }

def handle_status_query(question: str, workspace_id: int, db: Session) -> Dict[str, Any]:
    """Handle status queries"""
    # Extract task title from question
    tasks = db.query(Task).filter(Task.workspace_id == workspace_id).all()
    
    # Simple matching
    best_match = None
    for task in tasks:
        if task.title.lower() in question.lower():
            best_match = task
            break
    
    if not best_match:
        return {
            "response": "Could not identify specific task. Please provide task title.",
            "type": "info",
            "data": []
        }
    
    response = f"Task '{best_match.title}': Status is {best_match.status}, {best_match.progress}% complete. "
    if best_match.assignee_id:
        assignee = db.query(User).filter(User.id == best_match.assignee_id).first()
        if assignee:
            response += f"Assigned to {assignee.display_name}. "
    if best_match.due_date:
        response += f"Due {best_match.due_date.strftime('%Y-%m-%d')}."
    
    return {
        "response": response,
        "type": "info",
        "data": {
            "id": best_match.id,
            "title": best_match.title,
            "status": best_match.status,
            "progress": best_match.progress
        }
    }

def handle_recommendation_query(question: str, workspace_id: int, db: Session) -> Dict[str, Any]:
    """Handle recommendation queries"""
    # Get pending suggestions
    suggestions = db.query(AgentSuggestion).filter(
        AgentSuggestion.workspace_id == workspace_id,
        AgentSuggestion.applied == False
    ).order_by(AgentSuggestion.confidence.desc()).limit(3).all()
    
    if not suggestions:
        return {
            "response": "No pending recommendations. Run smart actions to generate suggestions.",
            "type": "info",
            "data": []
        }
    
    response = f"I have {len(suggestions)} recommendations. "
    response += f"Top suggestion: {suggestions[0].suggestion_type} (confidence: {suggestions[0].confidence:.0%})"
    
    return {
        "response": response,
        "type": "info",
        "data": [{"type": s.suggestion_type, "confidence": s.confidence} for s in suggestions]
    }
