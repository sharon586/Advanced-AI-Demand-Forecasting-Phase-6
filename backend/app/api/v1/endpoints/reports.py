from fastapi import APIRouter, Query, HTTPException
from typing import Optional
from datetime import datetime

router = APIRouter(prefix="/reports", tags=["Reports"])

# In-memory reports store
reports_store = [
    {
        "id": 1, "title": "Q1 Sales Report", "report_type": "Sales",
        "generated_by": "admin@example.com", "total_sales": 1290000,
        "forecast_accuracy": 94.5, "growth_rate": 12.3,
        "category": "All", "region": "North",
        "date_from": "2025-01-01", "date_to": "2025-03-31",
        "created_at": "2025-04-01T10:00:00"
    },
    {
        "id": 2, "title": "Electronics Forecast Q2", "report_type": "Forecast",
        "generated_by": "analyst@example.com", "total_sales": 1850000,
        "forecast_accuracy": 96.8, "growth_rate": 24.1,
        "category": "Electronics", "region": "South",
        "date_from": "2025-04-01", "date_to": "2025-06-30",
        "created_at": "2025-07-01T09:00:00"
    },
    {
        "id": 3, "title": "Annual Revenue Insights", "report_type": "Revenue",
        "generated_by": "admin@example.com", "total_sales": 6300000,
        "forecast_accuracy": 95.2, "growth_rate": 32.0,
        "category": "All", "region": "All",
        "date_from": "2025-01-01", "date_to": "2025-12-31",
        "created_at": "2026-01-05T11:00:00"
    },
]


@router.get("/")
def list_reports(
    page: int = Query(1, ge=1),
    per_page: int = Query(10, ge=1, le=100),
    search: Optional[str] = Query(None),
    report_type: Optional[str] = Query(None),
    category: Optional[str] = Query(None),
    region: Optional[str] = Query(None),
    date_from: Optional[str] = Query(None),
    date_to: Optional[str] = Query(None)
):
    filtered = reports_store

    if search:
        filtered = [r for r in filtered if search.lower() in r["title"].lower()]
    if report_type:
        filtered = [r for r in filtered if r.get("report_type") == report_type]
    if category:
        filtered = [r for r in filtered if r.get("category") == category]
    if region:
        filtered = [r for r in filtered if r.get("region") == region]

    total = len(filtered)
    start = (page - 1) * per_page
    end = start + per_page
    paginated = filtered[start:end]

    return {
        "reports": paginated,
        "total": total,
        "page": page,
        "per_page": per_page,
        "total_pages": (total + per_page - 1) // per_page
    }


@router.get("/sales")
def sales_report(
    category: Optional[str] = Query(None),
    region: Optional[str] = Query(None),
    date_from: Optional[str] = Query(None),
    date_to: Optional[str] = Query(None)
):
    monthly_data = [
        {"month": "January", "sales": 420000, "forecast": 450000, "growth": "8%"},
        {"month": "February", "sales": 380000, "forecast": 430000, "growth": "13%"},
        {"month": "March", "sales": 520000, "forecast": 580000, "growth": "11%"},
        {"month": "April", "sales": 610000, "forecast": 670000, "growth": "9%"},
        {"month": "May", "sales": 680000, "forecast": 730000, "growth": "7%"},
        {"month": "June", "sales": 720000, "forecast": 760000, "growth": "5%"},
    ]
    return {
        "report": "Monthly Sales Report",
        "status": "generated",
        "data": monthly_data,
        "summary": {
            "total_sales": sum(d["sales"] for d in monthly_data),
            "total_forecast": sum(d["forecast"] for d in monthly_data),
            "avg_growth": "8.8%"
        },
        "category": category,
        "region": region
    }


@router.get("/forecast")
def forecast_report(
    category: Optional[str] = Query(None),
    region: Optional[str] = Query(None)
):
    return {
        "report": "Forecast Report",
        "status": "generated",
        "models_used": ["Linear Regression", "Random Forest", "XGBoost", "ARIMA"],
        "best_model": "Random Forest",
        "overall_accuracy": 96.2,
        "category": category,
        "region": region
    }


@router.get("/{report_id}")
def get_report(report_id: int):
    report = next((r for r in reports_store if r["id"] == report_id), None)
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")
    return report


@router.post("/generate")
def generate_report(
    title: str = Query(...),
    report_type: str = Query("Sales"),
    category: Optional[str] = Query(None),
    region: Optional[str] = Query(None),
    date_from: Optional[str] = Query(None),
    date_to: Optional[str] = Query(None)
):
    new_id = max([r["id"] for r in reports_store], default=0) + 1
    report = {
        "id": new_id,
        "title": title,
        "report_type": report_type,
        "generated_by": "user@example.com",
        "total_sales": 2300000,
        "forecast_accuracy": 96.2,
        "growth_rate": 15.5,
        "category": category or "All",
        "region": region or "All",
        "date_from": date_from or "2025-01-01",
        "date_to": date_to or "2025-12-31",
        "created_at": datetime.utcnow().isoformat()
    }
    reports_store.append(report)
    return {"message": "Report generated successfully", "report_id": new_id, "report": report}
