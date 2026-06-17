from fastapi import APIRouter, HTTPException, Query
from typing import Optional
from datetime import datetime, timedelta
import random

router = APIRouter(prefix="/approvals", tags=["Forecast Approval Workflow"])

approvals_store = [
    {"id": 1, "forecast_name": "Q4 Electronics XGBoost Forecast", "forecast_id": 101,
     "submitted_by": "analyst@example.com", "submitted_by_name": "Analyst User",
     "assigned_to": "manager@example.com", "assigned_to_name": "Manager User",
     "status": "pending", "priority": "high",
     "accuracy": 97.1, "model": "XGBoost", "category": "Electronics", "region": "North",
     "notes": "Q4 holiday season forecast. XGBoost shows best accuracy.",
     "submitted_at": (datetime.utcnow() - timedelta(hours=3)).isoformat(),
     "reviewed_at": None, "reviewer_comment": ""},
    {"id": 2, "forecast_name": "Annual Fashion Demand Plan", "forecast_id": 102,
     "submitted_by": "analyst@example.com", "submitted_by_name": "Analyst User",
     "assigned_to": "admin@example.com", "assigned_to_name": "Admin User",
     "status": "approved", "priority": "medium",
     "accuracy": 95.2, "model": "Random Forest", "category": "Fashion", "region": "All",
     "notes": "Annual fashion demand plan for Q1-Q4 2026.",
     "submitted_at": (datetime.utcnow() - timedelta(days=2)).isoformat(),
     "reviewed_at": (datetime.utcnow() - timedelta(days=1)).isoformat(),
     "reviewer_comment": "Approved. Accuracy is acceptable. Proceed with planning."},
    {"id": 3, "forecast_name": "Grocery Restock Weekly", "forecast_id": 103,
     "submitted_by": "manager@example.com", "submitted_by_name": "Manager User",
     "assigned_to": "admin@example.com", "assigned_to_name": "Admin User",
     "status": "rejected", "priority": "low",
     "accuracy": 88.5, "model": "ARIMA", "category": "Groceries", "region": "South",
     "notes": "Weekly restock forecast. ARIMA used due to seasonal patterns.",
     "submitted_at": (datetime.utcnow() - timedelta(days=5)).isoformat(),
     "reviewed_at": (datetime.utcnow() - timedelta(days=4)).isoformat(),
     "reviewer_comment": "Rejected. Accuracy below 90% threshold. Retrain with XGBoost."},
    {"id": 4, "forecast_name": "Furniture Q1 Demand Forecast", "forecast_id": 104,
     "submitted_by": "analyst@example.com", "submitted_by_name": "Analyst User",
     "assigned_to": "manager@example.com", "assigned_to_name": "Manager User",
     "status": "pending", "priority": "medium",
     "accuracy": 91.8, "model": "Random Forest", "category": "Furniture", "region": "West",
     "notes": "Q1 2026 furniture demand forecast.",
     "submitted_at": (datetime.utcnow() - timedelta(hours=8)).isoformat(),
     "reviewed_at": None, "reviewer_comment": ""},
]

audit_trail = [
    {"id": i+1, "approval_id": random.choice([1,2,3,4]),
     "action": random.choice(["Submitted","Approved","Rejected","Reassigned","Comment Added"]),
     "performed_by": random.choice(["analyst@example.com","manager@example.com","admin@example.com"]),
     "detail": random.choice(["Submitted for review","Accuracy meets threshold","Below accuracy threshold",
                               "Reassigned to admin","Added review note"]),
     "timestamp": (datetime.utcnow() - timedelta(hours=i*4)).isoformat()}
    for i in range(20)
]

def _next_id(): return max((a["id"] for a in approvals_store), default=0) + 1

@router.get("/", summary="List all approval requests")
def list_approvals(status: Optional[str] = Query(None), assigned_to: Optional[str] = Query(None),
                   submitted_by: Optional[str] = Query(None)):
    data = list(approvals_store)
    if status: data = [a for a in data if a["status"] == status]
    if assigned_to: data = [a for a in data if a["assigned_to"] == assigned_to]
    if submitted_by: data = [a for a in data if a["submitted_by"] == submitted_by]
    return {"approvals": data, "total": len(data),
            "pending": sum(1 for a in data if a["status"] == "pending"),
            "approved": sum(1 for a in data if a["status"] == "approved"),
            "rejected": sum(1 for a in data if a["status"] == "rejected")}

