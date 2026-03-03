import uuid

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from auth import schemas, service, utils
from database import get_db
from models import UserSession

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/register")
async def register(user_in: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = service.get_user_by_email(db, user_in.email)
    if db_user:
        raise HTTPException(
            status_code=400, detail="A user with this email already exists."
        )
    user = service.create_user(db, user_in)

    # Generate verification code and send email
    code = await service.create_verification_code(db, user.id)
    from services.postmark_service import postmark_service

    await postmark_service.send_verification_email(user.email, code)

    return {
        "message": (
            "Registration successful. Please check your email for the "
            "verification code."
        ),
        "email": user.email,
    }


@router.post("/login", response_model=schemas.TokenResponse)
def login(user_in: schemas.UserLogin, db: Session = Depends(get_db)):
    user = service.authenticate_user(db, user_in.email, user_in.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    if not user.email_verified:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Email not verified. Please verify your email before logging in.",
            headers={"email_verified": "false"},
        )

    access_token, refresh_token = service.get_tokens_for_user(user, db)
    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer",
    }


@router.post("/verify-email")
async def verify_email(payload: schemas.EmailVerify, db: Session = Depends(get_db)):
    verified = await service.verify_email_code(db, payload.email, payload.code)
    if not verified:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or expired verification code.",
        )

    # Optional: Get tokens immediately after verification to log the user in
    user = service.get_user_by_email(db, payload.email)
    access_token, refresh_token = service.get_tokens_for_user(user, db)

    return {
        "message": "Email verified successfully.",
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer",
    }


@router.post("/resend-verification")
async def resend_verification(
    payload: schemas.ResendVerification, db: Session = Depends(get_db)
):
    user = service.get_user_by_email(db, payload.email)
    if not user:
        # Don't reveal if user exists or not for security
        return {
            "message": (
                "If this email is registered, a new verification code has been sent."
            )
        }

    if user.email_verified:
        return {"message": "Email is already verified."}

    code = await service.create_verification_code(db, user.id)
    from services.postmark_service import postmark_service

    await postmark_service.send_verification_email(user.email, code)

    return {"message": "Verification code resent successfully."}


@router.post("/refresh", response_model=schemas.TokenResponse)
def refresh(refresh_token: str, db: Session = Depends(get_db)):
    result = service.rotate_refresh_token(db, refresh_token)
    if not result:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired refresh token",
        )
    user, new_refresh_token = result
    access_token = utils.create_access_token(
        data={"sub": str(user.id), "email": user.email, "role": user.role}
    )
    return {
        "access_token": access_token,
        "refresh_token": new_refresh_token,
        "token_type": "bearer",
    }


@router.post("/logout")
def logout(refresh_token: str, db: Session = Depends(get_db)):
    # In a real app, you might extract the session_id from the token
    # and revoke only that session, or revoke all sessions for the user.
    # For now, let's just mark the specific session as revoked.
    try:
        session_id_str = refresh_token.split(":")[0]
        session_id = uuid.UUID(session_id_str)
        db.query(UserSession).filter(UserSession.id == session_id).update(
            {"revoked": True}
        )
        db.commit()
    except (ValueError, IndexError):
        pass  # Ignore failure, just return success


@router.post("/google", response_model=schemas.TokenResponse)
def google_auth(request: schemas.GoogleLoginRequest, db: Session = Depends(get_db)):
    idinfo = service.verify_google_token(request.id_token)
    if not idinfo:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid Google ID token",
        )

    user = service.create_or_update_google_user(db, idinfo)
    access_token, refresh_token = service.get_tokens_for_user(user, db)

    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer",
    }
