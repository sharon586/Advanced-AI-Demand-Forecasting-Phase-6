from fastapi import APIRouter
from app.api.v1.endpoints import auth, datasets, forecasting, analytics, users, reports, admin, notifications

api_router = APIRouter()
api_router.include_router(auth.router)
api_router.include_router(datasets.router)
api_router.include_router(forecasting.router)
api_router.include_router(analytics.router)
api_router.include_router(users.router)
api_router.include_router(reports.router)
api_router.include_router(admin.router)
api_router.include_router(notifications.router)
