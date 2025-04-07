import uuid
from typing import Any

from sqlmodel import Session, select

from app.core.security import get_password_hash, verify_password
from app.models import User, UserCreate, UserUpdate


def create_user(*, session: Session, user_create: UserCreate) -> User:
    """
    Creates a new user instance to be stored in the DB.

    Args:
        session: SQLModel session instance
        user_create: UserCreate instance (email, role, plain password)

    Returns:
        User: Created User object with auto-generated UUID, timestamp, and hashed password
    
    Note:
    1. usage of *: force all arguments after * to be passed as keyword arguments.
        e.g. create_user(session=my_session, user_create=new_user). Disallow create_user(my_session, new_user)
    2. model_validate() is a built-in SQLModel function.
    3. Refresh: after session commit, User object marked as expired. Thus, unless explicitly access an attribute (e.g. cur_user.email) which triggers underlying fetching updated data from DB, access the entire User object will return "empty". The way to work around is to use session.refresh() which triggers fetching updated data from DB.
    """
    user_db = User.model_validate(
        user_create, 
        update={"hashed_password": get_password_hash(user_create.password)}
    )
    session.add(user_db)
    session.commit()
    session.refresh(user_db) # ensure returned object contains updated data instead of looking empty
    return user_db


def get_user_by_email(*, session: Session, email: str) -> User | None:
    """
    Retrieves the first matched user by email from the database.

    Args:
        session: SQLModel session instance
        email: email address of the user to retrieve

    Returns:
        User | None: The first matched user by email, or None if no match is found
    """
    sql = select(User).where(User.email == email)
    first_matched_user = session.exec(sql).first()
    return first_matched_user

def authenticate(*, session: Session, email: str, password: str) -> User | None:
    """
    Authenticates a user by email and password.

    Args:
        session: SQLAlchemy database session
        email: User's email to find matched user from DB
        password: Plain text password to verify

    Returns:
        User | None: User object if authentication succeeds, None if user not found or password incorrect
    """
    user_from_db = get_user_by_email(session=session, email=email)
    if not user_from_db:
        return None
    if not verify_password(password, user_from_db.hashed_password):
        return None
    return user_from_db
    

def update_user(*, session: Session, db_user: User, user_in: UserUpdate) -> Any:
    # TODO
    pass