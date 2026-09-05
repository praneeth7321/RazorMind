from app.services.risk_engine import calculate_risk

risk = calculate_risk(
    amount=75000,
    customer_history="First-time customer",
    location="Different City",
    payment_time="02:30",
    device="New Device"
)

print(risk)