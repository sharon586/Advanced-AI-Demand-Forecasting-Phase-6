from fastapi import FastAPI
from fastapi.openapi.utils import get_openapi
from fastapi.middleware.cors import CORSMiddleware

from app.core.database import Base, engine

# Phase 1-3
from app.api.v1.endpoints.auth import router as auth_router
from app.api.v1.endpoints.datasets import router as datasets_router
from app.api.v1.endpoints.forecasting import router as forecasting_router
from app.api.v1.endpoints.analytics import router as analytics_router
from app.api.v1.endpoints.users import router as users_router
from app.api.v1.endpoints.reports import router as reports_router
from app.api.v1.endpoints.health import router as health_router
from app.api.v1.endpoints.admin import router as admin_router
from app.api.v1.endpoints.notifications import router as notifications_router
from app.api.v1.endpoints.realtime import router as realtime_router
from app.api.v1.endpoints.roles import router as roles_router
from app.api.v1.endpoints.system import router as system_router
from app.api.v1.endpoints.search import router as search_router
from app.api.v1.endpoints.advanced_analytics import router as advanced_analytics_router
from app.api.v1.endpoints.ml_ops import router as ml_ops_router

# Phase 4
from app.api.v1.endpoints.automation import router as automation_router
from app.api.v1.endpoints.integrations import router as integrations_router
from app.api.v1.endpoints.ai_features import router as ai_features_router
from app.api.v1.endpoints.forecast_comparison import router as forecast_comparison_router
from app.api.v1.endpoints.user_management import router as user_management_router
from app.api.v1.endpoints.alerts import router as alerts_router

# Phase 5
from app.api.v1.endpoints.workspaces import router as workspaces_router
from app.api.v1.endpoints.scenario_planning import router as scenario_router
from app.api.v1.endpoints.business_intelligence import router as bi_router
from app.api.v1.endpoints.ai_insights import router as ai_insights_router
from app.api.v1.endpoints.collaboration import router as collaboration_router
from app.api.v1.endpoints.data_management import router as data_management_router
from app.api.v1.endpoints.accuracy_center import router as accuracy_center_router
from app.api.v1.endpoints.executive_reporting import router as executive_reporting_router

# Phase 6
from app.api.v1.endpoints.organizations import router as organizations_router
from app.api.v1.endpoints.approval_workflow import router as approval_router
from app.api.v1.endpoints.workflow_automation import router as workflow_automation_router
from app.api.v1.endpoints.strategic_planning import router as strategic_router
from app.api.v1.endpoints.governance import router as governance_router
from app.api.v1.endpoints.kpi_management import router as kpi_router
from app.api.v1.endpoints.data_quality import router as data_quality_router
from app.api.v1.endpoints.command_center import router as command_center_router
from app.api.v1.endpoints.notification_center import router as notification_center_router

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Advanced AI Demand Forecasting API",
    version="6.0.0",
    description="Enterprise AI-powered Demand Forecasting Platform — Phase 6: Enterprise Ecosystem"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True, allow_methods=["*"], allow_headers=["*"],
)

for r in [
    # Phase 1-3
    auth_router, users_router, datasets_router, forecasting_router, analytics_router,
    reports_router, health_router, admin_router, notifications_router, realtime_router,
    roles_router, system_router, search_router, advanced_analytics_router, ml_ops_router,
    # Phase 4
    automation_router, integrations_router, ai_features_router,
    forecast_comparison_router, user_management_router, alerts_router,
    # Phase 5
    workspaces_router, scenario_router, bi_router, ai_insights_router,
    collaboration_router, data_management_router, accuracy_center_router, executive_reporting_router,
    # Phase 6
    organizations_router, approval_router, workflow_automation_router, strategic_router,
    governance_router, kpi_router, data_quality_router, command_center_router,
    notification_center_router,
]:
    app.include_router(r)

@app.get("/")
def root():
    return {"message": "Advanced AI Demand Forecasting Phase 6: Enterprise Ecosystem Active"}

def custom_openapi():
    if app.openapi_schema: return app.openapi_schema
    schema = get_openapi(title=app.title, version=app.version, description=app.description, routes=app.routes)
    schema["components"]["securitySchemes"] = {"BearerAuth": {"type": "http", "scheme": "bearer", "bearerFormat": "JWT"}}
    schema["security"] = [{"BearerAuth": []}]
    app.openapi_schema = schema
    return app.openapi_schema

app.openapi = custom_openapi
