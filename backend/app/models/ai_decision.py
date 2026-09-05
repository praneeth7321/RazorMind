from datetime import datetime

from sqlalchemy import Column, Integer, String, Float, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship

from app.database.base import Base


class AIDecision(Base):
    __tablename__ = "ai_decisions"

    id = Column(Integer, primary_key=True, index=True)

    event_id = Column(
        Integer,
        ForeignKey("events.id"),
        nullable=False
    )

    worker_name = Column(String(100), nullable=False)

    decision = Column(String(50), nullable=False)

    confidence = Column(Float)

    risk_score = Column(Float)

    reason = Column(Text)

    # NEW
    recommended_action = Column(Text)

    created_at = Column(DateTime, default=datetime.utcnow)

    event = relationship(
        "Event",
        back_populates="ai_decisions"
    )