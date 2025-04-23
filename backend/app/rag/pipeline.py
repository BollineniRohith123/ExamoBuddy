from haystack import Pipeline
from haystack.components.retrievers import InMemoryBM25Retriever
from haystack.components.generators import OpenAIGenerator
from .document_store import get_document_store
from .. import config

def get_rag_pipeline():
    """Get the RAG pipeline."""
    # Get document store
    document_store = get_document_store()
    
    # Create pipeline
    pipeline = Pipeline()
    
    # Add retriever
    pipeline.add_component(
        "retriever", 
        InMemoryBM25Retriever(document_store=document_store)
    )
    
    # Add generator using OpenRouter
    pipeline.add_component(
        "generator", 
        OpenAIGenerator(
            api_key=config.OPENROUTER_API_KEY,
            model="meta-llama/llama-3-8b",
            api_base_url="https://openrouter.ai/api/v1"
        )
    )
    
    # Connect components
    pipeline.connect("retriever", "generator")
    
    return pipeline
