from datetime import datetime

from sqlalchemy import Column, DateTime, Integer, String
from sqlalchemy.orm import relationship

from app.database.base import Base


class Merchant(Base):
    __tablename__ = "merchants"

    id = Column(Integer, primary_key=True, index=True)

    name = Column(String(100), nullable=False)

    email = Column(String(150), unique=True, nullable=False)

    business_type = Column(String(100), nullable=True)

    created_at = Column(DateTime, default=datetime.utcnow)

    payments = relationship("Payment", back_populates="merchant")