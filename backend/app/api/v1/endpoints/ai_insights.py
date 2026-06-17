from fastapi import APIRouter, Query
from typing import Optional
from datetime import datetime, timedelta
import random

router = APIRouter(prefix="/ai-insights", tags=["AI Insights Engine"])

@router.get("/recommendations", summary="Automated business recommendations")
def get_recommendations():
    recs = [
        {"id": 1, "category": "Revenue", "priority": "critical",
         "title": "Pre-stock Electronics before holiday spike",
         "summary": "AI predicts +84% demand spike for Electronics in 5 days. Current inventory covers only 5.2 days.",
         "action": "Order 420 units of top 3 SKUs immediately",
         "impact": "+₹12,80,000 projected revenue", "confidence": 94.2,
         "deadline": (datetime.utcnow() + timedelta(days=3)).strftime("%Y-%m-%d")},
        {"id": 2, "category": "Cost", "priority": "high",
         "title": "Reduce Groceries overstock by 40%",
         "summary": "Organic Oats inventory covers 3.8 months at current sales rate. Holding costs accumulating.",
         "action": "Reduce next procurement order by 40%",
         "impact": "Save ₹3,20,000 in holding costs", "confidence": 88.5,
         "deadline": (datetime.utcnow() + timedelta(days=14)).strftime("%Y-%m-%d")},
        {"id": 3, "category": "Model", "priority": "high",
         "title": "Switch Electronics model to XGBoost",
         "summary": "Linear Regression shows 8.6% lower accuracy than XGBoost for Electronics over last 60 days.",
         "action": "Update default model for Electronics category",
         "impact": "+₹28,500 forecasting accuracy value", "confidence": 91.5,
         "deadline": (datetime.utcnow() + timedelta(days=7)).strftime("%Y-%m-%d")},
        {"id": 4, "category": "Operations", "priority": "medium",
         "title": "Enable ensemble forecasting for Fashion",
         "summary": "Combining RF + XGBoost reduces Fashion RMSE by 23% based on last 90 days.",
         "action": "Enable ensemble mode in forecast settings",
         "impact": "RMSE ↓ 23%, Accuracy ↑ ~4%", "confidence": 87.8,
         "deadline": (datetime.utcnow() + timedelta(days=30)).strftime("%Y-%m-%d")},
        {"id": 5, "category": "Revenue", "priority": "low",
         "title": "Retrain ARIMA with October–November data",
         "summary": "ARIMA last trained 45 days ago. Adding recent seasonal data improves accuracy by ~3%.",
         "action": "Schedule model retraining for next maintenance window",
         "impact": "Accuracy ↑ 3%, MAE ↓ ~150", "confidence": 78.3,
         "deadline": (datetime.utcnow() + timedelta(days=45)).strftime("%Y-%m-%d")},
    ]
    return {"recommendations": recs, "total": len(recs),
            "critical": sum(1 for r in recs if r["priority"] == "critical"),
            "generated_at": datetime.utcnow().isoformat()}

@router.get("/opportunities", summary="Demand opportunity detection")
def get_opportunities():
    opps = [
        {"product": "Wireless Headphones Pro", "category": "Electronics",
         "opportunity": "Holiday bundle pricing", "potential_uplift": "+₹4,20,000",
         "confidence": 91.2, "window": "Dec 1–25", "action": "Create gift-bundle SKU"},
        {"product": "Winter Jacket Premium", "category": "Fashion",
         "opportunity": "Demand spike pre-stocking", "potential_uplift": "+₹2,80,000",
         "confidence": 88.7, "window": "Next 12 days", "action": "Reorder 124 units"},
        {"product": "Gaming Mouse RGB", "category": "Electronics",
         "opportunity": "Tournament season surge", "potential_uplift": "+₹1,60,000",
         "confidence": 83.4, "window": "Dec 8–20", "action": "Increase stock by 120 units"},
        {"product": "Standing Desk Pro", "category": "Furniture",
         "opportunity": "New Year workspace trend", "potential_uplift": "+₹95,000",
         "confidence": 76.1, "window": "Jan 1–15", "action": "Pre-order 40 units"},
    ]
    total_uplift = "₹9,55,000"
    return {"opportunities": opps, "total": len(opps), "total_potential_uplift": total_uplift}

