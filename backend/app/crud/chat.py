# In your CRUD operations (backend/app/crud/chat.py)
from app.models.chat import ConversationDocument, MessageDocument
from app.schemas.chat import ConversationCreate, ConversationWithMessages, MessagePublic

# Input Flow: Schema → Document
async def create_conversation(
        *,
        mongo_client: AsyncIOMotorClient, 
        user_id: str, 
        data: ConversationCreate  # ← API Schema validates input
) -> ConversationDocument:
    
    # Transform API schema to document structure
    conversation_doc = ConversationDocument(
        userId=user_id,
        title=data.title,  # From validated schema
        messages=[
            MessageDocument(
                role="user",
                content=data.initial_message,  # From validated schema
                sources=[]
            )
        ],
        messageCount=1
    )
    
    # Convert to dict for MongoDB storage
    doc_dict = conversation_doc.model_dump(by_alias=True)
    await mongo_client.db.conversations.insert_one(doc_dict)
    
    return conversation_doc

# Output Flow: Document → Schema
async def get_conversation(
        *,
        mongo_client: AsyncIOMotorClient, 
        conversation_id: str
) -> ConversationWithMessages:
    
    # Get raw document from MongoDB
    doc_dict = await mongo_client.db.conversations.find_one({"_id": conversation_id})
    
    # Parse into document structure
    conversation_doc = ConversationDocument(**doc_dict)
    
    # Transform document to API response schema
    return ConversationWithMessages(
        id=conversation_doc._id,
        user_id=conversation_doc.userId,
        title=conversation_doc.title,
        status=conversation_doc.status,
        message_count=conversation_doc.messageCount,
        created_at=conversation_doc.createdAt,
        updated_at=conversation_doc.updatedAt,
        last_message_at=conversation_doc.lastMessageAt,
        messages=[
            MessagePublic(
                id=msg.id,
                role=msg.role,
                content=msg.content,
                timestamp=msg.timestamp,
                sources=msg.sources
            ) for msg in conversation_doc.messages
        ]
    )