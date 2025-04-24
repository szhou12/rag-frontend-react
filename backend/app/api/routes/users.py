import uuid
from typing import Any

from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import col, delete, func, select

from app.api.deps import (
    get_current_user_with_scopes,
    CurrentUser,
    SessionDep,
)
from app.models.user import (
    User,
)
from app.schemas.user import (
    UserPublic,
)

router = APIRouter(prefix="/users", tags=["users"])


@router.get("/users/me", response_model=UserPublic)
async def read_user_me(current_user: CurrentUser) -> Any:
    """
    Notice that the dependency CurrentUser returns a DB ORM object (User)
    but this endpoint returns a Pydantic model object (UserResponse)
    FastAPI automatically handles model conversion and translate DB model to Pydantic model.
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

