# Novito User Guide - Phase 1 MVP

## Quick Navigation

### Admin Role
- **Dashboard** (`/`) - Overview metrics
- **Meetings** (`/meetings`) - Upload transcripts
- **Review Queue** (`/review`) - Approve AI suggestions ⭐
- **All Tasks** (`/tasks`) - View all workspace tasks
- **Team** (`/team`) - Manage team members
- **Reports** (`/reports`) - Analytics
- **Audit Trail** (`/audit`) - View all actions + undo ⭐
- **Settings** (`/settings`) - Configure agent ⭐

### Manager Role
- **Dashboard** (`/`) - Team metrics
- **Meetings** (`/meetings`) - Process meetings
- **Review Queue** (`/review`) - Review suggestions ⭐
- **Team Tasks** (`/tasks`) - View team tasks
- **Blockers** (`/blockers`) - Resolve blocked tasks ⭐
- **Reports** (`/reports`) - Team analytics

### Team Member Role
- **Dashboard** (`/`) - Personal stats
- **My Tasks** (`/tasks`) - View assigned tasks ⭐
- **My Stats** (`/reports`) - Personal metrics

⭐ = Key Phase 1 features

## Feature Walkthroughs

### 1. Review AI-Extracted Tasks (Admin/Manager)

**Purpose:** Review and approve tasks that Nova extracted from meetings

**Steps:**
1. Navigate to **Review Queue** (`/review`)
2. See list of pending suggestions with:
   - Suggestion type (create_task, split_task, set_focus_time)
   - AI confidence score (0-100%)
   - Task details (title, assignee, priority, effort)
3. For each suggestion:
   - **Approve** ✓ - Creates task and logs audit
   - **Edit** ✏️ - Modify details before approving (coming soon)
   - **Reject** ✗ - Dismisses suggestion and logs audit

**What Happens:**
- Approve → Task created in database + audit log entry
- Reject → Suggestion marked as processed + audit log entry
- Empty queue → Shows "No tasks pending review" message

**API Calls:**
- `GET /agent/suggestions?workspace_id=1&applied=false` - Load suggestions
- `PATCH /agent/suggestions/{id}/apply` - Approve
- `PATCH /agent/suggestions/{id}/reject` - Reject

---

### 2. Submit Task for Review (Team Member)

**Purpose:** Mark completed work ready for QA/verification

**Steps:**
1. Navigate to **My Tasks** (`/tasks`)
2. Click on a task you're working on
3. Update progress slider to 100%
4. Click **"✓ Submit for Review"** button
5. Task status changes to "QA"

**What Happens:**
- Task gets `submitted_at` timestamp
- Task gets `verification_deadline_at` (24 hours from now)
- Task status changes to "qa"
- Task appears in verification queue for managers

**API Call:**
- `PATCH /tasks/{id}/submit`

**When to Use:**
- You've completed the work
- Ready for someone to verify/test
- Want to signal work is done

---

### 3. Report a Blocker (Team Member)

**Purpose:** Flag tasks that are stuck and need help

**Steps:**
1. Navigate to **My Tasks** (`/tasks`)
2. Click on a blocked task
3. Click **"🚫 Report Blocker"** button
4. Enter blocker reason (e.g., "Waiting for API keys")
5. Task is flagged as blocked

**What Happens:**
- Task marked with `is_blocked=true`
- Blocker reason saved
- Task appears in manager's Blockers page
- Manager can see reason and take action

**API Call:**
- `PATCH /tasks/{id}` with `{is_blocked: true, blocker_reason: "..."}`

**When to Use:**
- Waiting for external dependency
- Need help from another team
- Technical issue blocking progress
- Need manager intervention

---

### 4. Resolve Blockers (Manager)

**Purpose:** Unblock team members and keep work flowing

