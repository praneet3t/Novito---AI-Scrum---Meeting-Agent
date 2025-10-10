"""Advanced AI intelligence and learning capabilities"""
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import datetime, timedelta
from ..database import get_db
from ..models import Task, User, AgentSuggestion, Audit, Meeting
from ..services.agent_service import create_suggestion
from typing import List, Dict
import re

router = APIRouter(prefix="/intelligence", tags=["intelligence"])

@router.post("/learn-patterns")
def learn_from_history(workspace_id: int, db: Session = Depends(get_db)):
    """Analyze historical patterns to improve future suggestions"""
    
    # Analyze approval patterns
    suggestions = db.query(AgentSuggestion).filter(
        AgentSuggestion.workspace_id == workspace_id
    ).all()
    
    approval_patterns = {}
    for suggestion in suggestions:
        stype = suggestion.suggestion_type
        if stype not in approval_patterns:
            approval_patterns[stype] = {"total": 0, "applied": 0, "avg_confidence": []}
        
        approval_patterns[stype]["total"] += 1
        if suggestion.applied:
            approval_patterns[stype]["applied"] += 1
        approval_patterns[stype]["avg_confidence"].append(suggestion.confidence)
    
    learned_patterns = {}
    for stype, data in approval_patterns.items():
        if data["total"] > 0:
            approval_rate = data["applied"] / data["total"]
            avg_conf = sum(data["avg_confidence"]) / len(data["avg_confidence"])
            learned_patterns[stype] = {
                "approval_rate": round(approval_rate, 2),
                "recommended_confidence_threshold": round(avg_conf * 0.9, 2),
                "sample_size": data["total"]
            }
    
    return {
        "patterns_learned": learned_patterns,
        "recommendations": generate_learning_recommendations(learned_patterns),
        "next_calibration": "Run after 50 more suggestions"
    }

@router.post("/predict-completion")
def predict_task_completion(task_id: int, db: Session = Depends(get_db)):
    """Predict task completion date using ML-like heuristics"""
    task = db.query(Task).filter(Task.id == task_id).first()
    if not task:
        return {"error": "Task not found"}
    
    # Get similar completed tasks
    similar_tasks = db.query(Task).filter(
        Task.workspace_id == task.workspace_id,
        Task.effort_tag == task.effort_tag,
        Task.status == "done",
        Task.assignee_id == task.assignee_id
    ).limit(10).all()
    
    if not similar_tasks:
        return {"error": "Insufficient historical data"}
    
    avg_days = sum([(t.updated_at - t.created_at).days for t in similar_tasks]) / len(similar_tasks)
    days_elapsed = (datetime.utcnow() - task.created_at).days
    progress_rate = task.progress / days_elapsed if days_elapsed > 0 else 0
    
    if progress_rate > 0:
        estimated_days_remaining = (100 - task.progress) / progress_rate
    else:
        estimated_days_remaining = avg_days - days_elapsed
    
    predicted_completion = datetime.utcnow() + timedelta(days=estimated_days_remaining)
    
    confidence = min(95, len(similar_tasks) * 10)
    
    return {
        "task_id": task_id,
        "current_progress": task.progress,
        "days_elapsed": days_elapsed,
        "predicted_completion_date": predicted_completion.isoformat(),
        "estimated_days_remaining": round(estimated_days_remaining, 1),
        "confidence": confidence,
        "based_on_similar_tasks": len(similar_tasks),
        "risk_level": "low" if estimated_days_remaining < 7 else "medium" if estimated_days_remaining < 14 else "high"
    }

