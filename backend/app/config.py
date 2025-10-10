import os
from typing import Literal

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")
AI_MODE: Literal["gemini", "mock"] = "mock" if not GEMINI_API_KEY else os.getenv("AI_MODE", "gemini")
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./novito.db")
AGENT_AUTO_CONFIDENCE = float(os.getenv("AGENT_AUTO_CONFIDENCE", "0.85"))
SECRET_KEY = os.getenv("SECRET_KEY", "demo-secret-key-not-for-production")
