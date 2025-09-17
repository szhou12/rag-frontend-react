from __future__ import annotations
from typing import Dict, Any, Optional, List

from langchain_huggingface.embeddings import HuggingFaceEmbeddings

from ..protocol import EmbeddingClient
from ..profile import EmbedProfile
from ..registry import register
from ..util import ThreadSafeWrapper

@register("hf")
def build_huggingface_embeddings(
    *
    model_name: str,
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
    threadsafe : bool, default False
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

@register_settings_adapter("hf")
def huggingface_adapter(settings, profile: EmbedProfile) -> Dict[str, Any]:
    """
    Merge profile.params with sensible defaults (from settings when present).
    Anything in profile.params takes precedence.
    """
    p = dict(profile.params)
    # Defaults if missing
    p.setdefault("model_kwargs", {}).setdefault("device", getattr(settings, "embed_device", "cpu"))
    p.setdefault("encode_kwargs", {}).setdefault("normalize_embeddings", getattr(settings, "embed_normalize", True))
    p.setdefault("threadsafe", getattr(settings, "embed_threadsafe_wrapper", False))

    if "model_name" not in p:
        raise ValueError("model_name is required for provider='hf'.")
    return p

# ---------------------- FUTURE EXTENSIONS (examples) ----------------------
## Note:
## 1. add new extension in a new py file e.g. models/openai.py
## 2. make sure to additionally implement a concrete Embedding class following protocol if it doesn't directly import from LangChain
## Example:
# @register("openai")
# def build_openai(*, model: str, api_key: str) -> EmbeddingClient:
#     return OpenAIEmbeddings(model=model, api_key=api_key)

# @register_settings_adapter("openai")
# def openai_adapter(settings, profile: EmbedProfile) -> Dict[str, Any]:
#     p = dict(profile.params)
#     p.setdefault("model", "text-embedding-3-large")
#     # Prefer pulling secrets from settings, not JSON
#     p.setdefault("api_key", getattr(settings, "openai_api_key", None))
#     if not p["api_key"]:
#         raise ValueError("OPENAI_API_KEY is required for provider='openai'.")
#     return p
