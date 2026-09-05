from pydantic import BaseModel


class PaymentCreate(BaseModel):
    merchant_id: int
    customer_id: int
    amount: float

    customer_history: str
    location: str
    device: str


class PaymentResponse(BaseModel):
    id: int
    razorpay_order_id: str
    amount: float
    currency: str
    status: str

    model_config = {
        "from_attributes": True
    }