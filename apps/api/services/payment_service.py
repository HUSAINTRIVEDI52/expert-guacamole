import os
import uuid
from typing import Any, Dict, Optional

import stripe
from fastapi import HTTPException
from loguru import logger
from sqlalchemy.orm import Session

import models

stripe.api_key = os.getenv("STRIPE_SECRET_KEY")


def create_checkout_session(
    db: Session, data: Dict[str, Any], current_user: Optional[models.User]
) -> Dict[str, Any]:
    """
    Creates a Stripe Checkout Session. Fallbacks to mock data if no user is found.
    """
    # Simple workaround: If no user, use a mock one
    if not current_user:
        logger.warning("No authenticated user found. Using MOCK USER for testing.")

        class MockUser:
            id = uuid.uuid4()
            email = "test-buyer@example.com"

        current_user = MockUser()

    try:
        search_request_id = data.get("search_request_id")
        total_amount = data.get("total_amount")

        amount_cents = 0
        lead_count = 0

        if search_request_id:
            search_request = (
                db.query(models.SearchRequest)
                .filter(models.SearchRequest.id == search_request_id)
                .first()
            )
            if not search_request:
                raise HTTPException(status_code=404, detail="Search request not found")

            total_amount = float(search_request.estimated_price)
            lead_count = search_request.estimated_count
            amount_cents = int(total_amount * 100)
        elif total_amount:
            amount_cents = int(total_amount * 100)
        else:
            raise HTTPException(
                status_code=400,
                detail="Either search_request_id or total_amount must be provided",
            )

        if amount_cents < 50:  # Stripe minimum
            amount_cents = 50

        frontend_url = os.getenv("FRONTEND_URL", "http://localhost:3000")
        # logo_url = f"{frontend_url}/logo-full.png"

        # Determine product name and description
        product_name = "Leads Purchase"
        if lead_count:
            product_description = (
                f"Full access to {lead_count:,} verified real estate leads "
                "including PII data (email, phone, address)."
            )
        else:
            product_description = (
                "Full access to 1240 verified real estate leads "
                "including PII data (email, phone, address)."
            )

        # Build cancel URL with state parameters to restore lead generation page
        cancel_params = f"payment_failed=true&lead_count={lead_count}"
        if search_request_id:
            cancel_params += f"&search_request_id={search_request_id}"

        cancel_url = f"{frontend_url}/lead-generation?{cancel_params}"

        session = stripe.checkout.Session.create(
            line_items=[
                {
                    "price_data": {
                        "currency": "usd",
                        "product_data": {
                            "name": product_name,
                            "description": product_description,
                            # 'images': [logo_url],
                        },
                        "unit_amount": amount_cents,
                    },
                    "quantity": 1,
                },
            ],
            mode="payment",
            success_url=(
                frontend_url + "/checkout/return?session_id={CHECKOUT_SESSION_ID}"
            ),
            cancel_url=cancel_url,
            customer_email=current_user.email,
            metadata={
                "user_id": str(current_user.id),
                "search_request_id": str(search_request_id)
                if search_request_id
                else "",
                "lead_count": str(lead_count),
            },
        )

        # Only save to DB if it's a real user from database
        if hasattr(current_user, "__tablename__"):
            purchase = models.Purchase(
                user_id=current_user.id,
                search_request_id=search_request_id,
                stripe_session_id=session.id,
                status="pending",
                total_amount=total_amount,
                lead_count=lead_count,
                currency="USD",
            )
            db.add(purchase)
            db.commit()
        else:
            logger.info("Skipping database save as we are in MOCK USER mode.")

        return {"url": session.url}
    except Exception as e:
        logger.error(f"Failed to create checkout session: {str(e)}")
        db.rollback()
        raise HTTPException(status_code=400, detail=str(e))


