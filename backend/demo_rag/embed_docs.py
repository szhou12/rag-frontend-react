

def add_documents(vector_store, docs):
    ids = []
    chunks_metadata = []

    try:
        for d in docs:
            ids.append(d.id)
            chunks_metadata.append({'id': d.id,
                                    'source_id': d.metadata['source_id'],
                                    'chunk_idx': d.metadata['chunk_idx']})

        vector_store.add_documents(documents=docs, ids=ids)

        return chunks_metadata
    except Exception as e:
        raise RuntimeError(f"Failed to add documents to Chroma: {e}")

def delete(vector_store, ids):
    try:
        vector_store.delete(ids=ids)
    except Exception as e:
        raise RuntimeError(f"Error while deleting from Chroma: {e}")