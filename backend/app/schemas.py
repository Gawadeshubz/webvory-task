from datetime import datetime
from enum import Enum

from pydantic import BaseModel, Field, field_validator


class ProductStatus(str, Enum):
    active = "active"
    inactive = "inactive"
    discontinued = "discontinued"


class ProductBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=200)
    sku: str = Field(..., min_length=1, max_length=50)
    price: float = Field(..., gt=0, description="Price must be greater than 0")
    status: ProductStatus = ProductStatus.active

    @field_validator("name", "sku")
    @classmethod
    def not_blank(cls, v: str) -> str:
        if not v.strip():
            raise ValueError("must not be blank or whitespace only")
        return v.strip()

    @field_validator("sku")
    @classmethod
    def sku_no_spaces(cls, v: str) -> str:
        if " " in v:
            raise ValueError("SKU must not contain spaces")
        return v.upper()


class ProductCreate(ProductBase):
    pass


class ProductUpdate(ProductBase):
    pass


class ProductOut(ProductBase):
    id: str
    created_at: datetime

    class Config:
        from_attributes = True  # allows returning SQLAlchemy objects directly
