from sqlmodel import Session, create_engine, select

from app import crud
from app.core.config import settings
from app.models import User, UserCreate

engine = create_engine(settings.SQLALCHEMY_DATABASE_URI)

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
            