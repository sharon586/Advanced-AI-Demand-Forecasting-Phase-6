from fastapi import APIRouter, Query
from typing import Optional
from datetime import datetime, timedelta
import random
import math

router = APIRouter(prefix="/realtime", tags=["Real-Time"])

def _generate_live_sales():
    base = 85000
    now = datetime.utcnow()
    hour_factor = 1 + 0.3 * math.sin(now.hour * math.pi / 12)
    noise = random.uniform(0.92, 1.08)
    return round(base * hour_factor * noise)

def _generate_sparkline(points=12):
    base = 70000
    data = []
    for i in range(points):
        val = base + random.randint(-15000, 25000) + i * 1200
        data.append(round(val))
    return data

@router.get("/dashboard")
def realtime_dashboard():
    now = datetime.utcnow()
    sales_now = _generate_live_sales()
    return {
        "timestamp": now.isoformat(),
        "live_sales": sales_now,
        "live_orders": random.randint(42, 138),
        "active_users": random.randint(8, 34),
        "forecast_accuracy": round(random.uniform(94.2, 97.8), 1),
        "sales_change_pct": round(random.uniform(2.1, 18.4), 1),
        "orders_change_pct": round(random.uniform(-3.2, 12.5), 1),
        "sparkline_sales": _generate_sparkline(12),
        "sparkline_orders": [random.randint(30, 120) for _ in range(12)],
        "alerts": [
            {"type": "warning", "message": "Headphones Pro X1: only 12 units left", "time": "2 min ago"},
            {"type": "success", "message": "Random Forest forecast completed: 96.8% accuracy", "time": "5 min ago"},
            {"type": "info", "message": "Electronics demand up 24% this hour", "time": "8 min ago"},
        ]
    }

@router.get("/sales-monitor")
def live_sales_monitor():
    now = datetime.utcnow()
    timeline = []
    for i in range(20):
        t = now - timedelta(minutes=(19 - i) * 3)
        timeline.append({
            "time": t.strftime("%H:%M"),
            "sales": _generate_live_sales(),
            "orders": random.randint(25, 95)
        })
    return {
        "timestamp": now.isoformat(),
        "timeline": timeline,
        "current_rate": f"₹{_generate_live_sales():,}/min",
        "peak_today": f"₹{random.randint(110000, 145000):,}",
        "total_today": f"₹{random.randint(2800000, 3400000):,}"
    }

@router.get("/anomalies")
def get_anomalies():
    return {
        "anomalies": [
            {"product": "Laptop UltraBook", "category": "Electronics", "region": "North",
             "expected": 52000, "actual": 89400, "deviation": "+71.9%", "severity": "high",
             "detected_at": (datetime.utcnow() - timedelta(hours=1)).isoformat()},
            {"product": "Cotton Kurta Set", "category": "Fashion", "region": "South",
             "expected": 14200, "actual": 4800, "deviation": "-66.2%", "severity": "medium",
             "detected_at": (datetime.utcnow() - timedelta(hours=3)).isoformat()},
            {"product": "Basmati Rice 10kg", "category": "Groceries", "region": "East",
             "expected": 18500, "actual": 22100, "deviation": "+19.5%", "severity": "low",
             "detected_at": (datetime.utcnow() - timedelta(hours=5)).isoformat()},
        ],
        "total_anomalies": 3,
        "high_severity": 1,
        "detection_accuracy": 94.2
    }

@router.get("/seasonal-trends")
def seasonal_trends():
    return {
        "current_season": "Summer",
        "season_impact": "+18%",
        "trends": [
            {"season": "Spring", "months": "Mar-May", "impact": "+12%", "top_category": "Fashion", "growth": 18},
            {"season": "Summer", "months": "Jun-Aug", "impact": "+18%", "top_category": "Electronics", "growth": 24},
            {"season": "Autumn", "months": "Sep-Nov", "impact": "+8%", "top_category": "Furniture", "growth": 11},
            {"season": "Winter", "months": "Dec-Feb", "impact": "+32%", "top_category": "Electronics", "growth": 38},
        ],
        "forecast_adjustment": {
            "Electronics": "+24% (Summer peak)",
            "Fashion": "+18% (Spring/Summer)",
            "Groceries": "Stable year-round",
            "Furniture": "+11% (Autumn)",
        }
    }
