# Novito - JSON Schemas & Prompt Templates

This document contains all JSON schemas used to validate Gemini API responses and the prompt templates used to generate them.

## Task Candidate Schema

Used to validate task extraction from meeting transcripts.

```json
{
  "type": "array",
  "items": {
    "type": "object",
    "properties": {
      "assignee": {
        "type": ["string", "null"],
        "description": "Username of assignee or null"
      },
      "description": {
        "type": "string",
        "description": "Task description"
      },
      "due_date": {
        "type": ["string", "null"],
        "description": "Due date in YYYY-MM-DD format or null"
      },
      "priority": {
        "type": ["integer", "null"],
        "description": "Priority from 1-10 or null",
        "minimum": 1,
        "maximum": 10
      },
      "effort_tag": {
        "type": ["string", "null"],
        "enum": ["small", "medium", "large", null],
        "description": "Effort estimate"
      },
      "confidence": {
        "type": "number",
        "minimum": 0.0,
        "maximum": 1.0,
        "description": "AI confidence score"
      },
      "is_blocked": {
        "type": "boolean",
        "description": "Whether task is blocked"
      },
      "blocker_reason": {
        "type": ["string", "null"],
        "description": "Reason for blocker if is_blocked is true"
      }
    },
    "required": ["description", "confidence", "is_blocked"]
  }
}
```

### Example Response

```json
[
  {
    "assignee": "dev1",
    "description": "Implement OAuth2 login with Google provider",
    "due_date": "2025-02-15",
    "priority": 9,
    "effort_tag": "large",
    "confidence": 0.92,
    "is_blocked": false,
    "blocker_reason": null
  },
  {
    "assignee": "qa1",
    "description": "Write test cases for authentication flow",
    "due_date": "2025-02-20",
    "priority": 7,
    "effort_tag": "medium",
    "confidence": 0.85,
    "is_blocked": false,
    "blocker_reason": null
  }
]
```

## Dependency Schema

Used to validate dependency detection.

```json
{
  "type": "object",
  "properties": {
    "dependencies": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "from": {
            "type": "string",
            "description": "Task that depends on another"
          },
          "depends_on": {
            "type": "string",
            "description": "Task that must be completed first"
          }
        },
        "required": ["from", "depends_on"]
      }
    }
  },
  "required": ["dependencies"]
}
```

### Example Response

```json
{
  "dependencies": [
    {
      "from": "Write test cases for authentication flow",
      "depends_on": "Implement OAuth2 login with Google provider"
    },
    {
      "from": "Deploy to production",
      "depends_on": "Complete QA testing"
    }
  ]
}
```

## RICE Scoring Schema

Used to validate RICE (Reach, Impact, Confidence, Effort) scoring.

```json
{
  "type": "object",
  "properties": {
    "reach": {
      "type": "integer",
      "description": "Number of users/customers affected"
    },
    "impact": {
      "type": "integer",
      "minimum": 1,
      "maximum": 10,
      "description": "Impact score from 1-10"
    },
    "confidence": {
      "type": "number",
      "minimum": 0.0,
      "maximum": 1.0,
      "description": "Confidence in estimates"
    },
    "effort": {
      "type": "integer",
      "description": "Estimated effort in hours"
    }
  },
  "required": ["reach", "impact", "confidence", "effort"]
}
```

### Example Response

```json
{
  "reach": 5000,
  "impact": 8,
  "confidence": 0.75,
  "effort": 40
}
```

## Assistant Action Schema

Used to validate Nova assistant chat responses.

```json
{
  "type": "object",
  "properties": {
    "action": {
      "type": "string",
      "description": "Action type: create_task, split_task, reschedule, reassign, none, etc."
    },
    "payload": {
      "type": "object",
      "description": "Action-specific data"
    },
    "confidence": {
      "type": "number",
      "description": "Confidence in suggested action"
    },
    "explanation": {
      "type": "string",
      "description": "Human-readable explanation"
    }
  },
  "required": ["action", "explanation"]
}
```

### Example Response (Create Task)

```json
{
  "action": "create_task",
  "payload": {
    "title": "Fix login bug",
    "assignee": "dev1",
    "due_date": "2025-02-10",
    "effort_tag": "small",
    "priority": 8
  },
  "confidence": 0.95,
  "explanation": "Creating high-priority bug fix task for dev1"
}
```

### Example Response (No Action)

```json
{
  "action": "none",
  "explanation": "I need more information about which task you want to update."
}
```

## Prompt Templates

### Task Extraction Prompt

```
You are an assistant that extracts action items from meeting transcripts.
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

Transcript: """
{transcript}
"""

Return ONLY the JSON array, no other text.
```

