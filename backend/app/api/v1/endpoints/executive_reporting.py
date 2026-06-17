from fastapi import APIRouter, HTTPException, Query
from typing import Optional
from datetime import datetime, timedelta
import random

router = APIRouter(prefix="/executive-reports", tags=["Executive Reporting"])

scheduled_reports = [
    {"id": 1, "name": "Monthly Executive Summary", "type": "executive_summary",
     "frequency": "monthly", "day": "1", "time": "07:00",
     "recipients": ["ceo@example.com", "cfo@example.com"],
     "format": "PDF", "is_active": True, "last_sent": (datetime.utcnow() - timedelta(days=1)).isoformat(),
     "next_send": (datetime.utcnow() + timedelta(days=29)).isoformat()},
    {"id": 2, "name": "Weekly Revenue Outlook", "type": "revenue_forecast",
     "frequency": "weekly", "day": "Monday", "time": "08:00",
     "recipients": ["manager@example.com", "admin@example.com"],
     "format": "PDF", "is_active": True, "last_sent": (datetime.utcnow() - timedelta(days=3)).isoformat(),
     "next_send": (datetime.utcnow() + timedelta(days=4)).isoformat()},
    {"id": 3, "name": "Demand & Inventory Outlook", "type": "demand_outlook",
     "frequency": "weekly", "day": "Friday", "time": "17:00",
     "recipients": ["admin@example.com"],
     "format": "PDF", "is_active": False, "last_sent": (datetime.utcnow() - timedelta(days=10)).isoformat(),
     "next_send": None},
]

generated_reports_store = [
    {"id": i+1,
     "name": random.choice(["Monthly Executive Summary", "Revenue Outlook Dec 2025",
                              "Demand Forecast Q4", "Management Analytics Nov"]),
     "type": random.choice(["executive_summary", "revenue_forecast", "demand_outlook", "management_analytics"]),
     "generated_by": random.choice(["admin@example.com", "system"]),
     "period": random.choice(["November 2025", "Q4 2025", "December 2025"]),
     "pages": random.randint(4, 18),
     "format": "PDF",
     "status": "ready",
     "generated_at": (datetime.utcnow() - timedelta(hours=i*8)).isoformat(),
     "download_url": f"/api/reports/download/exec_{i+1}.pdf"}
    for i in range(10)
]

@router.get("/summary", summary="Get executive summary report data")
def executive_summary_data(period: Optional[str] = Query("December 2025")):
    return {
        "period": period,
        "kpis": {
            "revenue": {"value": "₹2.84 Cr", "change": "+18.4%", "status": "on_track"},
            "profit": {"value": "₹59.7 L", "change": "+12.1%", "status": "on_track"},
            "forecast_accuracy": {"value": "96.2%", "change": "+1.8%", "status": "on_track"},
            "demand_fulfillment": {"value": "94.5%", "change": "-0.5%", "status": "at_risk"},
        },
        "highlights": [
            "Revenue tracking 18.4% above YoY with strong Electronics performance",
            "XGBoost model achieved all-time high accuracy of 97.1%",
            "2 demand spikes predicted — inventory action required in 3 days",
            "Grocery overstock situation resolved — ₹3.2L cost avoidance",
        ],
        "risks": [
            {"risk": "Running Shoes stockout", "severity": "critical", "eta": "< 24 hours"},
            {"risk": "Electronics pre-stocking gap", "severity": "high", "eta": "5 days"},
        ],
        "next_steps": [
            "Approve emergency order for Running Shoes (330 units)",
            "Switch Electronics model to XGBoost for improved accuracy",
            "Schedule Q1 planning session with demand team",
        ],
        "generated_at": datetime.utcnow().isoformat(),
    }

@router.get("/monthly-forecast", summary="Monthly business forecast report")
def monthly_forecast(month: Optional[str] = Query("December 2025")):
    months_data = [
        {"month": m, "forecast": round(random.uniform(700, 950) * 10000),
         "actual": round(random.uniform(680, 920) * 10000), "variance": round(random.uniform(-5, 8), 1)}
        for m in ["Sep","Oct","Nov"]
    ]
    months_data.append({"month": "Dec", "forecast": 9200000, "actual": None, "variance": None})
    return {
        "period": month,
        "monthly_data": months_data,
        "category_breakdown": [
            {"category": "Electronics", "forecast": 3800000, "share": "41.3%"},
            {"category": "Fashion", "forecast": 2600000, "share": "28.3%"},
            {"category": "Groceries", "forecast": 1900000, "share": "20.7%"},
            {"category": "Furniture", "forecast": 900000, "share": "9.8%"},
        ],
        "confidence": 94.2,
        "generated_at": datetime.utcnow().isoformat(),
    }

