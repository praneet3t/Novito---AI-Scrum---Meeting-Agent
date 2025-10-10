"""Authentication router - demo mode with simple username/password"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import User
from ..schemas import UserLogin, UserResponse

router = APIRouter(prefix="/auth", tags=["auth"])

# Simple demo session storage (in-memory)
sessions = {}

@router.post("/login")
def login(credentials: UserLogin, db: Session = Depends(get_db)):
    """Demo login - checks username and password"""
    user = db.query(User).filter(
        User.username == credentials.username,
        User.password == credentials.password
    ).first()
    
    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    # Create simple session token (demo only)
    token = f"demo-token-{user.id}"
    sessions[token] = user.id
    
    return {
        "token": token,
        "user": UserResponse.model_validate(user)
    }

@router.get("/me", response_model=UserResponse)
def get_current_user(token: str, db: Session = Depends(get_db)):
    """Get current user from token"""
    user_id = sessions.get(token)
    if not user_id:
        raise HTTPException(status_code=401, detail="Invalid token")
    
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    
    return user
