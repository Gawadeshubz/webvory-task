import uuid
from datetime import datetime, timezone

from sqlalchemy import Column, String, Float, DateTime
from .database import Base


def generate_uuid():
    return str(uuid.uuid4())


class Product(Base):
    __tablename__ = "products"

    id = Column(String, primary_key=True, default=generate_uuid)
    name = Column(String, nullable=False)
    sku = Column(String, nullable=False, unique=True, index=True)
    price = Column(Float, nullable=False)
    status = Column(String, nullable=False, default="active")
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
