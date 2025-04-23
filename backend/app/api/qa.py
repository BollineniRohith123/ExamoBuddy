from fastapi import APIRouter, Depends, HTTPException
from ..auth.utils import get_current_user
from ..database import get_db
from ..models.schemas import QuestionRequest, AnswerResponse
from ..rag.agent import get_agent

router = APIRouter()

@router.post("/ask", response_model=AnswerResponse)
def ask_question(request: QuestionRequest, current_user = Depends(get_current_user), db = Depends(get_db)):
    """Ask a question and get an answer using the RAG pipeline."""
    try:
        # Get the agent
        agent = get_agent()

        # Get user history for context
        db.execute(
            "SELECT question, answer FROM history WHERE user_id = %s ORDER BY timestamp DESC LIMIT 3",
            (current_user["id"],)
        )
        history = db.fetchall()

        # Format history as context
        context = "\n".join([f"Q: {h['question']}\nA: {h['answer']}" for h in history]) if history else ""

        # Run the agent with history context
        # For synchronous operation, use run() instead of arun()
        result = agent.run(request.question, context=context)

        # Save to history
        db.execute(
            "INSERT INTO history (user_id, question, answer) VALUES (%s, %s, %s)",
            (current_user["id"], request.question, result)
        )

        return {"answer": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
