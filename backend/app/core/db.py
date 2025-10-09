from sqlmodel import Session, create_engine, select, SQLModel

from app import crud
from app.core.config import settings
from app.models.user import User
from app.schemas.user import UserCreate

engine = create_engine(str(settings.SQLALCHEMY_DATABASE_URI))

def create_db_and_tables():
    """Create database tables"""
    SQLModel.metadata.create_all(engine)

def init_db(session: Session) -> None:
    first_admin = session.exec(
        select(User).where(User.email == settings.FIRST_SUPERUSER)
    ).first()
    if not first_admin:
        user_in = UserCreate(
            email=settings.FIRST_SUPERUSER,
            password=settings.FIRST_SUPERUSER_PASSWORD,
            role="admin",
        )
        user = crud.create_user(session=session, user_create=user_in)
            