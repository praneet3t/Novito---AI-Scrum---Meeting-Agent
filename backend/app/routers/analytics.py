"""Analytics router for dashboards"""
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ..database import get_db
from ..services.analytics_service import (
    get_briefing,
    get_burndown_data,
    get_velocity_data,
    get_task_distribution
)

router = APIRouter(prefix="/analytics", tags=["analytics"])

@router.get("/briefing")
def get_executive_briefing(workspace_id: int, days: int = 7, db: Session = Depends(get_db)):
    """Get executive briefing with blockers, overdue, risks"""
    return get_briefing(db, workspace_id, days)

@router.get("/burndown/{sprint_id}")
def get_burndown(sprint_id: int, db: Session = Depends(get_db)):
    """Get burndown chart data"""
    return get_burndown_data(db, sprint_id)

@router.get("/velocity")
def get_velocity(workspace_id: int, db: Session = Depends(get_db)):
    """Get velocity trend"""
    return get_velocity_data(db, workspace_id)

@router.get("/distribution")
def get_distribution(workspace_id: int, db: Session = Depends(get_db)):
    """Get task distribution by status"""
    return get_task_distribution(db, workspace_id)
