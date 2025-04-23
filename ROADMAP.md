# ExamoBuddy 24-Hour Development Roadmap

This roadmap outlines the intensive 24-hour development plan for creating the ExamoBuddy application, a Q&A platform for MBBS students using Haystack with agentic RAG and Perplexity API integration.

## Project Overview

**Duration**: 24 hours of continuous development
**Approach**: Vibe coding - rapid prototyping and iterative development
**Goal**: Create a functional MVP of the Q&A platform with core features implemented

## 24-Hour Development Timeline

### Hour 0-1: Project Setup and Planning (1 hour)
- [x] Set up development environments (Python 3.8+, Node.js)
- [x] Create GitHub repository structure
- [x] Define MVP features and prioritize tasks
- [x] Set up communication channels for pair programming
- [x] Prepare development tools and resources

### Hour 1-3: Database and Backend Foundation (2 hours)
- [x] Connect to PostgreSQL at server.alviongs.com via aaPanel
- [x] Create essential database tables (users, history, vectors)
- [x] Enable pgvector extension
- [x] Set up FastAPI project structure
- [x] Implement basic API endpoints structure

### Hour 3-6: Haystack RAG Pipeline Setup (3 hours)
- [x] Install and configure Haystack framework
- [x] Set up PgvectorDocumentStore with PostgreSQL connection
- [x] Implement basic document processing pipeline
- [x] Configure embedding models for vector generation
- [x] Create simple retrieval components
- [ ] Test basic RAG functionality with sample medical documents

### Hour 6-9: Agentic RAG Implementation (3 hours)
- [x] Implement Haystack agent framework
- [x] Define essential agent tools for medical domain
- [x] Create reasoning component for question analysis
- [x] Implement context management for follow-up questions
- [ ] Test agent with sample medical queries

### Hour 9-11: Perplexity API Integration (2 hours)
- [x] Set up Perplexity API client
- [x] Create custom tool for deep research
- [x] Implement basic caching for API calls
- [ ] Test integration with medical questions
- [x] Optimize response formatting

### Hour 11-12: PDF Generation (1 hour)
- [x] Implement basic PDF generation service
- [x] Create simple template for answer formatting
- [x] Set up API endpoint for PDF downloads
- [ ] Test PDF generation with sample answers

### Hour 12-14: Authentication System (2 hours)
- [x] Implement basic JWT-based authentication
- [x] Create login/register endpoints
- [x] Set up admin role functionality
- [ ] Test authentication flow

### Hour 14-17: Frontend Foundation (3 hours)
- [x] Set up Next.js project with TypeScript
- [x] Configure Tailwind CSS with basic medical theme
- [x] Create essential page structure (login, Q&A, history, admin)
- [x] Implement responsive layout templates
- [x] Set up API client for backend communication

### Hour 17-19: Core Q&A Interface (2 hours)
- [x] Implement question input interface
- [x] Create answer display component
- [x] Add loading states and basic animations
- [x] Implement PDF download button
- [ ] Test Q&A functionality end-to-end

### Hour 19-21: History and Admin Features (2 hours)
- [x] Create basic history page
- [x] Implement simple admin dashboard
- [x] Add user management interface
- [x] Create basic usage statistics display
- [ ] Test history and admin functionality

### Hour 21-23: Integration and Testing (2 hours)
- [x] Connect all frontend components to backend APIs
- [x] Implement error handling for critical paths
- [ ] Test end-to-end workflows
- [ ] Fix critical bugs and issues
- [ ] Optimize performance bottlenecks

### Hour 23-24: Deployment and Documentation (1 hour)
- [ ] Deploy backend to a simple production server
- [ ] Deploy frontend to Vercel
- [ ] Configure environment variables
- [x] Create basic documentation
- [ ] Prepare demo for stakeholders

## Technical Stack for Rapid Development

### Backend
- **Language**: Python 3.8+
- **Framework**: FastAPI (for quick API development)
- **RAG Framework**: Haystack (latest version with agentic capabilities)
- **Database**: PostgreSQL with pgvector at server.alviongs.com via aaPanel
- **Authentication**: Simple JWT-based auth (minimal implementation)
- **APIs**: Perplexity for deep research, OpenRouter for cost-effective LLM access
- **PDF Generation**: Simple pdfkit implementation

