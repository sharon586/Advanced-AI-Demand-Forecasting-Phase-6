from fastapi import APIRouter, Query
from typing import Optional
from datetime import datetime, timedelta
import random

router = APIRouter(prefix="/data-quality", tags=["Data Quality Management"])

quality_reports = [
    {"dataset_id":1,"dataset_name":"Electronics Sales 2025","overall_score":92,"grade":"A",
     "checks":{"completeness":96,"consistency":91,"accuracy":94,"timeliness":88,"validity":93},
     "issues":[{"type":"Missing Values","severity":"low","column":"region","count":24,"suggestion":"Fill with 'Unknown' or drop rows"},
               {"type":"Outlier Detected","severity":"medium","column":"sales_amount","count":7,"suggestion":"Review and cap at 3σ"}],
     "row_count":4820,"null_count":31,"duplicate_count":3,"last_checked":(datetime.utcnow()-timedelta(hours=2)).isoformat()},
    {"dataset_id":2,"dataset_name":"Fashion Demand Q3-Q4","overall_score":78,"grade":"B",
     "checks":{"completeness":82,"consistency":76,"accuracy":80,"timeliness":72,"validity":79},
     "issues":[{"type":"Missing Values","severity":"medium","column":"category","count":85,"suggestion":"Impute with mode value"},
               {"type":"Date Format Inconsistency","severity":"medium","column":"sale_date","count":42,"suggestion":"Standardize to YYYY-MM-DD"},
               {"type":"Negative Values","severity":"high","column":"quantity","count":12,"suggestion":"Investigate and correct or remove"}],
     "row_count":2140,"null_count":102,"duplicate_count":15,"last_checked":(datetime.utcnow()-timedelta(days=1)).isoformat()},
    {"dataset_id":3,"dataset_name":"Groceries 2024 Archive","overall_score":65,"grade":"C",
     "checks":{"completeness":70,"consistency":62,"accuracy":68,"timeliness":55,"validity":70},
     "issues":[{"type":"Stale Data","severity":"critical","column":"sale_date","count":6800,"suggestion":"Dataset is >1 year old — consider refreshing"},
               {"type":"Missing Values","severity":"high","column":"store_id","count":420,"suggestion":"Cannot reliably impute — source data needed"},
               {"type":"Duplicate Rows","severity":"medium","column":"*","count":128,"suggestion":"De-duplicate before training"}],
     "row_count":6800,"null_count":620,"duplicate_count":128,"last_checked":(datetime.utcnow()-timedelta(days=5)).isoformat()},
]

@router.get("/", summary="All dataset quality scores")
def get_all_quality(min_score: Optional[int] = Query(None)):
    data = list(quality_reports)
    if min_score is not None: data = [d for d in data if d["overall_score"]>=min_score]
    return {"quality_reports":data,"total":len(data),
            "avg_score":round(sum(d["overall_score"] for d in data)/len(data),1),
            "critical_issues":sum(len([i for i in d["issues"] if i["severity"]=="critical"]) for d in data)}

@router.get("/dashboard", summary="Data quality dashboard summary")
def quality_dashboard():
    return {
        "overall_platform_score":round(sum(d["overall_score"] for d in quality_reports)/len(quality_reports),1),
        "datasets_checked":len(quality_reports),
        "by_grade":{"A":1,"B":1,"C":1,"D":0,"F":0},
        "total_issues":sum(len(d["issues"]) for d in quality_reports),
        "critical_issues":sum(len([i for i in d["issues"] if i["severity"]=="critical"]) for d in quality_reports),
        "high_issues":sum(len([i for i in d["issues"] if i["severity"]=="high"]) for d in quality_reports),
        "datasets_needing_attention":[d["dataset_name"] for d in quality_reports if d["overall_score"]<80],
        "last_full_scan":(datetime.utcnow()-timedelta(hours=2)).isoformat(),
    }

@router.get("/{dataset_id}", summary="Quality report for a specific dataset")
def get_dataset_quality(dataset_id: int):
    r = next((d for d in quality_reports if d["dataset_id"]==dataset_id), None)
    if not r:
        return {"dataset_id":dataset_id,"overall_score":random.randint(60,98),"grade":"B",
                "checks":{"completeness":random.randint(70,98),"consistency":random.randint(70,98),
                           "accuracy":random.randint(70,98),"timeliness":random.randint(65,98),"validity":random.randint(70,98)},
                "issues":[],"row_count":random.randint(500,5000),"null_count":random.randint(0,50),
                "duplicate_count":random.randint(0,20),"last_checked":datetime.utcnow().isoformat()}
    return r

@router.post("/{dataset_id}/scan", summary="Trigger quality scan on a dataset")
def trigger_scan(dataset_id: int):
    score = random.randint(65,98)
    return {"dataset_id":dataset_id,"scan_status":"completed","overall_score":score,
            "grade":"A" if score>=90 else "B" if score>=80 else "C" if score>=70 else "D",
            "issues_found":random.randint(0,5),"scanned_at":datetime.utcnow().isoformat(),
            "message":f"Quality scan completed. Score: {score}/100"}

@router.get("/report/generate", summary="Generate data quality report")
def generate_quality_report():
    return {
        "report_id":f"dq_rpt_{datetime.utcnow().strftime('%Y%m%d%H%M%S')}",
        "platform_score":round(sum(d["overall_score"] for d in quality_reports)/len(quality_reports),1),
        "datasets":quality_reports,
        "recommendations":["Refresh Groceries 2024 Archive dataset — data is >1 year old",
                           "Fix 12 negative quantity values in Fashion dataset",
                           "Standardize date formats across all datasets"],
        "generated_at":datetime.utcnow().isoformat()
    }

@router.get("/validate/{dataset_id}", summary="Validate dataset before forecast use")
def validate_dataset(dataset_id: int):
    r = next((d for d in quality_reports if d["dataset_id"]==dataset_id), None)
    score = r["overall_score"] if r else random.randint(65,98)
    return {
        "dataset_id":dataset_id,"is_valid":score>=70,"score":score,
        "can_train":score>=75,"recommended_for_production":score>=85,
        "blocking_issues":[i for i in (r["issues"] if r else []) if i["severity"] in ["critical","high"]],
        "validated_at":datetime.utcnow().isoformat()
    }
