from sqlalchemy import Column, Integer, String, Text, DateTime, Boolean, Float, ForeignKey, JSON, Enum as SQLEnum
from sqlalchemy.orm import relationship
from datetime import datetime
import enum
from .database import Base

class TaskStatus(str, enum.Enum):
    todo = "todo"
    in_progress = "in_progress"
    qa = "qa"
    done = "done"
    released = "released"

class EffortTag(str, enum.Enum):
    small = "small"
    medium = "medium"
    large = "large"

class AgentMode(str, enum.Enum):
    off = "off"
    suggest = "suggest"
    auto = "auto"

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    display_name = Column(String)
    password = Column(String)
    role = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)

class Workspace(Base):
    __tablename__ = "workspaces"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    agent_mode = Column(SQLEnum(AgentMode), default=AgentMode.suggest)
    agent_config = Column(JSON, default=lambda: {"auto_confidence_threshold": 0.85, "allowed_auto_actions": ["set_focus_time"]})
    created_at = Column(DateTime, default=datetime.utcnow)

class Team(Base):
    __tablename__ = "teams"
    id = Column(Integer, primary_key=True, index=True)
    workspace_id = Column(Integer, ForeignKey("workspaces.id"))
    name = Column(String)

class TeamUser(Base):
    __tablename__ = "team_users"
    id = Column(Integer, primary_key=True, index=True)
    team_id = Column(Integer, ForeignKey("teams.id"))
    user_id = Column(Integer, ForeignKey("users.id"))

class Meeting(Base):
    __tablename__ = "meetings"
    id = Column(Integer, primary_key=True, index=True)
    workspace_id = Column(Integer, ForeignKey("workspaces.id"))
    title = Column(String)
    meeting_date = Column(DateTime)
    transcript_text = Column(Text)
    created_by = Column(Integer, ForeignKey("users.id"))
    created_at = Column(DateTime, default=datetime.utcnow)

class Task(Base):
    __tablename__ = "tasks"
    id = Column(Integer, primary_key=True, index=True)
    workspace_id = Column(Integer, ForeignKey("workspaces.id"))
    title = Column(String)
    description = Column(Text)
    assignee_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    status = Column(SQLEnum(TaskStatus), default=TaskStatus.todo)
    due_date = Column(DateTime, nullable=True)
    priority = Column(Integer, nullable=True)
    effort_tag = Column(SQLEnum(EffortTag), nullable=True)
    story_points = Column(Integer, nullable=True)
    progress = Column(Integer, default=0)
    suggested_focus_time = Column(Integer, nullable=True)
    is_potential_risk = Column(Boolean, default=False)
    risk_reason = Column(String, nullable=True)
    needs_priority_review = Column(Boolean, default=False)
    submitted_at = Column(DateTime, nullable=True)
    verification_deadline_at = Column(DateTime, nullable=True)
    is_blocked = Column(Boolean, default=False)
    blocker_reason = Column(String, nullable=True)
    parent_task_id = Column(Integer, ForeignKey("tasks.id"), nullable=True)
    confidence = Column(Float, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    sprint_id = Column(Integer, ForeignKey("sprints.id"), nullable=True)
    epic_id = Column(Integer, ForeignKey("epics.id"), nullable=True)

class Dependency(Base):
    __tablename__ = "dependencies"
    id = Column(Integer, primary_key=True, index=True)
    workspace_id = Column(Integer, ForeignKey("workspaces.id"))
    task_id = Column(Integer, ForeignKey("tasks.id"))
    depends_on_task_id = Column(Integer, ForeignKey("tasks.id"))

class Audit(Base):
    __tablename__ = "audits"
    id = Column(Integer, primary_key=True, index=True)
    workspace_id = Column(Integer, ForeignKey("workspaces.id"))
    actor_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    action_type = Column(String)
    target_type = Column(String)
    target_id = Column(Integer)
    before = Column(JSON, nullable=True)
    after = Column(JSON, nullable=True)
    suggestion_id = Column(Integer, ForeignKey("agent_suggestions.id"), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class AgentSuggestion(Base):
    __tablename__ = "agent_suggestions"
    id = Column(Integer, primary_key=True, index=True)
    workspace_id = Column(Integer, ForeignKey("workspaces.id"))
    suggestion_type = Column(String)
    payload = Column(JSON)
    confidence = Column(Float)
    applied = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)

class Sprint(Base):
    __tablename__ = "sprints"
    id = Column(Integer, primary_key=True, index=True)
    workspace_id = Column(Integer, ForeignKey("workspaces.id"))
    name = Column(String)
    start_date = Column(DateTime)
    end_date = Column(DateTime)
    capacity = Column(Integer, nullable=True)
    velocity = Column(Integer, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class Epic(Base):
    __tablename__ = "epics"
    id = Column(Integer, primary_key=True, index=True)
    workspace_id = Column(Integer, ForeignKey("workspaces.id"))
    title = Column(String)
    description = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class TestCase(Base):
    __tablename__ = "test_cases"
    id = Column(Integer, primary_key=True, index=True)
    workspace_id = Column(Integer, ForeignKey("workspaces.id"))
    task_id = Column(Integer, ForeignKey("tasks.id"), nullable=True)
    title = Column(String)
    steps = Column(Text)
    expected_result = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)

class TestRun(Base):
    __tablename__ = "test_runs"
    id = Column(Integer, primary_key=True, index=True)
    test_case_id = Column(Integer, ForeignKey("test_cases.id"))
    status = Column(String)
    notes = Column(Text, nullable=True)
    run_by = Column(Integer, ForeignKey("users.id"))
    run_at = Column(DateTime, default=datetime.utcnow)

class Incident(Base):
    __tablename__ = "incidents"
    id = Column(Integer, primary_key=True, index=True)
    workspace_id = Column(Integer, ForeignKey("workspaces.id"))
    title = Column(String)
    description = Column(Text)
    severity = Column(String)
    status = Column(String)
    remediation_task_id = Column(Integer, ForeignKey("tasks.id"), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class Retrospective(Base):
    __tablename__ = "retrospectives"
    id = Column(Integer, primary_key=True, index=True)
    workspace_id = Column(Integer, ForeignKey("workspaces.id"))
    sprint_id = Column(Integer, ForeignKey("sprints.id"))
    went_well = Column(Text)
    needs_improvement = Column(Text)
    action_items = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)
