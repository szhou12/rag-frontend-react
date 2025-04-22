from collections.abc import Generator
from typing import Annotated

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, SecurityScopes
import jwt
from jwt.exceptions import InvalidTokenError
from pydantic import ValidationError
from sqlmodel import Session

from app.core import security
from app.core.config import settings
from app.core.db import engine
from app.models import TokenPayload, User


def get_db() -> Generator[Session, None, None]:
    """
    Provides (Yields) a SQLAlchemy Session for DB operations.
    
    Yields:
        Generator[Session, None, None]: A SQLAlchemy Session for interacting with DB. Session will be automatically closed after the request.
    Note:
    1. Generator[YieldType, SendType, ReturnType]
        YieldType = Session: get_db() yields a Session instance.
        SendType = None: type of values can be sent to the generator using .send(). get_db() don't use .send().
        ReturnType = None: type of values returned by the generator. get_db() has no return.
    2. If use yield, get_db() needs to be a generator function, meaning its "return type" must be: get_db() -> Generator[...], rather than get_db() -> Session.
    """
    with Session(engine) as session:
        yield session

# SessionDep is Session type, but attaches metadata: Depends(get_db)
# FastAPI will automatically call get_db() to provide a Session when a var is declared as SessionDep.
SessionDep = Annotated[Session, Depends(get_db)]

# oauth2_scheme is a dependency callable object (acts like a function) that extracts the token from Authorization header.
# Workflow: client sends a POST request to tokenUrl -> backend generates a encoded JWT sent back to client -> client's future requests will have Authorization header with this token included inside for oauth2_scheme to extract.
oauth2_scheme = OAuth2PasswordBearer(
    # URL endpoint where the token is expected from
    tokenUrl=f"{settings.API_V1_STR}/login/token",
    scopes={
        "chat": "Access chat",
        "dashboard": "Access general dashboard",
        "dashboard:admin": "Access admin dashboard page"
    },
)

TokenDep = Annotated[str, Depends(oauth2_scheme)]



async def get_current_user_with_scopes(
        security_scopes: SecurityScopes,
        session: SessionDep,
        token: TokenDep,
) -> User:
    """
    Decode JWT token and verify user has required scopes.

    This dependency function decodes the JWT access token, checks user existence, and verifies the user has the required scopes for the endpoint.

    Args:
        security_scopes (SecurityScopes): Scopes required by the endpoint
        session (SessionDep): Database session dependency
        token (TokenDep): JWT token from request header

    Returns:
        User: User ORM in DB

    Raises:
        HTTPException: 
            - 401 if token is invalid or missing required scopes
            - 403 if credentials cannot be validated
            - 404 if user not found
            - 400 if user is inactive
    """
    # Create authentication requirements message
    if security_scopes.scopes:
        authenticate_value = f'Bearer scope="{" ".join(security_scopes.scopes)}"'
    else:
        authenticate_value = "Bearer"

    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": authenticate_value},
    )

    try:
        # Decode and validate JWT token
        payload = jwt.decode(
            token, settings.SECRET_KEY, algorithms=[security.ALGORITHM]
        )
        token_data = TokenPayload(**payload)

        # Check if every scope required by an endpoint exists in user's token
        # security_scopes.scopes = scopes required by the endpoint
        # e.g. def add_user( user: User = Security(get_current_user_with_scopes, scopes=["dashboard:admin"]) )
        # meaning: this endpoint requires user has "dashboard:admin" scope in token in order to access.
        # token_data.scopes = allowed scope list in user's token
        for scope in security_scopes.scopes:
            if scope not in token_data.scopes:
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail=f"Not enough permissions. Required scope: {scope}",
                    headers={"WWW-Authenticate": authenticate_value},
                )
    except (InvalidTokenError, ValidationError):
        raise credentials_exception
    
    # Get user from DB
    user = session.get(User, token_data.sub)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    return user

CurrentUser = Annotated[User, Depends(get_current_user_with_scopes)]