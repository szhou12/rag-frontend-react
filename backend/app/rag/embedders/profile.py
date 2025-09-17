from dataclasses import dataclass
from typing import Mapping, Optional, Any, Tuple

@dataclass(frozen=True)
class EmbedProfile:
    key: str # identifier. e.g. "hf-bge-en"
    provider: str # embedding model provider annotated in registry decorator. e.g. "hf"
    language: Optional[str] = None # embedding language
    params: Mapping[str, Any] = {}

    def params_items(self) -> Tuple[Tuple[str, Any], ...]:
        return tuple(sorted(self.params.items()))