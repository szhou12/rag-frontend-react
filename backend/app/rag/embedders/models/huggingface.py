from __future__ import annotations
from typing import Dict, Any, Optional, List

from langchain_huggingface.embeddings import HuggingFaceEmbeddings
from ..protocol import EmbeddingClient
from ..registry import register
from ..util import ThreadSafeWrapper

@register("hf")
def build_huggingface_embeddings(
    model_name: str,
    *,
    model_kwargs: Optional[Dict[str, Any]] = None,
    encode_kwargs: Optional[Dict[str, Any]] = None,
    threadsafe: bool = False,
) -> EmbeddingClient:
    """
    Build a Hugging Face embeddings client (SentenceTransformers under the hood).

    Parameters
    ----------
    model_name : str
        HF model id, e.g. "BAAI/bge-small-en-v1.5".
    model_kwargs : dict, optional
        Passed to HuggingFaceEmbeddings(model_kwargs=...). Common keys:
        - "device": "cpu" | "cuda" | "mps"
        - "trust_remote_code": bool
    encode_kwargs : dict, optional
        Passed to HuggingFaceEmbeddings(encode_kwargs=...). Common keys:
        - "normalize_embeddings": bool  (True for cosine similarity)
        - "batch_size": int
    threadsafe : bool, default True
        If True, wraps the client with ThreadSafeWrapper to serialize embed_* calls.

    Returns
    -------
    EmbeddingClient
        Object implementing embed_query/embed_documents (+ async counterparts if wrapper provides them).
    """
    # Provide gentle defaults; user overrides take precedence.
    # Use dict union (3.9+): {**defaults, **user} for clarity across versions.
    _default_model_kwargs = {"device": "cpu"}
    _default_encode_kwargs = {"normalize_embeddings": True}

    model_kwargs = {**_default_model_kwargs, **(model_kwargs or {})}
    encode_kwargs = {**_default_encode_kwargs, **(encode_kwargs or {})}

    client = HuggingFaceEmbeddings(
        model_name=model_name,
        model_kwargs=model_kwargs,
        encode_kwargs=encode_kwargs,
    )
    return ThreadSafeWrapper(client) if threadsafe else client

# ---------------------- FUTURE EXTENSIONS (examples) ----------------------
## Note:
## 1. add each in a new py file
## 2. make sure to implement a concrete Embedding class following protocol if it doesn't directly import from LangChain
# @register("http")
# def build_http_embeddings(endpoint: str, *, timeout_s: float = 30.0) -> EmbeddingClient:
#     """Build a simple HTTP client against a TEI-like service."""
#     ...

# @register("openai")
# def build_openai_embeddings(model: str, *, api_key: str) -> EmbeddingClient:
#     """Build an OpenAI embeddings client."""
#     ...

# @register("bedrock")
# def build_bedrock_embeddings(model: str, *, region: str, profile: str | None = None) -> EmbeddingClient:
#     """Build an AWS Bedrock embeddings client."""
#     ...