from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime

# Authentication schemas
class UserCreate(BaseModel):
    username: str
    password: str

class UserResponse(BaseModel):
    id: int
    username: str
    is_admin: bool
    created_at: datetime

class Token(BaseModel):
    access_token: str
    token_type: str

# Q&A schemas
class QuestionRequest(BaseModel):
    question: str

class AnswerResponse(BaseModel):
    answer: str

# History schemas
class HistoryItem(BaseModel):
    id: int
    question: str
    answer: str
    timestamp: datetime

class HistoryResponse(BaseModel):
    items: List[HistoryItem]
    total: int

# Admin schemas
class UserStats(BaseModel):
    total_users: int
    active_users: int
    admin_users: int

class QueryStats(BaseModel):
    total_queries: int
    queries_today: int
    average_per_user: float

class ApiCostStats(BaseModel):
    total_cost: float
    cost_today: float
    cost_per_query: float

class AdminStats(BaseModel):
    user_stats: UserStats
    query_stats: QueryStats
    api_cost_stats: ApiCostStats

# PDF schemas
class PdfRequest(BaseModel):
    answer: str
    question: Optional[str] = None