**Steps:**
1. Navigate to **Blockers** (`/blockers`)
2. See all blocked tasks with:
   - Task title and description
   - Blocker reason (why it's stuck)
   - Assignee and priority
3. Take action to resolve (coordinate, escalate, reassign)
4. Click **"✓ Mark Resolved"** button
5. Task is unblocked

**What Happens:**
- Task marked with `is_blocked=false`
- Blocker reason cleared
- Task removed from blockers list
- Team member can continue work

**API Call:**
- `PATCH /tasks/{id}` with `{is_blocked: false, blocker_reason: null}`

**Best Practices:**
- Check blockers daily
- Prioritize high-priority blocked tasks
- Communicate resolution to team member
- Create follow-up tasks if needed

---

### 5. Configure Agent (Admin)

**Purpose:** Control how Nova behaves and what it can do automatically

**Steps:**
1. Navigate to **Settings** (`/settings`)
2. Select **Agent Mode**:
   - **Off** - No suggestions generated
   - **Suggest** - Generate suggestions, require approval (recommended)
   - **Auto** - Auto-apply high-confidence suggestions
3. If Auto mode:
   - Set **Confidence Threshold** (50-100%)
   - Select **Allowed Auto-Actions** (checkboxes)
4. Click **"Save Settings"**

**Agent Modes Explained:**

**Off Mode:**
- Nova doesn't generate any suggestions
- Fully manual workflow
- Use when: Testing, onboarding, or don't want AI assistance

**Suggest Mode (Recommended):**
- Nova generates suggestions
- All suggestions require human approval
- Shows confidence scores to help decisions
- Use when: Want AI help but keep control

**Auto Mode:**
- Nova auto-applies suggestions above threshold
- Only applies allowed actions
- Still logs everything in audit trail
- Use when: Trust is established, want automation

**API Call:**
- `PATCH /workspaces/{id}/agent-mode`

---

### 6. View Audit Trail & Undo (Admin)

**Purpose:** Track all changes and undo mistakes

**Steps:**
1. Navigate to **Audit Trail** (`/audit`)
2. See table of all actions:
   - Timestamp
   - Action type (agent_create_task, agent_set_focus_time, etc.)
   - Target (task #, suggestion #)
   - Actor (User ID or "Nova (Auto)")
3. For reversible actions, click **"↶ Undo"**
4. Confirm undo
5. Action is reverted

**What's Logged:**
- All agent suggestions (applied and rejected)
- Task creations from suggestions
- Agent auto-actions (when in auto mode)
- Manual admin changes (future)

**What Can Be Undone:**
- set_focus_time - Reverts to previous value
- create_task - Deletes the created task (future)
- split_task - Removes subtasks (future)

**API Calls:**
- `GET /audits/?workspace_id=1&limit=50` - Load audit trail
- `POST /audits/{id}/undo` - Undo action

**Best Practices:**
- Review audit trail regularly
- Check what Nova is doing in auto mode
- Undo mistakes immediately
- Use audit for compliance/reporting

---

## Common Workflows

### Daily Standup → Tasks
1. Admin uploads meeting transcript (`/meetings`)
2. AI extracts action items → suggestions created
3. Admin reviews in Review Queue (`/review`)
4. Approves relevant tasks
5. Tasks appear in team members' My Tasks
6. Team members update progress throughout day

### Task Completion → Verification
1. Member works on task, updates progress
2. Member submits for review when done
3. Task appears in QA queue
4. QA/Manager verifies work
5. Marks task as done or sends back with notes

### Blocker → Resolution
1. Member encounters blocker
2. Reports blocker with reason
3. Manager sees in Blockers page
4. Manager coordinates resolution
5. Marks blocker resolved
6. Member continues work

### Agent Tuning
1. Admin enables Suggest mode
2. Reviews suggestions for a week
3. Checks confidence scores and accuracy
4. If confident, enables Auto mode
5. Sets threshold to 85%+
6. Monitors audit trail
7. Adjusts threshold based on results

---

## Tips & Best Practices

### For Admins
- Start with Suggest mode, not Auto
- Review audit trail daily
- Set confidence threshold high (85%+) for auto mode
- Only enable safe actions for auto (set_focus_time is safest)
- Use undo if Nova makes mistakes

### For Managers
- Check Blockers page daily
- Prioritize high-priority blockers
- Review team workload in Dashboard
- Process meetings regularly
- Monitor verification queue (submitted tasks)

### For Team Members
- Update task progress regularly
- Submit for review when truly done
- Report blockers early, don't wait
- Add clear blocker reasons
- Check My Tasks daily

### General
- Use confidence scores to guide approval decisions
- Higher confidence (>85%) = more likely accurate
- Lower confidence (<70%) = review carefully
- Reject bad suggestions to improve Nova over time
- Check audit trail to understand what Nova is doing

---

## Keyboard Shortcuts (Future)

Coming in Phase 2:
- `a` - Approve suggestion
- `r` - Reject suggestion
- `e` - Edit suggestion
- `s` - Submit task for review
- `b` - Report blocker
- `/` - Search tasks

---

## Troubleshooting

### "No suggestions in Review Queue"
- Check if agent mode is "off" in Settings
- Run suggestion engine: `POST /agent/run-suggestions?workspace_id=1`
- Process a meeting to generate new suggestions

### "Can't submit task for review"
- Make sure you're logged in as team member (not admin)
- Task must not already be in "done" status
- Check task is assigned to you

### "Undo button doesn't work"
- Only some actions are reversible
- Check action has "before" state in audit log
- Some actions can't be undone (by design)

### "Agent not auto-applying"
- Check agent mode is "auto" in Settings
- Check confidence threshold (might be too high)
- Check action is in allowed_auto_actions list
- Check suggestion confidence meets threshold

---

## API Reference (Quick)

All endpoints use `http://localhost:8000` as base URL.

**Agent:**
- `GET /agent/suggestions?workspace_id={id}&applied={bool}`
- `PATCH /agent/suggestions/{id}/apply?actor_id={id}`
- `PATCH /agent/suggestions/{id}/reject?actor_id={id}`

**Tasks:**
- `GET /tasks/?workspace_id={id}&status={status}`
- `GET /tasks/my?user_id={id}`
- `GET /tasks/blockers?workspace_id={id}`
- `PATCH /tasks/{id}/submit`
- `PATCH /tasks/{id}` (update any field)

**Workspace:**
- `GET /workspaces/{id}`
- `PATCH /workspaces/{id}/agent-mode`

**Audit:**
- `GET /audits/?workspace_id={id}&limit={n}`
- `POST /audits/{id}/undo`

Full API docs: http://localhost:8000/docs

---

**Need help? Check IMPLEMENTATION_STATUS.md for technical details or FEATURES.md for complete specifications.**
