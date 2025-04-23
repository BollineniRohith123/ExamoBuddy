from fastapi import APIRouter, Depends, HTTPException
from ..auth.utils import get_current_admin
from ..database import get_db
from ..models.schemas import AdminStats, UserStats, QueryStats, ApiCostStats

router = APIRouter()

@router.get("/stats", response_model=AdminStats)
async def get_admin_stats(current_admin = Depends(get_current_admin), db = Depends(get_db)):
    """Get admin statistics."""
    try:
        # Get user stats
        db.execute("SELECT COUNT(*) as total FROM users")
        total_users = db.fetchone()["total"]
        
        db.execute("SELECT COUNT(*) as total FROM users WHERE is_admin = TRUE")
        admin_users = db.fetchone()["total"]
        
        # For active users, we'll count users who have asked questions in the last 30 days
        db.execute("""
            SELECT COUNT(DISTINCT user_id) as active 
            FROM history 
            WHERE timestamp > NOW() - INTERVAL '30 days'
        """)
        active_users = db.fetchone()["active"]
        
        # Get query stats
        db.execute("SELECT COUNT(*) as total FROM history")
        total_queries = db.fetchone()["total"]
        
        db.execute("SELECT COUNT(*) as today FROM history WHERE DATE(timestamp) = CURRENT_DATE")
        queries_today = db.fetchone()["today"]
        
        average_per_user = total_queries / total_users if total_users > 0 else 0
        
        # In a real implementation, we would track API costs in a separate table
        # For now, we'll use dummy values
        api_cost_stats = {
            "total_cost": 0.0,
            "cost_today": 0.0,
            "cost_per_query": 0.0
        }
        
        return {
            "user_stats": {
                "total_users": total_users,
                "active_users": active_users,
                "admin_users": admin_users
            },
            "query_stats": {
                "total_queries": total_queries,
                "queries_today": queries_today,
                "average_per_user": average_per_user
            },
            "api_cost_stats": api_cost_stats
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/users")
async def get_users(current_admin = Depends(get_current_admin), db = Depends(get_db)):
    """Get all users (admin only)."""
    try:
        db.execute("SELECT id, username, is_admin, created_at FROM users")
        users = db.fetchall()
        return {"users": users}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
