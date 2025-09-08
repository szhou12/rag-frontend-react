from typing import List, Dict, Any
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from langchain_core.messages import BaseMessage, HumanMessage, AIMessage

# Import your RAG chain
import sys
import os
sys.path.append(os.path.join(os.path.dirname(__file__), '../demo_rag'))
from demo_rag.chain import build_answer_chain

router = APIRouter()

# Initialize the RAG chain (singleton pattern)
rag_chain = None

def get_rag_chain():
    global rag_chain
    if rag_chain is None:
        rag_chain = build_answer_chain()
    return rag_chain

# Pydantic models for request/response
class ChatMessage(BaseModel):
    role: str = Field(..., description="Either 'human' or 'assistant'")
    content: str = Field(..., description="Message content")

class RAGQueryRequest(BaseModel):
    input: str = Field(..., description="User's current question")
    chat_history: List[ChatMessage] = Field(default=[], description="Previous conversation history")

class RAGQueryResponse(BaseModel):
    answer: str = Field(..., description="Generated answer")
    context: List[Dict[str, Any]] = Field(default=[], description="Retrieved document contexts")

def convert_chat_history(chat_history: List[ChatMessage]) -> List[BaseMessage]:
    """Convert Pydantic ChatMessage objects to LangChain BaseMessage objects"""
    langchain_messages = []
    for msg in chat_history:
        if msg.role.lower() == "human":
            langchain_messages.append(HumanMessage(content=msg.content))
        elif msg.role.lower() == "assistant":
            langchain_messages.append(AIMessage(content=msg.content))
        else:
            # Default to HumanMessage for unknown roles
            langchain_messages.append(HumanMessage(content=msg.content))
    return langchain_messages

@router.post("/answer", response_model=RAGQueryResponse)
async def get_rag_answer(query: RAGQueryRequest):
    """
    Generate RAG-based answer for user's query with chat history context.
    
    - **input**: Current user question
    - **chat_history**: Previous conversation messages for context
    """
    try:
        # Get the RAG chain
        chain = get_rag_chain()
        
        # Convert chat history to LangChain format
        langchain_history = convert_chat_history(query.chat_history)
        
        # Prepare input for the chain
        chain_input = {
            "input": query.input,
            "chat_history": langchain_history
        }
        
        # Invoke the RAG chain
        result = chain.invoke(chain_input)
        
        # Format the response
        response = RAGQueryResponse(
            answer=result["answer"],
            context=[
                {
                    "page_content": doc.page_content,
                    "metadata": doc.metadata
                }
                for doc in result.get("context", [])
            ]
        )
        
        return response
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error generating RAG response: {str(e)}"
        )

@router.get("/health")
async def rag_health_check():
    """Health check endpoint for RAG service"""
    try:
        chain = get_rag_chain()
        return {"status": "healthy", "rag_chain_loaded": chain is not None}
    except Exception as e:
        return {"status": "unhealthy", "error": str(e)}

# Simple test endpoint (no auth required)
@router.post("/test")
async def test_rag(query: str = "What is renewable energy?"):
    """Simple test endpoint for RAG functionality"""
    try:
        chain = get_rag_chain()
        result = chain.invoke({
            "input": query,
            "chat_history": []
        })
        return {"question": query, "answer": result["answer"]}
    except Exception as e:
        return {"error": str(e)}