### Frontend
- **Framework**: Next.js 14+ with App Router
- **Styling**: Tailwind CSS with pre-built medical components
- **State Management**: React Query for efficient data fetching
- **Authentication**: JWT with localStorage (for MVP simplicity)
- **Charts**: Simple Chart.js implementation for admin
- **Deployment**: Vercel (for instant deployment)

### Infrastructure
- **Database**: Existing PostgreSQL at server.alviongs.com via aaPanel
- **Backend Hosting**: Railway.app or Render.com (for quick deployment)
- **Frontend Hosting**: Vercel (zero-config deployment)

## MVP Features Prioritization

### Must-Have Features
- Basic user authentication (login/register)
- Q&A functionality with agentic RAG
- Perplexity integration for deep research
- Simple history tracking
- Basic admin view
- PDF download capability

### Nice-to-Have Features (If Time Permits)
- Enhanced UI with medical theming
- Advanced admin analytics
- User feedback mechanism
- Follow-up question suggestions
- Caching for performance optimization

## Development Approach

### Parallel Development
- Frontend and backend development will happen simultaneously
- Use mock data for frontend while backend APIs are being developed
- Regular integration points every 3-4 hours

### Code Reuse and Shortcuts
- Use pre-built components and templates where possible
- Leverage existing libraries and code snippets
- Focus on functionality over perfect code structure
- Use minimal error handling for MVP (focus on happy paths)

### Testing Strategy
- Focus on manual testing of critical paths
- Implement basic automated tests only for core functionality
- Use real medical questions to validate RAG performance

## Post-MVP Development

After the 24-hour development sprint, these areas will need further refinement:

- Enhanced error handling and edge cases
- Improved security measures
- Performance optimization for production
- More comprehensive testing
- UI/UX refinements
- Additional features based on initial feedback

## Implementation Details and Code Snippets

### Database Schema (Quick Implementation)

```sql
-- Run this on server.alviongs.com to set up the database
CREATE EXTENSION IF NOT EXISTS pgvector;

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    is_admin BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE history (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id),
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE vectors (
    id SERIAL PRIMARY KEY,
    embedding VECTOR(1536),
    document_text TEXT NOT NULL,
    metadata JSONB
);

-- Insert admin user for testing
INSERT INTO users (username, password_hash, is_admin)
VALUES ('admin', '$2b$12$BnlkuACZiHUs8h0TLWejg.XyPEKLt.TYYORZbf/gfFd/S8sO77lt.', true);
```

### FastAPI Backend Structure

```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py           # FastAPI app initialization
│   ├── config.py         # Configuration and environment variables
│   ├── database.py       # Database connection
│   ├── auth/
│   │   ├── __init__.py
│   │   ├── router.py     # Auth endpoints
│   │   └── utils.py      # JWT functions
│   ├── rag/
│   │   ├── __init__.py
│   │   ├── document_store.py  # PgVector setup
│   │   ├── pipeline.py        # Haystack pipeline
│   │   └── agent.py           # Agentic RAG implementation
│   ├── api/
│   │   ├── __init__.py
│   │   ├── qa.py         # Q&A endpoints
│   │   ├── history.py    # History endpoints
│   │   ├── admin.py      # Admin endpoints
│   │   └── pdf.py        # PDF generation
│   └── models/
│       ├── __init__.py
│       └── schemas.py     # Pydantic models
└── requirements.txt
```

### Next.js Frontend Structure

```
frontend/
├── app/
│   ├── layout.tsx        # Root layout
│   ├── page.tsx          # Home page with Q&A interface
│   ├── login/
│   │   └── page.tsx      # Login page
│   ├── register/
│   │   └── page.tsx      # Registration page
│   ├── history/
│   │   └── page.tsx      # History page
│   ├── admin/
│   │   └── page.tsx      # Admin dashboard
│   └── api/
│       └── auth/
│           └── [...nextauth]/
│               └── route.ts  # Auth API routes
├── components/
│   ├── ui/               # Reusable UI components
│   ├── QuestionForm.tsx  # Question input form
│   ├── AnswerDisplay.tsx # Answer display with markdown
│   └── PDFButton.tsx     # PDF download button
├── lib/
│   ├── api.ts            # API client
│   └── auth.ts           # Auth utilities
└── package.json
```

### Key Implementation Code Snippets

#### Haystack Agentic RAG Setup

