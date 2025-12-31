import uuid
from datetime import datetime
from typing import Optional, List
from pydantic import EmailStr
from sqlmodel import SQLModel, Field, Relationship
from fastapi import UploadFile, File

from app.models.upload import UploadBase

## Upload CRUD Pydantic Schemas

##############
# API -----> #
##############

# Properties to receive on AddFile
class UploadCreate(UploadBase):
    file: UploadFile = File(...) # actual file content sent from frontend

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
    s3_key: str  # full S3 object key
    size: float
    date_added: datetime
    source_filename: str
    file_type: str
    status: int
    legacy_id: str | None = None


class UploadsPublic(SQLModel):
    data: list[UploadPublic] = []
    count: int
    success: bool = True
    error: Optional[str] = None
