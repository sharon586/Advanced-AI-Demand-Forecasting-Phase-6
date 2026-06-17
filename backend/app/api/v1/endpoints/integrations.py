from fastapi import APIRouter, HTTPException, Query
from typing import Optional
from datetime import datetime, timedelta
import random

router = APIRouter(prefix="/integrations", tags=["Enterprise Integrations"])

integrations_store = [
    {"id": 1, "name": "SAP ERP", "type": "erp", "provider": "SAP",
     "status": "connected", "endpoint": "https://sap-erp.company.com/api",
     "api_key_hint": "***-key-1234", "last_sync": (datetime.utcnow() - timedelta(minutes=30)).isoformat(),
     "sync_interval": "15min", "records_synced": 12480, "is_active": True,
     "created_at": (datetime.utcnow() - timedelta(days=30)).isoformat()},
    {"id": 2, "name": "Oracle NetSuite", "type": "erp", "provider": "Oracle",
     "status": "connected", "endpoint": "https://netsuite.oracle.com/api",
     "api_key_hint": "***-ns-5678", "last_sync": (datetime.utcnow() - timedelta(hours=1)).isoformat(),
     "sync_interval": "hourly", "records_synced": 5240, "is_active": True,
     "created_at": (datetime.utcnow() - timedelta(days=15)).isoformat()},
    {"id": 3, "name": "Shopify Inventory", "type": "inventory", "provider": "Shopify",
     "status": "error", "endpoint": "https://my-store.myshopify.com/admin/api",
     "api_key_hint": "***-shpk-9012", "last_sync": (datetime.utcnow() - timedelta(hours=5)).isoformat(),
     "sync_interval": "30min", "records_synced": 890, "is_active": False,
     "created_at": (datetime.utcnow() - timedelta(days=7)).isoformat()},
    {"id": 4, "name": "Warehouse API", "type": "inventory", "provider": "Custom",
     "status": "pending", "endpoint": "https://warehouse.internal/api/v2",
     "api_key_hint": "***-wh-3456", "last_sync": None, "sync_interval": "5min",
     "records_synced": 0, "is_active": False,
     "created_at": datetime.utcnow().isoformat()},
]

webhooks_store = [
    {"id": 1, "name": "Forecast Complete Webhook", "url": "https://hooks.slack.com/services/abc",
     "events": ["forecast.complete", "forecast.failed"], "is_active": True,
     "last_triggered": (datetime.utcnow() - timedelta(hours=2)).isoformat(),
     "total_delivered": 48, "secret": "wh_secret_****",
     "created_at": (datetime.utcnow() - timedelta(days=20)).isoformat()},
    {"id": 2, "name": "Inventory Alert Hook", "url": "https://api.customer.com/webhooks/inventory",
     "events": ["stock.low", "stock.critical"], "is_active": True,
     "last_triggered": (datetime.utcnow() - timedelta(days=1)).isoformat(),
     "total_delivered": 12, "secret": "wh_secret_****",
     "created_at": (datetime.utcnow() - timedelta(days=10)).isoformat()},
]

@router.get("/")
def get_integrations(type: Optional[str] = Query(None), status: Optional[str] = Query(None)):
    data = integrations_store
    if type:
        data = [i for i in data if i["type"] == type]
    if status:
        data = [i for i in data if i["status"] == status]
    return {"integrations": data, "total": len(data)}

@router.post("/")
def add_integration(payload: dict):
    new_id = max([i["id"] for i in integrations_store], default=0) + 1
    integration = {
        "id": new_id,
        "name": payload.get("name", "New Integration"),
        "type": payload.get("type", "custom"),
        "provider": payload.get("provider", "Custom"),
        "status": "pending",
        "endpoint": payload.get("endpoint", ""),
        "api_key_hint": "***-new",
        "last_sync": None,
        "sync_interval": payload.get("sync_interval", "hourly"),
        "records_synced": 0,
        "is_active": False,
        "created_at": datetime.utcnow().isoformat()
    }
    integrations_store.append(integration)
    return integration

@router.put("/{integration_id}/sync")
def trigger_sync(integration_id: int):
    for i in integrations_store:
        if i["id"] == integration_id:
            i["last_sync"] = datetime.utcnow().isoformat()
            i["status"] = "connected"
            i["records_synced"] += random.randint(50, 500)
            return {"message": "Sync triggered", "integration": i}
    raise HTTPException(status_code=404, detail="Not found")

@router.put("/{integration_id}/toggle")
def toggle_integration(integration_id: int):
    for i in integrations_store:
        if i["id"] == integration_id:
            i["is_active"] = not i["is_active"]
            i["status"] = "connected" if i["is_active"] else "disconnected"
            return i
    raise HTTPException(status_code=404, detail="Not found")

@router.delete("/{integration_id}")
def delete_integration(integration_id: int):
    global integrations_store
    integrations_store = [i for i in integrations_store if i["id"] != integration_id]
    return {"message": "Deleted"}

@router.get("/webhooks")
def get_webhooks():
    return {"webhooks": webhooks_store, "total": len(webhooks_store)}

@router.post("/webhooks")
def create_webhook(payload: dict):
    new_id = max([w["id"] for w in webhooks_store], default=0) + 1
    webhook = {
        "id": new_id,
        "name": payload.get("name", "New Webhook"),
        "url": payload.get("url", ""),
        "events": payload.get("events", []),
        "is_active": True,
        "last_triggered": None,
        "total_delivered": 0,
        "secret": f"wh_secret_****",
        "created_at": datetime.utcnow().isoformat()
    }
    webhooks_store.append(webhook)
    return webhook

@router.delete("/webhooks/{webhook_id}")
def delete_webhook(webhook_id: int):
    global webhooks_store
    webhooks_store = [w for w in webhooks_store if w["id"] != webhook_id]
    return {"message": "Deleted"}

@router.get("/summary")
def integration_summary():
    connected = sum(1 for i in integrations_store if i["status"] == "connected")
    total_records = sum(i["records_synced"] for i in integrations_store)
    return {
        "total_integrations": len(integrations_store),
        "connected": connected,
        "errors": sum(1 for i in integrations_store if i["status"] == "error"),
        "total_records_synced": total_records,
        "active_webhooks": sum(1 for w in webhooks_store if w["is_active"]),
    }