@router.get("/summary", summary="Approval workflow summary stats")
def approval_summary():
    return {
        "total": len(approvals_store),
        "pending": sum(1 for a in approvals_store if a["status"] == "pending"),
        "approved": sum(1 for a in approvals_store if a["status"] == "approved"),
        "rejected": sum(1 for a in approvals_store if a["status"] == "rejected"),
        "avg_accuracy_approved": round(
            sum(a["accuracy"] for a in approvals_store if a["status"] == "approved") /
            max(sum(1 for a in approvals_store if a["status"] == "approved"), 1), 2),
        "approval_rate": f"{round(sum(1 for a in approvals_store if a['status']=='approved')/len(approvals_store)*100)}%"
    }

@router.get("/{approval_id}", summary="Get approval details")
def get_approval(approval_id: int):
    a = next((x for x in approvals_store if x["id"] == approval_id), None)
    if not a: raise HTTPException(404, "Not found")
    return a

@router.post("/", status_code=201, summary="Submit forecast for approval")
def submit_approval(payload: dict):
    if not payload.get("forecast_name"): raise HTTPException(422, "forecast_name required")
    now = datetime.utcnow().isoformat()
    ap = {"id": _next_id(), "forecast_name": payload["forecast_name"],
          "forecast_id": payload.get("forecast_id", random.randint(100,999)),
          "submitted_by": payload.get("submitted_by", "analyst@example.com"),
          "submitted_by_name": payload.get("submitted_by_name", "Analyst User"),
          "assigned_to": payload.get("assigned_to", "manager@example.com"),
          "assigned_to_name": payload.get("assigned_to_name", "Manager User"),
          "status": "pending", "priority": payload.get("priority", "medium"),
          "accuracy": payload.get("accuracy", 90.0), "model": payload.get("model", "XGBoost"),
          "category": payload.get("category", "All"), "region": payload.get("region", "All"),
          "notes": payload.get("notes", ""), "submitted_at": now,
          "reviewed_at": None, "reviewer_comment": ""}
    approvals_store.append(ap)
    audit_trail.append({"id": len(audit_trail)+1, "approval_id": ap["id"],
                         "action": "Submitted", "performed_by": ap["submitted_by"],
                         "detail": f"Submitted '{ap['forecast_name']}' for approval",
                         "timestamp": now})
    return ap

@router.put("/{approval_id}/approve", summary="Approve a forecast")
def approve_forecast(approval_id: int, payload: dict):
    a = next((x for x in approvals_store if x["id"] == approval_id), None)
    if not a: raise HTTPException(404, "Not found")
    if a["status"] != "pending": raise HTTPException(400, "Only pending approvals can be approved")
    now = datetime.utcnow().isoformat()
    a["status"] = "approved"
    a["reviewed_at"] = now
    a["reviewer_comment"] = payload.get("comment", "Approved.")
    audit_trail.append({"id": len(audit_trail)+1, "approval_id": approval_id,
                         "action": "Approved", "performed_by": payload.get("reviewer", "admin@example.com"),
                         "detail": a["reviewer_comment"], "timestamp": now})
    return a

@router.put("/{approval_id}/reject", summary="Reject a forecast")
def reject_forecast(approval_id: int, payload: dict):
    a = next((x for x in approvals_store if x["id"] == approval_id), None)
    if not a: raise HTTPException(404, "Not found")
    if a["status"] != "pending": raise HTTPException(400, "Only pending approvals can be rejected")
    now = datetime.utcnow().isoformat()
    a["status"] = "rejected"
    a["reviewed_at"] = now
    a["reviewer_comment"] = payload.get("comment", "Rejected.")
    audit_trail.append({"id": len(audit_trail)+1, "approval_id": approval_id,
                         "action": "Rejected", "performed_by": payload.get("reviewer", "admin@example.com"),
                         "detail": a["reviewer_comment"], "timestamp": now})
    return a

@router.put("/{approval_id}/reassign", summary="Reassign approval to another reviewer")
def reassign_approval(approval_id: int, payload: dict):
    a = next((x for x in approvals_store if x["id"] == approval_id), None)
    if not a: raise HTTPException(404, "Not found")
    a["assigned_to"] = payload.get("email", a["assigned_to"])
    a["assigned_to_name"] = payload.get("name", a["assigned_to_name"])
    audit_trail.append({"id": len(audit_trail)+1, "approval_id": approval_id,
                         "action": "Reassigned", "performed_by": "admin@example.com",
                         "detail": f"Reassigned to {a['assigned_to']}", "timestamp": datetime.utcnow().isoformat()})
    return a

@router.get("/audit/trail", summary="Full approval audit trail")
def get_audit_trail(approval_id: Optional[int] = Query(None), limit: int = Query(20)):
    data = list(reversed(audit_trail))
    if approval_id: data = [x for x in data if x["approval_id"] == approval_id]
    return {"trail": data[:limit], "total": len(data)}
