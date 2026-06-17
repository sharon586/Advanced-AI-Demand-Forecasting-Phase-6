from fastapi import APIRouter, HTTPException, Query
from typing import Optional
from datetime import datetime, timedelta
import random

router = APIRouter(prefix="/collaboration", tags=["Forecast Collaboration"])

comments_store = [
    {"id": 1, "forecast_id": 1, "project_id": 1, "user": "admin@example.com",
     "user_name": "Admin User", "message": "Accuracy looks good. Should we compare with XGBoost before finalizing?",
     "replies": [], "likes": 2, "created_at": (datetime.utcnow() - timedelta(hours=5)).isoformat()},
    {"id": 2, "forecast_id": 1, "project_id": 1, "user": "analyst@example.com",
     "user_name": "Analyst User", "message": "Agreed. XGBoost performed better last quarter. I'll run a comparison.",
     "replies": [], "likes": 1, "created_at": (datetime.utcnow() - timedelta(hours=4)).isoformat()},
    {"id": 3, "forecast_id": 2, "project_id": 1, "user": "manager@example.com",
     "user_name": "Manager User", "message": "The demand spike for Winter Jackets aligns with our logistics plan. Proceed.",
     "replies": [], "likes": 3, "created_at": (datetime.utcnow() - timedelta(days=1)).isoformat()},
]

shares_store = [
    {"id": 1, "report_id": 1, "report_name": "Q4 Electronics Monthly Report",
     "shared_by": "admin@example.com", "shared_with": ["manager@example.com", "analyst@example.com"],
     "link": "https://app.aiforecast.com/shared/rpt_q4elec_2025",
     "access": "view-only", "expires_at": (datetime.utcnow() + timedelta(days=7)).isoformat(),
     "views": 8, "created_at": (datetime.utcnow() - timedelta(days=2)).isoformat()},
    {"id": 2, "report_id": 2, "report_name": "Annual Fashion Demand Plan",
     "shared_by": "manager@example.com", "shared_with": ["admin@example.com"],
     "link": "https://app.aiforecast.com/shared/rpt_fashion_annual",
     "access": "comment", "expires_at": (datetime.utcnow() + timedelta(days=30)).isoformat(),
     "views": 3, "created_at": (datetime.utcnow() - timedelta(days=5)).isoformat()},
]

timeline_store = [
    {"id": i+1, "project_id": (i % 2) + 1,
     "user": random.choice(["admin@example.com", "analyst@example.com", "manager@example.com"]),
     "user_name": random.choice(["Admin User", "Analyst User", "Manager User"]),
     "action": random.choice(["Added comment", "Ran forecast", "Shared report", "Updated scenario",
                               "Uploaded dataset", "Changed model", "Added member", "Generated report"]),
     "detail": random.choice(["on Q4 forecast", "using XGBoost", "with manager@example.com",
                               "Optimistic growth scenario", "sales_nov.csv", "ARIMA → XGBoost",
                               "analyst@example.com joined", "Monthly PDF generated"]),
     "timestamp": (datetime.utcnow() - timedelta(hours=i*2)).isoformat()}
    for i in range(30)
]

revisions_store = [
    {"id": 1, "forecast_id": 1, "version": "v3", "changed_by": "analyst@example.com",
     "changes": "Switched model from ARIMA to XGBoost; accuracy improved from 89.4% to 97.1%",
     "accuracy_before": 89.4, "accuracy_after": 97.1,
     "timestamp": (datetime.utcnow() - timedelta(hours=3)).isoformat()},
    {"id": 2, "forecast_id": 1, "version": "v2", "changed_by": "admin@example.com",
     "changes": "Updated training dataset to include November data; 1,240 new rows added",
     "accuracy_before": 91.2, "accuracy_after": 89.4,
     "timestamp": (datetime.utcnow() - timedelta(days=2)).isoformat()},
    {"id": 3, "forecast_id": 1, "version": "v1", "changed_by": "admin@example.com",
     "changes": "Initial forecast created with ARIMA model",
     "accuracy_before": None, "accuracy_after": 91.2,
     "timestamp": (datetime.utcnow() - timedelta(days=5)).isoformat()},
]

