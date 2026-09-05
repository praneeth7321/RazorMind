from datetime import datetime

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.dependencies import get_db
from app.database.session import SessionLocal

from app.models.payment import Payment
from app.models.ai_decision import AIDecision

from app.schemas.payment import PaymentCreate, PaymentResponse
from app.schemas.payment_verify import PaymentVerify

from app.services.razorpay_service import create_order, client
from app.services.event_service import create_event
from app.services.risk_engine import calculate_risk
from app.services.ai_service import analyze_payment

from app.workers.ai_router import process_ai_decision

router = APIRouter(
    prefix="/payments",
    tags=["Payments"]
)


@router.post("/create", response_model=PaymentResponse)
def create_payment(
    data: PaymentCreate,
    db: Session = Depends(get_db)
):
    # Create Razorpay Order
    order = create_order(data.amount)

    # Save payment
    payment = Payment(
        merchant_id=data.merchant_id,
        customer_id=data.customer_id,
        amount=data.amount,
        currency="INR",
        status="created",
        razorpay_order_id=order["id"],

        # Fraud Detection Data
        customer_history=data.customer_history,
        location=data.location,
        device=data.device,
    )

    db.add(payment)
    db.commit()
    db.refresh(payment)

    # Create Event
    create_event(
        db=db,
        event_type="PAYMENT_CREATED",
        payment_id=payment.id,
        payload=f"Payment {payment.id} created"
    )

    return payment


@router.post("/verify")
def verify_payment(data: PaymentVerify):

    params = {
        "razorpay_order_id": data.razorpay_order_id,
        "razorpay_payment_id": data.razorpay_payment_id,
        "razorpay_signature": data.razorpay_signature,
    }

    db = SessionLocal()

    try:
        # Verify Razorpay Signature
        client.utility.verify_payment_signature(params)

        # Find Payment
        payment = (
            db.query(Payment)
            .filter(
                Payment.razorpay_order_id == data.razorpay_order_id
            )
            .first()
        )

        if not payment:
            return {
                "success": False,
                "message": "Payment not found"
            }

        # Update Payment
        payment.razorpay_payment_id = data.razorpay_payment_id
        payment.status = "paid"

        db.commit()
        db.refresh(payment)

        # Create Success Event
        event = create_event(
            db=db,
            event_type="PAYMENT_SUCCESS",
            payment_id=payment.id,
            payload=f"Payment {payment.id} verified"
        )

        # Calculate Risk
        risk = calculate_risk(
            amount=payment.amount,
            customer_history=payment.customer_history,
            location=payment.location,
            payment_time=datetime.now().strftime("%H:%M"),
            device=payment.device
        )

        # AI Analysis
        ai_result = analyze_payment(
            risk["score"],
            risk["factors"]
        )

        # Save AI Decision
        decision = AIDecision(
            event_id=event.id,
            worker_name="Llama3.2",
            decision=ai_result["decision"],
            confidence=ai_result["confidence"],
            risk_score=risk["score"],
            reason=ai_result["reason"],
        )

        db.add(decision)
        db.commit()

        process_ai_decision(payment, ai_result)

        return {
            "success": True,
            "message": "Payment verified successfully",
            "payment_id": payment.id,
            "risk_score": risk["score"],
            "risk_factors": risk["factors"],
            "ai_decision": ai_result
        }

    except Exception as e:

        db.rollback()

        return {
            "success": False,
            "error": str(e)
        }

    finally:
        db.close()