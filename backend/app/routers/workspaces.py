"""Workspace router"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import Workspace
from pydantic import BaseModel

router = APIRouter(prefix="/workspaces", tags=["workspaces"])

class AgentModeUpdate(BaseModel):
    agent_mode: str
    agent_config: dict = None

@router.get("/{workspace_id}")
def get_workspace(workspace_id: int, db: Session = Depends(get_db)):
    """Get workspace settings"""
    workspace = db.query(Workspace).filter(Workspace.id == workspace_id).first()
    if not workspace:
        raise HTTPException(status_code=404, detail="Workspace not found")
    return workspace

@router.patch("/{workspace_id}/agent-mode")
def update_agent_mode(workspace_id: int, update: AgentModeUpdate, db: Session = Depends(get_db)):
    """Update agent mode and config"""
    workspace = db.query(Workspace).filter(Workspace.id == workspace_id).first()
    if not workspace:
        raise HTTPException(status_code=404, detail="Workspace not found")
    
    workspace.agent_mode = update.agent_mode
    if update.agent_config:
        workspace.agent_config = update.agent_config
    
    db.commit()
    db.refresh(workspace)
    return workspace
