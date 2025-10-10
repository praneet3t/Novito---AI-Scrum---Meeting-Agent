# Novito - Feature Specifications

Complete feature breakdown for Admin, Manager, and Team Member roles with acceptance criteria.

---

## 🔧 Admin Features (Full Control & Configuration)

Admins run the workspace. They configure Nova (agent), manage people, control workflows, and own audits/reports.

### 1. Workspace & Agent Settings
**What**: Toggle agent mode (off / suggest / auto), set confidence thresholds, allowed auto-actions.  
**Behavior**: Settings persist per workspace and gate agent behavior.  
**Done when**: Admin UI saves settings; GET /workspaces/{id} returns agent_mode + agent_config.

### 2. User & Role Management
**What**: Create/edit/delete users, assign roles (admin/manager/member), add to teams.  
**Behavior**: Changes control UI visibility and API access.  
**Done when**: Create/edit user endpoints work and frontend enforces role-based nav.

### 3. Team Management & Capacity
**What**: Create teams, assign members, set weekly capacity per user.  
**Behavior**: Capacity used by sprint planner & rebalancer.  
**Done when**: Team view shows members and capacity; planner warns on over-commit.

### 4. Meetings Processing & Review Controls
**What**: Upload/process transcripts, review AI suggestions, bulk-approve/reject.  
**Behavior**: AI suggestions saved as agent_suggestions; admin reviews before apply.  
**Done when**: /meetings/process creates suggestions and Review Queue allows bulk ops.

### 5. Review Queue / Suggestion Manager
**What**: See AI suggestions, edit payloads, apply or reject, view confidence/explanation.  
**Behavior**: Apply creates tasks and an audit row; reject marks suggestion rejected.  
**Done when**: Accept → task created; audit present and undo works.

### 6. Task & Sprint Governance
**What**: Create/close sprints, set sprint goals, move tasks between sprints/statuses.  
**Behavior**: Sprint board shows burndown; admin can force-move tasks if needed.  
**Done when**: Sprint CRUD works, burndown data updates after changes.

### 7. Backlog / Epic / Release Management
**What**: Create epics/releases, plan releases, attach tasks and milestones.  
**Behavior**: Release dashboard shows readiness and blockers.  
**Done when**: Release object lists associated tasks + readiness KPI.

### 8. QA & Test Case Oversight
**What**: View all test-cases/test-runs, link failures to remediation tasks.  
**Behavior**: Failing test can auto-create bug task suggestion (Nova).  
**Done when**: Test-run → failed → bug suggestion appears in Review Queue.

### 9. Incident & Postmortem Management
**What**: Create incidents, assign severity/owners, convert postmortem action items into tasks.  
**Behavior**: Incident links to releases and remediation tasks; auditable timeline.  
**Done when**: Incident → remediation tasks created + timeline/log shown.

### 10. Reports, Dashboards & Exports
**What**: Access executive dashboards (burndown, velocity, portfolio) and export CSV/PDF.  
**Behavior**: Cards provide drill-down to underlying task lists.  
**Done when**: Dashboard renders with drill-down and export button works.

### 11. Audit Trail & Undo
**What**: Full audit log for agent actions and admin changes; undo last reversible action.  
**Behavior**: Audit rows show before/after; undo endpoint reverts where possible.  
**Done when**: Audit view lists actions and /audits/{id}/undo reverts a create/update.

### 12. Workflow Rules & Templates (No-Code)
**What**: Create simple IF→THEN rules (e.g., IF submitted & not verified in 24h → SLA alert) and task templates.  
**Behavior**: Rules generate agent_suggestions or internal notifications.  
**Done when**: Rule created and triggers expected suggestion/notification.

### 13. Security & Workspace Utilities (Demo-level)
**What**: Reset demo data, seed/run demo, download DB snapshot.  
**Behavior**: Admin can reset or seed example flows for demos.  
**Done when**: Run Demo button populates sample data and UI steps visible.

---

## 📊 Manager Features (Team-Level Planning & Tracking)

Managers focus on planning, prioritization, sprint execution and removing blockers.

### 1. Team Dashboard
**What**: View team workload, completion rates, and blockers.  
**Behavior**: Shows per-member task counts, utilization and alert for overloaded members.  
**Done when**: Manager dashboard shows team metrics and highlights overloaded members.

