from sqlalchemy import Column, Integer, String, DateTime, Text, Float
from datetime import datetime
from app.core.database import Base


class Report(Base):
    __tablename__ = "reports"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    report_type = Column(String(100), default="Sales")
    generated_by = Column(String(200), nullable=True)
    total_sales = Column(Float, nullable=True)
    forecast_accuracy = Column(Float, nullable=True)
    growth_rate = Column(Float, nullable=True)
    summary = Column(Text, nullable=True)
    file_path = Column(String(500), nullable=True)
    category = Column(String(100), nullable=True)
    region = Column(String(100), nullable=True)
    date_from = Column(String(50), nullable=True)
    date_to = Column(String(50), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, index=True)
