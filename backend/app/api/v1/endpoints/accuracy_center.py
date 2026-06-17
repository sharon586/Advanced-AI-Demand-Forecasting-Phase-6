from fastapi import APIRouter, Query
from typing import Optional
from datetime import datetime, timedelta
import random

router = APIRouter(prefix="/accuracy-center", tags=["Forecast Accuracy Center"])

MODELS = ["Linear Regression", "Random Forest", "XGBoost", "ARIMA"]
MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov"]

def _model_trend(base, variance=3.0):
    return [{"month": MONTHS[i], "accuracy": round(base + i*0.3 + random.uniform(-variance, variance), 2)}
            for i in range(len(MONTHS))]

@router.get("/dashboard", summary="Model performance dashboard")
def performance_dashboard():
    models = [
        {"model": "XGBoost", "current_accuracy": 97.1, "mae": 1240, "rmse": 1880,
         "r2": 0.971, "mape": 3.2, "training_time_ms": 320, "status": "production",
         "trend": _model_trend(94, 1.5), "improvement_vs_last_month": "+0.8%"},
        {"model": "Random Forest", "current_accuracy": 95.2, "mae": 1580, "rmse": 2340,
         "r2": 0.952, "mape": 4.8, "training_time_ms": 580, "status": "staging",
         "trend": _model_trend(91, 2.0), "improvement_vs_last_month": "+0.4%"},
        {"model": "ARIMA", "current_accuracy": 91.4, "mae": 2150, "rmse": 3100,
         "r2": 0.914, "mape": 8.6, "training_time_ms": 120, "status": "backup",
         "trend": _model_trend(87, 2.5), "improvement_vs_last_month": "-0.2%"},
        {"model": "Linear Regression", "current_accuracy": 88.5, "mae": 2840, "rmse": 4200,
         "r2": 0.885, "mape": 11.5, "training_time_ms": 85, "status": "deprecated",
         "trend": _model_trend(85, 3.0), "improvement_vs_last_month": "+0.1%"},
    ]
    return {
        "models": models,
        "best_model": "XGBoost",
        "avg_accuracy": round(sum(m["current_accuracy"] for m in models) / len(models), 2),
        "production_model": "XGBoost",
        "last_evaluated": datetime.utcnow().isoformat(),
    }

@router.get("/accuracy-trends", summary="Accuracy trend history")
def accuracy_trends(model: Optional[str] = Query(None)):
    base = {"XGBoost": 94, "Random Forest": 91, "ARIMA": 87, "Linear Regression": 84}
    variance = {"XGBoost": 1.5, "Random Forest": 2.0, "ARIMA": 2.5, "Linear Regression": 3.0}
    selected = [model] if model and model in MODELS else MODELS
    return {
        "trends": {m: _model_trend(base[m], variance[m]) for m in selected},
        "months": MONTHS,
    }

@router.get("/historical-performance", summary="Historical prediction comparison")
def historical_performance(limit: int = Query(10)):
    records = []
    for i in range(limit):
        dt = (datetime.utcnow() - timedelta(days=i*7)).strftime("%Y-%m-%d")
        best = random.choice(MODELS)
        records.append({
            "date": dt,
            "model_scores": {m: round(random.uniform(84, 98), 2) for m in MODELS},
            "best_model": best,
            "best_accuracy": round(random.uniform(93, 98), 2),
            "actual_vs_predicted_error": round(random.uniform(1.2, 8.5), 2),
            "category": random.choice(["Electronics", "Fashion", "Groceries", "All"]),
        })
    return {"records": records, "total": len(records)}

@router.get("/improvement-tracking", summary="Model improvement over time")
def improvement_tracking():
    improvements = []
    base = {"XGBoost": 90.0, "Random Forest": 88.0, "ARIMA": 84.0, "Linear Regression": 82.0}
    for m in MODELS:
        points = []
        val = base[m]
        for i, month in enumerate(MONTHS):
            val += random.uniform(0.1, 0.8)
            points.append({"month": month, "accuracy": round(min(val, 99.5), 2)})
        improvements.append({
            "model": m,
            "start_accuracy": base[m],
            "current_accuracy": points[-1]["accuracy"],
            "improvement": round(points[-1]["accuracy"] - base[m], 2),
            "monthly_points": points,
        })
    return {"improvements": improvements}

@router.post("/generate-report", summary="Generate model evaluation report")
def generate_evaluation_report(payload: dict):
    model = payload.get("model", "XGBoost")
    period = payload.get("period", "Last 30 days")
    return {
        "report_id": f"eval_{datetime.utcnow().strftime('%Y%m%d%H%M%S')}",
        "model": model, "period": period,
        "sections": {
            "summary": f"{model} performed at 97.1% accuracy over {period} with consistent improvement.",
            "accuracy_metrics": {"accuracy": 97.1, "mae": 1240, "rmse": 1880, "r2": 0.971, "mape": 3.2},
            "comparison_vs_baseline": {"vs_linear_regression": "+8.6%", "vs_arima": "+5.7%", "vs_random_forest": "+1.9%"},
            "recommendations": [
                f"Keep {model} as production model",
                "Schedule retraining every 30 days",
                "Consider ensemble with Random Forest for further improvement",
            ],
        },
        "generated_at": datetime.utcnow().isoformat(),
    }