def get_session_status(db: Session, session_id: str) -> Dict[str, Any]:
    """
    Checks the status of a Stripe Checkout Session and updates local purchase status.
    """
    try:
        # Retrieve session with expanded payment_intent
        session = stripe.checkout.Session.retrieve(
            session_id, expand=["payment_intent"]
        )

        pi = session.payment_intent
        pi_status = pi.status if pi else None
        last_error = pi.last_payment_error if pi else None

        logger.info(
            f"STATUS CHECK | Session: {session.status} | "
            f"Payment: {session.payment_status} | PI: {pi_status}"
        )
        if last_error:
            logger.warning(
                f"PAYMENT ERROR | Code: {last_error.get('code')} | "
                f"Msg: {last_error.get('message')}"
            )

        purchase = (
            db.query(models.Purchase)
            .filter(models.Purchase.stripe_session_id == session_id)
            .first()
        )

        if purchase:
            if session.payment_status == "paid":
                if purchase.status != "completed":
                    purchase.status = "completed"
                    purchase.amount_received = session.amount_total / 100
                    purchase.stripe_payment_intent_id = (
                        pi.id if pi else session.payment_intent
                    )
                    purchase.paid_at = models.func.now()
                    db.commit()
                    logger.info(
                        f"Purchase {purchase.id} marked as completed via status check"
                    )
            elif session.status == "expired" or (pi and pi_status == "canceled"):
                if purchase.status != "failed":
                    purchase.status = "failed"
                    db.commit()
                    logger.info(f"Purchase {purchase.id} marked as failed")
            elif session.payment_status == "unpaid" and session.status == "complete":
                # This happens for delayed payment methods like SEPA/ACH
                if purchase.status != "pending_payment":
                    purchase.status = "pending_payment"
                    db.commit()
                    logger.info(f"Purchase {purchase.id} marked as pending_payment")

        return {
            "status": session.status,
            "payment_status": session.payment_status,
            "purchase_status": purchase.status if purchase else None,
            "customer_email": (
                session.customer_details.email if session.customer_details else None
            ),
            "payment_intent": {
                "id": pi.id if pi else None,
                "status": pi_status,
                "last_payment_error": last_error,
            },
        }
    except Exception as e:
        logger.error(f"Failed to retrieve session status: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))


async def handle_stripe_webhook(
    db: Session, payload: bytes, sig_header: str
) -> Dict[str, str]:
    """
    Handles Stripe webhooks.
    """
    webhook_secret = os.getenv("STRIPE_WEBHOOK_SECRET")

    try:
        event = stripe.Webhook.construct_event(payload, sig_header, webhook_secret)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid payload")
    except stripe.error.SignatureVerificationError:
        raise HTTPException(status_code=400, detail="Invalid signature")

    # Record the event
    webhook_event = models.StripeWebhookEvent(
        stripe_event_id=event["id"], event_type=event["type"], payload=event
    )
    db.add(webhook_event)

    # Handle the event
    if event["type"] == "checkout.session.completed":
        session = event["data"]["object"]
        purchase = (
            db.query(models.Purchase)
            .filter(models.Purchase.stripe_session_id == session["id"])
            .first()
        )
        if purchase:
            if session["payment_status"] == "paid":
                purchase.status = "completed"
                purchase.paid_at = models.func.now()
            else:
                purchase.status = "pending_payment"

            purchase.amount_received = session["amount_total"] / 100
            purchase.stripe_payment_intent_id = session["payment_intent"]
            webhook_event.processed = True
            webhook_event.processed_at = models.func.now()
            db.commit()
            logger.info(
                f"Purchase {purchase.id} updated via checkout.session.completed "
                f"(status: {purchase.status})"
            )

    elif event["type"] == "checkout.session.async_payment_succeeded":
        session = event["data"]["object"]
        purchase = (
            db.query(models.Purchase)
            .filter(models.Purchase.stripe_session_id == session["id"])
            .first()
        )
        if purchase:
            purchase.status = "completed"
            purchase.paid_at = models.func.now()
            webhook_event.processed = True
            webhook_event.processed_at = models.func.now()
            db.commit()
            logger.info(f"Purchase {purchase.id} completed via async_payment_succeeded")

    elif event["type"] == "checkout.session.async_payment_failed":
        session = event["data"]["object"]
        purchase = (
            db.query(models.Purchase)
            .filter(models.Purchase.stripe_session_id == session["id"])
            .first()
        )
        if purchase:
            purchase.status = "failed"
            webhook_event.processed = True
            webhook_event.processed_at = models.func.now()
            db.commit()
            logger.info(
                f"Purchase {purchase.id} marked as failed via async_payment_failed"
            )

    elif event["type"] == "checkout.session.expired":
        session = event["data"]["object"]
        purchase = (
            db.query(models.Purchase)
            .filter(models.Purchase.stripe_session_id == session["id"])
            .first()
        )
        if purchase:
            purchase.status = "failed"
            webhook_event.processed = True
            webhook_event.processed_at = models.func.now()
            db.commit()
            logger.info(
                f"Purchase {purchase.id} marked as failed via checkout.session.expired"
            )

    db.commit()
    return {"status": "success"}
