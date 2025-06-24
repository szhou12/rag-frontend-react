# NOTE: chat data are stored in MongoDB, thus document structures designed here are different from the rest of files under /models that are designed for SQL tables
from datetime import datetime
from typing import List, Optional, Literal
from pydantic import BaseModel, Field
import uuid

class MessageDocument(BaseModel):
    """Structure for message embedded in conversation document"""
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    role: Literal["user", "assistant", "system"]
    content: str
    timestamp: datetime = Field(default_factory=datetime.now)
    sources: List[str] = Field(default=[])

class ConversationDocument(BaseModel):
    """Structure for conversation document in MongoDB"""
    _id: str = Field(default_factory=lambda: str(uuid.uuid4()), alias="id")
    userId: str
    title: str
    status: Literal["active", "archived", "deleted"] = "active"
    messageCount: int = 0
    createdAt: datetime = Field(default_factory=datetime.now)
    updatedAt: datetime = Field(default_factory=datetime.now)
    lastMessageAt: Optional[datetime] = None
    messages: List[MessageDocument] = Field(default=[])
    
    class Config:
        populate_by_name = True  # Allow both 'id' and '_id'