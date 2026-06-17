from fastapi import APIRouter, HTTPException, Query
from typing import Optional
from datetime import datetime

router = APIRouter(prefix="/roles", tags=["Roles & Access"])

ROLE_PERMISSIONS = {
    "Super Admin": {
        "pages": ["dashboard","forecast","upload","reports","notifications","settings","admin","realtime","roles","system"],
        "apis": ["*"],
        "can_manage_users": True,
        "can_delete_data": True,
        "can_export": True,
        "can_retrain": True,
        "description": "Full system access with user management and system configuration"
    },
    "Admin": {
        "pages": ["dashboard","forecast","upload","reports","notifications","settings","admin","realtime"],
        "apis": ["forecast","analytics","datasets","reports","admin","notifications","realtime"],
        "can_manage_users": True,
        "can_delete_data": True,
        "can_export": True,
        "can_retrain": True,
        "description": "Full access except system-level configuration"
    },
    "Manager": {
        "pages": ["dashboard","forecast","upload","reports","notifications","settings"],
        "apis": ["forecast","analytics","datasets","reports","notifications"],
        "can_manage_users": False,
        "can_delete_data": False,
        "can_export": True,
        "can_retrain": False,
        "description": "Access to forecasting, reports and analytics"
    },
    "Analyst": {
        "pages": ["dashboard","forecast","upload","reports","notifications","settings"],
        "apis": ["forecast","analytics","datasets","reports"],
        "can_manage_users": False,
        "can_delete_data": False,
        "can_export": True,
        "can_retrain": False,
        "description": "Access to forecasting and dataset upload"
    },
    "Viewer": {
        "pages": ["dashboard","reports","notifications"],
        "apis": ["analytics","reports"],
        "can_manage_users": False,
        "can_delete_data": False,
        "can_export": False,
        "can_retrain": False,
        "description": "Read-only access to dashboard and reports"
    }
}

roles_store = [
    {"id": 1, "name": "Super Admin", "user_count": 1, "color": "#EF4444", "created_at": "2025-01-01"},
    {"id": 2, "name": "Admin", "user_count": 2, "color": "#7C3AED", "created_at": "2025-01-01"},
    {"id": 3, "name": "Manager", "user_count": 3, "color": "#3B82F6", "created_at": "2025-01-01"},
    {"id": 4, "name": "Analyst", "user_count": 5, "color": "#10B981", "created_at": "2025-01-01"},
    {"id": 5, "name": "Viewer", "user_count": 2, "color": "#F59E0B", "created_at": "2025-01-01"},
]

@router.get("/")
def get_roles():
    result = []
    for r in roles_store:
        perms = ROLE_PERMISSIONS.get(r["name"], {})
        result.append({**r, "permissions": perms})
    return {"roles": result, "total": len(result)}

@router.get("/permissions/{role_name}")
def get_role_permissions(role_name: str):
    perms = ROLE_PERMISSIONS.get(role_name)
    if not perms:
        raise HTTPException(status_code=404, detail="Role not found")
    return {"role": role_name, "permissions": perms}

@router.get("/matrix")
def permission_matrix():
    matrix = []
    features = ["View Dashboard", "Run Forecast", "Upload Dataset", "Export Reports",
                "Manage Users", "Delete Data", "Admin Panel", "System Config", "Retrain Models"]
    for role_name, perms in ROLE_PERMISSIONS.items():
        row = {"role": role_name}
        for feat in features:
            if feat == "View Dashboard": row[feat] = True
            elif feat == "Run Forecast": row[feat] = "forecast" in perms.get("apis", []) or "*" in perms.get("apis", [])
            elif feat == "Upload Dataset": row[feat] = "datasets" in perms.get("apis", []) or "*" in perms.get("apis", [])
            elif feat == "Export Reports": row[feat] = perms.get("can_export", False)
            elif feat == "Manage Users": row[feat] = perms.get("can_manage_users", False)
            elif feat == "Delete Data": row[feat] = perms.get("can_delete_data", False)
            elif feat == "Admin Panel": row[feat] = "admin" in perms.get("pages", [])
            elif feat == "System Config": row[feat] = "system" in perms.get("pages", [])
            elif feat == "Retrain Models": row[feat] = perms.get("can_retrain", False)
        matrix.append(row)
    return {"matrix": matrix, "features": features}
