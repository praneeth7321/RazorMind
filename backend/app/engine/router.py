def route_event(event):

    if event.event_type == "PAYMENT_CREATED":
        return "fraud_worker"

    return None