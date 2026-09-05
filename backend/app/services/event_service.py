from sqlalchemy.orm import Session

from app.models.event import Event
from app.engine.router import route_event


def create_event(
    db: Session,
    event_type: str,
    payment_id: int,
    payload: str,
):
    # Create event
    event = Event(
        event_type=event_type,
        payment_id=payment_id,
        payload=payload,
        status="pending"
    )

    # Save event to database
    db.add(event)
    db.commit()
    db.refresh(event)

    # Send event to AI router
    worker = route_event(event)

    # Debug logs
    print(f"[AI Router] Event: {event.event_type}")
    print(f"[AI Router] Selected Worker: {worker}")

    return event