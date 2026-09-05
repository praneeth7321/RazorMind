from datetime import datetime

from sqlalchemy import JSON, Column, DateTime, ForeignKey, Integer, String
from sqlalchemy.orm import relationship

from app.database.base import Base


class Event(Base):
    __tablename__ = "events"

    id = Column(Integer, primary_key=True, index=True)

    payment_id = Column(Integer, ForeignKey("payments.id"))

    event_type = Column(String(100), nullable=False)

    status = Column(String(30), default="pending")

    payload = Column(JSON, nullable=True)

    created_at = Column(DateTime, default=datetime.utcnow)

    payment = relationship("Payment", back_populates="events")

    ai_decisions = relationship("AIDecision", back_populates="event")