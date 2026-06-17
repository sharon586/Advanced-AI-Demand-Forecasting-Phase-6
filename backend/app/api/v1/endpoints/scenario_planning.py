from fastapi import APIRouter, HTTPException, Query
from typing import Optional
from datetime import datetime, timedelta
import random, math

router = APIRouter(prefix="/scenarios", tags=["Scenario Planning"])

scenarios_store = [
    {
        "id": 1, "name": "Optimistic Q4 Growth", "description": "Best-case holiday season scenario",
        "base_model": "XGBoost", "category": "Electronics", "region": "North",
        "variables": {"sales_growth": 15.0, "seasonality_factor": 1.3, "demand_factor": 1.2,
                      "price_elasticity": -0.5, "marketing_spend": 20.0, "competitor_impact": -5.0},
        "status": "saved", "is_baseline": False,
        "created_by": "admin@example.com",
        "created_at": (datetime.utcnow() - timedelta(days=7)).isoformat(),
        "updated_at": (datetime.utcnow() - timedelta(days=2)).isoformat(),
    },
    {
        "id": 2, "name": "Pessimistic Recession", "description": "Worst-case economic downturn scenario",
        "base_model": "Random Forest", "category": "All", "region": "All",
        "variables": {"sales_growth": -8.0, "seasonality_factor": 0.85, "demand_factor": 0.75,
                      "price_elasticity": -1.2, "marketing_spend": -15.0, "competitor_impact": -20.0},
        "status": "saved", "is_baseline": False,
        "created_by": "manager@example.com",
        "created_at": (datetime.utcnow() - timedelta(days=14)).isoformat(),
        "updated_at": (datetime.utcnow() - timedelta(days=5)).isoformat(),
    },
    {
        "id": 3, "name": "Baseline Current Trend", "description": "Continuation of current market conditions",
        "base_model": "XGBoost", "category": "All", "region": "All",
        "variables": {"sales_growth": 5.0, "seasonality_factor": 1.0, "demand_factor": 1.0,
                      "price_elasticity": -0.8, "marketing_spend": 0.0, "competitor_impact": 0.0},
        "status": "saved", "is_baseline": True,
        "created_by": "admin@example.com",
        "created_at": (datetime.utcnow() - timedelta(days=30)).isoformat(),
        "updated_at": (datetime.utcnow() - timedelta(days=30)).isoformat(),
    },
]

BASE_MONTHLY = [420, 350, 520, 280, 610, 480, 720, 650, 580, 710, 820, 950]
MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]

def _project_scenario(variables: dict):
    growth = variables.get("sales_growth", 0) / 100
    season = variables.get("seasonality_factor", 1.0)
    demand = variables.get("demand_factor", 1.0)
    mkt    = variables.get("marketing_spend", 0) / 100
    comp   = variables.get("competitor_impact", 0) / 100
    combined = (1 + growth) * season * demand * (1 + mkt * 0.5) * (1 + comp * 0.3)
    return [{"month": MONTHS[i], "value": round(BASE_MONTHLY[i] * combined * 1000 + random.uniform(-5000,5000))}
            for i in range(12)]

def _next_id():
    return max((s["id"] for s in scenarios_store), default=0) + 1

@router.get("/", summary="List all scenarios")
def list_scenarios(category: Optional[str] = Query(None), status: Optional[str] = Query(None)):
    data = list(scenarios_store)
    if category:
        data = [s for s in data if s["category"] == category or s["category"] == "All"]
    if status:
        data = [s for s in data if s["status"] == status]
    return {"scenarios": data, "total": len(data)}

@router.get("/{scenario_id}", summary="Get scenario")
def get_scenario(scenario_id: int):
    for s in scenarios_store:
        if s["id"] == scenario_id:
            return {**s, "projected_data": _project_scenario(s["variables"])}
    raise HTTPException(404, "Scenario not found")

