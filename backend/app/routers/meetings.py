"""Meetings router for processing transcripts"""
from fastapi import APIRouter, Depends, BackgroundTasks
from sqlalchemy.orm import Session
from typing import List
from ..database import get_db
from ..models import Meeting
from ..schemas import ProcessMeetingRequest, TaskCandidate
from ..ai.gemini_client import generate_tasks_from_transcript, detect_dependencies
from ..services.agent_service import create_suggestion

router = APIRouter(prefix="/meetings", tags=["meetings"])

@router.post("/process")
def process_meeting(
    request: ProcessMeetingRequest,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db)
):
    """Process meeting transcript and extract tasks"""
    # Store meeting
    meeting = Meeting(
        workspace_id=request.workspace_id,
        title=request.title,
        meeting_date=request.meeting_date,
        transcript_text=request.transcript,
        created_by=1  # Demo user
    )
    db.add(meeting)
    db.commit()
    db.refresh(meeting)
    
    # Extract tasks using Gemini
    candidates = generate_tasks_from_transcript(request.transcript)
    
    # Store as agent suggestions
    for candidate in candidates:
        create_suggestion(
            db,
            request.workspace_id,
            "create_task",
            {
                "title": candidate["description"][:100],
                "description": candidate["description"],
                "assignee": candidate.get("assignee"),
                "priority": candidate.get("priority"),
                "effort_tag": candidate.get("effort_tag"),
                "is_blocked": candidate.get("is_blocked"),
                "blocker_reason": candidate.get("blocker_reason")
            },
            candidate["confidence"]
        )
    
    return {
        "meeting_id": meeting.id,
        "candidates": candidates,
        "count": len(candidates)
    }

@router.get("/")
def list_meetings(workspace_id: int, db: Session = Depends(get_db)):
    """List all meetings for a workspace"""
    meetings = db.query(Meeting).filter(
        Meeting.workspace_id == workspace_id
    ).order_by(Meeting.meeting_date.desc()).all()
    return meetings
