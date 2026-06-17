from fastapi import APIRouter, Query
from typing import Optional
from datetime import datetime, timedelta
import random

router = APIRouter(prefix="/strategic", tags=["Strategic Planning"])

MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]
QUARTERS = ["Q1 2026","Q2 2026","Q3 2026","Q4 2026"]

def _trend(base, n=12, variance=0.12, growth=0.02):
    return [{"period": MONTHS[i] if n==12 else QUARTERS[i],
             "value": round(base*(1+growth*i)+random.uniform(-base*variance,base*variance))}
            for i in range(n)]

@router.get("/annual-plan", summary="Annual planning dashboard")
def annual_plan(year: int = Query(2026)):
    targets = [
        {"metric":"Revenue","target":120000000,"unit":"₹","period":str(year),"status":"on_track","progress":62},
        {"metric":"Forecast Accuracy","target":97.0,"unit":"%","period":str(year),"status":"on_track","progress":99},
        {"metric":"Cost Reduction","target":8.0,"unit":"%","period":str(year),"status":"at_risk","progress":40},
        {"metric":"New Markets","target":3,"unit":"markets","period":str(year),"status":"behind","progress":33},
        {"metric":"Customer Growth","target":25.0,"unit":"%","period":str(year),"status":"on_track","progress":72},
    ]
    return {
        "year": year,
        "targets": targets,
        "monthly_revenue_target": _trend(10000000),
        "monthly_revenue_forecast": _trend(10200000, variance=0.08),
        "summary": {"on_track": sum(1 for t in targets if t["status"]=="on_track"),
                    "at_risk": sum(1 for t in targets if t["status"]=="at_risk"),
                    "behind": sum(1 for t in targets if t["status"]=="behind")},
        "recommendations": [
            "Revenue tracking above target — maintain current strategy",
            "Cost reduction at 40% of target — review operational spend",
            "New market expansion behind schedule — accelerate Q3 launches",
        ]
    }

@router.get("/quarterly-plan", summary="Quarterly planning dashboard")
def quarterly_plan(quarter: str = Query("Q1 2026")):
    q_idx = QUARTERS.index(quarter) if quarter in QUARTERS else 0
    base_revenue = (q_idx+1)*28000000
    targets = [
        {"metric":"Quarterly Revenue","target":base_revenue,"forecast":round(base_revenue*1.08),"unit":"₹","variance":"+8%","status":"ahead"},
        {"metric":"Forecast Accuracy","target":95.0,"forecast":96.8,"unit":"%","variance":"+1.8%","status":"ahead"},
        {"metric":"New Products","target":5,"forecast":4,"unit":"SKUs","variance":"-1","status":"at_risk"},
        {"metric":"Inventory Turnover","target":8.0,"forecast":8.3,"unit":"x","variance":"+0.3x","status":"ahead"},
    ]
    weeks = [f"Wk {i+1}" for i in range(13)]
    return {
        "quarter": quarter,
        "targets": targets,
        "weekly_revenue": [{"week": w, "target": round(base_revenue/13), "forecast": round(base_revenue/13*random.uniform(0.9,1.15))} for w in weeks],
        "category_breakdown": [
            {"category": "Electronics", "target": round(base_revenue*0.42), "forecast": round(base_revenue*0.45), "status": "ahead"},
            {"category": "Fashion", "target": round(base_revenue*0.28), "forecast": round(base_revenue*0.26), "status": "at_risk"},
            {"category": "Groceries", "target": round(base_revenue*0.18), "forecast": round(base_revenue*0.19), "status": "ahead"},
            {"category": "Furniture", "target": round(base_revenue*0.12), "forecast": round(base_revenue*0.10), "status": "at_risk"},
        ]
    }

@router.get("/targets", summary="Business target tracking")
def get_targets():
    return {
        "targets": [
            {"id":1,"name":"Annual Revenue 2026","metric":"revenue","target":120000000,"current":74400000,"unit":"₹","progress":62,"status":"on_track","owner":"cfo@example.com"},
            {"id":2,"name":"Forecast Accuracy Goal","metric":"accuracy","target":97.0,"current":96.2,"unit":"%","progress":99,"status":"on_track","owner":"admin@example.com"},
            {"id":3,"name":"Cost Reduction 2026","metric":"cost_reduction","target":8.0,"current":3.2,"unit":"%","progress":40,"status":"at_risk","owner":"coo@example.com"},
            {"id":4,"name":"Market Expansion","metric":"new_markets","target":3,"current":1,"unit":"markets","progress":33,"status":"behind","owner":"cmo@example.com"},
            {"id":5,"name":"Inventory Turnover","metric":"inventory_turnover","target":9.0,"current":8.3,"unit":"x","progress":92,"status":"on_track","owner":"ops@example.com"},
        ]
    }

@router.get("/forecast-vs-target", summary="Forecast vs target comparison")
def forecast_vs_target(category: Optional[str] = Query(None)):
    data = [{"month": MONTHS[i],
             "target": round(9000000 + i*150000),
             "forecast": round(9000000 + i*150000 + random.uniform(-400000, 700000)),
             "actual": round(9000000 + i*150000 + random.uniform(-200000, 500000)) if i < 9 else None}
            for i in range(12)]
    return {"category": category or "All", "monthly_comparison": data,
            "total_target": sum(d["target"] for d in data),
            "total_forecast": sum(d["forecast"] for d in data),
            "variance_pct": round(random.uniform(2, 12), 1)}

@router.get("/recommendations", summary="Strategic planning AI recommendations")
def planning_recommendations():
    return {"recommendations": [
        {"priority":"critical","title":"Accelerate Q3 market expansion","impact":"Closes 67% gap on market target","action":"Launch NovaStar partnership in West region by June","deadline":"Jun 30, 2026"},
        {"priority":"high","title":"Reduce operational cost by 4.8%","impact":"Achieves cost reduction target","action":"Automate 3 manual reporting workflows","deadline":"Sep 30, 2026"},
        {"priority":"medium","title":"Increase Fashion category forecast horizon","impact":"Improves seasonal accuracy by 12%","action":"Extend forecast to 6 months for Fashion","deadline":"Mar 31, 2026"},
        {"priority":"low","title":"Onboard 2 new ERP integrations","impact":"Reduces data lag by 80%","action":"Connect Oracle + SAP to live data pipeline","deadline":"Dec 31, 2026"},
    ]}
