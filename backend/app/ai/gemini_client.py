"""Centralized Gemini API client with mock mode support"""
import logging
from typing import List, Dict, Any, Optional
from ..config import GEMINI_API_KEY, AI_MODE
from .prompts import (
    TASK_EXTRACTION_PROMPT,
    DEPENDENCY_DETECTION_PROMPT,
    RICE_SCORING_PROMPT,
    ASSISTANT_CHAT_PROMPT,
    MEETING_SUMMARY_PROMPT
)
from .parser import (
    parse_and_validate,
    fallback_task_extractor,
    fallback_dependencies,
    fallback_rice,
    fallback_assistant_action,
    TASK_CANDIDATE_SCHEMA,
    DEPENDENCY_SCHEMA,
    RICE_SCHEMA,
    ASSISTANT_ACTION_SCHEMA
)

logger = logging.getLogger(__name__)

# Initialize Gemini client if API key is present
gemini_model = None
if AI_MODE == "gemini" and GEMINI_API_KEY:
    try:
        import google.generativeai as genai
        genai.configure(api_key=GEMINI_API_KEY)
        gemini_model = genai.GenerativeModel('gemini-pro')
        logger.info("Gemini API initialized successfully")
    except Exception as e:
        logger.error(f"Failed to initialize Gemini: {e}")
        gemini_model = None

def _call_gemini(prompt: str) -> str:
    """Internal method to call Gemini or return mock response"""
    if AI_MODE == "mock" or not gemini_model:
        logger.info("Using mock AI mode")
        return _mock_response(prompt)
    
    try:
        response = gemini_model.generate_content(prompt)
        return response.text
    except Exception as e:
        logger.error(f"Gemini API error: {e}")
        return _mock_response(prompt)

def _mock_response(prompt: str) -> str:
    """Deterministic mock responses for development"""
    if "extract action items" in prompt.lower():
        return '''[
            {"assignee":"dev1","description":"Implement user authentication","due_date":"2025-02-15","priority":9,"effort_tag":"large","confidence":0.92,"is_blocked":false,"blocker_reason":null},
            {"assignee":"qa1","description":"Write test cases for login flow","due_date":"2025-02-20","priority":7,"effort_tag":"medium","confidence":0.85,"is_blocked":false,"blocker_reason":null}
        ]'''
    elif "dependency relationships" in prompt.lower():
        return '{"dependencies":[{"from":"Write test cases for login flow","depends_on":"Implement user authentication"}]}'
    elif "estimate RICE" in prompt.lower():
        return '{"reach":500,"impact":8,"confidence":0.8,"effort":40}'
    elif "Nova, the project assistant" in prompt.lower():
        return '{"action":"none","explanation":"I can help you with tasks, sprints, and project queries."}'
    elif "Summarize this meeting" in prompt.lower():
        return "Team discussed authentication implementation and testing strategy. Dev1 will implement OAuth2 login by Feb 15. QA1 will prepare test cases."
    return '{"action":"none","explanation":"Mock response"}'

def generate_tasks_from_transcript(transcript: str) -> List[Dict[str, Any]]:
    """Extract tasks from meeting transcript"""
    prompt = TASK_EXTRACTION_PROMPT.format(transcript=transcript)
    raw_response = _call_gemini(prompt)
    
    parsed = parse_and_validate(raw_response, TASK_CANDIDATE_SCHEMA)
    if parsed is None:
        logger.warning("Task extraction failed, using fallback")
        return fallback_task_extractor(transcript)
    
    return parsed

def detect_dependencies(transcript: str) -> Dict[str, List]:
    """Detect task dependencies from transcript"""
    prompt = DEPENDENCY_DETECTION_PROMPT.format(transcript=transcript)
    raw_response = _call_gemini(prompt)
    
    parsed = parse_and_validate(raw_response, DEPENDENCY_SCHEMA)
    if parsed is None:
        return fallback_dependencies()
    
    return parsed

def score_rice(description: str) -> Dict[str, Any]:
    """Estimate RICE score for a task"""
    prompt = RICE_SCORING_PROMPT.format(description=description)
    raw_response = _call_gemini(prompt)
    
    parsed = parse_and_validate(raw_response, RICE_SCHEMA)
    if parsed is None:
        return fallback_rice()
    
    return parsed

def assistant_chat(message: str, context: str = "") -> Dict[str, Any]:
    """Nova assistant chat"""
    prompt = ASSISTANT_CHAT_PROMPT.format(message=message, context=context)
    raw_response = _call_gemini(prompt)
    
    parsed = parse_and_validate(raw_response, ASSISTANT_ACTION_SCHEMA)
    if parsed is None:
        return fallback_assistant_action(message)
    
    return parsed

def summarize_meeting(transcript: str) -> str:
    """Generate meeting summary"""
    prompt = MEETING_SUMMARY_PROMPT.format(transcript=transcript)
    return _call_gemini(prompt)
