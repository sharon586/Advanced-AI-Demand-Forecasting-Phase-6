from fastapi import APIRouter, Query
from typing import Optional
from datetime import datetime, timedelta
import random

router = APIRouter(prefix="/ai-features", tags=["Advanced AI Features"])

PRODUCTS = [
    {"id": "P001", "name": "Wireless Headphones Pro", "category": "Electronics", "current_stock": 145, "avg_daily_sales": 28},
    {"id": "P002", "name": "Mechanical Keyboard X", "category": "Electronics", "current_stock": 78, "avg_daily_sales": 15},
    {"id": "P003", "name": "Running Shoes Elite", "category": "Fashion", "current_stock": 12, "avg_daily_sales": 22},
    {"id": "P004", "name": "Organic Oats 1kg", "category": "Groceries", "current_stock": 320, "avg_daily_sales": 85},
    {"id": "P005", "name": "Standing Desk Pro", "category": "Furniture", "current_stock": 8, "avg_daily_sales": 4},
    {"id": "P006", "name": "4K Monitor UHD", "category": "Electronics", "current_stock": 34, "avg_daily_sales": 9},
    {"id": "P007", "name": "Winter Jacket Premium", "category": "Fashion", "current_stock": 56, "avg_daily_sales": 18},
    {"id": "P008", "name": "Gaming Mouse RGB", "category": "Electronics", "current_stock": 203, "avg_daily_sales": 31},
]

@router.get("/recommendations")
def get_recommendations(category: Optional[str] = Query(None), limit: int = Query(5)):
    products = [p for p in PRODUCTS if not category or p["category"] == category]
    recommendations = []
    for p in products[:limit]:
        days_left = round(p["current_stock"] / max(p["avg_daily_sales"], 1), 1)
        score = round(random.uniform(72, 98), 1)
        demand_trend = random.choice(["rising", "stable", "falling"])
        recommendations.append({
            **p,
            "confidence_score": score,
            "recommended_order_qty": round(p["avg_daily_sales"] * 30 * random.uniform(1.0, 1.5)),
            "days_until_stockout": days_left,
            "demand_trend": demand_trend,
            "reason": f"{'⚠️ Low stock — ' if days_left < 7 else ''}{'📈 Rising demand' if demand_trend=='rising' else '📊 Stable demand'}"
        })
    recommendations.sort(key=lambda x: x["days_until_stockout"])
    return {"recommendations": recommendations, "total": len(recommendations)}

@router.get("/buying-behavior")
def get_buying_behavior():
    segments = [
        {"segment": "High-Value Repeat Buyers", "count": 1240, "avg_order_value": 285.50, "purchase_frequency": "2.3x/month",
         "top_categories": ["Electronics", "Furniture"], "churn_risk": "low", "trend": "+12%"},
        {"segment": "Seasonal Shoppers", "count": 3450, "avg_order_value": 95.20, "purchase_frequency": "0.8x/month",
         "top_categories": ["Fashion", "Groceries"], "churn_risk": "medium", "trend": "+5%"},
        {"segment": "Bargain Hunters", "count": 5680, "avg_order_value": 42.80, "purchase_frequency": "1.5x/month",
         "top_categories": ["Groceries", "Fashion"], "churn_risk": "high", "trend": "-3%"},
        {"segment": "Tech Enthusiasts", "count": 890, "avg_order_value": 420.00, "purchase_frequency": "1.1x/month",
         "top_categories": ["Electronics"], "churn_risk": "low", "trend": "+18%"},
    ]
    trend_data = [{"month": m, "retention": random.randint(72, 95), "new": random.randint(200, 500)}
                  for m in ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug"]]
    return {"segments": segments, "trend_data": trend_data, "total_customers": sum(s["count"] for s in segments)}

@router.get("/demand-spikes")
def get_demand_spikes():
    spikes = [
        {"product": "Winter Jacket Premium", "category": "Fashion", "predicted_spike": "+127%",
         "predicted_date": (datetime.utcnow() + timedelta(days=12)).strftime("%Y-%m-%d"),
         "confidence": 91.5, "trigger": "Seasonal weather shift", "severity": "high",
         "recommended_stock": 180, "current_stock": 56},
        {"product": "Wireless Headphones Pro", "category": "Electronics", "predicted_spike": "+84%",
         "predicted_date": (datetime.utcnow() + timedelta(days=5)).strftime("%Y-%m-%d"),
         "confidence": 87.2, "trigger": "Holiday season approaching", "severity": "high",
         "recommended_stock": 280, "current_stock": 145},
        {"product": "Organic Oats 1kg", "category": "Groceries", "predicted_spike": "+38%",
         "predicted_date": (datetime.utcnow() + timedelta(days=20)).strftime("%Y-%m-%d"),
         "confidence": 78.9, "trigger": "Health trend uptick", "severity": "medium",
         "recommended_stock": 450, "current_stock": 320},
        {"product": "Gaming Mouse RGB", "category": "Electronics", "predicted_spike": "+52%",
         "predicted_date": (datetime.utcnow() + timedelta(days=8)).strftime("%Y-%m-%d"),
         "confidence": 83.4, "trigger": "Gaming tournament season", "severity": "medium",
         "recommended_stock": 320, "current_stock": 203},
    ]
    return {"spikes": spikes, "high_severity": sum(1 for s in spikes if s["severity"] == "high")}

@router.get("/low-stock-predictions")
def get_low_stock_predictions():
    critical = []
    for p in PRODUCTS:
        days = round(p["current_stock"] / max(p["avg_daily_sales"], 1), 1)
        if days < 15:
            status = "critical" if days < 5 else "warning" if days < 10 else "moderate"
            critical.append({
                **p,
                "days_until_stockout": days,
                "stockout_date": (datetime.utcnow() + timedelta(days=days)).strftime("%Y-%m-%d"),
                "status": status,
                "recommended_reorder": round(p["avg_daily_sales"] * 45),
                "reorder_cost_estimate": round(p["avg_daily_sales"] * 45 * random.uniform(10, 80), 2)
            })
    critical.sort(key=lambda x: x["days_until_stockout"])
    return {"predictions": critical, "critical_count": sum(1 for p in critical if p["status"] == "critical")}

@router.get("/inventory-optimization")
def get_inventory_optimization():
    suggestions = [
        {"product": "Running Shoes Elite", "issue": "Critically low stock",
         "suggestion": "Reorder 330 units immediately. Expected stockout in 0.5 days.",
         "estimated_savings": 14200, "priority": "urgent", "action": "reorder"},
        {"product": "Standing Desk Pro", "issue": "Very low stock",
         "suggestion": "Reorder 120 units. Stock covers only 2 days at current sales rate.",
         "estimated_savings": 8500, "priority": "high", "action": "reorder"},
        {"product": "Winter Jacket Premium", "issue": "Demand spike predicted",
         "suggestion": "Increase stock by 124 units before Nov 15 spike. Confidence: 91.5%",
         "estimated_savings": 22800, "priority": "high", "action": "preorder"},
        {"product": "Organic Oats 1kg", "issue": "Overstocked",
         "suggestion": "Reduce next order by 40%. Current stock covers 3.8 months.",
         "estimated_savings": 3200, "priority": "low", "action": "reduce"},
        {"product": "Mechanical Keyboard X", "issue": "Suboptimal reorder point",
         "suggestion": "Set reorder trigger at 100 units (currently 50) to avoid stockouts.",
         "estimated_savings": 5100, "priority": "medium", "action": "adjust"},
    ]
    total_savings = sum(s["estimated_savings"] for s in suggestions)
    return {"suggestions": suggestions, "total_potential_savings": total_savings}
