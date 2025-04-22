import uuid
from datetime import datetime
from typing import Optional, List
from pydantic import EmailStr
from sqlmodel import SQLModel, Field, Relationship

# JSON payload containing access token
class Token(SQLModel):
    access_token: str
    token_type: str = "bearer"

# Contents of JWT token
class TokenPayload(SQLModel):
    sub: str | None = None
    scopes: List[str] = []

class NewPassword(SQLModel):
    token: str
    new_password: str = Field(min_length=8, max_length=40)


# Shared properties used for both database models and API schemas
class UserBase(SQLModel):
    email: EmailStr = Field(unique=True, index=True, max_length=255)
    role: str = Field(index=True)
    username: str | None = Field(default=None, max_length=255)

# Database model, database table inferred from class name
class User(UserBase, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True) # auto-generate
    hashed_password: str
    created_at: datetime = Field(default_factory=datetime.now, nullable=False, index=True) # auto-generate
    # items: list["Item"] = Relationship(back_populates="owner", cascade_delete=True)


# Shared properties
# class ItemBase(SQLModel):
#     title: str = Field(min_length=1, max_length=255)
#     description: str | None = Field(default=None, max_length=255)

# # Database model, database table inferred from class name
# class Item(ItemBase, table=True):
#     id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
#     owner_id: uuid.UUID = Field(
#         foreign_key="user.id", nullable=False, ondelete="CASCADE"
#     )
#     owner: User | None = Relationship(back_populates="items")

# Properties to receive from API on user creation
class UserCreate(UserBase):
    """
    Attributes:
    - email
    - role
    - password (plain text)
    """
    password: str = Field(min_length=8, max_length=40)

class UserRegister(SQLModel):
    email: EmailStr = Field(max_length=255)
    password: str = Field(min_length=8, max_length=40)
    role: str = Field(default="client")
    username: str | None = Field(default=None, max_length=255)


# Properties to receive from API on user update, all are optional
class UserUpdate(UserBase):
    email: EmailStr | None = Field(default=None, max_length=255)  # type: ignore
    password: str | None = Field(default=None, min_length=8, max_length=40)


class UserUpdateMe(SQLModel):
    email: EmailStr | None = Field(default=None, max_length=255)
    username: str | None = Field(default=None, max_length=255)


class UpdatePassword(SQLModel):
    current_password: str = Field(min_length=8, max_length=40)
    new_password: str = Field(min_length=8, max_length=40)


# Properties to send to API, id is always required
class UserPublic(UserBase):
    id: uuid.UUID
    username: str
    email: EmailStr
    role: str

class UsersPublic(SQLModel):
    data: list[UserPublic]
    count: int


### Uploads
# Shared properties
class UploadBase(SQLModel):
    filename: str = Field(min_length=1, max_length=255)
    author: str = Field(min_length=1, max_length=255)
    language: str = Field(min_length=1, max_length=5)


## Incoming API Schemas
# Properties to receive on upload creation from Frontend
class UploadCreate(UploadBase):
    pass

# Properties to recieve on upload update
class UploadUpdate(UploadBase):
    pass


## Database model stored in DB
# TODO: adjust
class Upload(UploadBase, table=True):
    """
    fields:
        - id: uuid.UUID
        - filename: str
        - author: str
        - language: str
        - date: datetime
        - filepath: Optional[str]
        - size_mb: Optional[float]
    """
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    date: datetime = Field(default_factory=datetime.now) # date uploaded
    filepath: Optional[str] = Field(default=None)
    size_mb: Optional[float] = Field(default=None)

## Returning API Schemas
# Properties to return via API, id is always required
class UploadPublic(UploadBase):
    id: uuid.UUID
    filepath: Optional[str] = None
    size_mb: Optional[float] = None
    date: Optional[datetime] = None

class UploadsPublic(SQLModel):
    data: list[UploadPublic]
    count: int