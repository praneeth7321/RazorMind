from datetime import datetime


def calculate_risk(
    amount: float,
    customer_history: str,
    location: str,
    payment_time: str,
    device: str,
):
    score = 0
    factors = []

    # High amount
    if amount >= 50000:
        score += 35
        factors.append("High Amount")

    elif amount >= 10000:
        score += 20
        factors.append("Medium Amount")

    # Customer history
    if customer_history.lower() == "first-time customer":
        score += 20
        factors.append("First-time Customer")

    # Location
    if location.lower() == "different city":
        score += 20
        factors.append("Different City")

    # Device
    if device.lower() == "new device":
        score += 15
        factors.append("New Device")

    # Transaction time
    hour = int(payment_time.split(":")[0])

    if hour >= 0 and hour <= 5:
        score += 10
        factors.append("Late Night Transaction")

    score = min(score, 100)

    return {
        "score": score,
        "factors": factors
    }