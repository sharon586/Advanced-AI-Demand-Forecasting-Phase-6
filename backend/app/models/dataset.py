from sqlalchemy import Column, Integer, String, DateTime, Boolean, Text
from datetime import datetime
from app.core.database import Base


class Dataset(Base):
    __tablename__ = "datasets"

    id = Column(Integer, primary_key=True, index=True)
    filename = Column(String(255), nullable=False, index=True)
    original_name = Column(String(255), nullable=True)
    uploaded_by = Column(String(200), nullable=True, index=True)
    file_path = Column(String(500), nullable=True)
    row_count = Column(Integer, nullable=True)
    column_count = Column(Integer, nullable=True)
    columns_list = Column(Text, nullable=True)
    file_size = Column(Integer, nullable=True)
    status = Column(String(50), default="active")
    category = Column(String(100), nullable=True)
    region = Column(String(100), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, index=True)