@router.get("/declining-products", summary="Detect declining products")
def get_declining_products():
    products = [
        {"product": "DVD Player Classic", "category": "Electronics",
         "decline_rate": "-42% YoY", "current_stock": 210, "monthly_sales": 12,
         "months_to_zero_demand": 8, "recommendation": "Liquidate stock, discontinue reorders",
         "severity": "critical"},
        {"product": "Wired Office Headset", "category": "Electronics",
         "decline_rate": "-28% YoY", "current_stock": 85, "monthly_sales": 18,
         "months_to_zero_demand": 14, "recommendation": "Reduce order quantity by 60%",
         "severity": "high"},
        {"product": "Physical Planner 2024", "category": "Stationery",
         "decline_rate": "-18% YoY", "current_stock": 320, "monthly_sales": 35,
         "months_to_zero_demand": 22, "recommendation": "Clear with 25% discount campaign",
         "severity": "medium"},
    ]
    return {"declining_products": products, "total": len(products),
            "critical_count": sum(1 for p in products if p["severity"] == "critical")}

@router.get("/high-growth", summary="High-growth product highlights")
def get_high_growth():
    products = [
        {"product": "Wireless Headphones Pro", "category": "Electronics",
         "growth_rate": "+127% YoY", "current_rank": 1, "prev_rank": 4,
         "trend": "accelerating", "forecast_next_quarter": "+38% QoQ",
         "recommendation": "Increase stock by 80%, negotiate volume discount"},
        {"product": "Gaming Mouse RGB", "category": "Electronics",
         "growth_rate": "+84% YoY", "current_rank": 2, "prev_rank": 7,
         "trend": "strong", "forecast_next_quarter": "+22% QoQ",
         "recommendation": "Expand to 2 new regional markets"},
        {"product": "Running Shoes Elite", "category": "Fashion",
         "growth_rate": "+62% YoY", "current_rank": 3, "prev_rank": 9,
         "trend": "strong", "forecast_next_quarter": "+18% QoQ",
         "recommendation": "Add 3 new color variants based on demand signals"},
        {"product": "Standing Desk Pro", "category": "Furniture",
         "growth_rate": "+48% YoY", "current_rank": 4, "prev_rank": 11,
         "trend": "emerging", "forecast_next_quarter": "+15% QoQ",
         "recommendation": "Introduce budget-tier variant to capture wider segment"},
    ]
    return {"high_growth_products": products, "total": len(products)}

@router.get("/forecast-summary", summary="AI-generated forecasting narrative summary")
def get_forecast_summary(category: Optional[str] = Query(None)):
    cat = category or "All Categories"
    return {
        "category": cat,
        "period": "December 2025",
        "summary": f"AI analysis of {cat} shows strong positive momentum with overall demand tracking 8% above forecast. "
                   f"XGBoost model leads with 97.1% accuracy. Two high-severity demand spikes are predicted within the next 12 days. "
                   f"Critical inventory shortages detected in 3 SKUs requiring immediate action.",
        "key_findings": [
            "Overall demand is tracking +8% above forecast baseline",
            "XGBoost is the top performing model at 97.1% accuracy",
            "2 high-severity demand spikes predicted in next 12 days",
            "3 products at critical stockout risk (< 3 days remaining)",
            "Holiday season expected to drive +35% revenue vs last December",
        ],
        "risk_flags": [
            {"risk": "Running Shoes stockout in < 1 day", "severity": "critical"},
            {"risk": "Electronics demand spike not pre-stocked", "severity": "high"},
            {"risk": "ARIMA model overdue for retraining (45 days)", "severity": "medium"},
        ],
        "model_performance": {
            "best_model": "XGBoost", "best_accuracy": 97.1,
            "avg_accuracy": 93.1, "models_evaluated": 4,
        },
        "generated_at": datetime.utcnow().isoformat(),
        "next_review": (datetime.utcnow() + timedelta(hours=24)).isoformat(),
    }
