"""Centralized Gemini prompt templates - versioned and easy to tweak"""

TASK_EXTRACTION_PROMPT = """You are an assistant that extracts action items from meeting transcripts.
Input: a meeting transcript and the workspace timezone.
Output: Return ONLY a JSON array of task objects. Each task object must have:

* assignee: string or null
* description: string
* due_date: "YYYY-MM-DD" or null
* priority: integer 1-10 or null
* effort_tag: "small" | "medium" | "large" | null
* confidence: float between 0.0 and 1.0
* is_blocked: boolean
* blocker_reason: string or null

Example:
[
{"assignee":"Priya","description":"Implement OAuth2 login","due_date":"2025-10-10","priority":9,"effort_tag":"large","confidence":0.92,"is_blocked":false,"blocker_reason":null}
]

Transcript: \"\"\"
{transcript}
\"\"\"

Return ONLY the JSON array, no other text.
"""

DEPENDENCY_DETECTION_PROMPT = """Detect task dependency relationships from the transcript. Return ONLY JSON:
{{"dependencies":[{{"from":"Finish API endpoints","depends_on":"DB migration complete"}}, ...]}}

Transcript: \"\"\"
{transcript}
\"\"\"

Return ONLY the JSON object, no other text.
"""

RICE_SCORING_PROMPT = """Given description and context, estimate RICE fields. Return ONLY JSON:
{{"reach":<int>, "impact":<1-10>, "confidence":<0.0-1.0>, "effort":<hours-int>}}

Task: {description}

Return ONLY the JSON object, no other text.
"""

ASSISTANT_CHAT_PROMPT = """You are Nova, the project assistant. Respond concisely. If user asks a change (e.g., create task), return a JSON action suggestion:
{{"action":"create_task","payload":{{"title":"...","assignee":"...","due_date":"YYYY-MM-DD or null","effort_tag":"small|medium|large","priority":1-10}},"confidence":0.95,"explanation":"one-liner"}}
If you cannot parse, return {{"action":"none","explanation":"reason"}}

User message: {message}

Context: {context}

Return ONLY JSON, no other text.
"""

MEETING_SUMMARY_PROMPT = """Summarize this meeting transcript in 2-3 sentences.

Transcript: \"\"\"
{transcript}
\"\"\"

Return ONLY the summary text.
"""
