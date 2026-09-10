import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# DB path comes from environment — never hardcoded.
# Defaults to a local file if not set (useful for running outside Docker).
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:////app/data/products.db")

# check_same_thread=False is required for SQLite when used with FastAPI's
# threaded request handling.
connect_args = {"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {}

engine = create_engine(DATABASE_URL, connect_args=connect_args)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


def get_db():
    """FastAPI dependency — yields a DB session per request, closes it after."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
