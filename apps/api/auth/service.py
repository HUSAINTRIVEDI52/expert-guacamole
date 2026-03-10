import os
import random
import string
import uuid
from datetime import datetime, timedelta
from typing import Optional, Tuple

from google.auth.transport import requests
from google.oauth2 import id_token
from sqlalchemy.orm import Session

from auth.schemas import UserCreate
from auth.utils import create_access_token, hash_password, verify_password
from models import EmailVerification, User, UserSession


def get_user_by_email(db: Session, email: str) -> Optional[User]:
    return db.query(User).filter(User.email == email).first()


def create_user(db: Session, user_in: UserCreate) -> User:
    db_user = User(
        email=user_in.email,
        password_hash=hash_password(user_in.password),
        provider="local",
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


def authenticate_user(db: Session, email: str, password: str) -> Optional[User]:
    user = get_user_by_email(db, email)
    if not user:
        return None
    if user.password_hash == "GOOGLE_AUTH_NO_PASSWORD":
        return None
    if not verify_password(password, user.password_hash):
        return None
    return user


def create_user_session(db: Session, user_id: uuid.UUID) -> str:
    refresh_token = str(uuid.uuid4())
    # Hash the refresh token before storing in DB for security
    refresh_token_hash = hash_password(refresh_token)
    expires_at = datetime.utcnow() + timedelta(days=30)

    db_session = UserSession(
        user_id=user_id, refresh_token_hash=refresh_token_hash, expires_at=expires_at
    )
    db.add(db_session)
    db.commit()
    db.refresh(db_session)
    # Return a composite token: session_id:plain_refresh_token
    return f"{db_session.id}:{refresh_token}"


def revoke_all_user_sessions(db: Session, user_id: uuid.UUID):
    db.query(UserSession).filter(
        UserSession.user_id == user_id,
        UserSession.revoked.is_(False),
    ).update({"revoked": True})
    db.commit()


def verify_refresh_token(db: Session, composite_token: str) -> Optional[User]:
    try:
        session_id_str, plain_token = composite_token.split(":")
        session_id = uuid.UUID(session_id_str)
    except (ValueError, AttributeError):
        return None

    db_session = (
        db.query(UserSession)
        .filter(
            UserSession.id == session_id,
            UserSession.revoked.is_(False),
            UserSession.expires_at > datetime.utcnow(),
        )
        .first()
    )

    if not db_session:
        return None

    if not verify_password(plain_token, db_session.refresh_token_hash):
        return None

    return db_session.user


def rotate_refresh_token(
    db: Session, composite_token: str
) -> Optional[Tuple[User, str]]:
    user = verify_refresh_token(db, composite_token)
    if not user:
        return None

    # Revoke old session and issue new one
    session_id_str = composite_token.split(":")[0]
    db.query(UserSession).filter(UserSession.id == uuid.UUID(session_id_str)).update(
        {"revoked": True}
    )
    db.commit()

    new_refresh_token = create_user_session(db, user.id)
    return user, new_refresh_token


GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID")


def verify_google_token(token: str) -> Optional[dict]:
    try:
        idinfo = id_token.verify_oauth2_token(
            token, requests.Request(), GOOGLE_CLIENT_ID
        )

        # ID token is valid. Get the user's Google Account ID from the decoded token.
        # userid = idinfo['sub']
        return idinfo
    except ValueError:
        # Invalid token
        return None


def get_user_by_google_sub(db: Session, google_sub: str) -> Optional[User]:
    return db.query(User).filter(User.google_sub == google_sub).first()


def create_or_update_google_user(db: Session, idinfo: dict) -> User:
    google_sub = idinfo["sub"]
    email = idinfo["email"]

    user = get_user_by_google_sub(db, google_sub)
    if not user:
        # Check if user exists with same email but different provider
        user = get_user_by_email(db, email)
        if user:
            # Link google account to existing local account
            user.google_sub = google_sub
            user.provider = "google"
        else:
            # Create new user
            user = User(
                email=email,
                password_hash="GOOGLE_AUTH_NO_PASSWORD",  # Or some other indicator
                provider="google",
                google_sub=google_sub,
                email_verified=True,  # Google emails are verified
            )
            db.add(user)

        db.commit()
        db.refresh(user)

    return user


def get_tokens_for_user(user: User, db: Session) -> Tuple[str, str]:
    access_token = create_access_token(
        data={"sub": str(user.id), "email": user.email, "role": user.role}
    )
    refresh_token = create_user_session(db, user.id)
    return access_token, refresh_token


def generate_verification_code(length: int = 6) -> str:
    return "".join(random.choices(string.digits, k=length))


def generate_verification_token() -> str:
    return uuid.uuid4().hex


async def create_verification_code(db: Session, user_id: uuid.UUID) -> Tuple[str, str]:
    code = generate_verification_code()
    token = generate_verification_token()
    expires_at = datetime.utcnow() + timedelta(minutes=15)

    # Check if a code already exists for this user
    existing_verification = (
        db.query(EmailVerification).filter(EmailVerification.user_id == user_id).first()
    )
    if existing_verification:
        existing_verification.code = code
        existing_verification.token = token
        existing_verification.expires_at = expires_at
        existing_verification.created_at = datetime.utcnow()
    else:
        new_verification = EmailVerification(
            user_id=user_id, code=code, token=token, expires_at=expires_at
        )
        db.add(new_verification)

    db.commit()
    return code, token


async def verify_email_code(db: Session, email: str, code: str) -> bool:
    user = get_user_by_email(db, email)
    if not user:
        return False

    verification = (
        db.query(EmailVerification)
        .filter(
            EmailVerification.user_id == user.id,
            EmailVerification.code == code,
            EmailVerification.expires_at > datetime.utcnow(),
        )
        .first()
    )

    if not verification:
        return False

    # Mark user as verified
    user.email_verified = True
    # Delete the verification code
    db.delete(verification)
    db.commit()

    return True


async def verify_email_token(db: Session, token: str) -> Optional[User]:
    verification = (
        db.query(EmailVerification)
        .filter(
            EmailVerification.token == token,
            EmailVerification.expires_at > datetime.utcnow(),
        )
        .first()
    )

    if not verification:
        return None

    user = verification.user
    # Mark user as verified
    user.email_verified = True
    # Delete the verification token
    db.delete(verification)
    db.commit()

    return user


async def create_password_reset_token(db: Session, email: str) -> Optional[str]:
    user = get_user_by_email(db, email)
    if not user:
        return None

    token = generate_verification_token()
    user.reset_password_token = token
    user.reset_password_expires_at = datetime.utcnow() + timedelta(hours=1)
    db.commit()
    return token


async def reset_password(db: Session, token: str, new_password: str) -> bool:
    user = (
        db.query(User)
        .filter(
            User.reset_password_token == token,
            User.reset_password_expires_at > datetime.utcnow(),
        )
        .first()
    )

    if not user:
        return False

    user.password_hash = hash_password(new_password)
    user.reset_password_token = None
    user.reset_password_expires_at = None
    # If they reset password, they definitely own the email
    user.email_verified = True
    # If they set a password, they can now login via local provider too
    if user.provider == "google":
        # Keep google_sub but allowing local login
        pass

    db.commit()
    return True
