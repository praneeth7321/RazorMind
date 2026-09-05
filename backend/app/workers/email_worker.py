def send_email(payment, ai_result):
    print("\n========== EMAIL WORKER ==========")

    print(f"Sending email for Payment {payment.id}")

    print(f"Decision: {ai_result['decision']}")

    print("Email sent successfully.")

    print("==================================\n")