### Dependency Detection Prompt

```
Detect task dependency relationships from the transcript. Return ONLY JSON:
{"dependencies":[{"from":"Finish API endpoints","depends_on":"DB migration complete"}, ...]}

Transcript: """
{transcript}
"""

Return ONLY the JSON object, no other text.
```

### RICE Scoring Prompt

```
Given description and context, estimate RICE fields. Return ONLY JSON:
{"reach":<int>, "impact":<1-10>, "confidence":<0.0-1.0>, "effort":<hours-int>}

Task: {description}

Return ONLY the JSON object, no other text.
```

### Assistant Chat Prompt

```
You are Nova, the project assistant. Respond concisely. If user asks a change (e.g., create task), return a JSON action suggestion:
{"action":"create_task","payload":{"title":"...","assignee":"...","due_date":"YYYY-MM-DD or null","effort_tag":"small|medium|large","priority":1-10},"confidence":0.95,"explanation":"one-liner"}
If you cannot parse, return {"action":"none","explanation":"reason"}

User message: {message}

Context: {context}

Return ONLY JSON, no other text.
```

### Meeting Summary Prompt

```
Summarize this meeting transcript in 2-3 sentences.

Transcript: """
{transcript}
"""

Return ONLY the summary text.
```

## Validation & Fallback Strategy

### Validation Process

1. **Parse JSON**: Attempt to parse Gemini response as JSON
2. **Clean Response**: Remove markdown code blocks (```json, ```)
3. **Validate Schema**: Use jsonschema library to validate against schema
4. **Return or Fallback**: If valid, return data; if invalid, log and use fallback

### Fallback Strategies

#### Task Extraction Fallback

Uses simple rule-based extraction:
- Searches for keywords: "I will", "I'll", "action:", "todo:", "task:"
- Creates task with confidence 0.5
- Sets default priority 5 and effort "medium"

#### Dependency Fallback

Returns empty dependencies array:
```json
{"dependencies": []}
```

#### RICE Fallback

Returns conservative estimates:
```json
{
  "reach": 100,
  "impact": 5,
  "confidence": 0.5,
  "effort": 8
}
```

#### Assistant Fallback

Returns "cannot parse" response:
```json
{
  "action": "none",
  "explanation": "I couldn't parse that request. Please try rephrasing."
}
```

## Confidence Thresholds

| Confidence | Interpretation | Action |
|------------|----------------|--------|
| < 0.5 | Low confidence | Flag for review, do not auto-apply |
| 0.5 - 0.7 | Medium confidence | Suggest only, needs_priority_review = true |
| 0.7 - 0.85 | Good confidence | Suggest, can be approved |
| ≥ 0.85 | High confidence | Eligible for auto-apply if enabled |

## Auto-Apply Rules

For agent_mode = "auto":

1. **Check confidence**: Must be ≥ auto_confidence_threshold (default 0.85)
2. **Check action type**: Must be in allowed_auto_actions list
3. **Check risk level**: Only low-risk actions (e.g., set_focus_time)
4. **Create audit log**: Always log before applying
5. **Apply action**: Execute the suggestion
6. **Mark applied**: Set suggestion.applied = true

### Safe Auto-Actions

- `set_focus_time`: Set suggested focus hours (low risk)
- `set_priority`: Adjust priority within bounds (low risk)

### Require Human Approval

- `create_task`: Creates new work items (medium risk)
- `split_task`: Restructures work (medium risk)
- `reassign`: Changes ownership (medium risk)
- `reschedule`: Changes deadlines (medium risk)
- `delete_task`: Removes work items (high risk)

## Error Handling

### Malformed JSON

```python
try:
    data = json.loads(response)
except json.JSONDecodeError as e:
    logger.error(f"JSON parse error: {e}")
    logger.error(f"Raw response: {response}")
    return fallback_extractor(input)
```

### Schema Validation Failure

```python
try:
    validate(instance=data, schema=SCHEMA)
except ValidationError as e:
    logger.error(f"Schema validation error: {e}")
    logger.error(f"Data: {data}")
    return fallback_extractor(input)
```

### API Errors

```python
try:
    response = gemini_model.generate_content(prompt)
    return response.text
except Exception as e:
    logger.error(f"Gemini API error: {e}")
    return mock_response(prompt)  # Fallback to mock
```

## Testing Schemas

All schemas have corresponding unit tests in `backend/tests/test_parser.py`:

- Valid JSON parsing
- Invalid JSON handling
- Markdown code block stripping
- Schema validation success
- Schema validation failure
- Fallback extractor behavior

Run tests:
```bash
pytest backend/tests/test_parser.py -v
```
