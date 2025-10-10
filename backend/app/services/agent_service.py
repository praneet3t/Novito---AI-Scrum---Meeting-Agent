"""Agent service for Nova suggestions and auto-actions"""
import logging
from sqlalchemy.orm import Session
from datetime import datetime
from typing import List, Dict, Any
from ..models import AgentSuggestion, Task, Workspace, Audit, AgentMode
from ..config import AGENT_AUTO_CONFIDENCE

logger = logging.getLogger(__name__)

def create_suggestion(
    db: Session,
    workspace_id: int,
    suggestion_type: str,
    payload: Dict[str, Any],
    confidence: float
) -> AgentSuggestion:
    """Create a new agent suggestion"""
    suggestion = AgentSuggestion(
        workspace_id=workspace_id,
        suggestion_type=suggestion_type,
        payload=payload,
        confidence=confidence,
        applied=False
    )
    db.add(suggestion)
    db.commit()
    db.refresh(suggestion)
    return suggestion

def reject_suggestion(
    db: Session,
    suggestion_id: int,
    actor_id: int
) -> bool:
    """Reject an agent suggestion"""
    suggestion = db.query(AgentSuggestion).filter(AgentSuggestion.id == suggestion_id).first()
    if not suggestion:
        return False
    
    suggestion.applied = True  # Mark as processed
    audit = Audit(
        workspace_id=suggestion.workspace_id,
        actor_id=actor_id,
        action_type="agent_suggestion_rejected",
        target_type="suggestion",
        target_id=suggestion_id,
        before={"suggestion_type": suggestion.suggestion_type},
        after={"rejected": True}
    )
    db.add(audit)
    db.commit()
    return True

def apply_suggestion(
    db: Session,
    suggestion_id: int,
    actor_id: int
) -> bool:
    """Apply an agent suggestion and create audit log"""
    suggestion = db.query(AgentSuggestion).filter(AgentSuggestion.id == suggestion_id).first()
    if not suggestion or suggestion.applied:
        return False
    
    workspace = db.query(Workspace).filter(Workspace.id == suggestion.workspace_id).first()
    if not workspace:
        return False
    
    # Execute the suggestion based on type
    success = False
    before_state = None
    after_state = None
    target_id = None
    
    if suggestion.suggestion_type == "set_focus_time":
        task_id = suggestion.payload.get("task_id")
        focus_time = suggestion.payload.get("focus_time")
        task = db.query(Task).filter(Task.id == task_id).first()
        if task:
            before_state = {"suggested_focus_time": task.suggested_focus_time}
            task.suggested_focus_time = focus_time
            after_state = {"suggested_focus_time": focus_time}
            target_id = task_id
            success = True
    
    elif suggestion.suggestion_type == "create_task":
        task = Task(
            workspace_id=suggestion.workspace_id,
            title=suggestion.payload.get("title"),
            description=suggestion.payload.get("description"),
            assignee_id=suggestion.payload.get("assignee_id"),
            priority=suggestion.payload.get("priority"),
            effort_tag=suggestion.payload.get("effort_tag"),
            confidence=suggestion.confidence
        )
        db.add(task)
        db.flush()
        target_id = task.id
        after_state = {"task_id": task.id, "title": task.title}
        success = True
    
    elif suggestion.suggestion_type == "flag_risk":
        task_id = suggestion.payload.get("task_id")
        task = db.query(Task).filter(Task.id == task_id).first()
        if task:
            before_state = {"is_potential_risk": task.is_potential_risk, "risk_reason": task.risk_reason}
            task.is_potential_risk = True
            task.risk_reason = suggestion.payload.get("reason")
            after_state = {"is_potential_risk": True, "risk_reason": task.risk_reason}
            target_id = task_id
            success = True
    
    elif suggestion.suggestion_type == "set_priority":
        task_id = suggestion.payload.get("task_id")
        priority = suggestion.payload.get("suggested_priority")
        task = db.query(Task).filter(Task.id == task_id).first()
        if task:
            before_state = {"priority": task.priority}
            task.priority = priority
            after_state = {"priority": priority}
            target_id = task_id
            success = True
    
    elif suggestion.suggestion_type == "split_task":
        parent_id = suggestion.payload.get("parent_task_id")
        subtasks = suggestion.payload.get("subtasks", [])
        for subtask_data in subtasks:
            subtask = Task(
                workspace_id=suggestion.workspace_id,
                title=subtask_data.get("title"),
                description=subtask_data.get("description"),
                parent_task_id=parent_id,
                effort_tag=subtask_data.get("effort_tag"),
                confidence=suggestion.confidence
            )
            db.add(subtask)
        target_id = parent_id
        after_state = {"subtasks_created": len(subtasks)}
        success = True
    
    if success:
        suggestion.applied = True
        
        # Create audit log
        audit = Audit(
            workspace_id=suggestion.workspace_id,
            actor_id=actor_id,
            action_type=f"agent_{suggestion.suggestion_type}",
            target_type="task",
            target_id=target_id,
            before=before_state,
            after=after_state,
            suggestion_id=suggestion_id
        )
        db.add(audit)
        db.commit()
        logger.info(f"Applied suggestion {suggestion_id}: {suggestion.suggestion_type}")
    
    return success

