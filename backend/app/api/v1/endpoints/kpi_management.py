from fastapi import APIRouter, HTTPException, Query
from typing import Optional
from datetime import datetime, timedelta
import random

router = APIRouter(prefix="/kpis", tags=["Advanced KPI Management"])

kpis_store = [
    {"id":1,"name":"Revenue Growth Rate","description":"Month-over-month revenue growth","formula":"(current-prev)/prev*100",
     "unit":"%","category":"Revenue","current_value":18.4,"target":15.0,"threshold_warning":12.0,"threshold_critical":8.0,
     "status":"achieved","trend":"up","is_active":True,"owner":"cfo@example.com",
     "created_at":(datetime.utcnow()-timedelta(days=60)).isoformat()},
    {"id":2,"name":"Forecast Accuracy Index","description":"Weighted average forecast accuracy across all models",
     "formula":"avg(model_accuracies)","unit":"%","category":"Forecasting","current_value":96.2,"target":95.0,
     "threshold_warning":90.0,"threshold_critical":85.0,"status":"achieved","trend":"up","is_active":True,
     "owner":"admin@example.com","created_at":(datetime.utcnow()-timedelta(days=45)).isoformat()},
    {"id":3,"name":"Inventory Turnover","description":"Number of times inventory is sold in a period",
     "formula":"COGS/avg_inventory","unit":"x","category":"Operations","current_value":8.3,"target":8.0,
     "threshold_warning":6.0,"threshold_critical":4.0,"status":"achieved","trend":"stable","is_active":True,
     "owner":"ops@example.com","created_at":(datetime.utcnow()-timedelta(days=30)).isoformat()},
    {"id":4,"name":"Demand Fulfillment Rate","description":"Percentage of demand fulfilled on time",
     "formula":"fulfilled/total*100","unit":"%","category":"Operations","current_value":94.5,"target":96.0,
     "threshold_warning":92.0,"threshold_critical":88.0,"status":"at_risk","trend":"down","is_active":True,
     "owner":"ops@example.com","created_at":(datetime.utcnow()-timedelta(days=20)).isoformat()},
    {"id":5,"name":"Cost per Forecast","description":"Average operational cost per forecast run",
     "formula":"total_cost/forecast_count","unit":"₹","category":"Efficiency","current_value":840,"target":1000,
     "threshold_warning":1200,"threshold_critical":1500,"status":"achieved","trend":"down","is_active":True,
     "owner":"admin@example.com","created_at":(datetime.utcnow()-timedelta(days=15)).isoformat()},
]

MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov"]

def _next_id(): return max((k["id"] for k in kpis_store), default=0)+1

def _kpi_trend(base, target, n=11):
    return [{"month":MONTHS[i],"value":round(base*(1+(i-5)*0.01)+random.uniform(-base*0.05,base*0.05),2),
             "target":target} for i in range(n)]

@router.get("/", summary="List all KPIs")
def list_kpis(category: Optional[str] = Query(None), status: Optional[str] = Query(None)):
    data = list(kpis_store)
    if category: data = [k for k in data if k["category"]==category]
    if status: data = [k for k in data if k["status"]==status]
    return {"kpis":data,"total":len(data),
            "achieved":sum(1 for k in data if k["status"]=="achieved"),
            "at_risk":sum(1 for k in data if k["status"]=="at_risk"),
            "behind":sum(1 for k in data if k["status"]=="behind")}

@router.get("/summary", summary="KPI performance summary")
def kpi_summary():
    return {"total":len(kpis_store),"active":sum(1 for k in kpis_store if k["is_active"]),
            "achieved":sum(1 for k in kpis_store if k["status"]=="achieved"),
            "at_risk":sum(1 for k in kpis_store if k["status"]=="at_risk"),
            "categories":list(set(k["category"] for k in kpis_store)),
            "overall_health":f"{round(sum(1 for k in kpis_store if k['status']=='achieved')/len(kpis_store)*100)}%"}

@router.get("/{kpi_id}", summary="Get KPI with trend data")
def get_kpi(kpi_id: int):
    k = next((x for x in kpis_store if x["id"]==kpi_id), None)
    if not k: raise HTTPException(404,"Not found")
    return {**k, "trend_data": _kpi_trend(k["current_value"], k["target"])}

@router.post("/", status_code=201, summary="Create custom KPI")
def create_kpi(payload: dict):
    if not payload.get("name"): raise HTTPException(422,"name required")
    now = datetime.utcnow().isoformat()
    kpi = {"id":_next_id(),"name":payload["name"],"description":payload.get("description",""),
           "formula":payload.get("formula","manual"),"unit":payload.get("unit",""),"category":payload.get("category","Custom"),
           "current_value":payload.get("current_value",0),"target":payload.get("target",100),
           "threshold_warning":payload.get("threshold_warning",80),"threshold_critical":payload.get("threshold_critical",60),
           "status":"on_track","trend":"stable","is_active":True,"owner":payload.get("owner","admin@example.com"),
           "created_at":now}
    kpis_store.append(kpi)
    return kpi

@router.put("/{kpi_id}", summary="Update KPI")
def update_kpi(kpi_id: int, payload: dict):
    for k in kpis_store:
        if k["id"]==kpi_id:
            for f in ["name","description","target","threshold_warning","threshold_critical","current_value","is_active"]:
                if f in payload: k[f]=payload[f]
            return k
    raise HTTPException(404,"Not found")

@router.delete("/{kpi_id}", summary="Delete KPI")
def delete_kpi(kpi_id: int):
    global kpis_store
    k = next((x for x in kpis_store if x["id"]==kpi_id),None)
    if not k: raise HTTPException(404,"Not found")
    kpis_store = [x for x in kpis_store if x["id"]!=kpi_id]
    return {"message":f"KPI '{k['name']}' deleted"}

@router.get("/report/performance", summary="Generate KPI performance report")
def kpi_performance_report():
    return {"report_id":f"kpi_rpt_{datetime.utcnow().strftime('%Y%m%d%H%M%S')}",
            "period":"YTD 2025-26","kpis":[{**k,"trend_data":_kpi_trend(k["current_value"],k["target"])} for k in kpis_store],
            "summary":{"total_kpis":len(kpis_store),"achieved":sum(1 for k in kpis_store if k["status"]=="achieved"),
                       "overall_health":"78%"},
            "generated_at":datetime.utcnow().isoformat()}
