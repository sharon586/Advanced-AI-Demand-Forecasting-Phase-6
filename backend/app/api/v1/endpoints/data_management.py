from fastapi import APIRouter, HTTPException, Query
from typing import Optional
from datetime import datetime, timedelta
import random

router = APIRouter(prefix="/data-management", tags=["Data Management"])

datasets_versioned = [
    {
        "id": 1, "name": "Electronics Sales 2025", "current_version": "v4",
        "versions": [
            {"version": "v4", "rows": 4820, "columns": 12, "size_kb": 420,
             "uploaded_by": "admin@example.com", "change_summary": "Added Nov data (+1,240 rows)",
             "uploaded_at": (datetime.utcnow() - timedelta(hours=2)).isoformat(), "is_current": True},
            {"version": "v3", "rows": 3580, "columns": 12, "size_kb": 310,
             "uploaded_by": "analyst@example.com", "change_summary": "Fixed column types, removed nulls",
             "uploaded_at": (datetime.utcnow() - timedelta(days=14)).isoformat(), "is_current": False},
            {"version": "v2", "rows": 3120, "columns": 11, "size_kb": 271,
             "uploaded_by": "admin@example.com", "change_summary": "Added region column",
             "uploaded_at": (datetime.utcnow() - timedelta(days=30)).isoformat(), "is_current": False},
            {"version": "v1", "rows": 2800, "columns": 10, "size_kb": 242,
             "uploaded_by": "admin@example.com", "change_summary": "Initial upload",
             "uploaded_at": (datetime.utcnow() - timedelta(days=60)).isoformat(), "is_current": False},
        ],
        "status": "active", "category": "Electronics", "is_archived": False,
        "forecasts_using": 5, "last_used": (datetime.utcnow() - timedelta(hours=2)).isoformat(),
    },
    {
        "id": 2, "name": "Fashion Demand Q3-Q4", "current_version": "v2",
        "versions": [
            {"version": "v2", "rows": 2140, "columns": 10, "size_kb": 188,
             "uploaded_by": "manager@example.com", "change_summary": "Appended Q4 data",
             "uploaded_at": (datetime.utcnow() - timedelta(days=5)).isoformat(), "is_current": True},
            {"version": "v1", "rows": 1080, "columns": 10, "size_kb": 95,
             "uploaded_by": "manager@example.com", "change_summary": "Initial Q3 dataset",
             "uploaded_at": (datetime.utcnow() - timedelta(days=45)).isoformat(), "is_current": False},
        ],
        "status": "active", "category": "Fashion", "is_archived": False,
        "forecasts_using": 3, "last_used": (datetime.utcnow() - timedelta(days=1)).isoformat(),
    },
    {
        "id": 3, "name": "Groceries 2024 Archive", "current_version": "v1",
        "versions": [
            {"version": "v1", "rows": 6800, "columns": 9, "size_kb": 580,
             "uploaded_by": "analyst@example.com", "change_summary": "Full year 2024 data",
             "uploaded_at": (datetime.utcnow() - timedelta(days=90)).isoformat(), "is_current": True},
        ],
        "status": "archived", "category": "Groceries", "is_archived": True,
        "forecasts_using": 1, "last_used": (datetime.utcnow() - timedelta(days=45)).isoformat(),
    },
]

upload_history = [
    {"id": i+1,
     "dataset_name": random.choice(["Electronics Sales 2025", "Fashion Demand Q3-Q4", "Groceries 2024 Archive"]),
     "version": f"v{random.randint(1,4)}",
     "uploaded_by": random.choice(["admin@example.com", "analyst@example.com", "manager@example.com"]),
     "rows": random.randint(500, 5000),
     "size_kb": random.randint(50, 600),
     "status": random.choice(["success", "success", "success", "failed"]),
     "error": None if random.random() > 0.2 else "Invalid column format",
     "uploaded_at": (datetime.utcnow() - timedelta(hours=i*6)).isoformat()}
    for i in range(20)
]

