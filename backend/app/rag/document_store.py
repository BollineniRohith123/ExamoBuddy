from haystack_integrations.document_stores.pgvector import PgvectorDocumentStore
from .. import config

def get_document_store():
    """Get the PgvectorDocumentStore instance."""
    connection_string = f"postgresql://{config.DB_USER}:{config.DB_PASSWORD}@{config.DB_HOST}:{config.DB_PORT}/{config.DB_NAME}"
    
    document_store = PgvectorDocumentStore(
        connection_string=connection_string,
        table_name="vectors",
        embedding_dimension=1536,  # For OpenAI embeddings
        vector_function="cosine_similarity",
        recreate_table=False,  # Set to True only when initializing for the first time
        search_strategy="hnsw"
    )
    
    return document_store
