from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
from .models import TaskStatus, EffortTag, AgentMode

class UserLogin(BaseModel):
    username: str
    password: str

class UserResponse(BaseModel):
    id: int
    username: str
    display_name: str
    role: str

    class Config:
        from_attributes = True

class ProcessMeetingRequest(BaseModel):
    workspace_id: int
    title: str
    meeting_date: datetime
    transcript: str

class TaskCandidate(BaseModel):
    assignee: Optional[str]
    description: str
    due_date: Optional[str]
    priority: Optional[int]
    effort_tag: Optional[str]
    confidence: float
    is_blocked: bool
    blocker_reason: Optional[str]

class TaskResponse(BaseModel):
    id: int
    workspace_id: int
    title: str
    description: Optional[str]
    assignee_id: Optional[int]
    status: TaskStatus
    due_date: Optional[datetime]
    priority: Optional[int]
    effort_tag: Optional[EffortTag]
    progress: int
    is_blocked: bool
    blocker_reason: Optional[str]
    confidence: Optional[float]
    needs_priority_review: bool
    suggested_focus_time: Optional[int]

    class Config:
        from_attributes = True

class TaskUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    assignee_id: Optional[int] = None
    status: Optional[TaskStatus] = None
    progress: Optional[int] = None
    is_blocked: Optional[bool] = None
    blocker_reason: Optional[str] = None
    priority: Optional[int] = None

class CaptureRequest(BaseModel):
    workspace_id: int
    text: str

class AgentSuggestionResponse(BaseModel):
    id: int
    workspace_id: int
    suggestion_type: str
    payload: dict
    confidence: float
    applied: bool
    created_at: datetime

    class Config:
        from_attributes = True

class BriefingResponse(BaseModel):
    blockers: List[TaskResponse]
    overdue: List[TaskResponse]
    risky_chains: List[dict]
    sla_breaches: List[dict]
