# backend/app/schemas/chat.py
import uuid
from datetime import datetime
from typing import List, Optional, Literal
from pydantic import Field, validator
from sqlmodel import SQLModel

##############
# API -----> #
##############

class MessageCreate(SQLModel):
    """Schema for creating a new message in a conversation"""
    role: Literal["user", "assistant", "system"] = Field(description="Message sender role")
    content: str = Field(min_length=1, max_length=10000, description="Message content")
    sources: List[str] = Field(default=[], description="Source documents referenced")

class ConversationCreate(SQLModel):
    """Schema for creating a new conversation with initial message"""
    initial_message: str = Field(min_length=1, max_length=10000, description="First message content")
    title: Optional[str] = Field(default=None, max_length=255, description="Custom conversation title")
    
    @validator('title', pre=True, always=True)
    def generate_title_if_empty(cls, v, values):
        if not v and 'initial_message' in values:
            # Auto-generate title from first 50 chars of initial message
            initial = values['initial_message']
            return initial[:50] + ('...' if len(initial) > 50 else '')
        return v

class ConversationUpdate(SQLModel):
    """Schema for updating conversation metadata"""
    title: Optional[str] = Field(default=None, max_length=255)
    status: Optional[Literal["active", "archived", "deleted"]] = Field(default=None)

class MessageAdd(SQLModel):
    """Schema for adding a message to existing conversation"""
    conversation_id: str = Field(description="Target conversation ID")
    role: Literal["user", "assistant", "system"] = Field(description="Message sender role")
    content: str = Field(min_length=1, max_length=10000, description="Message content")
    sources: List[str] = Field(default=[], description="Source documents referenced")

class ConversationQuery(SQLModel):
    """Schema for querying conversations with filters"""
    status: Optional[Literal["active", "archived", "deleted"]] = Field(default=None)
    limit: int = Field(default=20, ge=1, le=100, description="Number of conversations to return")
    offset: int = Field(default=0, ge=0, description="Number of conversations to skip")
    include_messages: bool = Field(default=False, description="Include messages in response")

class MessageQuery(SQLModel):
    """Schema for querying messages within a conversation"""
    conversation_id: str = Field(description="Conversation ID to get messages from")
    limit: int = Field(default=50, ge=1, le=200, description="Number of messages to return")
    offset: int = Field(default=0, ge=0, description="Number of messages to skip")
    before_timestamp: Optional[datetime] = Field(default=None, description="Get messages before this timestamp")

##############
# API <----- #
##############

class MessagePublic(SQLModel):
    """Schema for returning message data to frontend"""
    id: str = Field(description="Message unique identifier")
    role: Literal["user", "assistant", "system"]
    content: str
    timestamp: datetime
    sources: List[str] = Field(default=[])

class ConversationPublic(SQLModel):
    """Schema for returning conversation metadata to frontend"""
    id: str = Field(description="Conversation unique identifier") 
    user_id: str = Field(description="Owner user ID")
    title: str
    status: Literal["active", "archived", "deleted"]
    message_count: int = Field(description="Total number of messages")
    created_at: datetime
    updated_at: datetime
    last_message_at: Optional[datetime] = Field(default=None)

class ConversationWithMessages(ConversationPublic):
    """Schema for returning full conversation with messages"""
    messages: List[MessagePublic] = Field(default=[])

class ConversationsPublic(SQLModel):
    """Schema for returning paginated conversations list"""
    data: List[ConversationPublic]
    total: int = Field(description="Total number of conversations")
    limit: int
    offset: int
    has_more: bool = Field(description="Whether there are more conversations to load")

class ChatResponse(SQLModel):
    """Schema for AI chat response"""
    conversation_id: str
    message: MessagePublic
    processing_time_ms: Optional[int] = Field(default=None)
    model_used: Optional[str] = Field(default=None)

# Specialized schemas for different use cases
class ConversationPreview(SQLModel):
    """Lightweight schema for conversation previews in sidebar"""
    id: str
    title: str
    last_message_preview: str = Field(max_length=100, description="Truncated last message")
    updated_at: datetime
    message_count: int
    status: Literal["active", "archived", "deleted"]

class MessageBatch(SQLModel):
    """Schema for bulk message operations"""
    conversation_id: str
    messages: List[MessageCreate] = Field(min_items=1, max_items=10)