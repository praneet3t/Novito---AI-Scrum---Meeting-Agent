"""Tasks router for task management"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from ..database import get_db
from ..models import Task, AgentSuggestion
from ..schemas import TaskResponse, TaskUpdate, CaptureRequest
from ..services.task_service import create_task_from_candidate, get_review_queue, capture_quick_task
from ..services.agent_service import apply_suggestion

router = APIRouter(prefix="/tasks", tags=["tasks"])

@router.get("/review")
def get_review_tasks(workspace_id: int, db: Session = Depends(get_db)):
    """Get tasks in review queue (unapplied suggestions)"""
    suggestions = get_review_queue(db, workspace_id)
    return suggestions

@router.patch("/{task_id}/approve")
def approve_task(task_id: int, db: Session = Depends(get_db)):
    """Approve an AI candidate and create persistent task"""
    # Find the suggestion
    suggestion = db.query(AgentSuggestion).filter(
        AgentSuggestion.id == task_id,
        AgentSuggestion.suggestion_type == "create_task"
    ).first()
    
    if not suggestion:
        raise HTTPException(status_code=404, detail="Suggestion not found")
    
    # Apply the suggestion
    success = apply_suggestion(db, suggestion.id, actor_id=1)
    
    if not success:
        raise HTTPException(status_code=400, detail="Failed to apply suggestion")
    
    return {"success": True, "message": "Task created"}

@router.get("/my")
def get_my_tasks(user_id: int, db: Session = Depends(get_db)):
    """Get tasks assigned to user"""
    tasks = db.query(Task).filter(Task.assignee_id == user_id).all()
    return tasks

@router.get("/")
def list_tasks(workspace_id: int, status: str = None, db: Session = Depends(get_db)):
    """List all tasks with optional status filter"""
    query = db.query(Task).filter(Task.workspace_id == workspace_id)
    if status:
        query = query.filter(Task.status == status)
    return query.order_by(Task.created_at.desc()).all()

@router.get("/{task_id}")
def get_task(task_id: int, db: Session = Depends(get_db)):
    """Get single task details"""
    task = db.query(Task).filter(Task.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    return task

@router.patch("/{task_id}")
def update_task(task_id: int, update: TaskUpdate, db: Session = Depends(get_db)):
    """Update task fields"""
    task = db.query(Task).filter(Task.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    
    update_data = update.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(task, field, value)
    
    db.commit()
    db.refresh(task)
    return task

@router.post("/capture")
def capture_task(request: CaptureRequest, db: Session = Depends(get_db)):
    """Quick capture a task"""
    task = capture_quick_task(db, request.workspace_id, request.text, user_id=1)
    return task
