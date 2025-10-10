"""Autonomous mapping engine - zero manual input"""
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from ..database import get_db
from ..models import Task, User, Meeting, Dependency
from ..services.agent_service import create_suggestion
import re
from typing import List, Dict

router = APIRouter(prefix="/auto-map", tags=["auto-mapping"])

@router.post("/process-meeting")
def auto_map_meeting(meeting_id: int, db: Session = Depends(get_db)):
    """Automatically extract and map all task attributes from meeting"""
    meeting = db.query(Meeting).filter(Meeting.id == meeting_id).first()
    if not meeting:
        return {"error": "Meeting not found"}
    
    text = meeting.transcript_text
    mapped_tasks = []
    
    # Extract all potential tasks
    sentences = text.split('.')
    for sentence in sentences:
        sentence = sentence.strip()
        if not sentence or len(sentence) < 10:
            continue
        
        # Check if it's an action item
        if any(word in sentence.lower() for word in ['will', 'should', 'need to', 'must', 'going to', 'has to']):
            task_data = {
                "title": extract_title(sentence),
                "description": sentence,
                "owner": extract_owner(sentence, db, meeting.workspace_id),
                "deadline": extract_deadline(sentence),
                "dependencies": extract_dependencies(sentence, mapped_tasks),
                "blockers": extract_blockers(sentence),
                "priority": infer_priority(sentence),
                "confidence": calculate_confidence(sentence)
            }
            
            if task_data["title"]:
                suggestion = create_suggestion(
                    db, meeting.workspace_id, "auto_mapped_task",
                    task_data, task_data["confidence"]
                )
                mapped_tasks.append({"id": suggestion.id, "title": task_data["title"]})
    
    db.commit()
    return {
        "tasks_mapped": len(mapped_tasks),
        "suggestions": mapped_tasks,
        "auto_mapped": {
            "owners": sum(1 for t in mapped_tasks if mapped_tasks),
            "deadlines": sum(1 for t in mapped_tasks if mapped_tasks),
            "dependencies": 0,
            "blockers": 0
        }
    }

@router.post("/infer-dependencies")
def infer_task_dependencies(workspace_id: int, db: Session = Depends(get_db)):
    """Automatically infer dependencies from task relationships"""
    tasks = db.query(Task).filter(
        Task.workspace_id == workspace_id,
        Task.status.in_(["todo", "in_progress"])
    ).all()
    
    dependencies_found = []
    
    for task in tasks:
        text = f"{task.title} {task.description}".lower()
        
        # Find potential dependencies
        for other_task in tasks:
            if task.id == other_task.id:
                continue
            
            # Check if other task is mentioned
            if other_task.title.lower() in text:
                # Check for dependency keywords
                if any(kw in text for kw in ['after', 'depends on', 'requires', 'needs', 'blocked by', 'waiting for']):
                    existing = db.query(Dependency).filter(
                        Dependency.task_id == task.id,
                        Dependency.depends_on_task_id == other_task.id
                    ).first()
                    
                    if not existing:
                        dep = Dependency(
                            workspace_id=workspace_id,
                            task_id=task.id,
                            depends_on_task_id=other_task.id
                        )
                        db.add(dep)
                        dependencies_found.append({
                            "task": task.title,
                            "depends_on": other_task.title
                        })
    
    db.commit()
    return {
        "dependencies_mapped": len(dependencies_found),
        "dependencies": dependencies_found
    }

@router.post("/detect-blockers")
def auto_detect_blockers(workspace_id: int, db: Session = Depends(get_db)):
    """Automatically detect blockers from task state and dependencies"""
    tasks = db.query(Task).filter(
        Task.workspace_id == workspace_id,
        Task.status.in_(["todo", "in_progress"])
    ).all()
    
    blockers_detected = []
    
    for task in tasks:
        blocker_reasons = []
        
        # Check dependency blockers
        dependencies = db.query(Dependency).filter(
            Dependency.task_id == task.id
        ).all()
        
        for dep in dependencies:
            dep_task = db.query(Task).filter(Task.id == dep.depends_on_task_id).first()
            if dep_task and dep_task.status != "done":
                blocker_reasons.append(f"Waiting for: {dep_task.title}")
        
        # Check for stalled progress
        if task.progress > 0 and task.progress < 100:
            days_since_update = (datetime.utcnow() - task.updated_at).days
            if days_since_update > 3:
                blocker_reasons.append(f"No progress for {days_since_update} days")
        
        # Check for overdue without progress
        if task.due_date and task.due_date < datetime.utcnow() and task.progress < 50:
            blocker_reasons.append("Overdue with low progress")
        
        if blocker_reasons and not task.is_blocked:
            task.is_blocked = True
            task.blocker_reason = "; ".join(blocker_reasons)
            blockers_detected.append({
                "task": task.title,
                "reasons": blocker_reasons
            })
    
    db.commit()
    return {
        "blockers_detected": len(blockers_detected),
        "blockers": blockers_detected
    }

