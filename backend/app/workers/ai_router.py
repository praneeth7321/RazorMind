from app.workers.fraud_worker import process_block
from app.workers.notification_worker import process_review
from app.workers.email_worker import send_email


def process_ai_decision(payment, ai_result):

    decision = ai_result["decision"]

    print("\n========== AI ROUTER ==========")
    print("Decision:", decision)

    if decision == "BLOCK":
        process_block(payment, ai_result)
        send_email(payment, ai_result)

    elif decision == "REVIEW":
        process_review(payment, ai_result)

    elif decision == "APPROVE":
        print("Payment approved.")

    else:
        print("Unknown decision.")

    print("================================\n")