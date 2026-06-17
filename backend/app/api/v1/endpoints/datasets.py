import os
import json
import pandas as pd
from fastapi import APIRouter, UploadFile, File, HTTPException, Query, Depends
from typing import Optional
from datetime import datetime

router = APIRouter(prefix="/datasets", tags=["Datasets"])

UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# In-memory dataset store
datasets_store = []


@router.post("/upload")
async def upload_dataset(
    file: UploadFile = File(...),
    category: Optional[str] = Query(None),
    region: Optional[str] = Query(None)
):
    if not file.filename.endswith(".csv"):
        raise HTTPException(status_code=400, detail="Only CSV files allowed")

    file_path = f"{UPLOAD_FOLDER}/{file.filename}"
    content = await file.read()

    with open(file_path, "wb") as buffer:
        buffer.write(content)

    try:
        df = pd.read_csv(file_path)
        rows = len(df)
        cols = list(df.columns)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid CSV file")

    dataset_id = len(datasets_store) + 1
    dataset = {
        "id": dataset_id,
        "filename": file.filename,
        "original_name": file.filename,
        "file_path": file_path,
        "row_count": rows,
        "column_count": len(cols),
        "columns_list": json.dumps(cols),
        "file_size": len(content),
        "status": "active",
        "category": category or "General",
        "region": region or "All",
        "created_at": datetime.utcnow().isoformat()
    }
    datasets_store.append(dataset)

    return {
        "message": "Dataset uploaded successfully",
        "dataset_id": dataset_id,
        "filename": file.filename,
        "rows": rows,
        "columns": cols,
        "category": category,
        "region": region
    }


@router.get("/")
def list_datasets(
    page: int = Query(1, ge=1),
    per_page: int = Query(10, ge=1, le=100),
    search: Optional[str] = Query(None),
    category: Optional[str] = Query(None),
    region: Optional[str] = Query(None),
    status: Optional[str] = Query(None)
):
    filtered = datasets_store

    if search:
        filtered = [d for d in filtered if search.lower() in d["filename"].lower()]
    if category:
        filtered = [d for d in filtered if d.get("category") == category]
    if region:
        filtered = [d for d in filtered if d.get("region") == region]
    if status:
        filtered = [d for d in filtered if d.get("status") == status]

    total = len(filtered)
    start = (page - 1) * per_page
    end = start + per_page
    paginated = filtered[start:end]

    return {
        "datasets": paginated,
        "total": total,
        "page": page,
        "per_page": per_page,
        "total_pages": (total + per_page - 1) // per_page
    }


@router.get("/{dataset_id}")
def get_dataset(dataset_id: int):
    dataset = next((d for d in datasets_store if d["id"] == dataset_id), None)
    if not dataset:
        raise HTTPException(status_code=404, detail="Dataset not found")
    return dataset


@router.delete("/{dataset_id}")
def delete_dataset(dataset_id: int):
    global datasets_store
    dataset = next((d for d in datasets_store if d["id"] == dataset_id), None)
    if not dataset:
        raise HTTPException(status_code=404, detail="Dataset not found")
    datasets_store = [d for d in datasets_store if d["id"] != dataset_id]
    return {"message": "Dataset deleted successfully"}
