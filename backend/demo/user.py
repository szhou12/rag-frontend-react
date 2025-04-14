from fastapi import APIRouter, Depends

from .temp import get_current_active_user, get_client_user, get_staff_user, get_admin_user, get_current_user_with_scopes
from .temp import UserResponse
from .temp import User

router = APIRouter()

@router.get("/users/me", response_model=UserResponse)
async def read_users_me(current_user: User = Depends(get_current_user_with_scopes)):
    """
    Notice that the dependency get_current_active_user returns a SQLAlchemy ORM object (User)
    but this endpoint returns a Pydantic model object (UserResponse)
    FastAPI automatically handles model conversion and translate database model supported by SQLAlchemy.
    """
    return current_user

@router.get("/chat")
async def get_chat(user: User = Depends(get_client_user)):
    return {"message": "Chat access granted", "user": user.email}

@router.get("/dashboard")
async def get_dashboard(user: User = Depends(get_staff_user)):
    return {"message": "Dashboard access granted", "user": user.email}

@router.get("/dashboard/admin")
async def get_admin_dashboard(user: User = Depends(get_admin_user)):
    return {"message": "Admin dashboard access granted", "user": user.email}


