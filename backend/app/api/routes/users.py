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
    UserCreate,
    UserRegister,
)
from app.crud.user import (
    create_user,
    get_user_by_email,
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


@router.post("/register", response_model=UserPublic)
def register_user(user_in: UserRegister, db_session: Session = SessionDep) -> UserPublic:
    """
    Register a new user.

    Args:
        user_in: UserRegister (email, plain password, username, role) whose values passed in from frontend
        db_session: MySQL DB session

    Returns:
        UserPublic: UserPublic schema
    """
    # check if user with this email already registered
    db_user = get_user_by_email(session=db_session, email=user_in.email)
    if db_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, 
            detail="The user with this email already exists in the system"
        )

    # validate all fields type correct and values exist,
    # then convert UserRegister to UserCreate for internal user creation
    user_create = UserCreate.model_validate(user_in)

    # the returned user is User ORM object in DB
    user = create_user(session=db_session, user_create=user_create)

    # TODO: send verification email

    # As specified in response_model=UserPublic,
    # FastAPI will automatically convert User ORM object to UserPublic schema before sending the response to frontend
    return user


# TODO: read_users
# TODO: create_user
# TODO: update_user_me
# TODO: update_password_me
# TODO: delete_user_me
# TODO: register_user
# TODO: read_user_by_id
# TODO: update_user
# TODO: delete_user

