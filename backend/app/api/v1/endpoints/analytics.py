from fastapi import APIRouter, Query
from typing import Optional
from datetime import datetime, timedelta
import random

router = APIRouter(prefix="/analytics", tags=["Analytics"])


@router.get("/sales-trends")
def sales_trends(
    date_from: Optional[str] = Query(None),
    date_to: Optional[str] = Query(None),
    category: Optional[str] = Query(None),
    region: Optional[str] = Query(None)
):
    base_data = [
        {"month": "Jan", "sales": 420000, "forecast": 450000},
        {"month": "Feb", "sales": 350000, "forecast": 380000},
        {"month": "Mar", "sales": 520000, "forecast": 550000},
        {"month": "Apr", "sales": 280000, "forecast": 300000},
        {"month": "May", "sales": 610000, "forecast": 640000},
        {"month": "Jun", "sales": 480000, "forecast": 510000},
        {"month": "Jul", "sales": 720000, "forecast": 750000},
        {"month": "Aug", "sales": 650000, "forecast": 680000},
        {"month": "Sep", "sales": 690000, "forecast": 720000},
        {"month": "Oct", "sales": 740000, "forecast": 770000},
        {"month": "Nov", "sales": 820000, "forecast": 860000},
        {"month": "Dec", "sales": 910000, "forecast": 950000},
    ]
    multiplier = {"Electronics": 1.2, "Fashion": 0.9, "Groceries": 0.75, "Furniture": 0.6}.get(category, 1.0)
    adjusted = [{**d, "sales": int(d["sales"] * multiplier), "forecast": int(d["forecast"] * multiplier)} for d in base_data]
    return {
        "trend": "Sales increasing by 15%",
        "data": adjusted,
        "category": category,
        "region": region
    }


@router.get("/demand-growth")
def demand_growth(
    category: Optional[str] = Query(None),
    region: Optional[str] = Query(None)
):
    categories = [
        {"category": "Electronics", "growth": 24, "demand": 90, "revenue": 4200000},
        {"category": "Fashion", "growth": 18, "demand": 70, "revenue": 3100000},
        {"category": "Groceries", "growth": 12, "demand": 55, "revenue": 2400000},
        {"category": "Furniture", "growth": 8, "demand": 40, "revenue": 1800000},
        {"category": "Sports", "growth": 15, "demand": 48, "revenue": 2100000},
    ]
    if category:
        categories = [c for c in categories if c["category"] == category]
    return {
        "growth": "Demand growth is 22%",
        "categories": categories,
        "region": region
    }


@router.get("/monthly-forecast")
def monthly_forecast(
    category: Optional[str] = Query(None)
):
    next_months = [
        {"month": "Jan", "predicted": 950000, "lower": 920000, "upper": 980000},
        {"month": "Feb", "predicted": 870000, "lower": 840000, "upper": 900000},
        {"month": "Mar", "predicted": 1020000, "lower": 990000, "upper": 1050000},
        {"month": "Apr", "predicted": 980000, "lower": 950000, "upper": 1010000},
        {"month": "May", "predicted": 1100000, "lower": 1070000, "upper": 1130000},
        {"month": "Jun", "predicted": 1050000, "lower": 1020000, "upper": 1080000},
    ]
    return {
        "forecast": "Expected sales next month: ₹10.5L",
        "predictions": next_months,
        "category": category
    }


@router.get("/stock-alerts")
def stock_alerts(category: Optional[str] = Query(None)):
    alerts = [
        {"product": "Headphones Pro X1", "category": "Electronics", "stock": 12, "status": "critical", "days_left": 3},
        {"product": "Running Shoes Air", "category": "Fashion", "stock": 28, "status": "low", "days_left": 7},
        {"product": "Organic Rice 5kg", "category": "Groceries", "stock": 45, "status": "medium", "days_left": 14},
        {"product": "Office Chair Ergo", "category": "Furniture", "stock": 8, "status": "critical", "days_left": 2},
        {"product": "Laptop UltraBook", "category": "Electronics", "stock": 5, "status": "critical", "days_left": 1},
    ]
    if category:
        alerts = [a for a in alerts if a["category"] == category]
    return {"alert": "Low stock detected", "alerts": alerts}


@router.get("/summary")
def analytics_summary():
    return {
        "total_sales": 6300000,
        "total_forecasts": 48,
        "forecast_accuracy": 96.2,
        "revenue_growth": 32,
        "active_datasets": 12,
        "total_products": 24,
        "total_users": 8,
        "reports_generated": 15,
        "monthly_data": [
            {"month": "Jan", "sales": 420000, "profit": 126000},
            {"month": "Feb", "sales": 350000, "profit": 105000},
            {"month": "Mar", "sales": 520000, "profit": 156000},
            {"month": "Apr", "sales": 610000, "profit": 183000},
            {"month": "May", "sales": 680000, "profit": 204000},
            {"month": "Jun", "sales": 720000, "profit": 216000},
        ],
        "top_products": [
            {"name": "Headphones", "value": 420, "revenue": 840000},
            {"name": "Mobile", "value": 300, "revenue": 600000},
            {"name": "Laptop", "value": 210, "revenue": 1050000},
            {"name": "Keyboard", "value": 180, "revenue": 180000},
            {"name": "Mouse", "value": 160, "revenue": 112000},
        ],
        "recent_activity": [
            {"action": "Forecast generated", "model": "Random Forest", "time": "2 min ago", "status": "success"},
            {"action": "Dataset uploaded", "file": "sales_q4.csv", "time": "1 hour ago", "status": "success"},
            {"action": "Report exported", "type": "PDF", "time": "3 hours ago", "status": "success"},
            {"action": "Model comparison", "models": "4 models", "time": "5 hours ago", "status": "success"},
            {"action": "Dataset upload failed", "file": "corrupt.csv", "time": "1 day ago", "status": "error"},
        ]
    }
