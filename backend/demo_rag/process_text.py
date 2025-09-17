import re
import uuid
from collections import defaultdict
from typing import List, Dict
from langchain_core.documents import Document
from langchain_text_splitters import (
    RecursiveCharacterTextSplitter,
    MarkdownHeaderTextSplitter,
)

def clean_text(text: str) -> str:
    """Clean text content"""
    text = text.replace('\ufeff', '')  # remove BOM
    text = re.sub(r'\n{2,}', '\n\n', text)  # collapse 2+ newlines
    text = re.sub(r'[^\S\n]+', ' ', text)  # collapse spaces/tabs (keep \n)
    return text.strip()

def clean_page_content(docs: List[Document]) -> None:
    """Clean page content of all documents"""
    for d in docs:
        d.page_content = clean_text(d.page_content)

def split_and_tag_chunks_by_source(docs: List[Document]) -> List[Document]:
    """Split documents into chunks with proper tagging"""
    # Configure splitters
    headers_to_split_on = [("#", "header_1"), ("##", "header_2"), ("###", "header_3")]
    markdown_splitter = MarkdownHeaderTextSplitter(headers_to_split_on=headers_to_split_on)
    
    recursive_splitter = RecursiveCharacterTextSplitter(
        chunk_size=1200,
        chunk_overlap=160,
    )
    
    out: List[Document] = []
    counters: Dict[str, int] = defaultdict(int)  # source_id -> next chunk_idx

    for doc in docs:
        base_md = dict(doc.metadata or {})
        source_id = base_md.get("source_id")
        if not source_id:
            raise ValueError("Each Document.metadata must include 'source_id'.")

        # 1) markdown header split (adds header_* metadata)
        md_sections = markdown_splitter.split_text(doc.page_content)
        # merge original metadata into each section
        for sec in (md_sections or [Document(page_content=doc.page_content, metadata={})]):
            sec.metadata = {**base_md, **(sec.metadata or {})}

        # 2) recursive chunking on sections
        chunks = recursive_splitter.split_documents(md_sections or [doc])

        # 3) assign per-source chunk_idx + uuid4 id
        for c in chunks:
            idx = counters[source_id]
            counters[source_id] += 1

            c.metadata = {
                **(c.metadata or {}),
                "chunk_idx": idx,
            }
            c.id = str(uuid.uuid4())
            out.append(c)

    return out

def process_text(documents: List[Document]) -> List[Document]:
    """Clean and split documents into chunks"""
    print("Cleaning text...")
    clean_page_content(documents)
    
    print("Splitting into chunks...")
    chunks = split_and_tag_chunks_by_source(documents)
    
    print(f"Created {len(chunks)} chunks from {len(documents)} documents")
    return chunks

