"""Advanced analytics and predictive intelligence"""
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func, case
from datetime import datetime, timedelta
from ..database import get_db
from ..models import Task, Sprint, User, AgentSuggestion, Audit
from typing import Dict, List
import statistics

router = APIRouter(prefix="/analytics", tags=["analytics"])

@router.get("/velocity-forecast")
def forecast_velocity(workspace_id: int, db: Session = Depends(get_db)):
    """Predict sprint completion probability using historical velocity"""
    sprints = db.query(Sprint).filter(
        Sprint.workspace_id == workspace_id,
        Sprint.velocity.isnot(None)
    ).order_by(Sprint.start_date.desc()).limit(5).all()
    
    if len(sprints) < 2:
        return {"error": "Insufficient historical data", "min_sprints_needed": 2}
    
    velocities = [s.velocity for s in sprints]
    avg_velocity = statistics.mean(velocities)
    std_dev = statistics.stdev(velocities) if len(velocities) > 1 else 0
    
    current_sprint = db.query(Sprint).filter(
        Sprint.workspace_id == workspace_id,
        Sprint.end_date > datetime.utcnow()
    ).first()
    
    if not current_sprint:
        return {"error": "No active sprint"}
    
    committed_points = db.query(func.sum(Task.story_points)).filter(
        Task.sprint_id == current_sprint.id,
        Task.story_points.isnot(None)
    ).scalar() or 0
    
    completed_points = db.query(func.sum(Task.story_points)).filter(
        Task.sprint_id == current_sprint.id,
        Task.status == "done",
        Task.story_points.isnot(None)
    ).scalar() or 0
    
    remaining_points = committed_points - completed_points
    days_remaining = (current_sprint.end_date - datetime.utcnow()).days
    
    completion_probability = min(100, (avg_velocity / committed_points * 100)) if committed_points > 0 else 100
    
    return {
        "historical_velocity": {
            "average": round(avg_velocity, 1),
            "std_deviation": round(std_dev, 1),
            "trend": "stable" if std_dev < avg_velocity * 0.2 else "volatile",
            "last_5_sprints": velocities
        },
        "current_sprint": {
            "name": current_sprint.name,
            "committed_points": committed_points,
            "completed_points": completed_points,
            "remaining_points": remaining_points,
            "days_remaining": days_remaining,
            "completion_probability": round(completion_probability, 1),
            "risk_level": "low" if completion_probability > 80 else "medium" if completion_probability > 60 else "high"
        },
        "recommendation": generate_velocity_recommendation(completion_probability, remaining_points, days_remaining)
    }

@router.get("/task-cycle-time")
def analyze_cycle_time(workspace_id: int, db: Session = Depends(get_db)):
    """Analyze task cycle time and identify bottlenecks"""
    completed_tasks = db.query(Task).filter(
        Task.workspace_id == workspace_id,
        Task.status == "done",
        Task.created_at.isnot(None)
    ).order_by(Task.updated_at.desc()).limit(50).all()
    
    if not completed_tasks:
        return {"error": "No completed tasks"}
    
    cycle_times = []
    by_effort = {"small": [], "medium": [], "large": []}
    
    for task in completed_tasks:
        cycle_time = (task.updated_at - task.created_at).days
        cycle_times.append(cycle_time)
        if task.effort_tag:
            by_effort[task.effort_tag].append(cycle_time)
    
    return {
        "overall": {
            "average_days": round(statistics.mean(cycle_times), 1),
            "median_days": round(statistics.median(cycle_times), 1),
            "p85_days": round(sorted(cycle_times)[int(len(cycle_times) * 0.85)], 1),
            "min_days": min(cycle_times),
            "max_days": max(cycle_times)
        },
        "by_effort": {
            effort: {
                "average_days": round(statistics.mean(times), 1) if times else 0,
                "sample_size": len(times)
            }
            for effort, times in by_effort.items() if times
        },
        "insight": generate_cycle_time_insight(cycle_times, by_effort)
    }

@router.get("/workload-distribution")
def analyze_workload(workspace_id: int, db: Session = Depends(get_db)):
    """Analyze workload distribution and capacity utilization"""
    user_workloads = db.query(
        Task.assignee_id,
        User.display_name,
        func.count(Task.id).label('task_count'),
        func.sum(Task.story_points).label('total_points'),
        func.sum(case((Task.status == 'done', Task.story_points), else_=0)).label('completed_points')
    ).join(User, Task.assignee_id == User.id).filter(
        Task.workspace_id == workspace_id,
        Task.assignee_id.isnot(None)
    ).group_by(Task.assignee_id, User.display_name).all()
    
    if not user_workloads:
        return {"error": "No assigned tasks"}
    
    workloads = []
    total_points = sum([w.total_points or 0 for w in user_workloads])
    
    for user_id, name, task_count, points, completed in user_workloads:
        points = points or 0
        completed = completed or 0
        workloads.append({
            "user_id": user_id,
            "name": name,
            "task_count": task_count,
            "total_points": points,
            "completed_points": completed,
            "completion_rate": round((completed / points * 100) if points > 0 else 0, 1),
            "workload_percentage": round((points / total_points * 100) if total_points > 0 else 0, 1),
            "status": "overloaded" if task_count > 5 else "balanced" if task_count > 2 else "underutilized"
        })
    
    points_list = [w['total_points'] for w in workloads]
    balance_score = 100 - (statistics.stdev(points_list) / statistics.mean(points_list) * 100) if len(points_list) > 1 and statistics.mean(points_list) > 0 else 100
    
    return {
        "team_workload": workloads,
        "balance_metrics": {
            "balance_score": round(max(0, balance_score), 1),
            "interpretation": "excellent" if balance_score > 80 else "good" if balance_score > 60 else "needs_rebalancing",
            "total_capacity": total_points,
            "average_per_member": round(statistics.mean(points_list), 1) if points_list else 0
        },
        "recommendations": generate_workload_recommendations(workloads)
    }

