import chromadb
from app.core.config import settings

client = chromadb.HttpClient(host=settings.chroma_host, port=settings.chroma_port)

print(f"Chroma DB connected to {settings.chroma_host}:{settings.chroma_port}")

collects = client.list_collections()
print(collects)

if collects:
    col = client.get_collection("docs_en")
    print("Count:", col.count())

    data = col.get(limit=3)
    print(data["documents"])
    print(data["metadatas"])