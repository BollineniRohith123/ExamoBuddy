from fastapi import APIRouter, Depends, HTTPException, Query
from typing import Optional
from ..auth.utils import get_current_user
from ..database import get_db
from ..models.schemas import HistoryResponse, HistoryItem

router = APIRouter()

@router.get("/", response_model=HistoryResponse)
async def get_history(
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=100),
    current_user = Depends(get_current_user),
    db = Depends(get_db)
):
    """Get the user's question history."""
    try:
        # Get total count
        db.execute(
            "SELECT COUNT(*) as total FROM history WHERE user_id = %s",
            (current_user["id"],)
        )
        total = db.fetchone()["total"]
        
        # Get history items with pagination
        db.execute(
            "SELECT id, question, answer, timestamp FROM history WHERE user_id = %s ORDER BY timestamp DESC LIMIT %s OFFSET %s",
            (current_user["id"], limit, skip)
        )
        items = db.fetchall()
        
        return {
            "items": items,
            "total": total
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/{history_id}", response_model=HistoryItem)
async def get_history_item(
    history_id: int,
    current_user = Depends(get_current_user),
    db = Depends(get_db)
):
    """Get a specific history item."""
    try:
        # Get the history item
        db.execute(
            "SELECT id, question, answer, timestamp FROM history WHERE id = %s AND user_id = %s",
            (history_id, current_user["id"])
        )
        item = db.fetchone()
        
        if not item:
            raise HTTPException(status_code=404, detail="History item not found")
        
        return item
    except Exception as e:
        if isinstance(e, HTTPException):
            raise e
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/{history_id}")
async def delete_history_item(
    history_id: int,
    current_user = Depends(get_current_user),
    db = Depends(get_db)
):
    """Delete a specific history item."""
    try:
        # Check if the history item exists and belongs to the user
        db.execute(
            "SELECT id FROM history WHERE id = %s AND user_id = %s",
            (history_id, current_user["id"])
        )
        item = db.fetchone()
        
        if not item:
            raise HTTPException(status_code=404, detail="History item not found")
        
        # Delete the history item
        db.execute(
            "DELETE FROM history WHERE id = %s",
            (history_id,)
        )
        
        return {"message": "History item deleted successfully"}
    except Exception as e:
        if isinstance(e, HTTPException):
            raise e
        raise HTTPException(status_code=500, detail=str(e))