```python
# backend/app/rag/agent.py
from haystack import Pipeline
from haystack.components.retrievers import InMemoryBM25Retriever
from haystack.components.generators import OpenAIGenerator
from haystack.agents import Agent, Tool
import requests

# Perplexity API Tool
def perplexity_research(query: str) -> str:
    """Perform deep research using Perplexity API"""
    response = requests.post(
        "https://api.perplexity.ai/chat/completions",
        headers={"Authorization": f"Bearer {PERPLEXITY_API_KEY}"},
        json={
            "model": "sonar-pro",
            "messages": [{"role": "user", "content": query}]
        }
    )
    return response.json()["choices"][0]["message"]["content"]

# Reasoning Tool
def medical_reasoning(question: str, context: str) -> str:
    """Apply medical reasoning to analyze the question and context"""
    response = requests.post(
        "https://api.openrouter.ai/api/v1/chat/completions",
        headers={"Authorization": f"Bearer {OPENROUTER_API_KEY}"},
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
def create_agent(document_store):
    # Create retrieval pipeline
    retrieval_pipeline = Pipeline()
    retrieval_pipeline.add_component("retriever", InMemoryBM25Retriever(document_store=document_store))

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
        prompt_template="""You are a medical assistant for MBBS students.\n\n
        Question: {query}\n\nThink step by step to answer the question.""",
        tools=[retrieval_tool, perplexity_tool, reasoning_tool],
        llm=OpenAIGenerator(api_key=OPENROUTER_API_KEY, model="meta-llama/llama-3-8b")
    )

    return agent
```

#### FastAPI Q&A Endpoint

```python
# backend/app/api/qa.py
from fastapi import APIRouter, Depends, HTTPException
from ..auth.utils import get_current_user
from ..rag.agent import create_agent
from ..database import get_db
from ..models.schemas import QuestionRequest, AnswerResponse

router = APIRouter()

@router.post("/ask", response_model=AnswerResponse)
async def ask_question(request: QuestionRequest, current_user = Depends(get_current_user), db = Depends(get_db)):
    try:
        # Get agent
        agent = create_agent(document_store)

        # Get user history for context
        history = db.execute(
            "SELECT question, answer FROM history WHERE user_id = %s ORDER BY timestamp DESC LIMIT 3",
            (current_user["id"],)
        ).fetchall()

        # Format history as context
        context = "\n".join([f"Q: {h['question']}\nA: {h['answer']}" for h in history])

        # Run agent with history context
        result = agent.run(request.question, context=context)

        # Save to history
        db.execute(
            "INSERT INTO history (user_id, question, answer) VALUES (%s, %s, %s)",
            (current_user["id"], request.question, result)
        )
        db.commit()

        return {"answer": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
```

#### React Q&A Component

```tsx
// frontend/components/QuestionForm.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function QuestionForm() {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question }),
      });

      if (!response.ok) throw new Error('Failed to get answer');

      const data = await response.json();
      setAnswer(data.answer);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-4">
      <form onSubmit={handleSubmit} className="mb-6">
        <div className="mb-4">
          <label htmlFor="question" className="block text-sm font-medium text-gray-700 mb-1">
            Ask a medical question
          </label>
          <textarea
            id="question"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
            rows={3}
            placeholder="Enter your medical question here..."
            required
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50"
        >
          {loading ? 'Processing...' : 'Submit Question'}
        </button>
      </form>

      {loading && (
        <div className="text-center py-4">
          <div className="animate-pulse text-green-600">Researching your question...</div>
        </div>
      )}

      {answer && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Answer</h2>
          <div className="prose max-w-none">
            {answer}
          </div>
          <div className="mt-4 flex justify-end">
            <button
              onClick={() => window.open('/api/pdf?answer=' + encodeURIComponent(answer), '_blank')}
              className="text-green-600 hover:text-green-800"
            >
              Download as PDF
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
```

## Conclusion

This 24-hour development roadmap provides a detailed plan for creating a functional MVP of the ExamoBuddy application through intensive pair programming and rapid development techniques. By focusing on core functionality and leveraging existing tools and services, we can deliver a working prototype that demonstrates the power of agentic RAG with Perplexity integration for medical Q&A.

The implementation details and code snippets provide a clear starting point for development, allowing us to hit the ground running. The existing PostgreSQL hosting at pgadmin.alviongs.com will be utilized to minimize setup time and focus on feature development.

Let's start coding and build this application in the next 24 hours!