### 2. Process Meetings & Review Suggestions
**What**: Trigger meeting processing and review suggestions (restricted if admin requires review-only).  
**Behavior**: Manager sees suggestions and can approve if allowed by workspace policy.  
**Done when**: Manager can process a meeting and (if permitted) approve suggestions.

### 3. Sprint Planning & Capacity
**What**: Drag tasks into sprint, set story points, accept/reject capacity warnings.  
**Behavior**: Sprint planner prevents overcommit and shows predicted velocity.  
**Done when**: Tasks can be assigned to sprint and planner warns on capacity issues.

### 4. Priority & Backlog Grooming
**What**: Set RICE/MoSCoW scores, prioritize backlog, schedule grooming sessions.  
**Behavior**: Manager can update priority, and Nova can suggest scores for review.  
**Done when**: Backlog shows priority changes and grooming session notes attach.

### 5. Assign Tasks & Monitor Progress
**What**: Assign tasks to team members, track progress, request updates.  
**Behavior**: Notifications appear in-app (logged) when assignments change.  
**Done when**: Assignment API works and Tasks view reflects changes.

### 6. Blocker Resolution
**What**: See blocker list, escalate to admin or reassign resources.  
**Behavior**: Manager can create intervention tasks or trigger agent suggestions for rebalancing.  
**Done when**: Blockers list shows reasons and manager can create remediation tasks.

### 7. QA Coordination
**What**: Coordinate test runs and triage failures with QA.  
**Behavior**: Manager sees failing tests and can assign bug fixes.  
**Done when**: QA panel lists failing runs and manager can create tasks from failures.

### 8. Reports & Team Analytics
**What**: Sprint velocity, cycle time, and team trends.  
**Behavior**: Manager can filter by sprint/date and export results.  
**Done when**: Analytics endpoints return correct aggregates and charts render.

### 9. Retros & Action Tracking
**What**: Run retros, capture action items and ensure tasks are created and tracked.  
**Behavior**: Action items from retro become tasks assigned for next sprint.  
**Done when**: Retro action item creation creates tasks visible in backlog.

### 10. Agent Suggestion Approval
**What**: View agent suggestions targeted at the team and approve/apply them (if allowed).  
**Behavior**: Suggestions show impact and required approvals.  
**Done when**: Manager can accept a suggestion and task is created/updated.

---

## ✅ Team Member Features (Day-to-Day Execution)

Team members focus on execution: see assigned work, update status, raise blockers, and collaborate.

### 1. My Tasks View
**What**: List of assigned tasks with status, due date, priority, and progress slider.  
**Behavior**: Quick filters (today, overdue, high priority).  
**Done when**: Member sees assigned tasks and can update progress.

### 2. Task Detail & Subtasks
**What**: Task modal with description, acceptance criteria, attachments, comments and subtasks.  
**Behavior**: Can add comments, upload attachments, and view parent/child links.  
**Done when**: Task modal shows full details and allows comment/attachment.

### 3. Submit for Review / QA
**What**: When done, member clicks Submit for Review and adds submission notes + links.  
**Behavior**: Sets submitted_at and verification_deadline_at and moves task to Submitted.  
**Done when**: Submit action updates DB and task shows in verification queue.

### 4. Report Blocker
**What**: Flag task as blocked and give reason + optional attachment.  
**Behavior**: Blocker appears in manager/admin briefing with details.  
**Done when**: Blocker API marks task and briefing shows it.

### 5. Focus Mode / Time Blocking
**What**: Accept suggested focus time, start/stop simple timer for task (optional).  
**Behavior**: Logs focus session for analytics.  
**Done when**: Focus sessions show in personal analytics.

### 6. Accept Agent Suggestions (Light)
**What**: Accept small suggestions from Nova (e.g., suggested due_date or small split) if workspace allows.  
**Behavior**: Suggestion appears in My Tasks or Review action; member can accept to apply.  
**Done when**: Accepting suggestion updates task and creates audit.

### 7. View QA Results & Fixes
**What**: See test results tied to task, fix issues, and re-submit.  
**Behavior**: Test-run linking visible in task detail.  
**Done when**: Task shows test-run statuses and member can act on failures.

