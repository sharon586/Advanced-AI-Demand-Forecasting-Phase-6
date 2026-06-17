from fastapi import APIRouter, HTTPException, Query
from typing import Optional
from datetime import datetime, timedelta
import random

router = APIRouter(prefix="/workflows", tags=["Workflow Automation"])

workflows_store = [
    {"id": 1, "name": "Auto Forecast + Approve", "description": "Generate forecast then submit for manager approval automatically",
     "trigger": "dataset_upload", "steps": [
         {"order": 1, "action": "run_forecast", "model": "XGBoost", "category": "Electronics"},
         {"order": 2, "action": "submit_approval", "assigned_to": "manager@example.com"},
         {"order": 3, "action": "send_notification", "channel": "both", "message": "Forecast submitted for approval"},
     ], "is_active": True, "run_count": 28, "success_count": 26, "fail_count": 2,
     "last_run": (datetime.utcnow() - timedelta(hours=2)).isoformat(),
     "created_at": (datetime.utcnow() - timedelta(days=30)).isoformat()},
    {"id": 2, "name": "Weekly Report Generator", "description": "Auto-generate executive reports every Monday at 8AM",
     "trigger": "schedule", "schedule": "weekly/Monday/08:00", "steps": [
         {"order": 1, "action": "generate_report", "type": "executive_summary"},
         {"order": 2, "action": "send_notification", "channel": "email", "message": "Weekly report is ready"},
     ], "is_active": True, "run_count": 12, "success_count": 12, "fail_count": 0,
     "last_run": (datetime.utcnow() - timedelta(days=3)).isoformat(),
     "created_at": (datetime.utcnow() - timedelta(days=84)).isoformat()},
    {"id": 3, "name": "Low Accuracy Alert Flow", "description": "Notify team when model accuracy drops below 85%",
     "trigger": "accuracy_threshold", "threshold": 85, "steps": [
         {"order": 1, "action": "send_notification", "channel": "both", "message": "Model accuracy below threshold"},
         {"order": 2, "action": "retrain_model", "model": "auto"},
     ], "is_active": False, "run_count": 3, "success_count": 2, "fail_count": 1,
     "last_run": (datetime.utcnow() - timedelta(days=7)).isoformat(),
     "created_at": (datetime.utcnow() - timedelta(days=45)).isoformat()},
]

execution_logs = [
    {"id": i+1, "workflow_id": random.choice([1, 2, 3]),
     "workflow_name": random.choice(["Auto Forecast + Approve", "Weekly Report Generator", "Low Accuracy Alert Flow"]),
     "status": random.choice(["success", "success", "success", "failed"]),
     "steps_completed": random.randint(1, 3), "total_steps": 3,
     "duration_seconds": random.randint(5, 120),
     "trigger_reason": random.choice(["dataset_upload", "schedule", "manual", "threshold_breach"]),
     "error": None if random.random() > 0.2 else "Step 2 failed: API timeout",
     "executed_at": (datetime.utcnow() - timedelta(hours=i*5)).isoformat()}
    for i in range(25)
]

STEP_ACTIONS = ["run_forecast", "submit_approval", "send_notification", "generate_report",
                "retrain_model", "export_data", "archive_dataset"]
TRIGGERS = ["dataset_upload", "schedule", "accuracy_threshold", "approval_rejected", "manual", "forecast_complete"]

def _next_id(): return max((w["id"] for w in workflows_store), default=0) + 1

@router.get("/", summary="List all workflows")
def list_workflows(is_active: Optional[bool] = Query(None)):
    data = list(workflows_store)
    if is_active is not None: data = [w for w in data if w["is_active"] == is_active]
    return {"workflows": data, "total": len(data),
            "active": sum(1 for w in data if w["is_active"]),
            "total_runs": sum(w["run_count"] for w in data)}