def _next_comment_id():
    return max((c["id"] for c in comments_store), default=0) + 1

@router.get("/comments", summary="Get comments for a forecast or project")
def get_comments(forecast_id: Optional[int] = Query(None), project_id: Optional[int] = Query(None)):
    data = list(comments_store)
    if forecast_id is not None:
        data = [c for c in data if c["forecast_id"] == forecast_id]
    if project_id is not None:
        data = [c for c in data if c["project_id"] == project_id]
    return {"comments": list(reversed(data)), "total": len(data)}

@router.post("/comments", status_code=201, summary="Add comment")
def add_comment(payload: dict):
    if not payload.get("message"):
        raise HTTPException(422, "message is required")
    comment = {
        "id": _next_comment_id(),
        "forecast_id": payload.get("forecast_id", 1),
        "project_id": payload.get("project_id", 1),
        "user": payload.get("user", "admin@example.com"),
        "user_name": payload.get("user_name", "Admin User"),
        "message": payload["message"],
        "replies": [],
        "likes": 0,
        "created_at": datetime.utcnow().isoformat(),
    }
    comments_store.append(comment)
    return comment

@router.put("/comments/{comment_id}", summary="Edit comment")
def edit_comment(comment_id: int, payload: dict):
    for c in comments_store:
        if c["id"] == comment_id:
            if "message" in payload:
                c["message"] = payload["message"]
                c["edited"] = True
            return c
    raise HTTPException(404, "Comment not found")

@router.delete("/comments/{comment_id}", summary="Delete comment")
def delete_comment(comment_id: int):
    global comments_store
    c = next((x for x in comments_store if x["id"] == comment_id), None)
    if not c:
        raise HTTPException(404, "Comment not found")
    comments_store = [x for x in comments_store if x["id"] != comment_id]
    return {"message": "Comment deleted"}

@router.post("/comments/{comment_id}/like", summary="Like a comment")
def like_comment(comment_id: int):
    for c in comments_store:
        if c["id"] == comment_id:
            c["likes"] += 1
            return {"likes": c["likes"]}
    raise HTTPException(404, "Comment not found")

@router.get("/shares", summary="List shared reports")
def get_shares():
    return {"shares": shares_store, "total": len(shares_store)}

@router.post("/shares", status_code=201, summary="Share a report")
def share_report(payload: dict):
    new_share = {
        "id": len(shares_store) + 1,
        "report_id": payload.get("report_id", 1),
        "report_name": payload.get("report_name", "Report"),
        "shared_by": payload.get("shared_by", "admin@example.com"),
        "shared_with": payload.get("shared_with", []),
        "link": f"https://app.aiforecast.com/shared/rpt_{datetime.utcnow().timestamp():.0f}",
        "access": payload.get("access", "view-only"),
        "expires_at": (datetime.utcnow() + timedelta(days=payload.get("expires_days", 7))).isoformat(),
        "views": 0,
        "created_at": datetime.utcnow().isoformat(),
    }
    shares_store.append(new_share)
    return new_share

@router.delete("/shares/{share_id}", summary="Revoke shared link")
def revoke_share(share_id: int):
    global shares_store
    shares_store = [s for s in shares_store if s["id"] != share_id]
    return {"message": "Share link revoked"}

@router.get("/timeline", summary="Activity timeline for a project")
def get_timeline(project_id: Optional[int] = Query(None), limit: int = Query(20)):
    data = timeline_store
    if project_id is not None:
        data = [t for t in data if t["project_id"] == project_id]
    return {"timeline": list(reversed(data))[:limit], "total": len(data)}

@router.get("/revisions", summary="Forecast revision history")
def get_revisions(forecast_id: Optional[int] = Query(None)):
    data = revisions_store
    if forecast_id is not None:
        data = [r for r in data if r["forecast_id"] == forecast_id]
    return {"revisions": data, "total": len(data)}
