import uuid
from pydantic import EmailStr
from sqlmodel import SQLModel, Field

from app.models.user import UserBase

## User CRUD Pydantic Schemas

##############
# API -----> #
##############
# Properties to receive from API on AddUser
class UserRegister(SQLModel):
    """
    UserRegister designed for frontend input validation
    Takes in values from frontend registration form
    i.e., Client inputs email, plain password, username at endpoint /register; role is set to "client" by default.
    """
    email: EmailStr = Field(max_length=255)
    password: str = Field(min_length=8, max_length=40)
    role: str = Field(default="client")
    username: str | None = Field(default=None, max_length=255)


class UserCreate(UserBase):
    """
    UserRegister designed for internal user creation logic
    Convert UserRegister to UserCreate for internal processing

    Attributes:
    - email (from UserBase)
    - role (from UserBase)
    - username (from UserBase)
    - password (plain text)

    Note: all fields are required to provide from frontend
    """
    password: str = Field(min_length=8, max_length=40)


# Properties to receive from API on EditUser, all are optional
class UserUpdate(UserBase):
    # Redefine (email, password, role, username) to make them optional on update
    # optional on update = frontend doesn't have to include that field
    email: EmailStr | None = Field(default=None, max_length=255)
    password: str | None = Field(default=None, min_length=8, max_length=40)
    username: str | None = Field(default=None, max_length=255)
    role: str | None = Field(default=None)



class UserUpdateMe(SQLModel):
    email: EmailStr | None = Field(default=None, max_length=255)
    username: str | None = Field(default=None, max_length=255)




##############
# API <----- #
##############
# Properties to return to API, id is always required
class UserPublic(UserBase):
    id: uuid.UUID

class UsersPublic(SQLModel):
    data: list[UserPublic]
    count: int