@router.get("/summary", summary="Workflow engine summary")
def workflow_summary():
    total_runs = sum(w["run_count"] for w in workflows_store)
    total_success = sum(w["success_count"] for w in workflows_store)
    return {"total_workflows": len(workflows_store),
            "active_workflows": sum(1 for w in workflows_store if w["is_active"]),
            "total_runs": total_runs, "total_success": total_success,
            "total_failed": sum(w["fail_count"] for w in workflows_store),
            "success_rate": f"{round(total_success/max(total_runs,1)*100)}%"}

@router.get("/{workflow_id}", summary="Get workflow")
def get_workflow(workflow_id: int):
    w = next((x for x in workflows_store if x["id"] == workflow_id), None)
    if not w: raise HTTPException(404, "Not found")
    return w

@router.post("/", status_code=201, summary="Create workflow")
def create_workflow(payload: dict):
    if not payload.get("name"): raise HTTPException(422, "name required")
    now = datetime.utcnow().isoformat()
    wf = {"id": _next_id(), "name": payload["name"],
          "description": payload.get("description", ""),
          "trigger": payload.get("trigger", "manual"),
          "steps": payload.get("steps", []),
          "is_active": True, "run_count": 0, "success_count": 0, "fail_count": 0,
          "last_run": None, "created_at": now}
    if "schedule" in payload: wf["schedule"] = payload["schedule"]
    if "threshold" in payload: wf["threshold"] = payload["threshold"]
    workflows_store.append(wf)
    return wf

@router.put("/{workflow_id}", summary="Update workflow")
def update_workflow(workflow_id: int, payload: dict):
    for w in workflows_store:
        if w["id"] == workflow_id:
            for k in ["name", "description", "trigger", "steps", "is_active", "schedule", "threshold"]:
                if k in payload: w[k] = payload[k]
            return w
    raise HTTPException(404, "Not found")

@router.put("/{workflow_id}/toggle", summary="Enable/disable workflow")
def toggle_workflow(workflow_id: int):
    for w in workflows_store:
        if w["id"] == workflow_id:
            w["is_active"] = not w["is_active"]
            return {"message": f"Workflow {'enabled' if w['is_active'] else 'disabled'}", "workflow": w}
    raise HTTPException(404, "Not found")

@router.post("/{workflow_id}/execute", summary="Manually trigger workflow execution")
def execute_workflow(workflow_id: int):
    w = next((x for x in workflows_store if x["id"] == workflow_id), None)
    if not w: raise HTTPException(404, "Not found")
    now = datetime.utcnow().isoformat()
    success = random.random() > 0.1
    w["run_count"] += 1
    w["last_run"] = now
    if success: w["success_count"] += 1
    else: w["fail_count"] += 1
    log = {"id": len(execution_logs)+1, "workflow_id": workflow_id, "workflow_name": w["name"],
           "status": "success" if success else "failed",
           "steps_completed": len(w["steps"]) if success else random.randint(1, max(len(w["steps"])-1,1)),
           "total_steps": len(w["steps"]), "duration_seconds": random.randint(8, 90),
           "trigger_reason": "manual", "error": None if success else "Step execution failed",
           "executed_at": now}
    execution_logs.append(log)
    return {"message": f"Workflow '{w['name']}' executed", "status": log["status"], "log": log}

@router.delete("/{workflow_id}", summary="Delete workflow")
def delete_workflow(workflow_id: int):
    global workflows_store
    w = next((x for x in workflows_store if x["id"] == workflow_id), None)
    if not w: raise HTTPException(404, "Not found")
    workflows_store = [x for x in workflows_store if x["id"] != workflow_id]
    return {"message": f"Workflow '{w['name']}' deleted"}

@router.get("/logs/all", summary="Workflow execution logs")
def get_execution_logs(workflow_id: Optional[int] = Query(None), limit: int = Query(20)):
    data = list(reversed(execution_logs))
    if workflow_id: data = [l for l in data if l["workflow_id"] == workflow_id]
    return {"logs": data[:limit], "total": len(data)}