@router.post("/optimize-assignments")
def optimize_task_assignments(workspace_id: int, db: Session = Depends(get_db)):
    """Suggest optimal task assignments based on historical performance"""
    
    # Get user performance metrics
    user_performance = db.query(
        Task.assignee_id,
        User.display_name,
        Task.effort_tag,
        func.avg(Task.progress).label('avg_progress'),
        func.count(Task.id).label('completed_count')
    ).join(User, Task.assignee_id == User.id).filter(
        Task.workspace_id == workspace_id,
        Task.status == "done",
        Task.assignee_id.isnot(None)
    ).group_by(Task.assignee_id, User.display_name, Task.effort_tag).all()
    
    # Build expertise matrix
    expertise = {}
    for user_id, name, effort, avg_prog, count in user_performance:
        if user_id not in expertise:
            expertise[user_id] = {"name": name, "strengths": {}}
        expertise[user_id]["strengths"][effort] = {
            "avg_progress": round(avg_prog, 1),
            "experience": count
        }
    
    # Find unassigned tasks
    unassigned = db.query(Task).filter(
        Task.workspace_id == workspace_id,
        Task.assignee_id.is_(None),
        Task.status == "todo"
    ).all()
    
    suggestions_created = []
    for task in unassigned:
        best_match = find_best_assignee(task, expertise)
        if best_match:
            suggestion = create_suggestion(
                db, workspace_id, "optimize_assignment",
                {
                    "task_id": task.id,
                    "suggested_assignee": best_match["user_id"],
                    "reason": best_match["reason"],
                    "confidence_factors": best_match["factors"]
                },
                best_match["confidence"]
            )
            suggestions_created.append(suggestion.id)
    
    db.commit()
    return {
        "optimized_assignments": len(suggestions_created),
        "suggestion_ids": suggestions_created,
        "expertise_matrix": expertise
    }

@router.post("/detect-anomalies")
def detect_workflow_anomalies(workspace_id: int, db: Session = Depends(get_db)):
    """Detect unusual patterns that may indicate problems"""
    
    anomalies = []
    
    # Detect tasks stuck in QA too long
    qa_tasks = db.query(Task).filter(
        Task.workspace_id == workspace_id,
        Task.status == "qa",
        Task.submitted_at.isnot(None)
    ).all()
    
    for task in qa_tasks:
        days_in_qa = (datetime.utcnow() - task.submitted_at).days
        if days_in_qa > 3:
            anomalies.append({
                "type": "qa_bottleneck",
                "task_id": task.id,
                "severity": "high" if days_in_qa > 7 else "medium",
                "description": f"Task in QA for {days_in_qa} days",
                "recommendation": "Review QA process or reassign verification"
            })
    
    # Detect users with declining velocity
    recent_tasks = db.query(
        Task.assignee_id,
        func.count(Task.id).label('count')
    ).filter(
        Task.workspace_id == workspace_id,
        Task.status == "done",
        Task.updated_at > datetime.utcnow() - timedelta(days=14)
    ).group_by(Task.assignee_id).all()
    
    older_tasks = db.query(
        Task.assignee_id,
        func.count(Task.id).label('count')
    ).filter(
        Task.workspace_id == workspace_id,
        Task.status == "done",
        Task.updated_at.between(
            datetime.utcnow() - timedelta(days=28),
            datetime.utcnow() - timedelta(days=14)
        )
    ).group_by(Task.assignee_id).all()
    
    recent_dict = {user_id: count for user_id, count in recent_tasks}
    older_dict = {user_id: count for user_id, count in older_tasks}
    
    for user_id in set(recent_dict.keys()) | set(older_dict.keys()):
        recent = recent_dict.get(user_id, 0)
        older = older_dict.get(user_id, 0)
        if older > 0 and recent < older * 0.5:
            user = db.query(User).filter(User.id == user_id).first()
            anomalies.append({
                "type": "velocity_decline",
                "user_id": user_id,
                "user_name": user.display_name if user else "Unknown",
                "severity": "medium",
                "description": f"Velocity dropped from {older} to {recent} tasks per 2 weeks",
                "recommendation": "Check for blockers or workload issues"
            })
    
    # Detect priority inflation
    high_priority_count = db.query(func.count(Task.id)).filter(
        Task.workspace_id == workspace_id,
        Task.priority >= 8,
        Task.status.in_(["todo", "in_progress"])
    ).scalar()
    
    total_active = db.query(func.count(Task.id)).filter(
        Task.workspace_id == workspace_id,
        Task.status.in_(["todo", "in_progress"])
    ).scalar()
    
    if total_active > 0 and (high_priority_count / total_active) > 0.5:
        anomalies.append({
            "type": "priority_inflation",
            "severity": "low",
            "description": f"{high_priority_count}/{total_active} tasks marked high priority",
            "recommendation": "Review and recalibrate priorities - not everything can be urgent"
        })
    
    return {
        "anomalies_detected": len(anomalies),
        "anomalies": anomalies,
        "health_score": calculate_health_score(anomalies)
    }