@router.get("/datasets", summary="List versioned datasets")
def list_datasets(status: Optional[str] = Query(None), category: Optional[str] = Query(None)):
    data = list(datasets_versioned)
    if status:
        data = [d for d in data if d["status"] == status]
    if category:
        data = [d for d in data if d["category"] == category]
    return {"datasets": data, "total": len(data),
            "active": sum(1 for d in data if not d["is_archived"]),
            "archived": sum(1 for d in data if d["is_archived"])}

@router.get("/datasets/{dataset_id}", summary="Get dataset with version history")
def get_dataset(dataset_id: int):
    for d in datasets_versioned:
        if d["id"] == dataset_id:
            return d
    raise HTTPException(404, "Dataset not found")

@router.put("/datasets/{dataset_id}/archive", summary="Archive or unarchive dataset")
def toggle_archive(dataset_id: int):
    for d in datasets_versioned:
        if d["id"] == dataset_id:
            d["is_archived"] = not d["is_archived"]
            d["status"] = "archived" if d["is_archived"] else "active"
            return {"message": f"Dataset {'archived' if d['is_archived'] else 'restored'}", "dataset": d}
    raise HTTPException(404, "Dataset not found")

@router.put("/datasets/{dataset_id}/rollback/{version}", summary="Rollback to a previous version")
def rollback_version(dataset_id: int, version: str):
    for d in datasets_versioned:
        if d["id"] == dataset_id:
            target = next((v for v in d["versions"] if v["version"] == version), None)
            if not target:
                raise HTTPException(404, f"Version {version} not found")
            for v in d["versions"]:
                v["is_current"] = (v["version"] == version)
            d["current_version"] = version
            return {"message": f"Rolled back to {version}", "dataset": d}
    raise HTTPException(404, "Dataset not found")

@router.get("/datasets/compare/{id1}/{id2}", summary="Compare two datasets or versions")
def compare_datasets(id1: int, id2: int):
    d1 = next((d for d in datasets_versioned if d["id"] == id1), None)
    d2 = next((d for d in datasets_versioned if d["id"] == id2), None)
    if not d1 or not d2:
        raise HTTPException(404, "One or both datasets not found")
    v1 = next(v for v in d1["versions"] if v["is_current"])
    v2 = next(v for v in d2["versions"] if v["is_current"])
    return {
        "dataset_a": {"id": d1["id"], "name": d1["name"], "version": v1["version"],
                       "rows": v1["rows"], "columns": v1["columns"], "size_kb": v1["size_kb"]},
        "dataset_b": {"id": d2["id"], "name": d2["name"], "version": v2["version"],
                       "rows": v2["rows"], "columns": v2["columns"], "size_kb": v2["size_kb"]},
        "differences": {
            "row_diff": v1["rows"] - v2["rows"],
            "column_diff": v1["columns"] - v2["columns"],
            "size_diff_kb": v1["size_kb"] - v2["size_kb"],
            "same_columns": v1["columns"] == v2["columns"],
        },
    }

@router.get("/upload-history", summary="Dataset upload history")
def get_upload_history(limit: int = Query(20)):
    return {"history": list(reversed(upload_history))[:limit], "total": len(upload_history),
            "success_count": sum(1 for u in upload_history if u["status"] == "success"),
            "failed_count": sum(1 for u in upload_history if u["status"] == "failed")}

@router.get("/modifications", summary="Track dataset modifications")
def get_modifications(dataset_id: Optional[int] = Query(None)):
    mods = []
    for d in datasets_versioned:
        if dataset_id and d["id"] != dataset_id:
            continue
        for v in d["versions"]:
            mods.append({"dataset_id": d["id"], "dataset_name": d["name"],
                         "version": v["version"], "uploaded_by": v["uploaded_by"],
                         "change_summary": v["change_summary"],
                         "rows": v["rows"], "uploaded_at": v["uploaded_at"]})
    mods.sort(key=lambda x: x["uploaded_at"], reverse=True)
    return {"modifications": mods, "total": len(mods)}
