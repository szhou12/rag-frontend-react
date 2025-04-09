from collections.abc import Generator
from typing import Annotated

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
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
    tokenUrl=f"{settings.API_V1_STR}/login/access-token"
)

TokenDep = Annotated[str, Depends(oauth2_scheme)]


def get_current_user(session: SessionDep, token: TokenDep) -> User:
    """
    Args:
        session: a Session type that depends on get_db() to generate such a Session object.
        token: a string type that depends on oauth2_scheme to generate such a token. 

        - oauth2_scheme follows OAuth2.0 protocol to validate user's identity through (username, password) to generate a Bearer token.
        - The actual generation process is user POST request sends (username, password) to tokenUrl, under which sits a function that validates identity, generates and returns a JWT token to user.
    Returns:
    """
    try:
        payload = jwt.decode(
            token,
            settings.SECRET_KEY,
            algorithms=[security.JWT_ALGORITHM]
        )
        token_data = TokenPayload(**payload)
    except (InvalidTokenError, ValidationError):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Could not validate credentials"
        )
    user = session.get(User, token_data.sub)

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    return user
