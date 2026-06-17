from fastapi import APIRouter, HTTPException, Query
from typing import Optional
from datetime import datetime, timedelta
import random

router = APIRouter(prefix="/notification-center", tags=["Notification Center"])

notifications_db = [
    {"id": i+1,
     "title": random.choice(["Forecast Approved", "Dataset Uploaded", "Low Accuracy Alert",
                               "Report Ready", "Approval Pending", "Workflow Completed",
                               "Org Announcement", "KPI Threshold Breached"]),
     "message": random.choice(["Q4 Electronics forecast approved by admin",
                                "sales_nov.csv processed — 1,240 rows added",
                                "XGBoost accuracy dropped to 88.2% — action needed",
                                "Monthly Executive Report is ready for download",
                                "Fashion forecast pending your review for 6+ hours",
                                "Auto Forecast workflow completed — 26 runs succeeded",
                                "Platform maintenance scheduled Dec 5, 2025 02:00–04:00 UTC",
                                "Revenue Growth KPI breached warning threshold"]),
     "type": random.choice(["success", "warning", "error", "info"]),
     "channel": random.choice(["in-app", "email", "both"]),
     "role": random.choice(["all", "admin", "manager", "analyst"]),
     "org": random.choice(["Acme Corp", "GlobalTrade Ltd", "all"]),
     "is_read": random.choice([True, False, False]),
     "is_announcement": i > 17,
     "created_at": (datetime.utcnow() - timedelta(hours=i*3)).isoformat()}
    for i in range(20)
]

preferences_store = {
    "admin@example.com": {
        "email_enabled": True, "email_address": "admin@example.com",
        "in_app": True, "digest": "realtime",
        "channels": {"forecast_complete": {"in_app": True, "email": True},
                     "approval_required": {"in_app": True, "email": True},
                     "dataset_upload": {"in_app": True, "email": False},
                     "report_ready": {"in_app": True, "email": True},
                     "kpi_alert": {"in_app": True, "email": True},
                     "workflow_complete": {"in_app": True, "email": False},
                     "org_announcement": {"in_app": True, "email": True}},
    }
}

announcements_store = [
    {"id": 1, "title": "Platform Maintenance — Dec 5, 2025",
     "message": "Scheduled maintenance from 02:00–04:00 UTC. Forecasting will be unavailable during this window.",
     "severity": "warning", "audience": "all", "posted_by": "admin@example.com",
     "is_active": True, "created_at": (datetime.utcnow() - timedelta(days=1)).isoformat()},
    {"id": 2, "title": "New Feature: Scenario Planning Now Live",
     "message": "Phase 5 is live! Explore Scenario Planning, Executive Dashboard, and AI Insights Engine.",
     "severity": "info", "audience": "all", "posted_by": "admin@example.com",
     "is_active": True, "created_at": (datetime.utcnow() - timedelta(days=5)).isoformat()},
]

@router.get("/", summary="Get all notifications")
def get_notifications(role: Optional[str] = Query(None), is_read: Optional[bool] = Query(None),
                      type: Optional[str] = Query(None), limit: int = Query(20)):
    data = list(reversed(notifications_db))
    if role: data = [n for n in data if n["role"] in [role, "all"]]
    if is_read is not None: data = [n for n in data if n["is_read"] == is_read]
    if type: data = [n for n in data if n["type"] == type]
    return {"notifications": data[:limit], "total": len(data),
            "unread": sum(1 for n in notifications_db if not n["is_read"])}

@router.put("/{notif_id}/read", summary="Mark notification as read")
def mark_read(notif_id: int):
    for n in notifications_db:
        if n["id"] == notif_id:
            n["is_read"] = True
            return {"message": "Marked as read", "notification": n}
    raise HTTPException(404, "Not found")

@router.put("/read-all", summary="Mark all notifications as read")
def mark_all_read():
    for n in notifications_db:
        n["is_read"] = True
    return {"message": "All notifications marked as read"}

@router.delete("/{notif_id}", summary="Delete notification")
def delete_notification(notif_id: int):
    global notifications_db
    n = next((x for x in notifications_db if x["id"] == notif_id), None)
    if not n: raise HTTPException(404, "Not found")
    notifications_db = [x for x in notifications_db if x["id"] != notif_id]
    return {"message": "Deleted"}

@router.get("/preferences/{user_email}", summary="Get notification preferences")
def get_preferences(user_email: str):
    prefs = preferences_store.get(user_email)
    if not prefs:
        return {"user_email": user_email, "email_enabled": False,
                "in_app": True, "digest": "daily",
                "channels": {k: {"in_app": True, "email": False}
                             for k in ["forecast_complete", "approval_required", "dataset_upload",
                                       "report_ready", "kpi_alert", "workflow_complete", "org_announcement"]}}
    return {"user_email": user_email, **prefs}

@router.put("/preferences/{user_email}", summary="Update notification preferences")
def update_preferences(user_email: str, payload: dict):
    if user_email not in preferences_store:
        preferences_store[user_email] = {"email_enabled": False, "email_address": user_email,
                                          "in_app": True, "digest": "daily", "channels": {}}
    prefs = preferences_store[user_email]
    for k in ["email_enabled", "email_address", "in_app", "digest", "channels"]:
        if k in payload: prefs[k] = payload[k]
    return {"user_email": user_email, **prefs}

@router.get("/announcements", summary="Get org-wide announcements")
def get_announcements(is_active: Optional[bool] = Query(None)):
    data = list(announcements_store)
    if is_active is not None: data = [a for a in data if a["is_active"] == is_active]
    return {"announcements": data, "total": len(data)}

@router.post("/announcements", status_code=201, summary="Create org-wide announcement")
def create_announcement(payload: dict):
    if not payload.get("title"): raise HTTPException(422, "title required")
    ann = {"id": len(announcements_store)+1, "title": payload["title"],
           "message": payload.get("message", ""), "severity": payload.get("severity", "info"),
           "audience": payload.get("audience", "all"), "posted_by": payload.get("posted_by", "admin@example.com"),
           "is_active": True, "created_at": datetime.utcnow().isoformat()}
    announcements_store.append(ann)
    return ann

@router.put("/announcements/{ann_id}/toggle", summary="Activate/deactivate announcement")
def toggle_announcement(ann_id: int):
    for a in announcements_store:
        if a["id"] == ann_id:
            a["is_active"] = not a["is_active"]
            return a
    raise HTTPException(404, "Not found")

@router.delete("/announcements/{ann_id}", summary="Delete announcement")
def delete_announcement(ann_id: int):
    global announcements_store
    announcements_store = [a for a in announcements_store if a["id"] != ann_id]
    return {"message": "Deleted"}

@router.get("/history", summary="Full notification history log")
def notification_history(limit: int = Query(50)):
    return {"history": list(reversed(notifications_db))[:limit],
            "total": len(notifications_db),
            "sent_today": sum(1 for n in notifications_db
                              if datetime.fromisoformat(n["created_at"]) > datetime.utcnow() - timedelta(hours=24))}
