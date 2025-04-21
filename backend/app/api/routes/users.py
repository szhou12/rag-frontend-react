import uuid
from typing import Any

from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import col, delete, func, select

router = APIRouter(prefix="/users", tags=["users"])


@router.get("/users/me", response_model=UserResponse)
async def read_users_me(current_user: User = Depends(get_current_user_with_scopes)):
    """
    Notice that the dependency get_current_active_user returns a SQLAlchemy ORM object (User)
    but this endpoint returns a Pydantic model object (UserResponse)
    FastAPI automatically handles model conversion and translate database model supported by SQLAlchemy.
    """
    return current_user



# TODO: read_users
# TODO: create_user
# TODO: update_user_me
# TODO: update_password_me
# TODO: delete_user_me
# TODO: register_user
# TODO: read_user_by_id
# TODO: update_user
# TODO: delete_user