@router.get("/revenue-outlook", summary="Revenue and demand outlook")
def revenue_outlook():
    return {
        "current_month": {"revenue": 8420000, "demand_units": 24800, "top_category": "Electronics"},
        "next_month_forecast": {"revenue": 9200000, "demand_units": 27100, "growth": "+9.3%"},
        "next_quarter_forecast": {"revenue": 26500000, "demand_units": 79000, "growth": "+14.2%"},
        "revenue_by_category": [
            {"category": "Electronics", "current": 3800000, "forecast": 4200000, "growth": "+10.5%"},
            {"category": "Fashion", "current": 2600000, "forecast": 2800000, "growth": "+7.7%"},
            {"category": "Groceries", "current": 1900000, "forecast": 1950000, "growth": "+2.6%"},
            {"category": "Furniture", "current": 900000, "forecast": 1050000, "growth": "+16.7%"},
        ],
        "generated_at": datetime.utcnow().isoformat(),
    }

@router.get("/management-analytics", summary="Management-level analytics summary")
def management_analytics():
    return {
        "operational_metrics": [
            {"metric": "Avg Forecast Cycle Time", "value": "12 min", "change": "-3 min", "status": "good"},
            {"metric": "Dataset Processing Time", "value": "45 sec", "change": "-10 sec", "status": "good"},
            {"metric": "Alert Response Time", "value": "4.2 hrs", "change": "+0.8 hrs", "status": "warning"},
            {"metric": "Report Generation Time", "value": "28 sec", "change": "-5 sec", "status": "good"},
        ],
        "team_productivity": [
            {"user": "admin@example.com", "forecasts_run": 142, "reports": 56, "accuracy_avg": 96.1},
            {"user": "analyst@example.com", "forecasts_run": 87, "reports": 23, "accuracy_avg": 94.8},
            {"user": "manager@example.com", "forecasts_run": 34, "reports": 41, "accuracy_avg": 95.3},
        ],
        "platform_health": {
            "uptime": "99.98%", "api_requests_today": 1842,
            "errors_today": 3, "avg_response_ms": 184,
        },
        "generated_at": datetime.utcnow().isoformat(),
    }

@router.get("/scheduled", summary="List scheduled reports")
def list_scheduled():
    return {"scheduled_reports": scheduled_reports, "total": len(scheduled_reports),
            "active": sum(1 for r in scheduled_reports if r["is_active"])}

@router.post("/scheduled", status_code=201, summary="Create report schedule")
def create_scheduled(payload: dict):
    new_sched = {
        "id": len(scheduled_reports) + 1,
        "name": payload.get("name", "New Scheduled Report"),
        "type": payload.get("type", "executive_summary"),
        "frequency": payload.get("frequency", "monthly"),
        "day": payload.get("day", "1"),
        "time": payload.get("time", "08:00"),
        "recipients": payload.get("recipients", []),
        "format": payload.get("format", "PDF"),
        "is_active": True,
        "last_sent": None,
        "next_send": (datetime.utcnow() + timedelta(days=1)).isoformat(),
    }
    scheduled_reports.append(new_sched)
    return new_sched

@router.put("/scheduled/{sched_id}/toggle", summary="Enable/disable scheduled report")
def toggle_scheduled(sched_id: int):
    for s in scheduled_reports:
        if s["id"] == sched_id:
            s["is_active"] = not s["is_active"]
            return s
    raise HTTPException(404, "Scheduled report not found")

@router.get("/generated", summary="List generated reports")
def list_generated(limit: int = Query(10)):
    return {"reports": generated_reports_store[:limit], "total": len(generated_reports_store)}

@router.post("/generate", summary="Generate report on-demand")
def generate_report(payload: dict):
    rtype = payload.get("type", "executive_summary")
    new_report = {
        "id": len(generated_reports_store) + 1,
        "name": payload.get("name", f"{rtype.replace('_',' ').title()} Report"),
        "type": rtype,
        "generated_by": payload.get("generated_by", "admin@example.com"),
        "period": payload.get("period", "December 2025"),
        "pages": random.randint(4, 14),
        "format": payload.get("format", "PDF"),
        "status": "ready",
        "generated_at": datetime.utcnow().isoformat(),
        "download_url": f"/api/reports/download/exec_{len(generated_reports_store)+1}.pdf",
    }
    generated_reports_store.append(new_report)
    return new_report