@router.post("/", status_code=201, summary="Create scenario")
def create_scenario(payload: dict):
    if not payload.get("name"):
        raise HTTPException(422, "name is required")
    now = datetime.utcnow().isoformat()
    sc = {
        "id": _next_id(), "name": payload["name"],
        "description": payload.get("description", ""),
        "base_model": payload.get("base_model", "XGBoost"),
        "category": payload.get("category", "All"),
        "region": payload.get("region", "All"),
        "variables": payload.get("variables", {"sales_growth": 0, "seasonality_factor": 1.0,
                                               "demand_factor": 1.0, "price_elasticity": -0.8,
                                               "marketing_spend": 0, "competitor_impact": 0}),
        "status": "saved", "is_baseline": payload.get("is_baseline", False),
        "created_by": payload.get("created_by", "admin@example.com"),
        "created_at": now, "updated_at": now,
    }
    scenarios_store.append(sc)
    return {**sc, "projected_data": _project_scenario(sc["variables"])}

@router.put("/{scenario_id}", summary="Update scenario")
def update_scenario(scenario_id: int, payload: dict):
    for s in scenarios_store:
        if s["id"] == scenario_id:
            for k in ["name", "description", "base_model", "category", "region", "variables", "status"]:
                if k in payload:
                    s[k] = payload[k]
            s["updated_at"] = datetime.utcnow().isoformat()
            return {**s, "projected_data": _project_scenario(s["variables"])}
    raise HTTPException(404, "Scenario not found")

@router.delete("/{scenario_id}", summary="Delete scenario")
def delete_scenario(scenario_id: int):
    global scenarios_store
    sc = next((s for s in scenarios_store if s["id"] == scenario_id), None)
    if not sc:
        raise HTTPException(404, "Scenario not found")
    scenarios_store = [s for s in scenarios_store if s["id"] != scenario_id]
    return {"message": f"Scenario '{sc['name']}' deleted"}

@router.post("/compare", summary="Compare multiple scenarios side-by-side")
def compare_scenarios(payload: dict):
    ids = payload.get("scenario_ids", [])
    if len(ids) < 2:
        raise HTTPException(422, "Provide at least 2 scenario_ids")
    results = []
    for sid in ids:
        sc = next((s for s in scenarios_store if s["id"] == sid), None)
        if sc:
            projected = _project_scenario(sc["variables"])
            total = sum(p["value"] for p in projected)
            results.append({
                "id": sc["id"], "name": sc["name"], "is_baseline": sc["is_baseline"],
                "variables": sc["variables"], "projected_data": projected,
                "total_annual": total,
                "avg_monthly": round(total / 12),
                "peak_month": max(projected, key=lambda x: x["value"])["month"],
            })
    if not results:
        raise HTTPException(404, "No valid scenarios found")
    baseline = next((r for r in results if r["is_baseline"]), results[0])
    for r in results:
        r["vs_baseline_pct"] = round((r["total_annual"] - baseline["total_annual"]) / baseline["total_annual"] * 100, 2)
    return {"comparison": results, "baseline": baseline["name"],
            "months": MONTHS, "scenario_count": len(results)}

@router.post("/what-if", summary="Run ad-hoc what-if analysis without saving")
def run_what_if(payload: dict):
    variables = payload.get("variables", {})
    label = payload.get("label", "What-If Analysis")
    projected = _project_scenario(variables)
    total = sum(p["value"] for p in projected)
    baseline_projected = _project_scenario({"sales_growth": 5.0, "seasonality_factor": 1.0,
                                            "demand_factor": 1.0, "price_elasticity": -0.8,
                                            "marketing_spend": 0.0, "competitor_impact": 0.0})
    baseline_total = sum(p["value"] for p in baseline_projected)
    return {
        "label": label, "variables": variables,
        "projected_data": projected, "baseline_data": baseline_projected,
        "total_annual": total, "baseline_total": baseline_total,
        "vs_baseline_pct": round((total - baseline_total) / baseline_total * 100, 2),
        "peak_month": max(projected, key=lambda x: x["value"])["month"],
        "months": MONTHS,
    }
