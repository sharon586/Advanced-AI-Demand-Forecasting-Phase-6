from fastapi import APIRouter, Query
from typing import Optional
from datetime import datetime, timedelta
import random

router = APIRouter(prefix="/forecast-comparison", tags=["Forecast Comparison"])

MODELS = ["Linear Regression", "Random Forest", "XGBoost", "ARIMA"]

def gen_model_metrics(base_acc):
    return {
        "accuracy": round(base_acc + random.uniform(-2, 2), 2),
        "mae": round(random.uniform(800, 4000), 2),
        "rmse": round(random.uniform(1000, 6000), 2),
        "r2_score": round(random.uniform(0.82, 0.98), 4),
        "mape": round(random.uniform(2.5, 12.0), 2),
        "training_time_ms": random.randint(80, 1200),
    }

@router.get("/models")
def compare_models(category: Optional[str] = Query(None), region: Optional[str] = Query(None)):
    base_accuracies = {"Linear Regression": 88.5, "Random Forest": 95.2, "XGBoost": 97.1, "ARIMA": 91.4}
    results = []
    for model in MODELS:
        metrics = gen_model_metrics(base_accuracies[model])
        history = [{"month": m, "accuracy": round(metrics["accuracy"] + random.uniform(-4, 4), 2)}
                   for m in ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug"]]
        results.append({"model": model, **metrics, "history": history,
                        "is_recommended": model == "XGBoost"})
    results.sort(key=lambda x: x["accuracy"], reverse=True)
    return {"models": results, "best_model": results[0]["model"],
            "category": category or "All", "region": region or "All"}

@router.get("/accuracy-trends")
def accuracy_trends():
    months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug"]
    base = {"Linear Regression": 87, "Random Forest": 93, "XGBoost": 95, "ARIMA": 89}
    trends = {m: [{"month": mo, "accuracy": round(base[m] + random.uniform(-3, 3), 2)} for mo in months]
              for m in MODELS}
    return {"trends": trends, "months": months}

@router.get("/confidence-scores")
def confidence_scores(category: Optional[str] = Query(None)):
    scores = []
    for model in MODELS:
        score = round(random.uniform(72, 98), 2)
        interval_low = round(score - random.uniform(3, 8), 2)
        interval_high = round(score + random.uniform(1, 5), 2)
        scores.append({
            "model": model,
            "confidence_score": score,
            "confidence_interval": [interval_low, interval_high],
            "prediction_range": {"low": round(random.uniform(180000, 220000)),
                                  "mid": round(random.uniform(220001, 260000)),
                                  "high": round(random.uniform(260001, 300000))},
            "reliability": "high" if score > 90 else "medium" if score > 80 else "low"
        })
    return {"scores": scores, "category": category or "All"}

@router.get("/historical")
def historical_comparison(limit: int = Query(10)):
    comparisons = []
    for i in range(limit):
        date = (datetime.utcnow() - timedelta(days=i * 7)).strftime("%Y-%m-%d")
        best_model = random.choice(MODELS)
        comparisons.append({
            "date": date,
            "models": {m: round(random.uniform(85, 98), 2) for m in MODELS},
            "best_model": best_model,
            "best_accuracy": round(random.uniform(93, 98), 2),
            "category": random.choice(["Electronics", "Fashion", "Groceries", "All"]),
        })
    return {"comparisons": comparisons, "total": len(comparisons)}

@router.get("/recommendations")
def business_recommendations(category: Optional[str] = Query(None)):
    recommendations = [
        {"title": "Switch to XGBoost for Electronics", "impact": "high",
         "description": "XGBoost outperforms current Linear Regression by 8.6% accuracy on Electronics category.",
         "potential_savings": 28500, "confidence": 94.2, "action": "Switch Model"},
        {"title": "Increase forecast horizon for Fashion", "impact": "medium",
         "description": "Extending forecast from 3 to 6 months improves seasonal planning accuracy by 12%.",
         "potential_savings": 15200, "confidence": 87.8, "action": "Adjust Settings"},
        {"title": "Enable ensemble forecasting", "impact": "high",
         "description": "Combining Random Forest + XGBoost predictions reduces RMSE by 23%.",
         "potential_savings": 41000, "confidence": 91.5, "action": "Enable Feature"},
        {"title": "Retrain ARIMA with recent data", "impact": "low",
         "description": "ARIMA model was last trained 45 days ago. Retraining improves accuracy by ~3%.",
         "potential_savings": 4800, "confidence": 78.3, "action": "Retrain Model"},
    ]
    return {"recommendations": recommendations, "total_potential_savings": sum(r["potential_savings"] for r in recommendations)}
