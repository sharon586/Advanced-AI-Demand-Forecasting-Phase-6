from fastapi import APIRouter, HTTPException, Query
from typing import Optional
from datetime import datetime, timedelta
import random

router = APIRouter(prefix="/organizations", tags=["Multi-Organization Management"])

orgs_store = [
    {"id": 1, "name": "Acme Corp", "slug": "acme-corp", "industry": "Retail", "plan": "Enterprise",
     "status": "active", "owner_email": "admin@acme.com", "member_count": 12, "dataset_count": 8,
     "forecast_count": 45, "report_count": 22, "logo_color": "#7C3AED",
     "settings": {"timezone": "Asia/Kolkata", "currency": "INR", "fiscal_year_start": "April",
                  "default_model": "XGBoost", "data_retention_days": 365},
     "created_at": (datetime.utcnow() - timedelta(days=120)).isoformat(),
     "updated_at": (datetime.utcnow() - timedelta(hours=3)).isoformat()},
    {"id": 2, "name": "GlobalTrade Ltd", "slug": "globaltrade", "industry": "Manufacturing", "plan": "Business",
     "status": "active", "owner_email": "ceo@globaltrade.com", "member_count": 6, "dataset_count": 4,
     "forecast_count": 18, "report_count": 9, "logo_color": "#EC4899",
     "settings": {"timezone": "UTC", "currency": "USD", "fiscal_year_start": "January",
                  "default_model": "Random Forest", "data_retention_days": 180},
     "created_at": (datetime.utcnow() - timedelta(days=60)).isoformat(),
     "updated_at": (datetime.utcnow() - timedelta(days=1)).isoformat()},
    {"id": 3, "name": "NovaStar Retail", "slug": "novastar", "industry": "E-Commerce", "plan": "Starter",
     "status": "trial", "owner_email": "owner@novastar.com", "member_count": 3, "dataset_count": 2,
     "forecast_count": 5, "report_count": 2, "logo_color": "#3B82F6",
     "settings": {"timezone": "US/Eastern", "currency": "USD", "fiscal_year_start": "January",
                  "default_model": "ARIMA", "data_retention_days": 90},
     "created_at": (datetime.utcnow() - timedelta(days=14)).isoformat(),
     "updated_at": (datetime.utcnow() - timedelta(days=2)).isoformat()},
]

org_members_store = [
    {"org_id": 1, "user_email": "admin@acme.com", "user_name": "Admin User", "role": "Owner", "joined_at": "120d ago"},
    {"org_id": 1, "user_email": "analyst@acme.com", "user_name": "Analyst User", "role": "Analyst", "joined_at": "90d ago"},
    {"org_id": 1, "user_email": "manager@acme.com", "user_name": "Manager User", "role": "Manager", "joined_at": "60d ago"},
    {"org_id": 2, "user_email": "ceo@globaltrade.com", "user_name": "CEO User", "role": "Owner", "joined_at": "60d ago"},
    {"org_id": 2, "user_email": "analyst@globaltrade.com", "user_name": "GT Analyst", "role": "Analyst", "joined_at": "45d ago"},
]

def _next_id(): return max((o["id"] for o in orgs_store), default=0) + 1

@router.get("/", summary="List all organizations")
def list_orgs(status: Optional[str] = Query(None), plan: Optional[str] = Query(None)):
    data = list(orgs_store)
    if status: data = [o for o in data if o["status"] == status]
    if plan: data = [o for o in data if o["plan"] == plan]
    return {"organizations": data, "total": len(data),
            "active": sum(1 for o in data if o["status"] == "active"),
            "trial": sum(1 for o in data if o["status"] == "trial")}

@router.get("/summary", summary="Platform-wide org summary")
def orgs_summary():
    return {
        "total_organizations": len(orgs_store),
        "total_members": sum(o["member_count"] for o in orgs_store),
        "total_forecasts": sum(o["forecast_count"] for o in orgs_store),
        "total_datasets": sum(o["dataset_count"] for o in orgs_store),
        "by_plan": {p: sum(1 for o in orgs_store if o["plan"] == p) for p in ["Enterprise", "Business", "Starter"]},
        "by_status": {s: sum(1 for o in orgs_store if o["status"] == s) for s in ["active", "trial", "suspended"]},
    }

@router.get("/{org_id}", summary="Get organization")
def get_org(org_id: int):
    o = next((x for x in orgs_store if x["id"] == org_id), None)
    if not o: raise HTTPException(404, "Organization not found")
    return o

@router.post("/", status_code=201, summary="Create organization")
def create_org(payload: dict):
    if not payload.get("name"): raise HTTPException(422, "name is required")
    now = datetime.utcnow().isoformat()
    org = {"id": _next_id(), "name": payload["name"],
           "slug": payload["name"].lower().replace(" ", "-"),
           "industry": payload.get("industry", "Retail"), "plan": payload.get("plan", "Starter"),
           "status": "trial", "owner_email": payload.get("owner_email", "admin@example.com"),
           "member_count": 1, "dataset_count": 0, "forecast_count": 0, "report_count": 0,
           "logo_color": random.choice(["#7C3AED", "#EC4899", "#3B82F6", "#10B981", "#F59E0B"]),
           "settings": {"timezone": "UTC", "currency": "USD", "fiscal_year_start": "January",
                        "default_model": "XGBoost", "data_retention_days": 90},
           "created_at": now, "updated_at": now}
    orgs_store.append(org)
    return org

@router.put("/{org_id}", summary="Update organization")
def update_org(org_id: int, payload: dict):
    for o in orgs_store:
        if o["id"] == org_id:
            for k in ["name", "industry", "plan", "status", "settings"]: 
                if k in payload: o[k] = payload[k]
            o["updated_at"] = datetime.utcnow().isoformat()
            return o
    raise HTTPException(404, "Not found")

@router.delete("/{org_id}", summary="Delete organization")
def delete_org(org_id: int):
    global orgs_store
    o = next((x for x in orgs_store if x["id"] == org_id), None)
    if not o: raise HTTPException(404, "Not found")
    orgs_store = [x for x in orgs_store if x["id"] != org_id]
    return {"message": f"Organization '{o['name']}' deleted"}

@router.get("/{org_id}/members", summary="Get org members")
def get_org_members(org_id: int):
    members = [m for m in org_members_store if m["org_id"] == org_id]
    return {"members": members, "total": len(members)}

@router.post("/{org_id}/members", summary="Add member to org")
def add_org_member(org_id: int, payload: dict):
    org = next((o for o in orgs_store if o["id"] == org_id), None)
    if not org: raise HTTPException(404, "Org not found")
    member = {"org_id": org_id, "user_email": payload.get("email"),
              "user_name": payload.get("name", payload.get("email", "")),
              "role": payload.get("role", "Analyst"), "joined_at": "just now"}
    org_members_store.append(member)
    org["member_count"] += 1
    return member

@router.get("/{org_id}/dashboard", summary="Org-specific dashboard metrics")
def org_dashboard(org_id: int):
    org = next((o for o in orgs_store if o["id"] == org_id), None)
    if not org: raise HTTPException(404, "Not found")
    months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov"]
    return {
        "org": org,
        "metrics": {"total_revenue": round(random.uniform(2, 30) * 1e6, 0),
                    "forecast_accuracy": round(random.uniform(88, 98), 1),
                    "active_forecasts": random.randint(3, 20),
                    "pending_approvals": random.randint(0, 5)},
        "revenue_trend": [{"month": m, "value": round(random.uniform(500, 4000) * 1000)} for m in months],
    }
