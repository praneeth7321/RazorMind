from datetime import datetime

from sqlalchemy import Column, DateTime, Float, ForeignKey, Integer, String
from sqlalchemy.orm import relationship

from app.database.base import Base


class Payment(Base):
    __tablename__ = "payments"

    id = Column(Integer, primary_key=True, index=True)

    merchant_id = Column(
        Integer,
        ForeignKey("merchants.id"),
        nullable=False
    )

    customer_id = Column(
        Integer,
        ForeignKey("customers.id"),
        nullable=False
    )

    amount = Column(Float, nullable=False)

    currency = Column(String(10), default="INR")

    status = Column(String(30), default="created")

    razorpay_order_id = Column(String(100), nullable=True)

    razorpay_payment_id = Column(String(100), nullable=True)

    # -------- Fraud Detection Fields --------
    customer_history = Column(String(100), nullable=True)

    location = Column(String(100), nullable=True)

    device = Column(String(100), nullable=True)
    # ----------------------------------------

    created_at = Column(DateTime, default=datetime.utcnow)

    merchant = relationship(
        "Merchant",
        back_populates="payments"
    )

    customer = relationship(
        "Customer",
        back_populates="payments"
    )

    events = relationship(
        "Event",
        back_populates="payment"
    )