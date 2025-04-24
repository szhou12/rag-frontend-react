import uuid
from datetime import datetime
from typing import Optional, List
from pydantic import EmailStr
from sqlmodel import SQLModel, Field, Relationship

from app.models.upload import UploadBase

## Upload CRUD Pydantic Schemas

##############
# API -----> #
##############

# Properties to receive on AddFile
class UploadCreate(UploadBase):
    pass

# Properties to recieve on EditFile
class UploadUpdate(UploadBase):
    filename: str | None = Field(default=None, max_length=255)
    author: str | None = Field(default=None, max_length=255)
    language: str | None = Field(default=None, max_length=5)




##############
# API <----- #
##############
# Properties to return via API, id is always required
class UploadPublic(UploadBase):
    id: uuid.UUID
    filepath: Optional[str] = None
    size_mb: Optional[float] = None
    date: Optional[datetime] = None

class UploadsPublic(SQLModel):
    data: list[UploadPublic]
    count: int