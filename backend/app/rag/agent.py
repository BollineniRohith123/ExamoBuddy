from haystack import Pipeline
from haystack.components.retrievers import InMemoryBM25Retriever
from haystack.components.generators import OpenAIGenerator
from haystack.agents import Agent, Tool
import requests
import asyncio
from .document_store import get_document_store
from .. import config

# Perplexity API Tool
async def perplexity_research(query: str) -> str:
    """Perform deep research using Perplexity API."""
    response = requests.post(
        "https://api.perplexity.ai/chat/completions",
        headers={"Authorization": f"Bearer {config.PERPLEXITY_API_KEY}"},
        json={
            "model": "sonar-pro",
            "messages": [{"role": "user", "content": query}]
        }
    )
    return response.json()["choices"][0]["message"]["content"]

# Reasoning Tool
async def medical_reasoning(question: str, context: str) -> str:
    """Apply medical reasoning to analyze the question and context."""
    response = requests.post(
        "https://api.openrouter.ai/api/v1/chat/completions",
        headers={"Authorization": f"Bearer {config.OPENROUTER_API_KEY}"},
        json={
            "model": "meta-llama/llama-3-8b",
            "messages": [
                {"role": "system", "content": "You are a medical reasoning assistant."},
                {"role": "user", "content": f"Question: {question}\n\nContext: {context}"}
            ]
        }
    )
    return response.json()["choices"][0]["message"]["content"]

# Create Haystack Agent
def get_agent():
    """Get the Haystack agent with tools."""
    # Get document store
    document_store = get_document_store()
    
    # Create retrieval pipeline
    retrieval_pipeline = Pipeline()
    retrieval_pipeline.add_component(
        "retriever", 
        InMemoryBM25Retriever(document_store=document_store)
    )
    
    # Create tools
    retrieval_tool = Tool(
        name="retrieve_documents",
        pipeline_or_node=retrieval_pipeline,
        description="Retrieve relevant medical documents"
    )
    
    perplexity_tool = Tool(
        name="deep_research",
        pipeline_or_node=perplexity_research,
        description="Perform deep research on medical topics"
    )
    
    reasoning_tool = Tool(
        name="medical_reasoning",
        pipeline_or_node=medical_reasoning,
        description="Apply medical reasoning to analyze questions"
    )
    
    # Create agent with tools
    agent = Agent(
        prompt_template="""You are a medical assistant for MBBS students.

Question: {query}

Think step by step to answer the question. Use the tools available to you to retrieve relevant information and perform deep research.""",
        tools=[retrieval_tool, perplexity_tool, reasoning_tool],
        llm=OpenAIGenerator(
            api_key=config.OPENROUTER_API_KEY,
            model="meta-llama/llama-3-8b",
            api_base_url="https://openrouter.ai/api/v1"
        )
    )
    
    return agent
