from fastapi import APIRouter, HTTPException, Query
from typing import Optional
from datetime import datetime, timedelta
import random

router = APIRouter(prefix="/user-management", tags=["User Management"])

users_db = [
    {"id": 1, "name": "Admin User", "email": "admin@example.com", "role": "Admin",
     "is_active": True, "avatar": "A", "department": "Engineering",
     "last_login": (datetime.utcnow() - timedelta(hours=2)).isoformat(),
     "created_at": (datetime.utcnow() - timedelta(days=90)).isoformat(),
     "forecasts_run": 142, "datasets_uploaded": 28, "reports_generated": 56},
    {"id": 2, "name": "Analyst User", "email": "analyst@example.com", "role": "Analyst",
     "is_active": True, "avatar": "A", "department": "Data Science",
     "last_login": (datetime.utcnow() - timedelta(days=1)).isoformat(),
     "created_at": (datetime.utcnow() - timedelta(days=60)).isoformat(),
     "forecasts_run": 87, "datasets_uploaded": 15, "reports_generated": 23},
    {"id": 3, "name": "Manager User", "email": "manager@example.com", "role": "Manager",
     "is_active": True, "avatar": "M", "department": "Operations",
     "last_login": (datetime.utcnow() - timedelta(hours=8)).isoformat(),
     "created_at": (datetime.utcnow() - timedelta(days=45)).isoformat(),
     "forecasts_run": 34, "datasets_uploaded": 5, "reports_generated": 41},
    {"id": 4, "name": "Viewer User", "email": "viewer@example.com", "role": "Viewer",
     "is_active": False, "avatar": "V", "department": "Marketing",
     "last_login": (datetime.utcnow() - timedelta(days=14)).isoformat(),
     "created_at": (datetime.utcnow() - timedelta(days=30)).isoformat(),
     "forecasts_run": 8, "datasets_uploaded": 0, "reports_generated": 12},
]

activity_log = [
    {"id": i+1, "user_email": random.choice(["admin@example.com", "analyst@example.com", "manager@example.com"]),
     "action": random.choice(["Ran forecast", "Uploaded dataset", "Generated report", "Logged in", "Exported data"]),
     "detail": random.choice(["Random Forest - Electronics", "sales_q4.csv", "Monthly Summary", "From 192.168.1.1", "PDF export"]),
     "timestamp": (datetime.utcnow() - timedelta(hours=i*3)).isoformat(),
     "ip": f"192.168.1.{random.randint(1,254)}", "status": random.choice(["success","success","success","failed"])}
    for i in range(30)
]

@router.get("/users")
def get_all_users(role: Optional[str] = Query(None), is_active: Optional[bool] = Query(None), search: Optional[str] = Query(None)):
    data = users_db
    if role:
        data = [u for u in data if u["role"] == role]
    if is_active is not None:
        data = [u for u in data if u["is_active"] == is_active]
    if search:
        s = search.lower()
        data = [u for u in data if s in u["name"].lower() or s in u["email"].lower()]
    return {"users": data, "total": len(data)}

@router.get("/users/{user_id}")
def get_user(user_id: int):
    for u in users_db:
        if u["id"] == user_id:
            return u
    raise HTTPException(status_code=404, detail="User not found")

@router.put("/users/{user_id}")
def update_user(user_id: int, payload: dict):
    for i, u in enumerate(users_db):
        if u["id"] == user_id:
            for k, v in payload.items():
                if k in u:
                    users_db[i][k] = v
            return users_db[i]
    raise HTTPException(status_code=404, detail="Not found")

@router.put("/users/{user_id}/toggle-status")
def toggle_user_status(user_id: int):
    for u in users_db:
        if u["id"] == user_id:
            u["is_active"] = not u["is_active"]
            return u
    raise HTTPException(status_code=404, detail="Not found")

@router.post("/users/{user_id}/reset-password")
def reset_password(user_id: int):
    for u in users_db:
        if u["id"] == user_id:
            return {"message": f"Password reset email sent to {u['email']}", "status": "success"}
    raise HTTPException(status_code=404, detail="Not found")

@router.get("/activity")
def get_activity(user_email: Optional[str] = Query(None), limit: int = Query(20)):
    data = activity_log
    if user_email:
        data = [a for a in data if a["user_email"] == user_email]
    return {"activity": list(reversed(data))[:limit], "total": len(data)}

@router.get("/stats")
def user_stats():
    return {
        "total_users": len(users_db),
        "active_users": sum(1 for u in users_db if u["is_active"]),
        "by_role": {r: sum(1 for u in users_db if u["role"] == r)
                    for r in ["Admin", "Manager", "Analyst", "Viewer"]},
        "recent_logins": sum(1 for u in users_db
            if u["last_login"] and datetime.fromisoformat(u["last_login"]) > datetime.utcnow() - timedelta(hours=24)),
    }
