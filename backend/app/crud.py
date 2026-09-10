from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError

from . import models, schemas


def get_products(db: Session):
    return db.query(models.Product).order_by(models.Product.created_at.desc()).all()


def get_product(db: Session, product_id: str):
    return db.query(models.Product).filter(models.Product.id == product_id).first()


def get_product_by_sku(db: Session, sku: str, exclude_id: str | None = None):
    query = db.query(models.Product).filter(models.Product.sku == sku)
    if exclude_id:
        query = query.filter(models.Product.id != exclude_id)
    return query.first()


def create_product(db: Session, product: schemas.ProductCreate):
    db_product = models.Product(
        name=product.name,
        sku=product.sku,
        price=product.price,
        status=product.status,
    )
    db.add(db_product)
    try:
        db.commit()
    except IntegrityError:
        db.rollback()
        raise
    db.refresh(db_product)
    return db_product


def update_product(db: Session, product_id: str, product: schemas.ProductUpdate):
    db_product = get_product(db, product_id)
    if not db_product:
        return None
    db_product.name = product.name
    db_product.sku = product.sku
    db_product.price = product.price
    db_product.status = product.status
    try:
        db.commit()
    except IntegrityError:
        db.rollback()
        raise
    db.refresh(db_product)
    return db_product


def delete_product(db: Session, product_id: str):
    db_product = get_product(db, product_id)
    if not db_product:
        return None
    db.delete(db_product)
    db.commit()
    return db_product
