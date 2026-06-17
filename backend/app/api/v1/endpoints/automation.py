from fastapi import APIRouter, HTTPException, Query
from typing import Optional, List
from datetime import datetime, timedelta
import random

router = APIRouter(prefix="/automation", tags=["Smart Automation"])

# In-memory stores
schedules_store = [
    {"id": 1, "name": "Daily Electronics Forecast", "model": "Random Forest", "category": "Electronics",
     "region": "North", "interval": "daily", "time": "08:00", "is_active": True,
     "last_run": (datetime.utcnow() - timedelta(hours=6)).isoformat(),
     "next_run": (datetime.utcnow() + timedelta(hours=18)).isoformat(),
     "created_at": (datetime.utcnow() - timedelta(days=7)).isoformat()},
    {"id": 2, "name": "Weekly All-Category Forecast", "model": "XGBoost", "category": "All",
     "region": "All", "interval": "weekly", "time": "09:00", "is_active": True,
     "last_run": (datetime.utcnow() - timedelta(days=3)).isoformat(),
     "next_run": (datetime.utcnow() + timedelta(days=4)).isoformat(),
     "created_at": (datetime.utcnow() - timedelta(days=14)).isoformat()},
    {"id": 3, "name": "Monthly Groceries Report", "model": "ARIMA", "category": "Groceries",
     "region": "South", "interval": "monthly", "time": "07:00", "is_active": False,
     "last_run": (datetime.utcnow() - timedelta(days=12)).isoformat(),
     "next_run": (datetime.utcnow() + timedelta(days=18)).isoformat(),
     "created_at": (datetime.utcnow() - timedelta(days=30)).isoformat()},
]

alert_configs = [
    {"id": 1, "name": "Low Accuracy Alert", "type": "accuracy", "threshold": 85.0,
     "condition": "below", "is_active": True, "channel": "in-app", "created_at": datetime.utcnow().isoformat()},
    {"id": 2, "name": "High RMSE Alert", "type": "rmse", "threshold": 5000.0,
     "condition": "above", "is_active": True, "channel": "email", "created_at": datetime.utcnow().isoformat()},
    {"id": 3, "name": "Demand Spike Alert", "type": "demand_spike", "threshold": 25.0,
     "condition": "above", "is_active": True, "channel": "in-app", "created_at": datetime.utcnow().isoformat()},
]

workflow_runs = [
    {"id": 1, "schedule_name": "Daily Electronics Forecast", "status": "success",
     "duration_seconds": 12, "triggered_at": (datetime.utcnow() - timedelta(hours=6)).isoformat(),
     "result": "Forecast generated: 94.2% accuracy"},
    {"id": 2, "schedule_name": "Weekly All-Category Forecast", "status": "success",
     "duration_seconds": 38, "triggered_at": (datetime.utcnow() - timedelta(days=3)).isoformat(),
     "result": "All 4 models compared, best: XGBoost 97.1%"},
    {"id": 3, "schedule_name": "Monthly Groceries Report", "status": "failed",
     "duration_seconds": 5, "triggered_at": (datetime.utcnow() - timedelta(days=12)).isoformat(),
     "result": "Error: No dataset available for Groceries"},
]

@router.get("/schedules")
def get_schedules(is_active: Optional[bool] = Query(None)):
    data = schedules_store
    if is_active is not None:
        data = [s for s in data if s["is_active"] == is_active]
    return {"schedules": data, "total": len(data)}

@router.post("/schedules")
def create_schedule(payload: dict):
    new_id = max([s["id"] for s in schedules_store], default=0) + 1
    schedule = {
        "id": new_id,
        "name": payload.get("name", "New Schedule"),
        "model": payload.get("model", "Random Forest"),
        "category": payload.get("category", "All"),
        "region": payload.get("region", "All"),
        "interval": payload.get("interval", "daily"),
        "time": payload.get("time", "08:00"),
        "is_active": True,
        "last_run": None,
        "next_run": (datetime.utcnow() + timedelta(hours=1)).isoformat(),
        "created_at": datetime.utcnow().isoformat()
    }
    schedules_store.append(schedule)
    return schedule

@router.put("/schedules/{schedule_id}/toggle")
def toggle_schedule(schedule_id: int):
    for s in schedules_store:
        if s["id"] == schedule_id:
            s["is_active"] = not s["is_active"]
            return s
    raise HTTPException(status_code=404, detail="Schedule not found")

@router.delete("/schedules/{schedule_id}")
def delete_schedule(schedule_id: int):
    global schedules_store
    schedules_store = [s for s in schedules_store if s["id"] != schedule_id]
    return {"message": "Deleted"}

@router.post("/schedules/{schedule_id}/run")
def run_schedule_now(schedule_id: int):
    for s in schedules_store:
        if s["id"] == schedule_id:
            s["last_run"] = datetime.utcnow().isoformat()
            run = {
                "id": len(workflow_runs) + 1,
                "schedule_name": s["name"],
                "status": "success",
                "duration_seconds": random.randint(8, 45),
                "triggered_at": datetime.utcnow().isoformat(),
                "result": f"Manual run — forecast generated with {round(random.uniform(90,98),1)}% accuracy"
            }
            workflow_runs.append(run)
            return {"message": "Run triggered", "run": run}
    raise HTTPException(status_code=404, detail="Not found")

@router.get("/alerts")
def get_alert_configs():
    return {"alerts": alert_configs, "total": len(alert_configs)}

@router.post("/alerts")
def create_alert(payload: dict):
    new_id = max([a["id"] for a in alert_configs], default=0) + 1
    alert = {
        "id": new_id,
        "name": payload.get("name", "New Alert"),
        "type": payload.get("type", "accuracy"),
        "threshold": payload.get("threshold", 90.0),
        "condition": payload.get("condition", "below"),
        "is_active": True,
        "channel": payload.get("channel", "in-app"),
        "created_at": datetime.utcnow().isoformat()
    }
    alert_configs.append(alert)
    return alert

@router.put("/alerts/{alert_id}/toggle")
def toggle_alert(alert_id: int):
    for a in alert_configs:
        if a["id"] == alert_id:
            a["is_active"] = not a["is_active"]
            return a
    raise HTTPException(status_code=404, detail="Not found")

@router.delete("/alerts/{alert_id}")
def delete_alert(alert_id: int):
    global alert_configs
    alert_configs = [a for a in alert_configs if a["id"] != alert_id]
    return {"message": "Deleted"}

@router.get("/workflow-runs")
def get_workflow_runs(limit: int = Query(20)):
    return {"runs": list(reversed(workflow_runs))[:limit], "total": len(workflow_runs)}

@router.get("/summary")
def automation_summary():
    active = sum(1 for s in schedules_store if s["is_active"])
    success_runs = sum(1 for r in workflow_runs if r["status"] == "success")
    return {
        "total_schedules": len(schedules_store),
        "active_schedules": active,
        "total_runs": len(workflow_runs),
        "successful_runs": success_runs,
        "active_alerts": sum(1 for a in alert_configs if a["is_active"]),
    }
