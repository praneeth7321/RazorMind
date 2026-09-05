from datetime import datetime

from sqlalchemy import Column, DateTime, Float, Integer, String
from sqlalchemy.orm import relationship

from app.database.base import Base


class Customer(Base):
    __tablename__ = "customers"

    id = Column(Integer, primary_key=True, index=True)

    name = Column(String(100), nullable=False)

    email = Column(String(150), unique=True, nullable=False)

    phone = Column(String(20), nullable=True)

    risk_score = Column(Float, default=0.0)

    created_at = Column(DateTime, default=datetime.utcnow)

    payments = relationship("Payment", back_populates="customer")