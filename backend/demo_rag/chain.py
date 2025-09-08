from typing import Dict, Any
from langchain.chains.history_aware_retriever import create_history_aware_retriever
from langchain.chains.retrieval import create_retrieval_chain
from langchain.chains.combine_documents import create_stuff_documents_chain
from langchain_core.runnables import Runnable
from langchain_core.documents import Document

from .embeddings import build_embedder_en, build_embedder_zh
from .vectorstore import build_vectorstores, build_langchain_retriever
from .retrievers import BilingualRetriever
from .llm import build_llm
from .prompts import history_aware_prompt, response_prompt, document_prompt

def build_answer_chain() -> Runnable:
    """
    Returns a Runnable that expects:
        {"input": str, "chat_history": list[BaseMessage] }
    And outputs:
        {"answer": str, "context": list[Document]}
    Usage:
        chain = build_answer_chain()
        out = chain.invoke({"input": "question", "chat_history": []})
        print(out["answer"])
    """
    # Step 1: Embeddings -> Vector stores -> Retrievers
    emb_en = build_embedder_en()
    emb_zh = build_embedder_zh()
    vstores = build_vectorstores(emb_en, emb_zh)
    en_retriever = build_langchain_retriever(vstores["en"])
    zh_retriever = build_langchain_retriever(vstores["zh"])

    bilingual_retriever = BilingualRetriever(
        english_retriever=en_retriever, 
        chinese_retriever=zh_retriever)

    # LLM (Bedrock Claude)
    llm = build_llm()

    # Step 2: Make retriever history-aware (query rewriting)
    # history_aware_ret = Runnable[Any, list[Document]].
    history_aware_ret = create_history_aware_retriever(
        llm=llm,
        retriever=bilingual_retriever,
        prompt=history_aware_prompt
    )

    # Step 3: Response chain (stuff-combine)
    stuff_chain = create_stuff_documents_chain(
        llm=llm,
        prompt=response_prompt,
        document_prompt=document_prompt
    )

    rag_chain = create_retrieval_chain(history_aware_ret, stuff_chain)

    # Keep only {"answer": ...} while preserving context if you also want to inspect it
    # For your current step, we'll return both.
    return rag_chain

# Convenience: answer-only view
def build_answer_only_chain() -> Runnable:
    return build_answer_chain().pick("answer")
