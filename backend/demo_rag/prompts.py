from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder, PromptTemplate

# 1) History-aware retriever prompt (query reformulation) aka. context_query
HISTORY_AWARE_SYSTEM = (
    "You are a retrieval assistant. Given the chat history and the latest user message, "
    "write a concise search query that would retrieve the most relevant passages. "
    "Prefer named entities, dates, and key phrases. Return ONLY the query."
)

history_aware_prompt = ChatPromptTemplate.from_messages([
    ("system", HISTORY_AWARE_SYSTEM),
    MessagesPlaceholder(variable_name="chat_history"),
    ("human", "{input}")
])

# 2) Response template (stuff-combine)
RESPONSE_SYSTEM = (
    "You are a precise assistant specialized in answering questions about energies (especially clean energies), their applications in various sectors, and their broader impacts."
    "Answer ONLY using the provided context. "
    "If the answer is not in the context, say you don't have enough information. "
    "Cite sources inline as [^n], and end with a 'Sources' list (title + author). "
    "Respond in the user's language."
)

response_prompt = ChatPromptTemplate.from_messages([
    ("system", RESPONSE_SYSTEM + "\n\nContext:\n{context}"),
    MessagesPlaceholder(variable_name="chat_history"),
    ("human", "{input}")
])

# 3) Per-document formatter
document_prompt = PromptTemplate.from_template(
    "Source: {title} by {author}\n{page_content}"
)