@router.get("/ai-effectiveness")
def analyze_ai_effectiveness(workspace_id: int, db: Session = Depends(get_db)):
    """Measure AI suggestion accuracy and adoption rate"""
    total_suggestions = db.query(func.count(AgentSuggestion.id)).filter(
        AgentSuggestion.workspace_id == workspace_id
    ).scalar()
    
    applied_suggestions = db.query(func.count(AgentSuggestion.id)).filter(
        AgentSuggestion.workspace_id == workspace_id,
        AgentSuggestion.applied == True
    ).scalar()
    
    by_type = db.query(
        AgentSuggestion.suggestion_type,
        func.count(AgentSuggestion.id).label('total'),
        func.sum(case((AgentSuggestion.applied == True, 1), else_=0)).label('applied'),
        func.avg(AgentSuggestion.confidence).label('avg_confidence')
    ).filter(
        AgentSuggestion.workspace_id == workspace_id
    ).group_by(AgentSuggestion.suggestion_type).all()
    
    auto_actions = db.query(func.count(Audit.id)).filter(
        Audit.workspace_id == workspace_id,
        Audit.actor_id.is_(None)
    ).scalar()
    
    adoption_rate = (applied_suggestions / total_suggestions * 100) if total_suggestions > 0 else 0
    
    return {
        "overall_metrics": {
            "total_suggestions": total_suggestions,
            "applied_suggestions": applied_suggestions,
            "adoption_rate": round(adoption_rate, 1),
            "auto_actions_executed": auto_actions,
            "effectiveness_score": calculate_effectiveness_score(adoption_rate, total_suggestions)
        },
        "by_suggestion_type": [
            {
                "type": stype,
                "total": total,
                "applied": applied,
                "adoption_rate": round((applied / total * 100) if total > 0 else 0, 1),
                "avg_confidence": round(avg_conf, 2)
            }
            for stype, total, applied, avg_conf in by_type
        ],
        "insight": generate_ai_effectiveness_insight(adoption_rate, by_type)
    }

@router.get("/risk-heatmap")
def generate_risk_heatmap(workspace_id: int, db: Session = Depends(get_db)):
    """Generate risk heatmap across priority and progress dimensions"""
    tasks = db.query(Task).filter(
        Task.workspace_id == workspace_id,
        Task.status.in_(["todo", "in_progress"]),
        Task.priority.isnot(None)
    ).all()
    
    heatmap = {}
    for priority in range(1, 11):
        heatmap[priority] = {
            "0-25": 0, "26-50": 0, "51-75": 0, "76-100": 0
        }
    
    for task in tasks:
        progress_bucket = "0-25" if task.progress <= 25 else "26-50" if task.progress <= 50 else "51-75" if task.progress <= 75 else "76-100"
        heatmap[task.priority][progress_bucket] += 1
    
    high_risk_count = sum([heatmap[p]["0-25"] + heatmap[p]["26-50"] for p in range(8, 11)])
    
    return {
        "heatmap": heatmap,
        "risk_summary": {
            "high_risk_tasks": high_risk_count,
            "critical_quadrant": heatmap[10]["0-25"] + heatmap[9]["0-25"],
            "recommendation": "Immediate attention required" if high_risk_count > 5 else "Monitor closely" if high_risk_count > 2 else "Risk levels acceptable"
        }
    }

def generate_velocity_recommendation(probability: float, remaining: int, days: int) -> str:
    if probability > 85:
        return "Sprint on track for successful completion"
    elif probability > 70:
        return f"Monitor closely - {remaining} points remaining with {days} days left"
    elif probability > 50:
        return f"At risk - Consider descoping {int(remaining * 0.2)} points"
    else:
        return f"High risk - Immediate intervention needed, descope {int(remaining * 0.4)} points"

def generate_cycle_time_insight(times: List[int], by_effort: Dict) -> str:
    avg = statistics.mean(times)
    if avg > 14:
        return "Cycle time exceeds 2 weeks - investigate process bottlenecks"
    elif avg > 7:
        return "Cycle time within acceptable range but could be optimized"
    else:
        return "Excellent cycle time - team operating efficiently"

def generate_workload_recommendations(workloads: List[Dict]) -> List[str]:
    recs = []
    overloaded = [w for w in workloads if w['status'] == 'overloaded']
    underutilized = [w for w in workloads if w['status'] == 'underutilized']
    
    if overloaded:
        recs.append(f"{len(overloaded)} team members overloaded - redistribute tasks")
    if underutilized:
        recs.append(f"{len(underutilized)} team members underutilized - increase allocation")
    if not recs:
        recs.append("Workload well balanced across team")
    
    return recs

def calculate_effectiveness_score(adoption_rate: float, total: int) -> str:
    if adoption_rate > 80 and total > 10:
        return "Excellent - High trust in AI suggestions"
    elif adoption_rate > 60:
        return "Good - AI providing value"
    elif adoption_rate > 40:
        return "Fair - Review suggestion quality"
    else:
        return "Poor - AI needs calibration"

def generate_ai_effectiveness_insight(rate: float, by_type: List) -> str:
    if rate > 75:
        return "AI suggestions highly trusted and adopted by team"
    elif rate > 50:
        return "Moderate AI adoption - some suggestion types may need refinement"
    else:
        return "Low AI adoption - review confidence thresholds and suggestion quality"
