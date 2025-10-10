"""Agent router for Nova assistant"""
from fastapi import APIRouter, Depends, BackgroundTasks
from sqlalchemy.orm import Session
from ..database import get_db
from ..services.agent_service import run_suggestion_engine, undo_action
from ..ai.gemini_client import assistant_chat

router = APIRouter(prefix="/agent", tags=["agent"])

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

@router.post("/audits/{audit_id}/undo")
def undo_agent_action(audit_id: int, db: Session = Depends(get_db)):
    """Undo an agent action"""
    success = undo_action(db, audit_id)
    return {"success": success}
