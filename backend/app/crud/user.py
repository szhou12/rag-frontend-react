
from sqlmodel import Session, select

from app.core.security import get_password_hash, verify_password
from app.models.user import User
from app.schemas.user import UserCreate, UserUpdate

def create_user(*, session: Session, user_create: UserCreate) -> User:
    """
    Create a new user in the database.

    Args:
        session: Database session
        user_create: Pydantic schema including plain password

    Returns:
        User: The newly created User ORM object in DB
    """
    db_obj = User.model_validate(
        user_create,
        update={"hashed_password": get_password_hash(user_create.password)},
    )
    session.add(db_obj)
    session.commit()
    session.refresh(db_obj)
    return db_obj

def update_user(*, session: Session, db_user: User, user_in: UserUpdate) -> User:
    """
    Update an existing user in the database.

    Args:
        session: Database session
        db_user: Existing User ORM object to update
        user_in: Pydantic schema with fields to update

    Returns:
        User: The updated User ORM object in DB
    """
    # convert user_in to dict and contain only explicitly set (user provide in frontend) fields
    user_data = user_in.model_dump(exclude_unset=True)

    extra_data = {}
    if "password" in user_data:
        password = user_data["password"]
        hashed_password = get_password_hash(password)
        extra_data["hashed_password"] = hashed_password
    
    # update DB object with key-value pairs in user_data and extra_data
    db_user.sqlmodel_update(user_data, update=extra_data)

    session.add(db_user)
    session.commit()
    session.refresh(db_user)
    return db_user
    
def get_user_by_email(*, session: Session, email: str) -> User | None:
    """
    Get a user by email from the database.

    Args:
        session: Database session
        email: Email address of the user

    Returns:
        User | None: The User ORM object in DB if found, otherwise None
    """
    sql_stmt = select(User).where(User.email == email)
    session_user = session.exec(sql_stmt).first()
    return session_user

def authenticate(*, session: Session, email: str, password: str) -> User | None:
    """
    Authenticate a user by email and password.

    Args:
        session: Database session
        email: Email address of the user
        password: Plain text password of the user

    Returns:
        User | None: The User ORM object in DB if authenticated, otherwise None
    """
    db_user = get_user_by_email(session=session, email=email)

    if not db_user:
        return None
    if not verify_password(password, db_user.hashed_password):
        return None
    
    return db_user
        