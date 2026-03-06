from typing import Optional

from fastapi import APIRouter, Depends, Request
from sqlalchemy.orm import Session

import models
import services.payment_service as payment_service
from database import get_db

router = APIRouter()


@router.post("/create-checkout-session")
async def create_checkout_session(
    data: dict,
    db: Session = Depends(get_db),
    current_user: Optional[models.User] = Depends(
        lambda: None
    ),  # Bypass auth for testing
):
    """
    Creates a Stripe Checkout Session via payment service.
    """
    return payment_service.create_checkout_session(db, data, current_user)


@router.get("/session-status")
async def session_status(session_id: str, db: Session = Depends(get_db)):
    """
    Checks the status of a Stripe Checkout Session via payment service.
    """
    return payment_service.get_session_status(db, session_id)


@router.post("/webhook")
async def stripe_webhook(request: Request, db: Session = Depends(get_db)):
    """
    Stripe webhook handler via payment service.
    """
    payload = await request.body()
    sig_header = request.headers.get("stripe-signature")

    return await payment_service.handle_stripe_webhook(db, payload, sig_header)
