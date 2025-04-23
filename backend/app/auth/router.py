from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from datetime import timedelta
from ..database import get_db
from . import utils
from ..models.schemas import UserCreate, Token, UserResponse

router = APIRouter()

@router.post("/register", response_model=UserResponse)
async def register(user: UserCreate, db = Depends(get_db)):
    """Register a new user."""
    # Check if username already exists
    db.execute("SELECT * FROM users WHERE username = %s", (user.username,))
    existing_user = db.fetchone()
    
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username already registered",
        )
    
    # Hash the password
    hashed_password = utils.get_password_hash(user.password)
    
    # Insert the new user
    db.execute(
        "INSERT INTO users (username, password_hash, is_admin) VALUES (%s, %s, %s) RETURNING id, username, is_admin, created_at",
        (user.username, hashed_password, False)
    )
    
    new_user = db.fetchone()
    return new_user

@router.post("/token", response_model=Token)
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends(), db = Depends(get_db)):
    """Login to get an access token."""
    # Get the user from the database
    db.execute("SELECT * FROM users WHERE username = %s", (form_data.username,))
    user = db.fetchone()
    
    # Check if user exists and password is correct
    if not user or not utils.verify_password(form_data.password, user["password_hash"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Create access token
    access_token_expires = timedelta(minutes=utils.config.JWT_EXPIRATION)
    access_token = utils.create_access_token(
        data={"sub": user["username"]},
        expires_delta=access_token_expires,
    )
    
    return {"access_token": access_token, "token_type": "bearer"}

@router.get("/me", response_model=UserResponse)
async def read_users_me(current_user = Depends(utils.get_current_user)):
    """Get the current user's information."""
    return current_user
