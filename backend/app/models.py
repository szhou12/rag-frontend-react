import uuid

from pydantic import EmailStr
from sqlmodel import Field, Relationship, SQLModel

class User(SQLModel, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    email: EmailStr = Field(unique=True)
    password: str

