from datetime import timedelta
from typing import Annotated, Any

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import HTMLResponse
from fastapi.security import OAuth2PasswordRequestForm

from app import crud
from app.core import security
from app.api.deps import CurrentUser, SessionDep
from app.models import Token
from app.core.config import settings


router = APIRouter(tags=["login"])

@router.post("/login/token")
async def login_for_access_token(
    session: SessionDep,
    form_data: Annotated[OAuth2PasswordRequestForm, Depends()]
) -> Token:
    """
    Authenticate user and generate JWT access token.

    This endpoint validates user credentials and generates a JWT token for authenticated access.
    The token includes user role-based scopes and expires based on configured timeout.

    Args:
        session (SessionDep): Database session dependency
        form_data (OAuth2PasswordRequestForm): Form containing username (email) and password

    Returns:
        Token: Object containing the JWT access token

    Raises:
        HTTPException: 401 status code if email/password combination is invalid

    Example:
        POST /login/token
        Form data:
            username: user@example.com
            password: userpassword
    """
    # fetch user from DB by email, then verify if their password matches, return user info object stored in DB which contains user.role
    user = crud.authenticate(
        session=session, email=form_data.username, password=form_data.password
    )

    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, 
                            detail="Incorrect email or password",
                            headers={"WWW-Authenticate": "Bearer"})
    
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)

    # create JWT access token
    jwt_data_payload = {
        "sub": user.email,
        "scopes": settings.ROLE_SCOPES.get(user.role, [])
    }
    access_token = security.create_access_token(
        data=jwt_data_payload,
        expires_delta=access_token_expires
    )

    return Token(access_token=access_token)


# TODO: test_token
# TODO: recover_password
# TODO: reset_password
# TODO: recover_password_html_content