"""Audit trail router"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import Audit
from ..services.agent_service import undo_action

router = APIRouter(prefix="/audits", tags=["audits"])

@router.get("/")
def list_audits(workspace_id: int, limit: int = 50, db: Session = Depends(get_db)):
    """List audit trail"""
    audits = db.query(Audit).filter(
        Audit.workspace_id == workspace_id
    ).order_by(Audit.created_at.desc()).limit(limit).all()
    return audits

@router.post("/{audit_id}/undo")
def undo_audit_action(audit_id: int, db: Session = Depends(get_db)):
    """Undo an audited action"""
    success = undo_action(db, audit_id)
    if not success:
        raise HTTPException(status_code=400, detail="Cannot undo this action")
    return {"success": True, "message": "Action undone"}
