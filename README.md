# ExamoBuddy

A Q&A platform for MBBS students using Haystack with agentic RAG and Perplexity API.

## Overview

ExamoBuddy is a web application designed to help medical students with their studies by providing accurate answers to their questions. The platform uses Haystack for smart question-answering, Perplexity's API for deep research, and Next.js for a beautiful, medical-themed interface.

## Features

- User authentication and login
- Question and answer functionality with context preservation
- History tracking of past questions
- PDF download of answers
- Super admin dashboard for monitoring usage and costs

## Technology Stack

- **Frontend**: Next.js with Tailwind CSS
- **Backend**: Haystack pipelines with agentic RAG, FastAPI
- **Database**: PostgreSQL with pgvector for vector embeddings
- **APIs**: OpenRouter for cost-effective LLM generation, Perplexity for deep research

## Prerequisites

Before you begin, ensure you have the following installed:

- Python 3.8 or higher
- Node.js 18 or higher
- npm or yarn
- PostgreSQL with pgvector extension (hosted on aaPanel)
- wkhtmltopdf (for PDF generation)

## Installation and Setup

### 1. Clone the Repository

```bash
git clone https://github.com/BollineniRohith123/ExamoBuddy.git
cd ExamoBuddy
```

### 2. Set Up the Backend

#### Install Dependencies

```bash
cd backend
pip install -r requirements.txt
```

#### Configure Environment Variables

Create a `.env` file in the `backend` directory with the following content:

```
# Database configuration
DB_HOST=server.alviongs.com
DB_PORT=5432
DB_NAME=examobuddy
DB_USER=your_db_username
DB_PASSWORD=your_db_password

# API Keys
PERPLEXITY_API_KEY=your_perplexity_api_key
OPENROUTER_API_KEY=your_openrouter_api_key

# JWT Configuration
JWT_SECRET=your_jwt_secret_key
JWT_ALGORITHM=HS256
JWT_EXPIRATION=1440  # 24 hours in minutes

# Application settings
DEBUG=True
API_PREFIX=/api
```

Replace the placeholder values with your actual credentials.

#### Set Up the Database

Follow the detailed instructions in [PostgreSQL aaPanel Setup Guide](docs/postgresql-aapanel-setup.md) to set up PostgreSQL on aaPanel.

Once your database is set up, run the SQL script in `backend/setup_db.sql`:

```bash
psql -h server.alviongs.com -U your_db_username -d examobuddy -f setup_db.sql
```

#### Run the Backend Server

```bash
cd backend
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

The backend API will be available at http://localhost:8000.

### 3. Set Up the Frontend

#### Install Dependencies

```bash
cd frontend
npm install
```

#### Configure Environment Variables

Create a `.env.local` file in the `frontend` directory with the following content:

```
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

#### Run the Frontend Development Server

```bash
cd frontend
npm run dev
```

The frontend will be available at http://localhost:3000.

## Usage

### Default Admin Account

A default admin account is created during database setup:

- Username: `admin`
- Password: `admin123`

### Adding Medical Documents

To add medical documents for the RAG system, you need to create a script that processes your documents and stores them in the PostgreSQL database. Here's a basic example:

```python
from haystack.nodes import PreProcessor
from haystack_integrations.document_stores.pgvector import PgvectorDocumentStore
from haystack.nodes import EmbeddingRetriever

# Connect to the document store
document_store = PgvectorDocumentStore(
    connection_string="postgresql://your_db_username:your_db_password@server.alviongs.com:5432/examobuddy",
    embedding_dimension=1536,
    recreate_table=False
)

# Load and preprocess documents
preprocessor = PreProcessor(
    clean_empty_lines=True,
    clean_whitespace=True,
    clean_header_footer=True,
    split_by="word",
    split_length=500,
    split_overlap=50
)

# Load your documents (example with text files)
docs = []
for file_path in ["path/to/your/medical/document1.txt", "path/to/your/medical/document2.txt"]:
    with open(file_path, "r") as f:
        docs.append({"content": f.read(), "meta": {"name": file_path}})

# Preprocess documents
processed_docs = preprocessor.process(docs)

# Initialize retriever with embeddings
retriever = EmbeddingRetriever(
    document_store=document_store,
    embedding_model="sentence-transformers/all-mpnet-base-v2"
)

# Update embeddings in the document store
document_store.write_documents(processed_docs)
document_store.update_embeddings(retriever)
```

## Development Plan

See [allaboutapp.md](allaboutapp.md) for a detailed development plan and architecture.

## Roadmap

See [ROADMAP.md](ROADMAP.md) for the development roadmap and progress tracking.
