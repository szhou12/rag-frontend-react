from langchain_huggingface.embeddings import HuggingFaceEmbeddings
# from .config import settings
from app.core.config import settings


def build_embedder_en():
    return HuggingFaceEmbeddings(
        model_name=settings.embed_en_model,
        model_kwargs={"device": settings.embed_device},
        encode_kwargs={"normalize_embeddings": settings.embed_normalize},
    )

def build_embedder_zh():
    return HuggingFaceEmbeddings(
        model_name=settings.embed_zh_model,
        model_kwargs={"device": settings.embed_device},
        encode_kwargs={"normalize_embeddings": settings.embed_normalize},
    )
