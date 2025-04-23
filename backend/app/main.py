from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from . import config
from .api import qa, history, admin, pdf
from .auth import router as auth_router

# Create FastAPI app
app = FastAPI(
    title="ExamoBuddy API",
    description="API for ExamoBuddy - A Q&A platform for MBBS students",
    version="0.1.0",
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For development, replace with specific origins in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth_router.router, prefix=f"{config.API_PREFIX}/auth", tags=["Authentication"])
app.include_router(qa.router, prefix=f"{config.API_PREFIX}/qa", tags=["Q&A"])
app.include_router(history.router, prefix=f"{config.API_PREFIX}/history", tags=["History"])
app.include_router(admin.router, prefix=f"{config.API_PREFIX}/admin", tags=["Admin"])
app.include_router(pdf.router, prefix=f"{config.API_PREFIX}/pdf", tags=["PDF"])

@app.get("/")
async def root():
    """Root endpoint to check if the API is running."""
    return {"message": "Welcome to ExamoBuddy API"}

@app.get("/health")
async def health_check():
    """Health check endpoint."""
    return {"status": "healthy"}
