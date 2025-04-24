import uuid
from datetime import datetime
from typing import Optional, List
from pydantic import EmailStr
from sqlmodel import SQLModel, Field, Relationship

# Shared properties
class UploadBase(SQLModel):
    filename: str = Field(min_length=1, max_length=255)
    author: str = Field(min_length=1, max_length=255)
    language: str = Field(min_length=1, max_length=5)


# Database ORM model
class Upload(UploadBase, table=True):
    """
    Attributes:
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