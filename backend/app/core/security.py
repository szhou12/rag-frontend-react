from datetime import datetime, timedelta, timezone
from typing import Optional, Any

import jwt # encode and decode JWT (JSON Web Token)
from passlib.context import CryptContext # hash user password

from app.core.config import settings

JWT_ALGORITHM = "HS256"

# implicitly set default hash algo=bcrypt
# deprecated="auto" helps hash algo migration in future by auto-deprecating non-default hash algo
password_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def get_password_hash(password: str) -> str:
    """
    Hash a plain text password using bcrypt hashing algorithm. Only hashed password is stored in DB.
    """
    return password_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    Verify user's input plain password matches the hashed password stored in DB.
    """
    return password_context.verify(plain_password, hashed_password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    """
    Generate a JSON Web Token (JWT) for user authentication and authorization. It goes through a specific encoding process to transform the payload data (usually a Python dictionary) into a compact, URL-safe string.

    Args:
        data (dict): The payload data to include in the JWT. Common keys include:
        - 'sub': The subject of the token, typically a user ID. Standard keyword for JWT, aiming to identify the principal that is the subject of the JWT. It's a string or a unique identifier for the user.
        - 'scopes': A list of roles associated with the user (e.g., ['client'], ['staff', 'admin'])
        - e.g. data={ "sub": user.email, "scopes": [user.role] }

        expires_delta (Optional[timedelta]): Optional expiration time for the token. Defaults to 15 minutes if not provided.

    Returns:
        str: The encoded JWT string.
    Example:
        token = create_access_token(data={ "sub": user.email, "scopes": [user.role] }, timedelta(minutes=30))
    """
    to_encode = data.copy()

    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=15)

    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=JWT_ALGORITHM)
    
    return encoded_jwt

