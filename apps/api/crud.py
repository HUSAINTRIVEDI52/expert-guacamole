import uuid

from loguru import logger
from sqlalchemy.orm import Session

import models
import schemas


def get_user(db: Session, user_id: uuid.UUID):
    return db.query(models.User).filter(models.User.id == user_id).first()


def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()


def get_users(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.User).offset(skip).limit(limit).all()


def create_user(db: Session, user: schemas.UserCreate):
    logger.info(f"Creating user with email: {user.email}")
    # In a real app, we'd hash the password properly (e.g., bcrypt/argon2)
    fake_hashed_password = user.password + "notreallyhashed"
    db_user = models.User(email=user.email, password_hash=fake_hashed_password)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    logger.success(f"User created successfully: {db_user.id}")
    return db_user


# Other CRUD operations for SearchRequest, Purchase, etc. can be added as needed.
