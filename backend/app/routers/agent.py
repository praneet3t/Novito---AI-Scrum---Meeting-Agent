"""Agent router for Nova assistant"""
from fastapi import APIRouter, Depends, BackgroundTasks, HTTPException
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import AgentSuggestion, Audit
from ..services.agent_service import run_suggestion_engine, undo_action, apply_suggestion, reject_suggestion
from ..ai.gemini_client import assistant_chat

router = APIRouter(prefix="/agent", tags=["agent"])

@router.get("/suggestions")
def list_suggestions(workspace_id: int, applied: bool = None, db: Session = Depends(get_db)):
    """List agent suggestions with optional filter"""
    query = db.query(AgentSuggestion).filter(AgentSuggestion.workspace_id == workspace_id)
    if applied is not None:
        query = query.filter(AgentSuggestion.applied == applied)
    return query.order_by(AgentSuggestion.created_at.desc()).all()

@router.patch("/suggestions/{suggestion_id}/apply")
def apply_agent_suggestion(suggestion_id: int, actor_id: int = 1, db: Session = Depends(get_db)):
    """Apply an agent suggestion"""
    success = apply_suggestion(db, suggestion_id, actor_id)
    if not success:
        raise HTTPException(status_code=400, detail="Failed to apply suggestion")
    return {"success": True, "message": "Suggestion applied"}

@router.patch("/suggestions/{suggestion_id}/reject")
def reject_agent_suggestion(suggestion_id: int, actor_id: int = 1, db: Session = Depends(get_db)):
    """Reject an agent suggestion"""
    success = reject_suggestion(db, suggestion_id, actor_id)
    if not success:
        raise HTTPException(status_code=404, detail="Suggestion not found")
    return {"success": True, "message": "Suggestion rejected"}

@router.post("/run-suggestions")
def run_suggestions(
    workspace_id: int,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db)
):
    """Run the suggestion engine"""
    suggestions = run_suggestion_engine(db, workspace_id)
    return {
        "success": True,
        "suggestions_created": len(suggestions)
    }

@router.post("/chat")
def chat_with_nova(message: str, context: str = "", db: Session = Depends(get_db)):
    """Chat with Nova assistant"""
    response = assistant_chat(message, context)
    return response
