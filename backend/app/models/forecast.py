from sqlalchemy import Column, Integer, Float, String, DateTime, Text
from datetime import datetime
from app.core.database import Base


class Forecast(Base):
    __tablename__ = "forecasts"

    id = Column(Integer, primary_key=True, index=True)
    user_email = Column(String(200), nullable=True, index=True)
    model_name = Column(String(100), default="Linear Regression")
    dataset_name = Column(String(255), nullable=True)
    prediction_value = Column(Float)
    accuracy = Column(Float)
    mae = Column(Float, nullable=True)
    rmse = Column(Float, nullable=True)
    r2_score = Column(Float, nullable=True)
    category = Column(String(100), nullable=True)
    region = Column(String(100), nullable=True)
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, index=True)
