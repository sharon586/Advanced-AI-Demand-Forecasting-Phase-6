import pandas as pd
from fastapi import APIRouter, Query, HTTPException
from typing import Optional
from datetime import datetime

from app.ml.predict import (
    linear_regression_forecast,
    random_forest_forecast,
    xgboost_forecast,
    arima_forecast,
    compare_all_models
)

router = APIRouter(prefix="/forecast", tags=["Forecasting"])

# In-memory forecast history
forecast_history = []

SAMPLE_DATA = {
    "month": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    "sales": [100000, 120000, 145000, 130000, 160000, 175000, 190000, 210000, 205000, 230000, 250000, 280000]
}


def get_df(category: Optional[str] = None):
    df = pd.DataFrame(SAMPLE_DATA)
    if category == "Electronics":
        df["sales"] = df["sales"] * 1.2
    elif category == "Fashion":
        df["sales"] = df["sales"] * 0.9
    elif category == "Groceries":
        df["sales"] = df["sales"] * 0.75
    return df


def save_history(model_name: str, result: dict, category: str, region: str):
    entry = {
        "id": len(forecast_history) + 1,
        "model_name": model_name,
        "prediction": result.get("prediction"),
        "accuracy": result.get("metrics", {}).get("accuracy"),
        "mae": result.get("metrics", {}).get("mae"),
        "rmse": result.get("metrics", {}).get("rmse"),
        "r2_score": result.get("metrics", {}).get("r2_score"),
        "category": category or "All",
        "region": region or "All",
        "created_at": datetime.utcnow().isoformat()
    }
    forecast_history.append(entry)
    return entry


@router.get("/linear")
def forecast_linear(
    category: Optional[str] = Query(None),
    region: Optional[str] = Query(None)
):
    df = get_df(category)
    result = linear_regression_forecast(df)
    save_history("Linear Regression", result, category, region)
    return result


@router.get("/random-forest")
def forecast_rf(
    category: Optional[str] = Query(None),
    region: Optional[str] = Query(None)
):
    df = get_df(category)
    result = random_forest_forecast(df)
    save_history("Random Forest", result, category, region)
    return result


@router.get("/xgboost")
def forecast_xgb(
    category: Optional[str] = Query(None),
    region: Optional[str] = Query(None)
):
    df = get_df(category)
    result = xgboost_forecast(df)
    save_history("XGBoost", result, category, region)
    return result


@router.get("/arima")
def forecast_arima(
    category: Optional[str] = Query(None),
    region: Optional[str] = Query(None)
):
    df = get_df(category)
    result = arima_forecast(df)
    save_history("ARIMA", result, category, region)
    return result


@router.get("/compare")
def compare_models(
    category: Optional[str] = Query(None),
    region: Optional[str] = Query(None)
):
    df = get_df(category)
    result = compare_all_models(df)
    return result


@router.get("/history")
def get_forecast_history(
    page: int = Query(1, ge=1),
    per_page: int = Query(10, ge=1, le=100),
    model: Optional[str] = Query(None),
    category: Optional[str] = Query(None),
    region: Optional[str] = Query(None)
):
    filtered = forecast_history
    if model:
        filtered = [f for f in filtered if model.lower() in f["model_name"].lower()]
    if category:
        filtered = [f for f in filtered if f.get("category") == category]
    if region:
        filtered = [f for f in filtered if f.get("region") == region]

    total = len(filtered)
    start = (page - 1) * per_page
    end = start + per_page
    paginated = sorted(filtered, key=lambda x: x["id"], reverse=True)[start:end]

    return {
        "history": paginated,
        "total": total,
        "page": page,
        "per_page": per_page,
        "total_pages": (total + per_page - 1) // per_page
    }


@router.get("/history/{forecast_id}")
def get_forecast_by_id(forecast_id: int):
    entry = next((f for f in forecast_history if f["id"] == forecast_id), None)
    if not entry:
        raise HTTPException(status_code=404, detail="Forecast not found")
    return entry
