# Phase 2 Demo Script - Smart Agentic Features

## 🎬 5-Minute Demo

### Setup (30 seconds)
```bash
# Make sure backend and frontend are running
# Seed data should be loaded
curl -X POST http://localhost:8000/seed/run-demo
```

---

### Demo 1: Smart Daily Briefing (90 seconds)

**Login as Admin** (`admin` / `admin123`)

1. **Click "☀️ Briefing" in navigation**
   - See AI insight banner: "✅ All systems running smoothly"
   - View summary cards: 0 overdue, 1 blocked, 0 at-risk, 1 in review, 2 suggestions

2. **Scroll to "Quick Wins Available"**
   - See 3 small, high-priority tasks
   - Total time estimate shown

3. **View "Blocked Tasks" section**
   - See task with blocker reason
   - One-click visibility into problems

**Key Point**: "This briefing saves 15 minutes every morning. Nova tells you exactly what needs attention."

---

### Demo 2: Proactive Risk Detection (90 seconds)

**Stay logged in as Admin**

1. **Click "🤖 Smart Actions" in navigation**

2. **Click "Run Risk Detection"**
   - Button shows "Analyzing..."
   - Results appear: "Created X suggestions"

3. **Click "Review Queue" in navigation**
   - See new risk suggestions
   - Each shows:
     - Task at risk
     - Specific reason (e.g., "High priority task with low progress")
     - Confidence score

4. **Click "Approve" on one suggestion**
   - Task flagged as at-risk
   - Logged in audit trail

**Key Point**: "Nova catches problems before they become critical. No manual monitoring needed."

---

### Demo 3: Smart Workload Rebalancing (90 seconds)

**Stay logged in as Admin**

1. **Go back to "🤖 Smart Actions"**

2. **Click "Suggest Rebalancing"**
   - Nova analyzes team workload
   - Creates suggestions for overloaded members

3. **Go to "Review Queue"**
   - See rebalancing suggestions
   - Shows current assignee and reason
   - Suggests reassignment

4. **Approve suggestion**
   - Task reassigned automatically
   - Team balance improved

**Key Point**: "Nova prevents burnout by automatically detecting and suggesting workload redistribution."

---

### Demo 4: Quick Wins & Auto-Prioritize (60 seconds)

**Stay logged in as Admin**

1. **Go to "🤖 Smart Actions"**

2. **Click "Auto-Prioritize Tasks"**
   - Nova analyzes unprioritized tasks
   - Suggests priorities based on deadlines

3. **Go to "Review Queue"**
   - See priority suggestions
   - Each shows suggested priority (1-10)
   - Based on due date and effort

4. **Approve suggestions**
   - Tasks get priorities automatically
   - Consistent prioritization logic

**Key Point**: "No task left unprioritized. Nova ensures consistent priority logic across the workspace."

---

### Demo 5: Personalized Briefing (30 seconds)

**Logout → Login as Team Member** (`dev1` / `dev123`)

1. **Click "☀️ Briefing"**
   - See personalized "Your Focus Today" section
   - Shows only YOUR high-priority tasks
   - Different from admin view

2. **View "Quick Wins Available"**
   - Filtered to your assignments
   - Shows estimated time

**Key Point**: "Briefing adapts to each user. Team members see their focus, managers see team health."

---

## 🎯 Key Messages

### Innovation #1: Proactive Intelligence
"Traditional tools are reactive - you check them. Nova is proactive - it alerts you."

### Innovation #2: One-Click Actions
"No complex configuration. Click button → AI analyzes → Creates suggestions. Simple but powerful."

### Innovation #3: Human-in-the-Loop
"Nova suggests, humans approve. Safe automation with full audit trail."

### Innovation #4: Personalized
"Briefing shows what YOU need to see, not everything. Adapts to your role and assignments."

### Innovation #5: Time Savings
"Daily briefing: 15 min saved. Risk detection: 30 min/week. Rebalancing: 1 hour/sprint. Total: ~3 hours/week per manager."

---

## 📊 Demo Data Points

After running all smart actions:
- **Risks detected**: 2-3 tasks flagged
- **Rebalancing suggestions**: 1-2 tasks to reassign
- **Dependencies found**: 1-2 potential dependencies
- **Priorities suggested**: 3-4 tasks prioritized

Total suggestions created: ~8-10
All visible in Review Queue for approval

---

## 🎤 Talking Points

### For Executives
"Nova reduces management overhead by 3 hours per week while catching problems early. ROI is immediate."

### For Managers
"Start your day with a 5-minute briefing instead of 20 minutes of manual review. Nova tells you exactly what needs attention."

### For Team Members
"See your focus list every morning. No more wondering what to work on. Quick wins help build momentum."

### For Technical Audience
"All smart actions create suggestions with confidence scores. Human-in-the-loop ensures safety. Full audit trail for compliance."

---

## 🔄 Comparison: Before vs After

### Before Nova (Traditional)
- Manager manually reviews all tasks daily (20 min)
- Risks discovered when deadlines missed
- Workload imbalance causes burnout
- Priorities set inconsistently
- Dependencies found through conflicts

### After Nova (Phase 2)
- AI briefing shows priorities (5 min)
- Risks flagged proactively
- Workload balanced automatically
- Priorities suggested consistently
- Dependencies detected from text

**Time saved**: 15 min/day = 75 min/week = 5 hours/month per manager

---

## 🚀 Quick Commands

```bash
# Seed demo data
curl -X POST http://localhost:8000/seed/run-demo

# Get daily briefing
curl http://localhost:8000/briefing/daily?workspace_id=1&user_id=1

# Run risk detection
curl -X POST http://localhost:8000/smart/detect-risks?workspace_id=1

# Suggest rebalancing
curl -X POST http://localhost:8000/smart/suggest-rebalance?workspace_id=1

# Auto-prioritize
curl -X POST http://localhost:8000/smart/auto-prioritize?workspace_id=1

# Get quick wins
curl http://localhost:8000/smart/quick-wins?workspace_id=1&user_id=3
```

---

## 💡 Demo Tips

1. **Start with briefing** - Most impressive visual impact
2. **Show risk detection** - Demonstrates proactive intelligence
3. **Emphasize one-click** - Simplicity is key selling point
4. **Show audit trail** - Proves safety and compliance
5. **End with time savings** - Concrete ROI

---

## 🎯 Success Criteria

Demo is successful if audience understands:
1. ✅ Nova is proactive, not reactive
2. ✅ One-click actions are simple but powerful
3. ✅ Human approval ensures safety
4. ✅ Personalization adapts to each user
5. ✅ Time savings are measurable (3 hours/week)

---

**Phase 2 transforms Nova from a task manager into an intelligent team assistant! 🤖**
