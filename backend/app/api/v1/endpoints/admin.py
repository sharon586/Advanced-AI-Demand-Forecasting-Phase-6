from fastapi import APIRouter, Depends, HTTPException, Query
from typing import Optional
from datetime import datetime
from app.core.dependencies import role_required

router = APIRouter(prefix="/admin", tags=["Admin"])

# Mock data for admin panel
admin_users = [
    {"id": 1, "name": "Admin User", "email": "admin@example.com", "role": "Admin", "is_active": True, "created_at": "2025-01-01"},
    {"id": 2, "name": "Analyst User", "email": "analyst@example.com", "role": "Analyst", "is_active": True, "created_at": "2025-02-15"},
    {"id": 3, "name": "Manager User", "email": "manager@example.com", "role": "Manager", "is_active": True, "created_at": "2025-03-10"},
    {"id": 4, "name": "Sneha R", "email": "sneha@example.com", "role": "Analyst", "is_active": False, "created_at": "2025-04-20"},
]


@router.get("/dashboard")
def admin_dashboard():
    return {
        "total_users": 8,
        "active_users": 6,
        "total_datasets": 12,
        "total_forecasts": 48,
        "total_reports": 15,
        "system_health": "healthy",
        "server_uptime": "99.8%",
        "api_calls_today": 247,
        "storage_used_gb": 2.4,
        "storage_total_gb": 50,
        "recent_activities": [
            {"user": "admin@example.com", "action": "Forecast generated", "time": "5 min ago"},
            {"user": "analyst@example.com", "action": "Dataset uploaded", "time": "20 min ago"},
            {"user": "manager@example.com", "action": "Report exported", "time": "1 hour ago"},
            {"user": "sneha@example.com", "action": "Login", "time": "2 hours ago"},
        ],
        "system_analytics": {
            "daily_api_calls": [120, 180, 210, 247, 195, 230, 190, 260, 280, 240, 220, 247],
            "monthly_labels": ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
        }
    }


@router.get("/users")
def get_all_users(
    page: int = Query(1, ge=1),
    per_page: int = Query(10, ge=1, le=100),
    search: Optional[str] = Query(None),
    role: Optional[str] = Query(None),
    is_active: Optional[bool] = Query(None)
):
    filtered = admin_users
    if search:
        filtered = [u for u in filtered if search.lower() in u["name"].lower() or search.lower() in u["email"].lower()]
    if role:
        filtered = [u for u in filtered if u["role"] == role]
    if is_active is not None:
        filtered = [u for u in filtered if u["is_active"] == is_active]

    total = len(filtered)
    start = (page - 1) * per_page
    paginated = filtered[start:start + per_page]
    return {"users": paginated, "total": total, "page": page, "total_pages": (total + per_page - 1) // per_page}


@router.put("/users/{user_id}/toggle")
def toggle_user_status(user_id: int):
    user = next((u for u in admin_users if u["id"] == user_id), None)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    user["is_active"] = not user["is_active"]
    return {"message": f"User {'activated' if user['is_active'] else 'deactivated'}", "user": user}


@router.delete("/users/{user_id}")
def delete_user(user_id: int):
    global admin_users
    user = next((u for u in admin_users if u["id"] == user_id), None)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    admin_users = [u for u in admin_users if u["id"] != user_id]
    return {"message": "User deleted successfully"}


@router.get("/system-analytics")
def system_analytics():
    return {
        "forecast_model_usage": [
            {"model": "Linear Regression", "count": 18, "percentage": 37.5},
            {"model": "Random Forest", "count": 14, "percentage": 29.2},
            {"model": "XGBoost", "count": 10, "percentage": 20.8},
            {"model": "ARIMA", "count": 6, "percentage": 12.5},
        ],
        "dataset_categories": [
            {"category": "Electronics", "count": 4},
            {"category": "Fashion", "count": 3},
            {"category": "Groceries", "count": 2},
            {"category": "Furniture", "count": 2},
            {"category": "General", "count": 1},
        ],
        "api_response_times": {
            "forecast": 245,
            "datasets": 120,
            "analytics": 180,
            "reports": 320
        },
        "error_rate": 0.8,
        "uptime_percentage": 99.8
    }
