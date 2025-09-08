# Response Pipeline Workflow

1. Embedding models -> Chroma DB conn -> Chroma Retriever
2. LLM API
3. Response Chain

# Files inspection
`config.py` --> `embeddings.py` --> `vectorstore.py` --> `retrievers.py` --> `llm.py` --> `prompts.py` --> `chain.py`

# What happens in `chain.py`

## Two-Step RAG Pipeline

### Step 1: History-Aware Retrieval → What happens in `create_history_aware_retriever()`
- **Input**: `{"input": "current user question", "chat_history": [previous messages]}`
- **Query Reformulation**: LLM uses `HISTORY_AWARE_SYSTEM` prompt to reformulate the current query based on chat history
- **Document Retrieval**: Reformulated query → `BilingualRetriever` → `List[Document]`
- **Example**: "What about solar panels?" + [Previous talk about renewable energy efficiency] → "solar panel efficiency renewable energy" → [relevant docs]

### Step 2: Document Stuffing + Response Generation → What happens in `create_stuff_documents_chain()`
- **Input**: `List[Document]` from Step 1
- **Document Stuffing**: All documents are "stuffed" into `{context}` variable using `response_prompt`
- **Response Generation**: LLM generates final answer using `RESPONSE_SYSTEM` template
- **Output**: `{"answer": "...", "context": [documents...]}`

## Complete Flow
```
User Input + Chat History 
    ↓
[history_aware_retriever] Query Reformulation + Retrieval
    ↓
[stuff_documents_chain] Context Stuffing + Response Generation
    ↓
Final Answer with Sources
```