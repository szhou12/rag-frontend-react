import os
import boto3
import tempfile
import concurrent.futures
from typing import Callable, List, Dict
from langchain_core.documents import Document

# from .config import 
from app.core.config import settings

# Step 2: load by s3_key

# Create S3 client
s3_client = boto3.client(
    "s3",
    region_name=settings.aws_region,
    aws_access_key_id=settings.aws_access_key_id,
    aws_secret_access_key=settings.aws_secret_access_key,
)

def download_s3_to_temp(bucket: str, file: dict, s3) -> str:
    """Download S3 file to temporary location"""
    with tempfile.NamedTemporaryFile(suffix=file['file_type'] or "", delete=False) as tmp:
        s3.download_fileobj(bucket, file['s3_key'], tmp)
        return tmp.name

def select_metadata(full_metadata: dict):
    """Select relevant metadata for documents"""
    return {
        'source_id': full_metadata['id'],
        'source': full_metadata['s3_key'],
        'title': full_metadata.get("filename", ""),
        'author': full_metadata.get("author", ""),
        'language': full_metadata.get('language', ""),
        'file_type': full_metadata.get('file_type', ""),
    }

def docling_loader(filepath, metadata):
    """Load using Docling"""
    from langchain_docling import DoclingLoader
    loader = DoclingLoader(file_path=filepath)
    docs = loader.load()
    for d in docs:
        d.metadata = select_metadata(metadata)
    return docs

def markitdown_loader(filepath, metadata):
    """Load using MarkItDown"""
    from markitdown import MarkItDown
    converter = MarkItDown()
    markdown_content = converter.convert(filepath).text_content
    document = Document(page_content=markdown_content, metadata=select_metadata(metadata))
    return [document]

def pymupdf_loader(filepath, metadata):
    """Load using PyMuPDF"""
    from langchain_community.document_loaders import PyMuPDFLoader
    loader = PyMuPDFLoader(filepath)
    docs = loader.load()
    for d in docs:
        d.metadata = select_metadata(metadata)
    return docs

def run_with_timeout(func: Callable, timeout: int, *args, **kwargs):
    """Run function with timeout"""
    with concurrent.futures.ThreadPoolExecutor(max_workers=1) as executor:
        future = executor.submit(func, *args, **kwargs)
        try:
            return future.result(timeout=timeout)
        except concurrent.futures.TimeoutError:
            raise TimeoutError(f"Function {func.__name__} timed out after {timeout} seconds")

def load_with_fallback(filepath: str, metadata: Dict, timeout_s: int) -> List[Document]:
    """Load document with fallback loaders"""
    loaders: List[Callable[[str, Dict], List[Document]]] = [markitdown_loader, docling_loader]

    # Only include PyMuPDF for PDFs
    if metadata.get("file_type", "").lower() == "pdf":
        loaders = [pymupdf_loader] + loaders

    last_error = None
    for loader in loaders:
        try:
            docs = run_with_timeout(loader, timeout_s, filepath, metadata)
            print(f"[OK] Loaded with {loader.__name__} in < {timeout_s}s → {len(docs)} docs")
            return docs
        except Exception as e:
            print(f"[FAIL] {loader.__name__} → {e}")
            last_error = e
    raise RuntimeError(f"All loaders failed for {filepath}") from last_error


def load_document(file_metadata: Dict) -> List[Document]:
    local_path = download_s3_to_temp(settings.s3_bucket_name, file_metadata, s3_client)
    print(f"[OK] saved {file_metadata['s3_key']} -> {local_path}")
    try:
        docs = load_with_fallback(local_path, file_metadata, timeout_s=300)
        return docs
    except Exception as e:
        raise RuntimeError(f"All loaders failed for {file_metadata['s3_key']}")
    finally:
        # Clean up temp file
        if local_path and os.path.exists(local_path):
            os.remove(local_path)


def load_documents(file_metadata: List[Dict]) -> List[Document]:
    """Download and load all documents"""
    loaded_files = []
    errors = []

    for f in file_metadata:
        local_path = None
        try:
            local_path = download_s3_to_temp(settings.s3_bucket_name, f, s3_client)
            print(f"[OK] saved {f['s3_key']} -> {local_path}")

            docs = load_with_fallback(local_path, f, timeout_s=300)
            loaded_files.extend(docs)

        except Exception as e:
            errors.append(f)
            print(f"[FAIL] {f['s3_key']}: {e}")

        finally:
            # Clean up temp file
            if local_path and os.path.exists(local_path):
                os.remove(local_path)

    print(f"Successfully loaded {len(loaded_files)} documents, {len(errors)} errors")
    return loaded_files

