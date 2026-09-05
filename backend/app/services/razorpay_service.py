import razorpay

from app.core.config import settings


client = razorpay.Client(
    auth=(
        settings.RAZORPAY_KEY_ID,
        settings.RAZORPAY_KEY_SECRET
    )
)


def create_order(amount: float):

    order = client.order.create(
        {
            "amount": int(amount * 100),
            "currency": "INR",
            "payment_capture": 1
        }
    )

    return order