from fastapi import APIRouter, Query
from typing import Optional

router = APIRouter(prefix="/search", tags=["Search"])

MOCK_DATA = {
    "forecasts": [
        {"id": 1, "type": "forecast", "title": "Random Forest — Electronics/North", "accuracy": "96.8%", "date": "2026-05-27", "url": "/forecast"},
        {"id": 2, "type": "forecast", "title": "XGBoost — Fashion/South", "accuracy": "95.4%", "date": "2026-05-27", "url": "/forecast"},
        {"id": 3, "type": "forecast", "title": "Linear Regression — All/All", "accuracy": "91.2%", "date": "2026-05-26", "url": "/forecast"},
        {"id": 4, "type": "forecast", "title": "ARIMA — Groceries/East", "accuracy": "88.6%", "date": "2026-05-25", "url": "/forecast"},
    ],
    "reports": [
        {"id": 1, "type": "report", "title": "Q1 Sales Report", "report_type": "Sales", "date": "2025-04-01", "url": "/reports"},
        {"id": 2, "type": "report", "title": "Electronics Forecast Q2", "report_type": "Forecast", "date": "2025-07-01", "url": "/reports"},
        {"id": 3, "type": "report", "title": "Annual Revenue Insights", "report_type": "Revenue", "date": "2026-01-05", "url": "/reports"},
    ],
    "datasets": [
        {"id": 1, "type": "dataset", "title": "sales_q1_2025.csv", "rows": 1240, "category": "All", "date": "2025-04-01", "url": "/upload"},
        {"id": 2, "type": "dataset", "title": "electronics_demand.csv", "rows": 860, "category": "Electronics", "date": "2025-05-10", "url": "/upload"},
        {"id": 3, "type": "dataset", "title": "fashion_trends.csv", "rows": 540, "category": "Fashion", "date": "2025-06-15", "url": "/upload"},
    ],
    "users": [
        {"id": 1, "type": "user", "title": "Admin User", "email": "admin@example.com", "role": "Admin", "url": "/admin"},
        {"id": 2, "type": "user", "title": "Analyst User", "email": "analyst@example.com", "role": "Analyst", "url": "/admin"},
        {"id": 3, "type": "user", "title": "Manager User", "email": "manager@example.com", "role": "Manager", "url": "/admin"},
    ]
}

@router.get("/global")
def global_search(
    q: str = Query(..., min_length=1),
    category: Optional[str] = Query(None)
):
    q_lower = q.lower()
    results = []
    sources = ["forecasts", "reports", "datasets", "users"]
    if category: sources = [category] if category in sources else sources

    for source in sources:
        for item in MOCK_DATA.get(source, []):
            searchable = f"{item.get('title','')} {item.get('email','')} {item.get('report_type','')} {item.get('category','')}".lower()
            if q_lower in searchable:
                results.append(item)

    return {
        "query": q,
        "results": results,
        "total": len(results),
        "by_type": {
            "forecasts": len([r for r in results if r["type"] == "forecast"]),
            "reports": len([r for r in results if r["type"] == "report"]),
            "datasets": len([r for r in results if r["type"] == "dataset"]),
            "users": len([r for r in results if r["type"] == "user"]),
        }
    }
