def process_block(payment, ai_result):
    print("\n========== FRAUD WORKER ==========")

    print(f"Payment ID : {payment.id}")
    print(f"Decision   : {ai_result['decision']}")
    print(f"Reason     : {ai_result['reason']}")

    print("Payment flagged as fraudulent.")

    print("==================================\n")