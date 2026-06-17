from fastapi import APIRouter, Query
from typing import Optional
from datetime import datetime, timedelta
import random

router = APIRouter(prefix="/command-center", tags=["Executive Command Center"])

MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov"]

@router.get("/overview", summary="Organization-wide analytics overview")
def get_overview():
    return {
        "platform_metrics": {
            "total_organizations": 3, "total_users": 21, "total_forecasts": 68,
            "total_datasets": 14, "total_reports": 33, "active_workflows": 2,
            "pending_approvals": 2, "avg_forecast_accuracy": 94.6,
        },
        "health_indicators": [
            {"name": "Platform Uptime", "value": "99.98%", "status": "healthy"},
            {"name": "Avg API Response", "value": "184ms", "status": "healthy"},
            {"name": "Data Quality Score", "value": "78/100", "status": "warning"},
            {"name": "Approval Backlog", "value": "2 pending", "status": "warning"},
            {"name": "Failed Workflows", "value": "3 this week", "status": "warning"},
            {"name": "Model Accuracy", "value": "97.1%", "status": "healthy"},
        ],
        "revenue_trend": [{"month": m, "value": round(random.uniform(2.2, 4.5) * 1e6)} for m in MONTHS],
        "generated_at": datetime.utcnow().isoformat(),
    }

@router.get("/executive-metrics", summary="Executive-level forecasting metrics")
def executive_metrics():
    return {
        "kpis": [
            {"label": "Total Revenue YTD", "value": "₹28.45 Cr", "change": "+18.4%", "trend": "up", "icon": "💰"},
            {"label": "Net Profit YTD", "value": "₹5.97 Cr", "change": "+12.1%", "trend": "up", "icon": "📈"},
            {"label": "Best Model Accuracy", "value": "97.1%", "change": "+0.8%", "trend": "up", "icon": "🎯"},
            {"label": "Demand Fulfillment", "value": "94.5%", "change": "-0.5%", "trend": "down", "icon": "📦"},
            {"label": "Active Organizations", "value": "3", "change": "+1", "trend": "up", "icon": "🏢"},
            {"label": "Pending Approvals", "value": "2", "change": "0", "trend": "stable", "icon": "⏳"},
            {"label": "Workflow Success Rate", "value": "92%", "change": "+3%", "trend": "up", "icon": "⚙️"},
            {"label": "Data Quality Score", "value": "78/100", "change": "-2", "trend": "down", "icon": "🗄️"},
        ],
        "model_performance": [
            {"model": "XGBoost", "accuracy": 97.1, "status": "production"},
            {"model": "Random Forest", "accuracy": 95.2, "status": "staging"},
            {"model": "ARIMA", "accuracy": 91.4, "status": "backup"},
            {"model": "Linear Regression", "accuracy": 88.5, "status": "deprecated"},
        ],
    }

@router.get("/strategic-insights", summary="Strategic planning insights for executives")
def strategic_insights():
    return {
        "insights": [
            {"category": "Revenue", "priority": "high", "title": "Holiday season driving +35% revenue surge",
             "detail": "Electronics and Fashion categories expected to peak Dec 1–25. Pre-stock recommended.",
             "impact": "+₹4.2 Cr projected", "confidence": 94.2},
            {"category": "Operations", "priority": "high", "title": "Workflow automation saving 18hrs/week",
             "detail": "3 active workflows eliminating manual forecast submission and report generation.",
             "impact": "₹2.1L monthly cost savings", "confidence": 98.0},
            {"category": "Risk", "priority": "critical", "title": "3 datasets below quality threshold",
             "detail": "Fashion and Groceries datasets have quality score <80. Forecast reliability at risk.",
             "impact": "Accuracy may drop 4-8%", "confidence": 88.5},
            {"category": "Growth", "priority": "medium", "title": "NovaStar Retail expansion opportunity",
             "detail": "Trial org showing strong adoption. Upgrade to Business plan before trial expires.",
             "impact": "+₹18L ARR", "confidence": 76.0},
        ],
        "generated_at": datetime.utcnow().isoformat(),
    }

@router.get("/performance-summaries", summary="Business performance summaries by org")
def performance_summaries():
    orgs = [
        {"org": "Acme Corp", "plan": "Enterprise", "revenue": 284500000, "accuracy": 96.2,
         "forecasts": 45, "members": 12, "health": "excellent"},
        {"org": "GlobalTrade Ltd", "plan": "Business", "revenue": 92000000, "accuracy": 94.1,
         "forecasts": 18, "members": 6, "health": "good"},
        {"org": "NovaStar Retail", "plan": "Starter", "revenue": 18000000, "accuracy": 88.5,
         "forecasts": 5, "members": 3, "health": "fair"},
    ]
    return {"organizations": orgs, "total_revenue": sum(o["revenue"] for o in orgs),
            "avg_accuracy": round(sum(o["accuracy"] for o in orgs) / len(orgs), 2)}

@router.get("/alert-center", summary="Executive alert center")
def alert_center():
    alerts = [
        {"id": 1, "severity": "critical", "title": "Running Shoes stockout in < 1 day",
         "category": "Inventory", "org": "Acme Corp", "action_required": True,
         "created_at": (datetime.utcnow() - timedelta(hours=2)).isoformat()},
        {"id": 2, "severity": "critical", "title": "Fashion dataset quality score: 65/100",
         "category": "Data Quality", "org": "Acme Corp", "action_required": True,
         "created_at": (datetime.utcnow() - timedelta(hours=5)).isoformat()},
        {"id": 3, "severity": "high", "title": "2 forecasts pending approval > 8 hours",
         "category": "Approval Workflow", "org": "All", "action_required": True,
         "created_at": (datetime.utcnow() - timedelta(hours=8)).isoformat()},
        {"id": 4, "severity": "high", "title": "NovaStar Retail trial expires in 7 days",
         "category": "Organization", "org": "NovaStar Retail", "action_required": True,
         "created_at": (datetime.utcnow() - timedelta(hours=12)).isoformat()},
        {"id": 5, "severity": "medium", "title": "ARIMA model accuracy dropped to 91.4%",
         "category": "Model Performance", "org": "GlobalTrade Ltd", "action_required": False,
         "created_at": (datetime.utcnow() - timedelta(days=1)).isoformat()},
    ]
    return {
        "alerts": alerts,
        "total": len(alerts),
        "critical": sum(1 for a in alerts if a["severity"] == "critical"),
        "high": sum(1 for a in alerts if a["severity"] == "high"),
        "action_required": sum(1 for a in alerts if a["action_required"]),
    }
