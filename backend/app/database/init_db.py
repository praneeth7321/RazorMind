from app.database.base import Base
from app.database.session import engine

# Import all models so SQLAlchemy registers them
from app.models import (
    Merchant,
    Customer,
    Payment,
    Event,
    AIDecision,
    User,
)

def create_database():
    Base.metadata.create_all(bind=engine)