@router.post("/extract-insights")
def extract_meeting_insights(meeting_id: int, db: Session = Depends(get_db)):
    """Extract deeper insights from meeting transcripts"""
    meeting = db.query(Meeting).filter(Meeting.id == meeting_id).first()
    if not meeting:
        return {"error": "Meeting not found"}
    
    text = meeting.transcript_text.lower()
    
    insights = {
        "sentiment": analyze_sentiment(text),
        "key_topics": extract_topics(text),
        "decision_points": extract_decisions(text),
        "action_density": calculate_action_density(text),
        "participation_balance": "balanced"  # Simplified
    }
    
    return {
        "meeting_id": meeting_id,
        "insights": insights,
        "recommendations": generate_meeting_recommendations(insights)
    }

def find_best_assignee(task: Task, expertise: Dict) -> Dict:
    """Find best assignee based on expertise"""
    if not expertise or not task.effort_tag:
        return None
    
    best_score = 0
    best_user = None
    
    for user_id, data in expertise.items():
        if task.effort_tag in data["strengths"]:
            strength = data["strengths"][task.effort_tag]
            score = strength["avg_progress"] * (1 + min(strength["experience"] / 10, 1))
            if score > best_score:
                best_score = score
                best_user = user_id
    
    if best_user:
        return {
            "user_id": best_user,
            "confidence": min(0.85, best_score / 100),
            "reason": f"Strong track record with {task.effort_tag} tasks",
            "factors": expertise[best_user]["strengths"][task.effort_tag]
        }
    return None

def generate_learning_recommendations(patterns: Dict) -> List[str]:
    recs = []
    for stype, data in patterns.items():
        if data["approval_rate"] < 0.5:
            recs.append(f"Low approval for {stype} - increase confidence threshold to {data['recommended_confidence_threshold']}")
        elif data["approval_rate"] > 0.9:
            recs.append(f"High approval for {stype} - consider enabling auto-apply")
    return recs if recs else ["All suggestion types performing well"]

def calculate_health_score(anomalies: List[Dict]) -> int:
    if not anomalies:
        return 100
    
    severity_weights = {"low": 5, "medium": 15, "high": 30}
    deductions = sum([severity_weights.get(a["severity"], 10) for a in anomalies])
    return max(0, 100 - deductions)

def analyze_sentiment(text: str) -> str:
    positive_words = ["great", "excellent", "good", "progress", "completed", "success"]
    negative_words = ["blocked", "issue", "problem", "delayed", "concern", "risk"]
    
    pos_count = sum([text.count(word) for word in positive_words])
    neg_count = sum([text.count(word) for word in negative_words])
    
    if pos_count > neg_count * 1.5:
        return "positive"
    elif neg_count > pos_count * 1.5:
        return "negative"
    return "neutral"

def extract_topics(text: str) -> List[str]:
    topics = []
    if "authentication" in text or "login" in text:
        topics.append("authentication")
    if "database" in text or "migration" in text:
        topics.append("database")
    if "test" in text or "qa" in text:
        topics.append("testing")
    if "deploy" in text or "release" in text:
        topics.append("deployment")
    return topics if topics else ["general"]

def extract_decisions(text: str) -> List[str]:
    decisions = []
    decision_patterns = [
        r"decided to (.+?)[\.\n]",
        r"we will (.+?)[\.\n]",
        r"agreed to (.+?)[\.\n]"
    ]
    for pattern in decision_patterns:
        matches = re.findall(pattern, text, re.IGNORECASE)
        decisions.extend(matches[:3])
    return decisions

def calculate_action_density(text: str) -> str:
    action_words = ["will", "should", "need to", "must", "going to"]
    count = sum([text.count(word) for word in action_words])
    words = len(text.split())
    density = (count / words * 100) if words > 0 else 0
    
    if density > 5:
        return "high"
    elif density > 2:
        return "medium"
    return "low"

def generate_meeting_recommendations(insights: Dict) -> List[str]:
    recs = []
    if insights["sentiment"] == "negative":
        recs.append("Address concerns raised in meeting promptly")
    if insights["action_density"] == "low":
        recs.append("Meeting had few action items - ensure clear outcomes")
    if len(insights["decision_points"]) == 0:
        recs.append("No clear decisions recorded - document key decisions")
    return recs if recs else ["Meeting was productive and well-structured"]