def extract_title(sentence: str) -> str:
    """Extract task title from sentence"""
    # Remove common prefixes
    sentence = re.sub(r'^(I will|We will|Should|Need to|Must|Going to|Has to)\s+', '', sentence, flags=re.IGNORECASE)
    # Take first 80 chars
    return sentence[:80].strip()

def extract_owner(sentence: str, db: Session, workspace_id: int) -> int:
    """Extract task owner from sentence"""
    users = db.query(User).all()
    
    for user in users:
        # Check for name mentions
        if user.display_name.lower() in sentence.lower() or user.username.lower() in sentence.lower():
            return user.id
    
    # Check for role mentions
    if 'dev' in sentence.lower():
        dev = db.query(User).filter(User.role == 'dev').first()
        if dev:
            return dev.id
    
    return None

def extract_deadline(sentence: str) -> datetime:
    """Extract deadline from sentence"""
    sentence_lower = sentence.lower()
    
    # Specific dates
    if 'today' in sentence_lower:
        return datetime.utcnow()
    if 'tomorrow' in sentence_lower:
        return datetime.utcnow() + timedelta(days=1)
    if 'next week' in sentence_lower:
        return datetime.utcnow() + timedelta(days=7)
    if 'end of week' in sentence_lower or 'friday' in sentence_lower:
        days_until_friday = (4 - datetime.utcnow().weekday()) % 7
        return datetime.utcnow() + timedelta(days=days_until_friday)
    if 'next month' in sentence_lower:
        return datetime.utcnow() + timedelta(days=30)
    
    # Extract "by [day]" or "in [n] days"
    by_match = re.search(r'by (\w+)', sentence_lower)
    if by_match:
        return datetime.utcnow() + timedelta(days=7)
    
    in_match = re.search(r'in (\d+) days?', sentence_lower)
    if in_match:
        return datetime.utcnow() + timedelta(days=int(in_match.group(1)))
    
    return None

def extract_dependencies(sentence: str, existing_tasks: List[Dict]) -> List[str]:
    """Extract dependencies from sentence"""
    deps = []
    sentence_lower = sentence.lower()
    
    for task in existing_tasks:
        if task["title"].lower() in sentence_lower:
            if any(kw in sentence_lower for kw in ['after', 'depends on', 'requires', 'needs']):
                deps.append(task["title"])
    
    return deps

def extract_blockers(sentence: str) -> str:
    """Extract blocker information from sentence"""
    sentence_lower = sentence.lower()
    
    blocker_keywords = ['blocked by', 'waiting for', 'pending', 'stuck on', 'need approval']
    for keyword in blocker_keywords:
        if keyword in sentence_lower:
            # Extract text after keyword
            idx = sentence_lower.index(keyword)
            blocker_text = sentence[idx:idx+100]
            return blocker_text
    
    return None

def infer_priority(sentence: str) -> int:
    """Infer priority from sentence urgency"""
    sentence_lower = sentence.lower()
    
    high_urgency = ['urgent', 'critical', 'asap', 'immediately', 'emergency']
    medium_urgency = ['important', 'soon', 'priority', 'should']
    
    if any(word in sentence_lower for word in high_urgency):
        return 9
    if any(word in sentence_lower for word in medium_urgency):
        return 7
    
    return 5

def calculate_confidence(sentence: str) -> float:
    """Calculate confidence score for extraction"""
    score = 0.5
    
    # Higher confidence if clear action words
    if any(word in sentence.lower() for word in ['will', 'must', 'need to']):
        score += 0.2
    
    # Higher confidence if owner mentioned
    if any(word in sentence.lower() for word in ['i will', 'john', 'sarah', 'dev', 'qa']):
        score += 0.15
    
    # Higher confidence if deadline mentioned
    if any(word in sentence.lower() for word in ['by', 'today', 'tomorrow', 'friday', 'next week']):
        score += 0.15
    
    return min(score, 0.95)
