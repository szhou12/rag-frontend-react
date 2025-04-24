import uuid
from datetime import datetime
from pydantic import EmailStr
from sqlmodel import SQLModel, Field, Relationship


# Shared properties used for both database model and API schemas
class UserBase(SQLModel):
    email: EmailStr = Field(unique=True, index=True, max_length=255)
    role: str = Field(index=True)
    username: str | None = Field(default=None, max_length=255)

# Database ORM model, table=True => database table
class User(UserBase, table=True):
    """
    Attributes:
    - id: uuid.UUID
    - email: EmailStr
    - role: str
    - username: str | None
    - hashed_password: str
    - created_at: datetime
    """
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True) # auto-generate
    hashed_password: str
    created_at: datetime = Field(default_factory=datetime.now, nullable=False, index=True) # auto-generate
    # items: list["Item"] = Relationship(back_populates="owner", cascade_delete=True)