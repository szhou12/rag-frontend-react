from datetime import timedelta

from fastapi.security import OAuth2PasswordRequestForm
from fastapi import Depends, HTTPException, status, APIRouter
from sqlalchemy.orm import Session

from .temp import authenticate_user, ACCESS_TOKEN_EXPIRE_MINUTES, create_access_token, get_user, get_password_hash, ROLE_SCOPES
from .temp import get_db
from .temp import Token, UserCreate, UserResponse
from .temp import User

router = APIRouter()

@router.post("/token")
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)) -> Token:
    # fetch user from DB by email, then verify if their password matches, return user info object stored in DB which contains user.role
    user = authenticate_user(db=db, email=form_data.username, password=form_data.password)

    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, 
                            detail="Incorrect email or password",
                            headers={"WWW-Authenticate": "Bearer"})
    
    # Check if the requested scopes are allowed for the user's role
    ## Q: where should form_data.scopes come from?
    ## A: Frontend sets in login form
    # for scope in form_data.scopes:
    #     if scope not in ROLE_SCOPES.get(user.role, []):
    #         raise HTTPException(
    #             status_code=status.HTTP_401_UNAUTHORIZED,
    #             detail=f"Not enough permissions. Scope '{scope}' not allowed for role '{user.role}'",
    #             headers={"WWW-Authenticate": "Bearer"},
    #         )


    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={
            "sub": user.email,
            "scopes": ROLE_SCOPES.get(user.role, [])
        }, 
        expires_delta=access_token_expires
    )
    return Token(access_token=access_token, token_type="bearer")


@router.post("/register", response_model=UserResponse)
def register_user(user: UserCreate, db: Session = Depends(get_db)) -> UserResponse:
    db_user = get_user(db, user.email)
    if db_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, 
            detail="Account already registered"
        )
    hashed_pwd = get_password_hash(user.password)
    db_user = User(
        username=user.username,
        email=user.email, 
        hashed_password=hashed_pwd, 
        role=user.role
    ) # how to pass in role? -> RegisterForm.jsx sets default role to "client"
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user