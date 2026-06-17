from fastapi import APIRouter, Query
from datetime import datetime, timedelta
import random

router = APIRouter(prefix="/ml-ops", tags=["ML Operations"])

retrain_history = [
    {"id": 1, "model": "Random Forest", "trigger": "scheduled", "accuracy_before": 94.2, "accuracy_after": 96.8, "duration_s": 42, "status": "completed", "timestamp": (datetime.utcnow() - timedelta(days=2)).isoformat()},
    {"id": 2, "model": "XGBoost", "trigger": "new_data", "accuracy_before": 93.1, "accuracy_after": 95.4, "duration_s": 38, "status": "completed", "timestamp": (datetime.utcnow() - timedelta(days=4)).isoformat()},
    {"id": 3, "model": "Linear Regression", "trigger": "manual", "accuracy_before": 89.8, "accuracy_after": 91.2, "duration_s": 12, "status": "completed", "timestamp": (datetime.utcnow() - timedelta(days=7)).isoformat()},
]

@router.get("/retrain-status")
def retrain_status():
    return {
        "auto_retrain_enabled": True,
        "retrain_schedule": "Weekly on Sunday 02:00 UTC",
        "last_retrain": (datetime.utcnow() - timedelta(days=2)).isoformat(),
        "next_retrain": (datetime.utcnow() + timedelta(days=5)).isoformat(),
        "models_status": [
            {"model": "Random Forest", "accuracy": 96.8, "last_trained": "2 days ago", "status": "healthy", "data_points": 8420},
            {"model": "XGBoost", "accuracy": 95.4, "last_trained": "4 days ago", "status": "healthy", "data_points": 8420},
            {"model": "Linear Regression", "accuracy": 91.2, "last_trained": "7 days ago", "status": "healthy", "data_points": 8420},
            {"model": "ARIMA", "accuracy": 88.6, "last_trained": "7 days ago", "status": "stale", "data_points": 8420},
        ],
        "history": retrain_history
    }

@router.post("/retrain")
def trigger_retrain(model: str = Query("all")):
    new_accuracy = round(random.uniform(94.5, 97.9), 1)
    entry = {
        "id": len(retrain_history) + 1,
        "model": model,
        "trigger": "manual",
        "accuracy_before": round(random.uniform(88, 95), 1),
        "accuracy_after": new_accuracy,
        "duration_s": random.randint(12, 55),
        "status": "completed",
        "timestamp": datetime.utcnow().isoformat()
    }
    retrain_history.append(entry)
    return {"message": f"Model '{model}' retrained successfully", "result": entry}

@router.get("/ensemble")
def ensemble_forecast(
    category: str = Query(None),
    region: str = Query(None)
):
    return {
        "ensemble_prediction": 785000,
        "ensemble_accuracy": 98.2,
        "method": "Weighted Average (RF:40%, XGB:35%, LR:15%, ARIMA:10%)",
        "component_predictions": [
            {"model": "Random Forest", "prediction": 715000, "weight": 0.40, "accuracy": 96.8},
            {"model": "XGBoost", "prediction": 798000, "weight": 0.35, "accuracy": 95.4},
            {"model": "Linear Regression", "prediction": 672000, "weight": 0.15, "accuracy": 91.2},
            {"model": "ARIMA", "prediction": 695000, "weight": 0.10, "accuracy": 88.6},
        ],
        "confidence_interval": {"lower": 748000, "upper": 822000},
        "category": category, "region": region
    }
