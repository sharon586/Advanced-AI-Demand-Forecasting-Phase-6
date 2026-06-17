from fastapi import APIRouter, HTTPException, Query
from typing import Optional
from datetime import datetime, timedelta
import random

router = APIRouter(prefix="/governance", tags=["Forecast Governance Center"])

versions_store = [
    {"id": 1, "forecast_id": 101, "forecast_name": "Q4 Electronics Forecast",
     "version": "v3", "status": "approved", "model": "XGBoost", "accuracy": 97.1,
     "created_by": "analyst@example.com", "approved_by": "admin@example.com",
     "changes": "Switched from ARIMA to XGBoost; accuracy improved from 89.4% to 97.1%",
     "is_current": True, "created_at": (datetime.utcnow() - timedelta(hours=3)).isoformat()},
    {"id": 2, "forecast_id": 101, "forecast_name": "Q4 Electronics Forecast",
     "version": "v2", "status": "rejected", "model": "ARIMA", "accuracy": 89.4,
     "created_by": "analyst@example.com", "approved_by": "manager@example.com",
     "changes": "Updated dataset with November data", "is_current": False,
     "created_at": (datetime.utcnow() - timedelta(days=2)).isoformat()},
    {"id": 3, "forecast_id": 101, "forecast_name": "Q4 Electronics Forecast",
     "version": "v1", "status": "superseded", "model": "ARIMA", "accuracy": 91.2,
     "created_by": "admin@example.com", "approved_by": None,
     "changes": "Initial forecast", "is_current": False,
     "created_at": (datetime.utcnow() - timedelta(days=5)).isoformat()},
    {"id": 4, "forecast_id": 102, "forecast_name": "Fashion Annual Plan",
     "version": "v1", "status": "approved", "model": "Random Forest", "accuracy": 95.2,
     "created_by": "manager@example.com", "approved_by": "admin@example.com",
     "changes": "Initial forecast", "is_current": True,
     "created_at": (datetime.utcnow() - timedelta(days=1)).isoformat()},
]

modification_log = [
    {"id": i+1, "forecast_id": random.choice([101, 102]),
     "forecast_name": random.choice(["Q4 Electronics Forecast", "Fashion Annual Plan"]),
     "modified_by": random.choice(["analyst@example.com", "manager@example.com", "admin@example.com"]),
     "modification_type": random.choice(["Dataset Updated", "Model Changed", "Variables Adjusted",
                                          "Version Created", "Submitted for Approval"]),
     "detail": random.choice(["Added Nov 2025 data", "ARIMA → XGBoost", "Demand factor: 1.0 → 1.2",
                               "v3 created", "Submitted to manager@example.com"]),
     "timestamp": (datetime.utcnow() - timedelta(hours=i*6)).isoformat()}
    for i in range(20)
]

lifecycle_stages = ["Draft", "Review", "Approved", "Published", "Archived"]

@router.get("/dashboard", summary="Governance dashboard overview")
def governance_dashboard():
    return {
        "version_control": {"total_versions": len(versions_store),
                             "current_versions": sum(1 for v in versions_store if v["is_current"]),
                             "approved": sum(1 for v in versions_store if v["status"] == "approved")},
        "approval_health": {"total": 4, "approved": 2, "pending": 1, "rejected": 1, "rate": "50%"},
        "modification_activity": {"last_24h": 8, "last_7d": 28, "last_30d": 95},
        "lifecycle": {s: random.randint(1, 10) for s in lifecycle_stages},
        "compliance_score": 87,
        "last_audit": (datetime.utcnow() - timedelta(hours=6)).isoformat(),
    }

@router.get("/versions", summary="Forecast version control")
def get_versions(forecast_id: Optional[int] = Query(None)):
    data = list(versions_store)
    if forecast_id: data = [v for v in data if v["forecast_id"] == forecast_id]
    return {"versions": data, "total": len(data)}

@router.get("/versions/{version_id}", summary="Get version details")
def get_version(version_id: int):
    v = next((x for x in versions_store if x["id"] == version_id), None)
    if not v: raise HTTPException(404, "Not found")
    return v

@router.post("/versions", status_code=201, summary="Create new forecast version")
def create_version(payload: dict):
    now = datetime.utcnow().isoformat()
    # Mark previous versions as not current
    for v in versions_store:
        if v["forecast_id"] == payload.get("forecast_id"):
            v["is_current"] = False
            if v["status"] == "approved": v["status"] = "superseded"
    ver = {"id": len(versions_store)+1,
           "forecast_id": payload.get("forecast_id", 101),
           "forecast_name": payload.get("forecast_name", "Forecast"),
           "version": f"v{len([v for v in versions_store if v['forecast_id']==payload.get('forecast_id',101)])+1}",
           "status": "draft", "model": payload.get("model", "XGBoost"),
           "accuracy": payload.get("accuracy", 0),
           "created_by": payload.get("created_by", "analyst@example.com"),
           "approved_by": None, "changes": payload.get("changes", "New version"),
           "is_current": True, "created_at": now}
    versions_store.append(ver)
    return ver

@router.get("/modifications", summary="Track all forecast modifications")
def get_modifications(forecast_id: Optional[int] = Query(None), limit: int = Query(20)):
    data = list(reversed(modification_log))
    if forecast_id: data = [m for m in data if m["forecast_id"] == forecast_id]
    return {"modifications": data[:limit], "total": len(data)}

@router.get("/approval-records", summary="All approval records for audit")
def get_approval_records():
    records = [
        {"forecast_name": v["forecast_name"], "version": v["version"], "model": v["model"],
         "accuracy": v["accuracy"], "status": v["status"],
         "submitted_by": v["created_by"], "approved_by": v["approved_by"],
         "created_at": v["created_at"]}
        for v in versions_store
    ]
    return {"records": records, "total": len(records)}

@router.get("/lifecycle", summary="Forecast lifecycle management")
def get_lifecycle():
    forecasts = [
        {"id": 101, "name": "Q4 Electronics Forecast", "current_stage": "Published",
         "current_version": "v3", "next_action": "Archive after Q4 ends", "compliance": True},
        {"id": 102, "name": "Fashion Annual Plan", "current_stage": "Approved",
         "current_version": "v1", "next_action": "Publish to stakeholders", "compliance": True},
        {"id": 103, "name": "Grocery Restock Weekly", "current_stage": "Draft",
         "current_version": "v1", "next_action": "Submit for review", "compliance": False},
    ]
    return {"forecasts": forecasts, "stages": lifecycle_stages}