def run_suggestion_engine(db: Session, workspace_id: int) -> List[AgentSuggestion]:
    """Run the suggestion engine to generate new suggestions"""
    workspace = db.query(Workspace).filter(Workspace.id == workspace_id).first()
    if not workspace or workspace.agent_mode == AgentMode.off:
        return []
    
    suggestions = []
    
    # Find tasks that need focus time suggestions
    tasks_without_focus = db.query(Task).filter(
        Task.workspace_id == workspace_id,
        Task.suggested_focus_time.is_(None),
        Task.status.in_(["todo", "in_progress"])
    ).limit(5).all()
    
    for task in tasks_without_focus:
        # Simple heuristic: estimate focus time based on effort tag
        focus_time = 2 if task.effort_tag == "small" else 4 if task.effort_tag == "medium" else 8
        confidence = 0.75
        
        suggestion = create_suggestion(
            db,
            workspace_id,
            "set_focus_time",
            {"task_id": task.id, "focus_time": focus_time},
            confidence
        )
        suggestions.append(suggestion)
        
        # Auto-apply if mode is auto and confidence is high enough
        if workspace.agent_mode == AgentMode.auto:
            auto_threshold = workspace.agent_config.get("auto_confidence_threshold", AGENT_AUTO_CONFIDENCE)
            allowed_actions = workspace.agent_config.get("allowed_auto_actions", [])
            
            if confidence >= auto_threshold and "set_focus_time" in allowed_actions:
                apply_suggestion(db, suggestion.id, actor_id=None)
                logger.info(f"Auto-applied suggestion {suggestion.id}")
    
    # Find large tasks that should be split
    large_tasks = db.query(Task).filter(
        Task.workspace_id == workspace_id,
        Task.effort_tag == "large",
        Task.status == "todo"
    ).limit(3).all()
    
    for task in large_tasks:
        suggestion = create_suggestion(
            db,
            workspace_id,
            "split_task",
            {
                "parent_task_id": task.id,
                "subtasks": [
                    {"title": f"{task.title} - Part 1", "description": "First phase", "effort_tag": "medium"},
                    {"title": f"{task.title} - Part 2", "description": "Second phase", "effort_tag": "medium"}
                ]
            },
            0.70
        )
        suggestions.append(suggestion)
    
    return suggestions

def undo_action(db: Session, audit_id: int) -> bool:
    """Undo an agent action based on audit log"""
    audit = db.query(Audit).filter(Audit.id == audit_id).first()
    if not audit or not audit.before:
        return False
    
    # Revert based on action type
    if audit.action_type == "agent_set_focus_time":
        task = db.query(Task).filter(Task.id == audit.target_id).first()
        if task:
            task.suggested_focus_time = audit.before.get("suggested_focus_time")
            db.commit()
            logger.info(f"Undid action {audit_id}")
            return True
    
    return False
