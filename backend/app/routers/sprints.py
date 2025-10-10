"""Sprints router"""
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import Sprint, Task

router = APIRouter(prefix="/sprints", tags=["sprints"])

@router.get("/")
def list_sprints(workspace_id: int, db: Session = Depends(get_db)):
    """List all sprints"""
    sprints = db.query(Sprint).filter(
        Sprint.workspace_id == workspace_id
    ).order_by(Sprint.start_date.desc()).all()
    return sprints

@router.get("/{sprint_id}/tasks")
def get_sprint_tasks(sprint_id: int, db: Session = Depends(get_db)):
    """Get tasks in a sprint"""
    tasks = db.query(Task).filter(Task.sprint_id == sprint_id).all()
    return tasks
