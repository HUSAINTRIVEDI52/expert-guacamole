import os

from dotenv import load_dotenv
from loguru import logger
from sqlalchemy import create_engine, text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

load_dotenv(".env")
load_dotenv(".env.local", override=True)

SQLALCHEMY_DATABASE_URL = os.getenv("DATABASE_URL")

# check_same_thread=False is only needed for SQLite
is_sqlite = SQLALCHEMY_DATABASE_URL.startswith("sqlite")
connect_args = {"check_same_thread": False} if is_sqlite else {}

try:
    engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args=connect_args)
    # Test connection
    with engine.connect() as connection:
        connection.execute(text("SELECT 1"))

    db_name = SQLALCHEMY_DATABASE_URL.split("/")[-1]
    logger.success(f"Successfully connected to the database: {db_name}")
except Exception as e:
    logger.error(f"Failed to connect to the database: {str(e)}")
    raise e

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
