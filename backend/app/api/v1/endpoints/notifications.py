from fastapi import APIRouter, Query, HTTPException
from typing import Optional
from datetime import datetime, timedelta
import random

router = APIRouter(prefix="/notifications", tags=["Notifications"])

# In-memory notifications store
notifications_store = [
    {
        "id": 1, "user_email": "admin@example.com",
        "title": "Forecast Completed",
        "message": "Random Forest forecast for Electronics category completed with 96.8% accuracy.",
        "notification_type": "success", "is_read": False,
        "created_at": (datetime.utcnow() - timedelta(minutes=5)).isoformat()
    },
    {
        "id": 2, "user_email": "admin@example.com",
        "title": "Dataset Uploaded",
        "message": "sales_q4_2025.csv uploaded successfully. 1,240 rows processed.",
        "notification_type": "success", "is_read": False,
        "created_at": (datetime.utcnow() - timedelta(hours=1)).isoformat()
    },
    {
        "id": 3, "user_email": "admin@example.com",
        "title": "Report Generated",
        "message": "Q4 2025 Annual Report has been generated and is ready for download.",
        "notification_type": "info", "is_read": True,
        "created_at": (datetime.utcnow() - timedelta(hours=3)).isoformat()
    },
    {
        "id": 4, "user_email": "admin@example.com",
        "title": "Dataset Upload Failed",
        "message": "corrupt_data.csv upload failed. File appears to be invalid or corrupted.",
        "notification_type": "error", "is_read": True,
        "created_at": (datetime.utcnow() - timedelta(days=1)).isoformat()
    },
    {
        "id": 5, "user_email": "admin@example.com",
        "title": "Low Stock Alert",
        "message": "Critical: Headphones Pro X1 has only 12 units remaining (3 days supply).",
        "notification_type": "warning", "is_read": False,
        "created_at": (datetime.utcnow() - timedelta(hours=2)).isoformat()
    },
]


@router.get("/")
def get_notifications(
    user_email: Optional[str] = Query(None),
    is_read: Optional[bool] = Query(None),
    notification_type: Optional[str] = Query(None),
    page: int = Query(1, ge=1),
    per_page: int = Query(20, ge=1, le=100)
):
    filtered = notifications_store

    if user_email:
        filtered = [n for n in filtered if n["user_email"] == user_email]
    if is_read is not None:
        filtered = [n for n in filtered if n["is_read"] == is_read]
    if notification_type:
        filtered = [n for n in filtered if n["notification_type"] == notification_type]

    total = len(filtered)
    unread_count = len([n for n in filtered if not n["is_read"]])
    start = (page - 1) * per_page
    paginated = sorted(filtered, key=lambda x: x["id"], reverse=True)[start:start + per_page]

    return {
        "notifications": paginated,
        "total": total,
        "unread_count": unread_count,
        "page": page,
        "total_pages": (total + per_page - 1) // per_page
    }


@router.put("/{notification_id}/read")
def mark_as_read(notification_id: int):
    notif = next((n for n in notifications_store if n["id"] == notification_id), None)
    if not notif:
        raise HTTPException(status_code=404, detail="Notification not found")
    notif["is_read"] = True
    return {"message": "Marked as read", "notification": notif}


@router.put("/read-all")
def mark_all_read(user_email: Optional[str] = Query(None)):
    for n in notifications_store:
        if user_email is None or n["user_email"] == user_email:
            n["is_read"] = True
    return {"message": "All notifications marked as read"}


@router.delete("/{notification_id}")
def delete_notification(notification_id: int):
    global notifications_store
    notif = next((n for n in notifications_store if n["id"] == notification_id), None)
    if not notif:
        raise HTTPException(status_code=404, detail="Notification not found")
    notifications_store = [n for n in notifications_store if n["id"] != notification_id]
    return {"message": "Notification deleted"}


@router.post("/")
def create_notification(
    user_email: str = Query(...),
    title: str = Query(...),
    message: str = Query(...),
    notification_type: str = Query("info")
):
    new_id = max([n["id"] for n in notifications_store], default=0) + 1
    notif = {
        "id": new_id,
        "user_email": user_email,
        "title": title,
        "message": message,
        "notification_type": notification_type,
        "is_read": False,
        "created_at": datetime.utcnow().isoformat()
    }
    notifications_store.append(notif)
    return {"message": "Notification created", "notification": notif}
