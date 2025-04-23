-- Enable pgvector extension
CREATE EXTENSION IF NOT EXISTS pgvector;

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    is_admin BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create history table
CREATE TABLE IF NOT EXISTS history (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id),
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create vectors table for document embeddings
CREATE TABLE IF NOT EXISTS vectors (
    id SERIAL PRIMARY KEY,
    embedding VECTOR(1536),
    document_text TEXT NOT NULL,
    metadata JSONB
);

-- Insert admin user for testing (password: admin123)
INSERT INTO users (username, password_hash, is_admin) 
VALUES ('admin', '$2b$12$BnlkuACZiHUs8h0TLWejg.XyPEKLt.TYYORZbf/gfFd/S8sO77lt.', true)
ON CONFLICT (username) DO NOTHING;
