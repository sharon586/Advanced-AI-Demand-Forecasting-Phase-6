from fastapi import APIRouter, Query
from typing import Optional
from datetime import datetime, timedelta
import random

router = APIRouter(prefix="/bi", tags=["Business Intelligence"])

MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov"]

def _monthly(base, variance=0.15):
    return [{"month": MONTHS[i], "value": round(base * (1 + (i*0.03)) + random.uniform(-base*variance, base*variance))}
            for i in range(len(MONTHS))]

@router.get("/executive-summary", summary="Executive KPI summary")
def executive_summary():
    return {
        "kpis": {
            "total_revenue": {"value": 28_450_000, "unit": "₹", "change": "+18.4%", "trend": "up"},
            "net_profit": {"value": 5_972_000, "unit": "₹", "change": "+12.1%", "trend": "up"},
            "total_cost": {"value": 22_478_000, "unit": "₹", "change": "+8.2%", "trend": "up"},
            "gross_margin": {"value": 21.0, "unit": "%", "change": "+2.3pp", "trend": "up"},
            "forecast_accuracy": {"value": 96.2, "unit": "%", "change": "+1.8%", "trend": "up"},
            "demand_fulfillment": {"value": 94.5, "unit": "%", "change": "-0.5%", "trend": "down"},
            "inventory_turnover": {"value": 8.3, "unit": "x", "change": "+0.7x", "trend": "up"},
            "customer_count": {"value": 11260, "unit": "", "change": "+14.2%", "trend": "up"},
        },
        "period": "YTD 2025",
        "generated_at": datetime.utcnow().isoformat(),
    }

@router.get("/revenue-forecast", summary="Revenue forecast by month/category")
def revenue_forecast(category: Optional[str] = Query(None)):
    base_map = {"Electronics": 4200000, "Fashion": 2800000, "Groceries": 1900000, "Furniture": 1400000, "All": 8500000}
    base = base_map.get(category, base_map["All"])
    actual = _monthly(base)
    forecast = [{"month": MONTHS[i], "value": round(actual[i]["value"] * random.uniform(1.02, 1.08))}
                for i in range(len(MONTHS))]
    return {
        "category": category or "All",
        "actual": actual,
        "forecast": forecast,
        "total_actual": sum(d["value"] for d in actual),
        "total_forecast": sum(d["value"] for d in forecast),
        "growth_rate": "+18.4%",
        "peak_month": max(actual, key=lambda x: x["value"])["month"],
    }

@router.get("/profit-forecast", summary="Profit and margin analysis")
def profit_forecast():
    revenue = _monthly(8500000)
    cost    = [{"month": MONTHS[i], "value": round(revenue[i]["value"] * random.uniform(0.72, 0.80))} for i in range(len(MONTHS))]
    profit  = [{"month": MONTHS[i], "value": revenue[i]["value"] - cost[i]["value"]} for i in range(len(MONTHS))]
    margins = [{"month": MONTHS[i], "value": round(profit[i]["value"] / revenue[i]["value"] * 100, 2)} for i in range(len(MONTHS))]
    return {
        "revenue": revenue, "cost": cost, "profit": profit, "margins": margins,
        "avg_margin": round(sum(m["value"] for m in margins) / len(margins), 2),
        "total_profit": sum(p["value"] for p in profit),
        "total_revenue": sum(r["value"] for r in revenue),
    }

@router.get("/cost-analysis", summary="Cost breakdown and trends")
def cost_analysis():
    categories = [
        {"category": "Operations", "amount": 8200000, "pct": 36.5, "change": "+5.2%", "color": "#7C3AED"},
        {"category": "Procurement", "amount": 6800000, "pct": 30.3, "change": "+12.1%", "color": "#EC4899"},
        {"category": "Logistics", "amount": 3900000, "pct": 17.3, "change": "+3.8%", "color": "#3B82F6"},
        {"category": "Marketing", "amount": 2100000, "pct": 9.3, "change": "+22.5%", "color": "#10B981"},
        {"category": "Technology", "amount": 980000, "pct": 4.4, "change": "-2.1%", "color": "#F59E0B"},
        {"category": "Other", "amount": 498000, "pct": 2.2, "change": "+1.0%", "color": "#6B7280"},
    ]
    monthly = _monthly(1900000, variance=0.12)
    return {
        "categories": categories,
        "monthly_trend": monthly,
        "total_cost": sum(c["amount"] for c in categories),
        "highest_cost": categories[0]["category"],
        "fastest_growing": "Marketing",
    }

@router.get("/performance-kpis", summary="Business performance KPI trends")
def performance_kpis():
    kpis = [
        {"name": "Revenue Growth", "current": 18.4, "target": 15.0, "unit": "%", "status": "achieved", "trend": _monthly(18, 0.2)},
        {"name": "Forecast Accuracy", "current": 96.2, "target": 95.0, "unit": "%", "status": "achieved", "trend": _monthly(95, 0.05)},
        {"name": "Inventory Turnover", "current": 8.3, "target": 8.0, "unit": "x", "status": "achieved", "trend": _monthly(8.0, 0.1)},
        {"name": "Demand Fulfillment", "current": 94.5, "target": 96.0, "unit": "%", "status": "at_risk", "trend": _monthly(95, 0.08)},
        {"name": "Cost Reduction", "current": 3.2, "target": 5.0, "unit": "%", "status": "behind", "trend": _monthly(3, 0.3)},
        {"name": "Customer Satisfaction", "current": 88.7, "target": 90.0, "unit": "%", "status": "at_risk", "trend": _monthly(88, 0.05)},
    ]
    return {"kpis": kpis,
            "achieved": sum(1 for k in kpis if k["status"] == "achieved"),
            "at_risk": sum(1 for k in kpis if k["status"] == "at_risk"),
            "behind": sum(1 for k in kpis if k["status"] == "behind")}

@router.get("/growth-impact", summary="Forecasting impact on business growth")
def growth_impact():
    return {
        "before_ai": {"revenue": 18500000, "accuracy": 72.0, "stockouts": 142, "overstock_cost": 980000},
        "after_ai": {"revenue": 28450000, "accuracy": 96.2, "stockouts": 14, "overstock_cost": 182000},
        "improvements": {
            "revenue_increase": "+53.8%",
            "accuracy_improvement": "+24.2pp",
            "stockout_reduction": "-90.1%",
            "overstock_savings": "₹7,98,000",
            "roi": "412%",
            "payback_period": "4.2 months",
        },
        "monthly_impact": [
            {"month": MONTHS[i], "before": round(1540000 + random.uniform(-50000, 50000)),
             "after": round(2370000 + random.uniform(-80000, 80000) + i * 30000)}
            for i in range(len(MONTHS))
        ]
    }
