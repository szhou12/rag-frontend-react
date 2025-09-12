from typing import List
from threading import Lock

from .protocol import EmbeddingClient

class ThreadSafeWrapper(EmbeddingClient):
    """
    A conservative thread/async-safe wrapper around an EmbeddingClient.
    only one thread at a time is allowed to run .embed_* and .aembed_* methods if wrapped.

    - If the inner client only exposes sync methods (e.g., HuggingFaceEmbeddings),
      async methods are implemented by running the locked sync methods in a worker
      thread (so the event loop isn't blocked).
    - If the inner client also supports async methods, we prefer them and guard with
      an asyncio.Lock to prevent concurrent access to shared state.

    This wrapper serializes calls PER INSTANCE. If you need higher throughput without
    serialization, run embeddings as a separate service (TEI) or instantiate multiple
    clients and shard requests.
    """
    def __init__(self, inner: EmbeddingClient):
        self._inner = inner
        self._tlock = ThreadLock()
        self._alock = asyncio.Lock()

        # Detect whether inner has true async impls (not just inherited from a mixin)
        self._has_async_query = _is_coroutine_method(inner, "aembed_query")
        self._has_async_docs  = _is_coroutine_method(inner, "aembed_documents")

    # -------- sync API (locked) --------
    def embed_query(self, text: str) -> List[float]:
        with self._tlock:
            return self._inner.embed_query(text)

    def embed_documents(self, texts: List[str]) -> List[List[float]]:
        with self._tlock:
            return self._inner.embed_documents(texts)

    # -------- async API (prefer true-async; else run sync in thread) --------
    async def aembed_query(self, text: str) -> List[float]:
        if self._has_async_query:
            async with self._alock:
                return await self._inner.aembed_query(text)
        # Fallback: call our locked sync method in a worker thread
        return await anyio.to_thread.run_sync(self.embed_query, text)

    async def aembed_documents(self, texts: List[str]) -> List[List[float]]:
        if self._has_async_docs:
            async with self._alock:
                return await self._inner.aembed_documents(texts)
        return await anyio.to_thread.run_sync(self.embed_documents, texts)

def _is_coroutine_method(obj: object, name: str) -> bool:
    """Best-effort check: does `obj.name` look like a real coroutine function?"""
    func = getattr(obj, name, None)
    return callable(func) and inspect.iscoroutinefunction(func)
