"""
protocol.py
------------
Defines the abstract interface (protocol) an embedder relies on.
Callers should import and type to `EmbeddingClient`, not to a concrete class.

Design follows LangChain's Embeddings Interface:
https://python.langchain.com/api_reference/core/embeddings/langchain_core.embeddings.embeddings.Embeddings.html#

This design implies two things:
1. Any Embedding class from LangChain automatically comforms to this protocol.
2. Any Embedding class NOT from LangChain should have its immplementation logic of embed_query, embed_documents, aembed_query, aembed_documents.
"""

from typing import Protocol, List, runtime_checkable

@runtime_checkable
class EmbeddingClient(Protocol):
    """
    Minimal interface for an embedding client - the blueprint that a concrete embedding class follows to implement.

    Notes
    -----
    - Keep this small and implementation-agnostic so you can swap providers.
    - Return plain Python lists to stay compatible with LangChain & vector DB clients.
    """

    def embed_query(self, text: str) -> List[float]:
        """
        Embed a single query string (used by response pipeline before retrieval).

        Parameters
        ----------
        text : str
            The text to embed.

        Returns
        -------
        List[float]
            The embedding vector.

        Example
        -------
        emb_en = EmbedderProvider.get("en")
        vec = obj.embed_query("where is the policy doc?")
        """
        ...

    def embed_documents(self, texts: List[str]) -> List[List[float]]:
        """
        Embed multiple documents/chunks (used by ingestion pipeline).

        Parameters
        ----------
        texts : List[str]
            List of texts to embed.

        Returns
        -------
        List[List[float]]
            A list of embedding vectors (one per input text).

        Example
        -------
        emb_zh = EmbedderProvider.get("zh")
        vectors = emb_zh.embed_documents(["第一段文本", "第二段文本"])
        """
        ...

    async def aembed_query(self, text: str) -> List[float]: 
        """
        Async embed_query
        """
        ...

    async def aembed_documents(self, texts: List[str]) -> List[List[float]]:
        """
        Async embed_documents
        """
        ...
