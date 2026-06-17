from fastapi import APIRouter, Query
from typing import Optional

router = APIRouter(prefix="/advanced-analytics", tags=["Advanced Analytics"])

@router.get("/region-forecast")
def region_forecast(category: Optional[str] = Query(None)):
    regions = [
        {"region": "North", "current_sales": 1800000, "forecast": 2100000, "growth": "+16.7%",
         "top_product": "Laptop UltraBook", "risk": "low",
         "monthly": [150000,160000,175000,185000,195000,210000,225000,240000,255000,270000,285000,300000]},
        {"region": "South", "current_sales": 1200000, "forecast": 1380000, "growth": "+15.0%",
         "top_product": "Running Shoes Air", "risk": "low",
         "monthly": [95000,105000,112000,118000,125000,132000,140000,148000,155000,162000,170000,178000]},
        {"region": "East", "current_sales": 980000, "forecast": 1060000, "growth": "+8.2%",
         "top_product": "Basmati Rice 10kg", "risk": "medium",
         "monthly": [78000,82000,87000,91000,96000,100000,105000,110000,114000,118000,123000,128000]},
        {"region": "West", "current_sales": 1350000, "forecast": 1520000, "growth": "+12.6%",
         "top_product": "Office Chair Ergo", "risk": "low",
         "monthly": [108000,115000,122000,130000,138000,146000,154000,162000,170000,178000,186000,195000]},
    ]
    return {"regions": regions, "category_filter": category,
            "labels": ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]}

@router.get("/category-insights")
def category_insights():
    return {
        "categories": [
            {"category": "Electronics", "revenue": 4200000, "growth": "+24%", "units": 1820,
             "avg_price": 18500, "forecast_next": 5100000, "trend": "rising",
             "top_products": ["Laptop UltraBook","Headphones Pro X1","Bluetooth Speaker"],
             "monthly_sales": [320000,345000,368000,392000,418000,445000,472000,500000,528000,556000,585000,614000]},
            {"category": "Fashion", "revenue": 3100000, "growth": "+18%", "units": 2540,
             "avg_price": 2400, "forecast_next": 3650000, "trend": "rising",
             "top_products": ["Running Shoes Air","Denim Jacket","Cotton Kurta Set"],
             "monthly_sales": [240000,258000,275000,292000,310000,328000,346000,364000,382000,400000,418000,436000]},
            {"category": "Groceries", "revenue": 2400000, "growth": "+12%", "units": 4820,
             "avg_price": 650, "forecast_next": 2680000, "trend": "stable",
             "top_products": ["Basmati Rice 10kg","Organic Rice 5kg"],
             "monthly_sales": [185000,194000,203000,212000,222000,232000,242000,252000,262000,272000,282000,292000]},
            {"category": "Furniture", "revenue": 1800000, "growth": "+8%", "units": 420,
             "avg_price": 7200, "forecast_next": 1940000, "trend": "stable",
             "top_products": ["Office Chair Ergo","Study Table Wooden"],
             "monthly_sales": [140000,146000,152000,158000,164000,170000,176000,182000,188000,194000,200000,206000]},
        ],
        "labels": ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]
    }

@router.get("/revenue-prediction")
def revenue_prediction():
    return {
        "current_year_revenue": 11500000,
        "predicted_next_year": 14800000,
        "growth_rate": "+28.7%",
        "confidence": 94.2,
        "quarterly": [
            {"quarter": "Q1 2025", "actual": 2850000, "predicted": None},
            {"quarter": "Q2 2025", "actual": 3100000, "predicted": None},
            {"quarter": "Q3 2025", "actual": 2800000, "predicted": None},
            {"quarter": "Q4 2025", "actual": 2750000, "predicted": None},
            {"quarter": "Q1 2026", "actual": None, "predicted": 3400000},
            {"quarter": "Q2 2026", "actual": None, "predicted": 3750000},
            {"quarter": "Q3 2026", "actual": None, "predicted": 3600000},
            {"quarter": "Q4 2026", "actual": None, "predicted": 4050000},
        ]
    }

@router.get("/inventory-risk")
def inventory_risk():
    return {
        "high_risk": [
            {"product": "Laptop UltraBook", "category": "Electronics", "current_stock": 5,
             "days_remaining": 1, "reorder_point": 20, "risk_score": 98, "action": "Reorder immediately"},
            {"product": "Headphones Pro X1", "category": "Electronics", "current_stock": 12,
             "days_remaining": 3, "reorder_point": 30, "risk_score": 91, "action": "Order within 24hrs"},
            {"product": "Office Chair Ergo", "category": "Furniture", "current_stock": 8,
             "days_remaining": 2, "reorder_point": 15, "risk_score": 95, "action": "Reorder immediately"},
        ],
        "medium_risk": [
            {"product": "Running Shoes Air", "category": "Fashion", "current_stock": 28,
             "days_remaining": 7, "reorder_point": 40, "risk_score": 72, "action": "Plan reorder"},
            {"product": "Denim Jacket", "category": "Fashion", "current_stock": 35,
             "days_remaining": 9, "reorder_point": 45, "risk_score": 64, "action": "Monitor closely"},
        ],
        "low_risk": [
            {"product": "Organic Rice 5kg", "category": "Groceries", "current_stock": 180,
             "days_remaining": 45, "reorder_point": 60, "risk_score": 18, "action": "No action needed"},
            {"product": "Basmati Rice 10kg", "category": "Groceries", "current_stock": 145,
             "days_remaining": 38, "reorder_point": 50, "risk_score": 22, "action": "No action needed"},
        ],
        "total_at_risk": 5,
        "estimated_loss_if_stockout": 2840000
    }

@router.get("/ai-insights")
def ai_insights():
    return {
        "insights": [
            {"category": "Revenue Opportunity", "icon": "💰", "severity": "high",
             "title": "Electronics Revenue Surge Predicted",
             "detail": "Random Forest model predicts 24% revenue increase in Electronics next quarter. Consider increasing inventory for Laptop UltraBook and Headphones Pro X1.",
             "impact": "+₹12.4L potential revenue", "confidence": 96.8},
            {"category": "Risk Alert", "icon": "⚠️", "severity": "high",
             "title": "Critical Stock Shortage Detected",
             "detail": "3 products at critical stock levels. Immediate reorder recommended to prevent ₹28.4L revenue loss.",
             "impact": "-₹28.4L if not addressed", "confidence": 98.1},
            {"category": "Seasonal Pattern", "icon": "❄️", "severity": "info",
             "title": "Winter Demand Spike Approaching",
             "detail": "Historical patterns indicate 38% demand spike in Electronics during Dec-Jan. Begin forecasting and inventory planning now.",
             "impact": "+₹38% seasonal boost", "confidence": 91.4},
            {"category": "Model Improvement", "icon": "🤖", "severity": "info",
             "title": "Ensemble Model Recommendation",
             "detail": "Combining Random Forest + XGBoost predictions improves accuracy from 96.8% to 98.2%. Consider enabling ensemble mode.",
             "impact": "+1.4% accuracy improvement", "confidence": 89.5},
            {"category": "Market Trend", "icon": "📈", "severity": "success",
             "title": "Fashion Category Growing Strongly",
             "detail": "Fashion category showing 18% growth trend. South region leading with Running Shoes Air as top performer.",
             "impact": "+₹5.5L additional revenue", "confidence": 87.3},
        ]
    }
