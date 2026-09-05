from app.services.ai_service import analyze_payment

result = analyze_payment(
    95,
    [
        "Large payment",
        "First-time customer",
        "2:30 AM",
        "Electronics",
        "Different city/IP"
    ]
)

print(result)
print(type(result))