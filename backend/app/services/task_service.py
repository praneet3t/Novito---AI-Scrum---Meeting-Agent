"""Task service for task operations"""
from sqlalchemy.orm import Session
from typing import List, Optional
from ..models import Task, User, AgentSuggestion
from ..ai.gemini_client import generate_tasks_from_transcript

def create_task_from_candidate(
    db: Session,
    workspace_id: int,
    candidate: dict,
    meeting_id: Optional[int] = None
) -> Task:
    """Create a persistent task from an AI candidate"""
    # Find assignee by name if provided
    assignee_id = None
    if candidate.get("assignee"):
        user = db.query(User).filter(User.username == candidate["assignee"]).first()
        if user:
            assignee_id = user.id
    
    task = Task(
        workspace_id=workspace_id,
        title=candidate["description"][:100],  # Use description as title
        description=candidate["description"],
        assignee_id=assignee_id,
        priority=candidate.get("priority"),
        effort_tag=candidate.get("effort_tag"),
        is_blocked=candidate.get("is_blocked", False),
        blocker_reason=candidate.get("blocker_reason"),
        confidence=candidate.get("confidence"),
        needs_priority_review=candidate.get("confidence", 1.0) < 0.7
    )
    
    db.add(task)
    db.commit()
    db.refresh(task)
    return task

def get_review_queue(db: Session, workspace_id: int) -> List[AgentSuggestion]:
    """Get unapplied suggestions for review"""
    return db.query(AgentSuggestion).filter(
        AgentSuggestion.workspace_id == workspace_id,
        AgentSuggestion.applied == False
    ).order_by(AgentSuggestion.created_at.desc()).all()

def capture_quick_task(db: Session, workspace_id: int, text: str, user_id: int) -> Task:
    """Quick capture a task from text"""
    task = Task(
        workspace_id=workspace_id,
        title=text[:100],
        description=text,
        assignee_id=user_id,
        priority=5,
        confidence=1.0
    )
    db.add(task)
    db.commit()
    db.refresh(task)
    return task
