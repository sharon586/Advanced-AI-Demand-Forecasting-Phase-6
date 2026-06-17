from fastapi import APIRouter, Depends
from app.core.dependencies import role_required

router = APIRouter(prefix="/users", tags=["Users"])


@router.get("/")
def get_users():
    return {
        "users": [
            {"id": 1, "name": "Admin User", "email": "admin@example.com", "role": "Admin"},
            {"id": 2, "name": "Analyst User", "email": "analyst@example.com", "role": "Analyst"},
            {"id": 3, "name": "Manager User", "email": "manager@example.com", "role": "Manager"},
        ]
    }


@router.get("/admin")
def admin_only(current_user=Depends(role_required(["Admin"]))):
    return {"message": "Welcome Admin", "user": current_user}
