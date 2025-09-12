"""
registry.py
-----------
Registry for embedding providers.
- Open/Closed Principle: add a new builder via @register("key") without editing existing code.
"""

from typing import Callable, Dict
from .protocol import EmbeddingClient

# Maps provider key (e.g., "hf", "http", "openai") -> builder function
_REGISTRY: Dict[str, Callable[..., EmbeddingClient]] = {}


def register(provider_key: str):
    """
    Decorator to register an embedding provider builder under a string key. i.e. @register(<key>)

    Example
    -------
    @register("hf")
    def build_hf(model_name: str, normalize: bool = True, device: str = "cpu") -> EmbeddingClient:
        ...
    """
    def _decorator(builder: Callable[..., EmbeddingClient]):
        _REGISTRY[provider_key] = builder
        return builder
    return _decorator


def get_builder(provider_key: str) -> Callable[..., EmbeddingClient]:
    """
    Lookup a builder by provider key. i.e. get_builder(<key>)

    Raises
    ------
    KeyError if provider key is unknown.
    """
    try:
        return _REGISTRY[provider_key]
    except KeyError as e:
        raise KeyError(
            f"Unknown embeddings provider '{provider_key}'. "
            f"Registered providers: {list(_REGISTRY.keys())}"
        ) from e
