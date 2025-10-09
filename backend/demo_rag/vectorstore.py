import chromadb
from langchain_chroma import Chroma
# from .config import settings
from app.core.config import settings

def build_chroma_client():
    # In production, front Chroma with a private network / SG and health checks
    return chromadb.HttpClient(host=settings.chroma_host, port=settings.chroma_port)

def build_vectorstores(embed_en, embed_zh):
    client = build_chroma_client()
    vs_en = Chroma(
        client=client,
        collection_name=settings.chroma_collection_en,
        embedding_function=embed_en,
    )
    vs_zh = Chroma(
        client=client,
        collection_name=settings.chroma_collection_zh,
        embedding_function=embed_zh,
    )
    return {"en": vs_en, "zh": vs_zh}

def build_langchain_retriever(vs, *, search_type=None, k=None, fetch_k=None, lambda_mult=None):
    search_type = search_type or settings.search_type
    search_kwargs = {
        "k": k or settings.search_k,
        "fetch_k": fetch_k or settings.search_fetch_k,
        "lambda_mult": lambda_mult if lambda_mult is not None else settings.search_lambda_mult,
    }
    return vs.as_retriever(search_type=search_type, search_kwargs=search_kwargs)
