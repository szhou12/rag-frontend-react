from typing import Optional, List
from datetime import datetime, timedelta, timezone
import bcrypt

from fastapi import Depends, HTTPException, status, Security
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm, SecurityScopes
from pydantic import BaseModel
from sqlalchemy import Column, Integer, String, Boolean
from sqlalchemy.orm import declarative_base
from sqlalchemy import create_engine, MetaData
from sqlalchemy.orm import sessionmaker, Session
import jwt
from jwt.exceptions import InvalidTokenError
from passlib.context import CryptContext




##### models.py #####
Base = declarative_base()

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    is_active = Column(Boolean, default=True)
    role = Column(String)


##### schemas.py #####
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    # username: Optional[str] = None
    email: Optional[str] = None
    scopes: List[str] = []

# model that contains registration info
class UserCreate(BaseModel):
    username: str
    email: str
    password: str
    role: str

# model that contains user's public info stored in DB
class UserResponse(BaseModel):
    username: str
    email: Optional[str] = None
    role: str

# model that contains user's whole info stored in DB
class UserInDB(UserResponse):
    # private info
    hashed_password: str


##### database.py #####
DATABASE_URL = "sqlite:///./test.db"

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
metadata = MetaData()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

Base.metadata.create_all(bind=engine)


##### auth/auth_handler.py #####
SECRET_KEY = "8f0541d753e4f77f3f79a25dfa337819280ecf7d44b5c62f62f0b8b967c37968"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

password_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

oauth2_scheme = OAuth2PasswordBearer(
    tokenUrl="auth/token",
    scopes={
        "chat": "Access chat",
        "dashboard": "Access general dashboard",
        "dashboard:admin": "Access admin dashboard page"
    },
)

ROLE_SCOPES = {
    "client": ["chat"],
    "staff": ["chat", "dashboard"],
    "admin": ["chat", "dashboard", "dashboard:admin"]
}

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

def get_user(db: Session, email: str):
    """
    Retrieves a user from the database by email.
    """
    db_user = db.query(User).filter(User.email == email).first()
    return db_user # ORM object

def authenticate_user(db: Session, email: str, password: str):
    """
    Authenticates a user by comparing input (email, password) to those stored in DB.
    """
    user = get_user(db, email)
    if not user: # no such user found
        return False
    if not verify_password(password, user.hashed_password): # incorrect password
        return False
    return user

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    """
    Generates an access token using the provided data.

    :param data: The data to encode in the token, typically containing user-specific information like email
    :param expires_delta: The time delta for the token's expiration. Adds an expiration time to the token.
    """
    to_encode = data.copy()

    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=15)

    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

async def get_current_user(
        token: str = Depends(oauth2_scheme), 
        db: Session = Depends(get_db)
):
    """
    token is string type that depends on oauth2_scheme to generate. 
        oauth2_scheme follows OAuth2.0 protocol to validate user's identity through (username, password) to generate a Bearer token. 
        The actual generation process is user POST request sends username & password to tokenUrl, through which identity is validated and a token (JWT) is generated and returned to user.
    1. Verifies the JWT token by decoding it using jwt.decode.
    2. Extracts user information from the token payload.
    3. Retrieves the user object from DB.
    """
    credential_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

    # Step 1: Decode JWT
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM]) # payload = user data
        email: str = payload.get("sub")
        if email is None:
            raise credential_exception
        token_data = TokenData(email=email)
    except InvalidTokenError:
        raise credential_exception
    
    # Step 2: Retrieve user from DB
    user = get_user(db, email=token_data.email)
    if user is None:
        raise credential_exception
    
    return user


# TODO: DELETE THIS FUNCTION
async def get_current_active_user(current_user: User = Depends(get_current_user)):
    """
    Checks if a user is active (disabled=True) before granting access to an endpoint.
    """
    # if current_user.disabled:
    #     raise HTTPException(status_code=400, detail="Inactive user")
    return current_user


async def get_current_user_with_scopes(
        security_scopes: SecurityScopes,
        token: str = Depends(oauth2_scheme),
        db: Session = Depends(get_db)
):
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

    # Decode JWT token
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
        
        token_scopes = payload.get("scopes", [])
        token_data = TokenData(email=email, scopes=token_scopes)
        # TokenData: {
        #     "email": "test@test.com",
        #     "scopes": ["chat", "dashboard"]
        # }
    except InvalidTokenError:
        raise credentials_exception
    
    # Get user from DB
    user = get_user(db, email=token_data.email)
    if user is None:
        raise credentials_exception
    
    # Check scopes
    # security_scopes.scopes = scopes required by the endpoint
    # token_data.scopes = scopes allowed for the user's role
    for scope in security_scopes.scopes:
        if scope not in token_data.scopes:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Not enough permissions. Required scope: {scope}",
                headers={"WWW-Authenticate": authenticate_value},
            )
    
    return user

# Any authenticated user can access (no specific scope required) 
def get_client_user(user: User = Depends(get_current_user_with_scopes)):
    return user

# Only users with "dashboard" scope can access (staff and admin)
def get_staff_user(user: User = Security(get_current_user_with_scopes, scopes=["dashboard"])):
    return user

# Only users with "dashboard:admin" scope can access (admin only)
def get_admin_user(user: User = Security(get_current_user_with_scopes, scopes=["dashboard:admin"])):
    return user