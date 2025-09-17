"""
registry.py
-----------
Registry for embedding providers.
- Open/Closed Principle: add a new builder via @register("key") without editing existing code.
"""

from typing import Callable, Dict, Any
from .protocol import EmbeddingClient
from .profile import EmbedProfile

# Maps provider key (e.g., "hf", "http", "openai") -> builder function
# Callable[..., EmbeddingClient] = a function that takes any number of arguments and returns an EmbeddingClient object
_BUILDERS: Dict[str, Callable[..., EmbeddingClient]] = {}
# Callable[[Any, EmbedProfile], Dict[str, Any]] = a function that takes 2 args (any type, EmbedProfile object) and returns a dict with string keys and any values
_ADAPTERS: Dict[str, Callable[[Any, EmbedProfile], Dict[str, Any]]] = {}

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
        _BUILDERS[provider_key] = builder
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
        return _BUILDERS[provider_key]
    except KeyError as e:
        raise KeyError(
            f"Unknown embeddings provider '{provider_key}'. "
            f"Registered providers: {list(_BUILDERS.keys())}"
        ) from e

def register_settings_adapter(provider_key: str):
    def _decorator(adapter: Callable[[Any, EmbedProfile], Dict[str, Any]]):
        _ADAPTERS[provider_key] = adapter
        return adapter
    return _decorator

def get_adapter(provider_key: str) -> Callable[[Any, EmbedProfile], Dict[str, Any]]:
    if provider_key not in _ADAPTERS:
        raise KeyError(f"No settings adapter for provider '{provider_key}'. Registered: {list(_ADAPTERS)}")
    return _ADAPTERS[provider_key]

