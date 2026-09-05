from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func, desc, or_

from app.database.dependencies import get_db
from app.auth.dependencies import get_current_user

from app.models.payment import Payment
from app.models.event import Event
from app.models.ai_decision import AIDecision


router = APIRouter(
    prefix="/dashboard",
    tags=["Dashboard"]
)


# ==========================================================
# DASHBOARD STATS
# ==========================================================
@router.get("/stats")
def dashboard_stats(
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db),
):
    total_payments = (
        db.query(Payment)
        .count()
    )

    successful_payments = (
        db.query(Payment)
        .filter(Payment.status == "paid")
        .count()
    )

    blocked_payments = (
        db.query(AIDecision)
        .filter(AIDecision.decision == "BLOCK")
        .count()
    )

    review_queue = (
        db.query(AIDecision)
        .filter(AIDecision.decision == "REVIEW")
        .count()
    )

    average_confidence = (
        db.query(func.avg(AIDecision.confidence))
        .scalar()
    )

    average_risk = (
        db.query(func.avg(AIDecision.risk_score))
        .scalar()
    )

    return {
        "total_payments": total_payments,
        "successful_payments": successful_payments,
        "blocked_payments": blocked_payments,
        "review_queue": review_queue,
        "average_ai_confidence": round(
            average_confidence or 0,
            2
        ),
        "average_risk_score": round(
            average_risk or 0,
            2
        ),
    }


# ==========================================================
# DECISION DISTRIBUTION
# ==========================================================
@router.get("/decision-distribution")
def decision_distribution(
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db),
):
    approve = (
        db.query(AIDecision)
        .filter(AIDecision.decision == "APPROVE")
        .count()
    )

    review = (
        db.query(AIDecision)
        .filter(AIDecision.decision == "REVIEW")
        .count()
    )

    block = (
        db.query(AIDecision)
        .filter(AIDecision.decision == "BLOCK")
        .count()
    )

    return [
        {
            "name": "APPROVE",
            "value": approve
        },
        {
            "name": "REVIEW",
            "value": review
        },
        {
            "name": "BLOCK",
            "value": block
        },
    ]


# ==========================================================
# PAYMENTS PER DAY
# ==========================================================
@router.get("/payments-per-day")
def payments_per_day(
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db),
):
    data = (
        db.query(
            func.date(Payment.created_at).label("date"),
            func.count(Payment.id).label("count"),
        )
        .group_by(
            func.date(Payment.created_at)
        )
        .order_by(
            func.date(Payment.created_at)
        )
        .all()
    )

    return [
        {
            "date": str(row.date),
            "count": row.count,
        }
        for row in data
    ]


# ==========================================================
# RECENT PAYMENTS
# ==========================================================
@router.get("/recent-payments")
def recent_payments(
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db),
):
    data = (
        db.query(
            Payment.id.label("payment_id"),
            Payment.amount,
            Payment.status,
            Payment.created_at,
            AIDecision.decision,
            AIDecision.confidence,
            AIDecision.risk_score,
        )
        .join(
            Event,
            Payment.id == Event.payment_id
        )
        .join(
            AIDecision,
            Event.id == AIDecision.event_id
        )
        .order_by(
            desc(Payment.created_at)
        )
        .limit(10)
        .all()
    )

    return [
        {
            "payment_id": row.payment_id,
            "amount": row.amount,
            "status": row.status,
            "decision": row.decision,
            "confidence": row.confidence,
            "risk_score": row.risk_score,
            "created_at": row.created_at,
        }
        for row in data
    ]


# ==========================================================
# PAYMENT HISTORY
# ==========================================================
@router.get("/payment-history")
def payment_history(
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db),
):
    payments = (
        db.query(
            Payment.id,
            Payment.customer_id,
            Payment.merchant_id,
            Payment.amount,
            Payment.currency,
            Payment.status,
            Payment.razorpay_order_id,
            Payment.razorpay_payment_id,
            Payment.created_at,
            AIDecision.risk_score,
            AIDecision.decision,
            AIDecision.confidence,
            AIDecision.reason,
        )
        .outerjoin(
            Event,
            (Payment.id == Event.payment_id)
            & (Event.event_type == "PAYMENT_SUCCESS")
        )
        .outerjoin(
            AIDecision,
            Event.id == AIDecision.event_id
        )
        .order_by(Payment.id.desc())
        .all()
    )

    return [
        {
            "id": p.id,
            "customer_id": p.customer_id,
            "merchant_id": p.merchant_id,
            "amount": p.amount,
            "currency": p.currency,
            "status": p.status,
            "razorpay_order_id": p.razorpay_order_id,
            "razorpay_payment_id": p.razorpay_payment_id,
            "created_at": p.created_at,
            "risk_score": p.risk_score,
            "decision": p.decision,
            "confidence": p.confidence,
            "reason": p.reason,
        }
        for p in payments
    ]
# ==========================================================
# MERCHANT LEADERBOARD
# ==========================================================
@router.get("/merchant-leaderboard")
def merchant_leaderboard(
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db),
):
    merchants = (
        db.query(
            Payment.merchant_id,
            func.count(
                Payment.id
            ).label("transactions"),
            func.avg(
                AIDecision.risk_score
            ).label("avg_risk"),
            func.avg(
                AIDecision.confidence
            ).label("avg_confidence"),
        )
        .join(
            Event,
            Payment.id == Event.payment_id
        )
        .join(
            AIDecision,
            Event.id == AIDecision.event_id
        )
        .group_by(
            Payment.merchant_id
        )
        .order_by(
            func.avg(
                AIDecision.risk_score
            ).desc()
        )
        .all()
    )

    result = []

    for merchant in merchants:
        avg_risk = merchant.avg_risk or 0
        avg_confidence = merchant.avg_confidence or 0

        if avg_risk >= 80:
            status = "High Risk"

        elif avg_risk >= 50:
            status = "Watch"

        else:
            status = "Safe"

        result.append(
            {
                "merchant_id": merchant.merchant_id,
                "transactions": merchant.transactions,
                "avg_risk": round(
                    avg_risk,
                    2
                ),
                "avg_confidence": round(
                    avg_confidence,
                    2
                ),
                "status": status,
            }
        )

    return result


# ==========================================================
# FRAUD ALERTS
# ==========================================================
@router.get("/fraud-alerts")
def fraud_alerts(
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db),
):
    alerts = (
        db.query(
            Payment.id.label("payment_id"),
            Payment.merchant_id,
            Payment.customer_id,
            Payment.amount,
            Payment.currency,
            Payment.status,
            Payment.created_at,
            AIDecision.risk_score,
            AIDecision.confidence,
            AIDecision.decision,
            AIDecision.reason.label("reason"),
        )
        .join(
            Event,
            Payment.id == Event.payment_id
        )
        .join(
            AIDecision,
            Event.id == AIDecision.event_id
        )
        .filter(
            or_(
                AIDecision.risk_score >= 60,
                AIDecision.decision == "REVIEW",
                AIDecision.decision == "BLOCK",
            )
        )
        .order_by(
            Payment.created_at.desc()
        )
        .all()
    )

    return [
        {
            "id": alert.payment_id,
            "merchant": alert.merchant_id,
            "customer": alert.customer_id,
            "amount": alert.amount,
            "currency": alert.currency,
            "status": alert.status,
            "risk_score": alert.risk_score,
            "confidence": alert.confidence,
            "decision": alert.decision,
            "reason": alert.reason,
            "created_at": alert.created_at,
        }
        for alert in alerts
    ]
