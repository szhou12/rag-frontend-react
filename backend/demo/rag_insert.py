import sys
import os
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))

from demo_rag.extract_metadata import get_file_metadata, increment_status_by_ids, check_status
from demo_rag.load_documents import load_document  
from demo_rag.process_text import process_text
from demo_rag.embed_docs import add_documents
from demo_rag.embeddings import build_embedder_en, build_embedder_zh
from demo_rag.vectorstore import build_vectorstores


# processed_ids_en = ['7cc8818d-a792-402e-93f4-9a2c7bc4f6dd', 
#                     '8cb1b1f7-aa03-49b9-aea7-ff452f018b2b']

emb_en = build_embedder_en()
emb_zh = build_embedder_zh()
vstores = build_vectorstores(emb_en, emb_zh)

# lang="en"

# files = get_file_metadata(language=lang)
# for f in files:
#     if f.get("id") in processed_ids_en:
#         continue
#     documents = load_document(f)
#     chunks = process_text(documents)

#     print(f"{f['filename']} produces: {len(chunks)} chunks")

#     add_documents(vstores[lang], chunks)
#     processed_ids_en.append(f.get("id"))

# increment_status_by_ids(processed_ids_en)

# check_status(lang)

langs = ["en", "zh"]
for lang in langs:
    processed_ids = []
    files = get_file_metadata(language=lang)
    for f in files:
        if f.get("id") in processed_ids:
            continue
        documents = load_document(f)
        chunks = process_text(documents)
        add_documents(vstores[lang], chunks)
        processed_ids.append(f.get("id"))
    
    increment_status_by_ids(processed_ids)

    print(check_status(lang))


