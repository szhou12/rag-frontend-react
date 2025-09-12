"""
provider.py
-----------
Thread-safe, per-key singleton provider for embedders.

- One process-wide instance per "key" (e.g., "en", "zh", "code", "legal").
- Lazily constructs an embedder via the registry builder.
- Lets you (re)configure the embedder for a key without changing call-sites.

Typical usage
-------------
At startup:
    EmbedderProvider.configure("en", provider="hf", model="BAAI/bge-small-en-v1.5", normalize=True, device="cpu")
    EmbedderProvider.configure("zh", provider="hf", model="BAAI/bge-small-zh-v1.5", normalize=True, device="cpu")

Later in code (ingest or response):
    emb = EmbedderProvider.get("en")
    vec = emb.embed_query("hello world")
"""

from __future__ import annotations
from typing import Dict, Optional, Any
from threading import Lock

from .protocol import EmbeddingClient
from .registry import get_builder


class EmbedderProvider:
    """
    Per-key singleton manager for embedding clients.

    Design
    ------
    - Maintains a map: key -> (instance, config)
    - `configure(key, **kwargs)` builds or rebuilds the singleton for that key.
    - `get(key)` returns the existing instance; if absent, raises or lazy-builds
      using last known config (config must exist for lazy build to work).

    Notes
    -----
    - "key" is arbitrary: use "en", "zh", or any logical partition (e.g., "tenantA").
    - Instances are per-process singletons. Multiple app processes will each
      hold their own instance; use an external embedding service if you want
      true global sharing across processes/machines.
    """

    _lock = Lock()
    _instances: Dict[str, EmbeddingClient] = {}
    _configs: Dict[str, Dict[str, Any]] = {}

    @classmethod
    def configure(cls, key: str, *, provider: str, **builder_kwargs) -> None:
        """
        Configure (and construct) the singleton for a key.

        Parameters
        ----------
        key : str
            Logical key for this embedder (e.g., "en").
        provider : str
            Registry provider key (e.g., "hf", "http", "openai").
        builder_kwargs : dict
            Keyword args forwarded to the builder for this provider, e.g.:
            - HF: model=<str>, normalize=<bool>, device=<str>, threadsafe=<bool>
            - HTTP: endpoint=<str>, timeout_s=<float>
            - OpenAI: model=<str>, api_key=<str>
        """
        with cls._lock:
            builder = get_builder(provider)
            instance = builder(**builder_kwargs)
            cls._instances[key] = instance
            cls._configs[key] = {"provider": provider, **builder_kwargs}

    @classmethod
    def get(cls, key: str) -> EmbeddingClient:
        """
        Get the singleton instance for a key.

        Raises
        ------
        KeyError if the key has not been configured.
        """
        with cls._lock:
            if key not in cls._instances:
                # If you prefer lazy defaulting, you could attempt to construct
                # from cls._configs[key]; here we keep it strict to surface misconfig early.
                raise KeyError(
                    f"Embedder key '{key}' is not configured. "
                    f"Call EmbedderProvider.configure('{key}', ...) at startup."
                )
            return cls._instances[key]

    @classmethod
    def reconfigure(cls, key: str, *, provider: Optional[str] = None, **builder_kwargs) -> None:
        """
        Rebuild the singleton for a key with updated settings.
        Useful when you rotate models or move from HF to HTTP without changing callers.
        """
        with cls._lock:
            config = cls._configs.get(key, {}).copy()
            if provider is not None:
                config["provider"] = provider
            config.update(builder_kwargs)
            builder = get_builder(config["provider"])
            instance = builder(**{k: v for k, v in config.items() if k != "provider"})
            cls._instances[key] = instance
            cls._configs[key] = config

    @classmethod
    def describe(cls, key: str) -> Dict[str, Any]:
        """
        Return the stored configuration for a key (useful for logging/telemetry).
        """
        with cls._lock:
            if key not in cls._configs:
                raise KeyError(f"Embedder key '{key}' is not configured.")
            return dict(cls._configs[key])

    @classmethod
    def reset(cls, key: Optional[str] = None) -> None:
        """
        Reset one or all singleton instances. Intended for tests or hot swaps.

        Parameters
        ----------
        key : Optional[str]
            If provided, reset only this key; otherwise reset everything.
        """
        with cls._lock:
            if key is None:
                cls._instances.clear()
                cls._configs.clear()
            else:
                cls._instances.pop(key, None)
                cls._configs.pop(key, None)
