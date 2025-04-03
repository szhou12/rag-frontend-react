from datetime import datetime, timedelta, timezone
from typing import Optional, Any

import jwt # encode and decode JWT (JSON Web Token)

from app.core.config import settings

ALGORITHM = "HS256"

def get_password_hash(password: str) -> str:
    # TODO
    pass

def verify_password(plain_password: str, hashed_password: str) -> bool:
    # TODO
    pass

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    """
    Generate a JSON Web Token (JWT) for user authentication and authorization. It goes through a specific encoding process to transform the payload data (usually a Python dictionary) into a compact, URL-safe string.

    Args:
        data (dict): The payload data to include in the JWT. Common keys include:
            - 'sub': The subject of the token, typically a user ID. Standard keyword for JWT, aiming to identify the principal that is the subject of the JWT. It's a string or a unique identifier for the user.
            - 'roles': A list of roles associated with the user (e.g., ['client'], ['staff', 'admin'])
        expires_delta (Optional[timedelta]): Optional expiration time for the token. Defaults to 15 minutes if not provided.

    Returns:
        str: The encoded JWT string.

    Example:
        token = create_access_token({"sub": "user_id"}, timedelta(minutes=30))
    """
    to_encode = data.copy()

    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=15)

    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=ALGORITHM)
    
    return encoded_jwt

