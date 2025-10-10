"""Unit tests for AI parser with mock responses"""
import pytest
from app.ai.parser import (
    parse_and_validate,
    fallback_task_extractor,
    TASK_CANDIDATE_SCHEMA,
    DEPENDENCY_SCHEMA
)

def test_parse_valid_task_json():
    """Test parsing valid task JSON"""
    valid_json = '''[
        {
            "assignee": "dev1",
            "description": "Implement feature X",
            "due_date": "2025-02-15",
            "priority": 8,
            "effort_tag": "large",
            "confidence": 0.9,
            "is_blocked": false,
            "blocker_reason": null
        }
    ]'''
    
    result = parse_and_validate(valid_json, TASK_CANDIDATE_SCHEMA)
    assert result is not None
    assert len(result) == 1
    assert result[0]["description"] == "Implement feature X"
    assert result[0]["confidence"] == 0.9

def test_parse_invalid_json():
    """Test parsing invalid JSON returns None"""
    invalid_json = "not valid json"
    result = parse_and_validate(invalid_json, TASK_CANDIDATE_SCHEMA)
    assert result is None

def test_parse_json_with_markdown():
    """Test parsing JSON wrapped in markdown code blocks"""
    markdown_json = '''```json
    [{"assignee": null, "description": "Test task", "confidence": 0.8, "is_blocked": false}]
    ```'''
    
    result = parse_and_validate(markdown_json, TASK_CANDIDATE_SCHEMA)
    assert result is not None
    assert len(result) == 1

def test_fallback_task_extractor():
    """Test fallback extractor finds action items"""
    transcript = """
    Dev1: I will implement the login feature.
    QA1: I'll write test cases for authentication.
    """
    
    tasks = fallback_task_extractor(transcript)
    assert len(tasks) >= 2
    assert all(task["confidence"] == 0.5 for task in tasks)

def test_parse_dependencies():
    """Test parsing dependency JSON"""
    dep_json = '''{"dependencies": [{"from": "Task A", "depends_on": "Task B"}]}'''
    result = parse_and_validate(dep_json, DEPENDENCY_SCHEMA)
    assert result is not None
    assert len(result["dependencies"]) == 1

if __name__ == "__main__":
    pytest.main([__file__, "-v"])
