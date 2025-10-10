"""JSON schema validation for Gemini responses with fallback"""
import json
import logging
from jsonschema import validate, ValidationError
from typing import List, Dict, Any, Optional

logger = logging.getLogger(__name__)

TASK_CANDIDATE_SCHEMA = {
    "type": "array",
    "items": {
        "type": "object",
        "properties": {
            "assignee": {"type": ["string", "null"]},
            "description": {"type": "string"},
            "due_date": {"type": ["string", "null"]},
            "priority": {"type": ["integer", "null"]},
            "effort_tag": {"type": ["string", "null"], "enum": ["small", "medium", "large", None]},
            "confidence": {"type": "number", "minimum": 0.0, "maximum": 1.0},
            "is_blocked": {"type": "boolean"},
            "blocker_reason": {"type": ["string", "null"]}
        },
        "required": ["description", "confidence", "is_blocked"]
    }
}

DEPENDENCY_SCHEMA = {
    "type": "object",
    "properties": {
        "dependencies": {
            "type": "array",
            "items": {
                "type": "object",
                "properties": {
                    "from": {"type": "string"},
                    "depends_on": {"type": "string"}
                },
                "required": ["from", "depends_on"]
            }
        }
    },
    "required": ["dependencies"]
}

RICE_SCHEMA = {
    "type": "object",
    "properties": {
        "reach": {"type": "integer"},
        "impact": {"type": "integer", "minimum": 1, "maximum": 10},
        "confidence": {"type": "number", "minimum": 0.0, "maximum": 1.0},
        "effort": {"type": "integer"}
    },
    "required": ["reach", "impact", "confidence", "effort"]
}

ASSISTANT_ACTION_SCHEMA = {
    "type": "object",
    "properties": {
        "action": {"type": "string"},
        "payload": {"type": "object"},
        "confidence": {"type": "number"},
        "explanation": {"type": "string"}
    },
    "required": ["action", "explanation"]
}

def parse_and_validate(raw_response: str, schema: dict) -> Optional[Any]:
    """Parse JSON and validate against schema. Returns None on failure."""
    try:
        # Clean response - remove markdown code blocks if present
        cleaned = raw_response.strip()
        if cleaned.startswith("```json"):
            cleaned = cleaned[7:]
        if cleaned.startswith("```"):
            cleaned = cleaned[3:]
        if cleaned.endswith("```"):
            cleaned = cleaned[:-3]
        cleaned = cleaned.strip()
        
        data = json.loads(cleaned)
        validate(instance=data, schema=schema)
        return data
    except (json.JSONDecodeError, ValidationError) as e:
        logger.error(f"Parse/validation error: {e}")
        logger.error(f"Raw response: {raw_response}")
        return None

def fallback_task_extractor(transcript: str) -> List[Dict[str, Any]]:
    """Rule-based fallback when Gemini fails"""
    logger.warning("Using fallback task extractor")
    tasks = []
    lines = transcript.split('\n')
    
    for line in lines:
        line_lower = line.lower()
        if any(keyword in line_lower for keyword in ["i will", "i'll", "action:", "todo:", "task:"]):
            tasks.append({
                "assignee": None,
                "description": line.strip(),
                "due_date": None,
                "priority": 5,
                "effort_tag": "medium",
                "confidence": 0.5,
                "is_blocked": False,
                "blocker_reason": None
            })
    
    return tasks if tasks else []

def fallback_dependencies() -> Dict[str, List]:
    """Safe empty fallback for dependencies"""
    return {"dependencies": []}

def fallback_rice() -> Dict[str, Any]:
    """Conservative RICE fallback"""
    return {"reach": 100, "impact": 5, "confidence": 0.5, "effort": 8}

def fallback_assistant_action(message: str) -> Dict[str, Any]:
    """Fallback assistant response"""
    return {
        "action": "none",
        "explanation": "I couldn't parse that request. Please try rephrasing."
    }
