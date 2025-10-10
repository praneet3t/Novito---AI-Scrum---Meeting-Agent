"""Seed demo data for Novito"""
from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from .models import (
    User, Workspace, Team, TeamUser, Meeting, Task, Sprint, Epic,
    TestCase, TestRun, Incident, Retrospective, AgentSuggestion,
    TaskStatus, EffortTag, AgentMode
)

def seed_all(db: Session):
    """Seed all demo data"""
    # Clear existing data
    db.query(AgentSuggestion).delete()
    db.query(TestRun).delete()
    db.query(TestCase).delete()
    db.query(Incident).delete()
    db.query(Retrospective).delete()
    db.query(Task).delete()
    db.query(Meeting).delete()
    db.query(TeamUser).delete()
    db.query(Team).delete()
    db.query(Sprint).delete()
    db.query(Epic).delete()
    db.query(Workspace).delete()
    db.query(User).delete()
    db.commit()
    
    # Users
    admin = User(username="admin", display_name="Admin User", password="admin123", role="admin")
    po = User(username="product_owner", display_name="Product Owner", password="po123", role="po")
    dev1 = User(username="dev1", display_name="Dev One", password="dev123", role="dev")
    qa1 = User(username="qa1", display_name="QA One", password="qa123", role="qa")
    
    db.add_all([admin, po, dev1, qa1])
    db.commit()
    
    # Workspace
    workspace = Workspace(
        name="Demo Workspace",
        agent_mode=AgentMode.suggest,
        agent_config={"auto_confidence_threshold": 0.85, "allowed_auto_actions": ["set_focus_time"]}
    )
    db.add(workspace)
    db.commit()
    
    # Teams
    team_alpha = Team(workspace_id=workspace.id, name="Team Alpha")
    team_qa = Team(workspace_id=workspace.id, name="Team QA")
    db.add_all([team_alpha, team_qa])
    db.commit()
    
    # Team members
    db.add_all([
        TeamUser(team_id=team_alpha.id, user_id=admin.id),
        TeamUser(team_id=team_alpha.id, user_id=po.id),
        TeamUser(team_id=team_alpha.id, user_id=dev1.id),
        TeamUser(team_id=team_qa.id, user_id=qa1.id)
    ])
    db.commit()
    
    # Sprints
    today = datetime.utcnow()
    sprint1 = Sprint(
        workspace_id=workspace.id,
        name="Sprint 1",
        start_date=today - timedelta(days=28),
        end_date=today - timedelta(days=14),
        capacity=40,
        velocity=35
    )
    sprint2 = Sprint(
        workspace_id=workspace.id,
        name="Sprint 2",
        start_date=today - timedelta(days=14),
        end_date=today,
        capacity=40,
        velocity=38
    )
    sprint3 = Sprint(
        workspace_id=workspace.id,
        name="Sprint 3 (Current)",
        start_date=today,
        end_date=today + timedelta(days=14),
        capacity=40,
        velocity=None
    )
    db.add_all([sprint1, sprint2, sprint3])
    db.commit()
    
    # Epics
    epic1 = Epic(workspace_id=workspace.id, title="User Authentication", description="Implement secure user auth")
    epic2 = Epic(workspace_id=workspace.id, title="Dashboard Analytics", description="Build analytics dashboard")
    db.add_all([epic1, epic2])
    db.commit()
    
    # Tasks
    task1 = Task(
        workspace_id=workspace.id,
        title="Implement OAuth2 login",
        description="Add OAuth2 authentication with Google and GitHub providers",
        assignee_id=dev1.id,
        status=TaskStatus.in_progress,
        priority=9,
        effort_tag=EffortTag.large,
        story_points=8,
        progress=60,
        sprint_id=sprint3.id,
        epic_id=epic1.id,
        confidence=0.92
    )
    
    task2 = Task(
        workspace_id=workspace.id,
        title="Write test cases for login flow",
        description="Comprehensive test coverage for authentication",
        assignee_id=qa1.id,
        status=TaskStatus.todo,
        priority=7,
        effort_tag=EffortTag.medium,
        story_points=5,
        sprint_id=sprint3.id,
        epic_id=epic1.id,
        confidence=0.85
    )
    
    task3 = Task(
        workspace_id=workspace.id,
        title="Design dashboard wireframes",
        description="Create wireframes for analytics dashboard",
        assignee_id=po.id,
        status=TaskStatus.done,
        priority=8,
        effort_tag=EffortTag.small,
        story_points=3,
        progress=100,
        sprint_id=sprint2.id,
        epic_id=epic2.id
    )
    
    task4 = Task(
        workspace_id=workspace.id,
        title="Implement burndown chart",
        description="Build interactive burndown chart component",
        assignee_id=dev1.id,
        status=TaskStatus.qa,
        priority=6,
        effort_tag=EffortTag.medium,
        story_points=5,
        progress=100,
        sprint_id=sprint3.id,
        epic_id=epic2.id,
        submitted_at=today - timedelta(hours=2),
        verification_deadline_at=today + timedelta(hours=22)
    )
    
    task5 = Task(
        workspace_id=workspace.id,
        title="Fix database migration issue",
        description="Resolve schema migration conflicts",
        assignee_id=dev1.id,
        status=TaskStatus.in_progress,
        priority=10,
        effort_tag=EffortTag.small,
        story_points=2,
        progress=30,
        is_blocked=True,
        blocker_reason="Waiting for DBA approval",
        sprint_id=sprint3.id
    )
    
    task6 = Task(
        workspace_id=workspace.id,
        title="Refactor API endpoints",
        description="Large refactoring task that should be split",
        assignee_id=dev1.id,
        status=TaskStatus.todo,
        priority=5,
        effort_tag=EffortTag.large,
        story_points=13,
        sprint_id=sprint3.id
    )
    
    db.add_all([task1, task2, task3, task4, task5, task6])
    db.commit()
    
    # Meetings
    meeting1 = Meeting(
        workspace_id=workspace.id,
        title="Daily Standup",
        meeting_date=today - timedelta(days=1),
        transcript_text="""
        Dev1: I will continue working on OAuth2 login. I'm 60% done. Should be ready by Friday.
        QA1: I'll start writing test cases for the login flow once Dev1 finishes.
        PO: Great progress. Dev1, is anything blocking you?
        Dev1: No blockers right now.
        """,
        created_by=admin.id
    )
    
    meeting2 = Meeting(
        workspace_id=workspace.id,
        title="Sprint Planning",
        meeting_date=today - timedelta(days=7),
        transcript_text="""
        PO: This sprint we'll focus on authentication and dashboard.
        Dev1: I will implement OAuth2 login. It's a large task, estimated 8 points.
        QA1: I will write test cases for login. This depends on Dev1 finishing the implementation.
        Dev1: I also need to fix the database migration issue, but I'm blocked by DBA approval.
        PO: Let me follow up with the DBA team.
        """,
        created_by=po.id
    )
    
    meeting3 = Meeting(
        workspace_id=workspace.id,
        title="Sprint Retrospective",
        meeting_date=today - timedelta(days=14),
        transcript_text="""
        Team: Last sprint went well. We completed 38 points.
        Dev1: We should improve our code review process.
        QA1: Agreed. Also need better test automation.
        PO: Action item: Dev1 will research code review tools by next sprint.
        """,
        created_by=admin.id
    )
    
    db.add_all([meeting1, meeting2, meeting3])
    db.commit()
    
    # Test Cases
    test1 = TestCase(
        workspace_id=workspace.id,
        task_id=task4.id,
        title="Test burndown chart rendering",
        steps="1. Navigate to dashboard\n2. Check burndown chart loads\n3. Verify data points",
        expected_result="Chart displays correctly with all data points"
    )
    
    test2 = TestCase(
        workspace_id=workspace.id,
        task_id=task1.id,
        title="Test OAuth2 Google login",
        steps="1. Click Google login\n2. Authorize\n3. Verify redirect",
        expected_result="User logged in successfully"
    )
    
    db.add_all([test1, test2])
    db.commit()
    
    # Test Runs
    run1 = TestRun(
        test_case_id=test1.id,
        status="passed",
        notes="All checks passed",
        run_by=qa1.id
    )
    
    run2 = TestRun(
        test_case_id=test2.id,
        status="failed",
        notes="Redirect URL incorrect",
        run_by=qa1.id
    )
    
    db.add_all([run1, run2])
    db.commit()
    
    # Incidents
    incident1 = Incident(
        workspace_id=workspace.id,
        title="Production login failure",
        description="Users unable to login via OAuth2",
        severity="high",
        status="open",
        remediation_task_id=task1.id
    )
    
    db.add(incident1)
    db.commit()
    
    # Retrospective
    retro1 = Retrospective(
        workspace_id=workspace.id,
        sprint_id=sprint2.id,
        went_well="Good velocity, completed all planned work",
        needs_improvement="Code review turnaround time, test coverage",
        action_items="Research code review tools, increase test automation"
    )
    
    db.add(retro1)
    db.commit()
    
    # Agent Suggestions
    suggestion1 = AgentSuggestion(
        workspace_id=workspace.id,
        suggestion_type="split_task",
        payload={
            "parent_task_id": task6.id,
            "subtasks": [
                {"title": "Refactor API endpoints - Part 1", "description": "Refactor user endpoints", "effort_tag": "medium"},
                {"title": "Refactor API endpoints - Part 2", "description": "Refactor task endpoints", "effort_tag": "medium"}
            ]
        },
        confidence=0.78,
        applied=False
    )
    
    suggestion2 = AgentSuggestion(
        workspace_id=workspace.id,
        suggestion_type="set_focus_time",
        payload={"task_id": task2.id, "focus_time": 4},
        confidence=0.88,
        applied=False
    )
    
    db.add_all([suggestion1, suggestion2])
    db.commit()
    
    print("✓ Demo data seeded successfully!")
    print(f"  Users: admin/admin123, product_owner/po123, dev1/dev123, qa1/qa123")
    print(f"  Workspace: {workspace.name} (ID: {workspace.id})")
    print(f"  Tasks: {db.query(Task).count()}")
    print(f"  Meetings: {db.query(Meeting).count()}")
    print(f"  Suggestions: {db.query(AgentSuggestion).count()}")