### 8. Notifications & Inbox
**What**: In-app notifications for new assignments, approaching due dates, or blocker requests.  
**Behavior**: Click notification to navigate to task/detail.  
**Done when**: Notifications list shows and navigates correctly.

### 9. Personal Dashboard
**What**: Small view of tasks due today, overdue items, and personal completion rate.  
**Behavior**: Quick action links to Start Focus / Submit / Report Blocker.  
**Done when**: Dashboard renders and quick actions work.

---

## 🔗 Quick Mapping: UI Buttons → Backend Actions

For developers implementing features:

| UI Action | Backend Endpoint | Result |
|-----------|------------------|--------|
| Process Meeting | POST /meetings/process | Creates agent_suggestions |
| Open Review Queue | GET /agent/suggestions?applied=false | Lists pending suggestions |
| Accept Suggestion | PATCH /agent/suggestions/{id}/apply | Creates task + audit |
| Reject Suggestion | PATCH /agent/suggestions/{id}/reject | Marks rejected |
| Submit for Review | PATCH /tasks/{id}/submit | Sets submitted_at + deadline |
| Report Blocker | PATCH /tasks/{id} | Sets is_blocked=true + reason |
| Enable Agent | PATCH /workspaces/{id}/agent-mode | Updates agent_mode |
| Undo Action | POST /audits/{id}/undo | Reverts change |

---

## 🎯 Implementation Priorities

### Phase 1: Minimal Viable Agentic-Enabled Experience

**Admin**
- ✅ Review Queue + Apply/Reject + Audit/Undo
- ✅ Meeting processing with AI extraction
- ✅ User and team management

**Manager**
- ✅ Sprint planning + capacity warnings
- ✅ Blocker resolution
- ✅ Team dashboard

**Team Member**
- ✅ My Tasks view
- ✅ Submit for Review
- ✅ Report Blocker

**Agent (Nova)**
- ✅ Process meeting → suggestions saved (suggest-only mode)
- ✅ Confidence scoring
- ✅ Human-in-the-loop approval

**Dashboards**
- ✅ Briefing with blockers/SLA/overdue items
- ✅ Charts and analytics

### Phase 2: Enhanced Collaboration

- Sprint board with drag-and-drop
- Real-time notifications
- Comments and attachments
- Test case management
- Incident tracking

### Phase 3: Advanced Agent Features

- Auto-mode with safe actions
- Workflow rules engine
- Advanced analytics
- Integration APIs
- Mobile support

---

## 📋 Acceptance Criteria Summary

### Admin Role
- [ ] Can configure agent mode and thresholds
- [ ] Can create/edit/delete users and teams
- [ ] Can process meetings and review AI suggestions
- [ ] Can approve/reject suggestions with audit trail
- [ ] Can undo agent actions
- [ ] Can view all tasks and reports
- [ ] Can manage sprints and releases

### Manager Role
- [ ] Can view team dashboard with workload
- [ ] Can process meetings (if permitted)
- [ ] Can assign tasks and set priorities
- [ ] Can view and resolve blockers
- [ ] Can access team analytics
- [ ] Can run retrospectives

### Team Member Role
- [ ] Can view assigned tasks
- [ ] Can update task progress
- [ ] Can submit tasks for review
- [ ] Can report blockers
- [ ] Can view personal dashboard
- [ ] Can receive notifications

### System-Wide
- [ ] All actions create audit logs
- [ ] Agent suggestions require approval
- [ ] Confidence scores displayed
- [ ] Role-based access enforced
- [ ] Data persists correctly

---

## 🚀 Current Implementation Status

### ✅ Completed
- Role-based authentication
- Meeting transcript processing
- AI task extraction with Gemini
- Review queue with approve/reject
- Task management with progress tracking
- Team member management
- Dashboard with charts
- Reports and analytics

### 🔄 In Progress
- Audit trail and undo functionality
- Sprint planning features
- Blocker resolution workflow
- Notification system

### 📋 Planned
- Workflow rules engine
- Test case management
- Incident tracking
- Advanced agent modes
- Real-time collaboration

---

**This document serves as the single source of truth for feature requirements and acceptance criteria.**
