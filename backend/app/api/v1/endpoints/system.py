from fastapi import APIRouter, Query
from datetime import datetime, timedelta
import random

router = APIRouter(prefix="/system", tags=["System Monitoring"])

activity_log = [
    {"id": 1, "user": "admin@example.com", "action": "forecast_run", "detail": "Random Forest — Electronics/North", "ip": "192.168.1.10", "status": "success", "duration_ms": 245, "timestamp": (datetime.utcnow() - timedelta(minutes=5)).isoformat()},
    {"id": 2, "user": "analyst@example.com", "action": "dataset_upload", "detail": "sales_q4.csv (1240 rows)", "ip": "192.168.1.12", "status": "success", "duration_ms": 820, "timestamp": (datetime.utcnow() - timedelta(minutes=22)).isoformat()},
    {"id": 3, "user": "manager@example.com", "action": "report_export", "detail": "Annual Revenue PDF", "ip": "192.168.1.15", "status": "success", "duration_ms": 1240, "timestamp": (datetime.utcnow() - timedelta(hours=1)).isoformat()},
    {"id": 4, "user": "sneha@example.com", "action": "login", "detail": "Login attempt — account inactive", "ip": "192.168.1.20", "status": "failed", "duration_ms": 120, "timestamp": (datetime.utcnow() - timedelta(hours=2)).isoformat()},
    {"id": 5, "user": "admin@example.com", "action": "model_compare", "detail": "4 models benchmarked", "ip": "192.168.1.10", "status": "success", "duration_ms": 1850, "timestamp": (datetime.utcnow() - timedelta(hours=3)).isoformat()},
    {"id": 6, "user": "analyst@example.com", "action": "forecast_run", "detail": "XGBoost — Fashion/South", "ip": "192.168.1.12", "status": "success", "duration_ms": 312, "timestamp": (datetime.utcnow() - timedelta(hours=5)).isoformat()},
    {"id": 7, "user": "manager@example.com", "action": "dataset_upload", "detail": "corrupt.csv — invalid format", "ip": "192.168.1.15", "status": "failed", "duration_ms": 95, "timestamp": (datetime.utcnow() - timedelta(hours=6)).isoformat()},
    {"id": 8, "user": "admin@example.com", "action": "user_manage", "detail": "Deactivated user sneha@example.com", "ip": "192.168.1.10", "status": "success", "duration_ms": 88, "timestamp": (datetime.utcnow() - timedelta(days=1)).isoformat()},
]

@router.get("/activity-logs")
def get_activity_logs(
    page: int = Query(1, ge=1),
    per_page: int = Query(20, ge=1, le=100),
    user: str = Query(None),
    action: str = Query(None),
    status: str = Query(None)
):
    filtered = activity_log
    if user: filtered = [a for a in filtered if user.lower() in a["user"].lower()]
    if action: filtered = [a for a in filtered if a["action"] == action]
    if status: filtered = [a for a in filtered if a["status"] == status]
    total = len(filtered)
    start = (page - 1) * per_page
    return {
        "logs": filtered[start:start+per_page],
        "total": total,
        "page": page,
        "total_pages": (total + per_page - 1) // per_page
    }

@router.get("/performance")
def system_performance():
    return {
        "cpu_usage": round(random.uniform(18, 45), 1),
        "memory_usage": round(random.uniform(42, 68), 1),
        "disk_usage": round(random.uniform(28, 52), 1),
        "api_latency_ms": random.randint(85, 320),
        "requests_per_min": random.randint(12, 48),
        "error_rate_pct": round(random.uniform(0.2, 1.8), 2),
        "cache_hit_rate": round(random.uniform(72, 94), 1),
        "db_query_avg_ms": random.randint(12, 85),
        "uptime_hours": 2184,
        "uptime_pct": 99.8,
        "endpoint_stats": [
            {"endpoint": "/forecast/random-forest", "avg_ms": 245, "calls_today": 84},
            {"endpoint": "/analytics/summary", "avg_ms": 120, "calls_today": 312},
            {"endpoint": "/datasets/upload", "avg_ms": 820, "calls_today": 28},
            {"endpoint": "/reports/", "avg_ms": 185, "calls_today": 96},
            {"endpoint": "/auth/login", "avg_ms": 210, "calls_today": 47},
        ]
    }

@router.get("/api-monitor")
def api_monitor():
    hours = [(datetime.utcnow() - timedelta(hours=i)).strftime("%H:00") for i in range(23, -1, -1)]
    calls = [random.randint(8, 65) for _ in hours]
    errors = [random.randint(0, 3) for _ in hours]
    return {
        "hourly_calls": [{"hour": h, "calls": c, "errors": e} for h, c, e in zip(hours, calls, errors)],
        "total_today": sum(calls),
        "total_errors_today": sum(errors),
        "most_called": "/analytics/summary",
        "slowest": "/datasets/upload"
    }
