import os

import httpx
from loguru import logger


class PostmarkService:
    def __init__(self):
        self.api_token = os.getenv("POSTMARK_API_TOKEN")
        self.from_email = os.getenv("POSTMARK_FROM_EMAIL", "info@sul.com")
        self.base_url = "https://api.postmarkapp.com"

    async def send_email(
        self,
        to_email: str,
        subject: str,
        html_body: str,
        text_body: str = None,
    ):
        """
        Sends an email using Postmark API.
        """
        if not self.api_token or self.api_token == "server_token_here":
            logger.warning(
                "POSTMARK_API_TOKEN not set or using placeholder, skipping email "
                "send. Email would have been sent to: {}",
                to_email,
            )
            return {
                "Message": (
                    "Postmark API token not set or placeholder, email skip logged"
                ),
                "MessageID": "dummy-id",
            }

        headers = {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "X-Postmark-Server-Token": self.api_token,
        }

        payload = {
            "From": self.from_email,
            "To": to_email,
            "Subject": subject,
            "HtmlBody": html_body,
            "MessageStream": "outbound",
        }
        if text_body:
            payload["TextBody"] = text_body

        async with httpx.AsyncClient() as client:
            try:
                response = await client.post(
                    f"{self.base_url}/email", headers=headers, json=payload
                )
                if response.status_code == 422:
                    logger.warning(
                        "Postmark API rejected email (likely test address/"
                        "inactive): %s",
                        response.text,
                    )
                    return {
                        "Message": "Postmark rejected email, but continuing in dev",
                        "error": response.json(),
                    }

                response.raise_for_status()
                logger.info(f"Email sent to {to_email} via Postmark")
                return response.json()
            except httpx.HTTPStatusError as e:
                logger.error(f"Postmark API error: {e.response.text}")
                raise
            except Exception as e:
                logger.error(f"Error sending email via Postmark: {e}")
                # In dev we might want to continue, but in prod we should probably know
                if os.getenv("ENVIRONMENT") == "production":
                    raise
                logger.warning("Continuing registration despite email failure in dev")
                return {"Message": "Email failure, continuing in dev", "error": str(e)}

    async def send_verification_email(self, email: str, code: str):
        """
        Sends a verification code email to the user.
        """
        subject = "Verify your email address - SUL"
        html_body = f"""
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;
        padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px;">
            <h1 style="color: #4F46E5; text-align: center;">Welcome to SUL!</h1>
            <p style="font-size: 16px; color: #374151;">Thank you for registering.
            Please use the following 6-digit code to verify your email address:</p>
            <div style="background-color: #f3f4f6; padding: 20px; text-align: center;
            border-radius: 8px; margin: 20px 0;">
                <span style="font-size: 32px; font-weight: bold; letter-spacing: 8px;
                color: #111827;">{code}</span>
            </div>
            <p style="font-size: 14px; color: #6b7280; text-align: center;">
            This code will expire in 15 minutes.</p>
            <hr style="border: 0; border-top: 1px solid #e5e7eb; margin: 20px 0;">
            <p style="font-size: 12px; color: #9ca3af; text-align: center;">
            If you didn't create an account, you can safely ignore this email.</p>
        </div>
        """
        text_body = (
            f"Welcome to SUL!\n\nPlease use the following 6-digit code to verify "
            f"your email address: {code}\n\nThis code will expire in 15 minutes.\n\n"
            "If you didn't create an account, you can safely ignore this email."
        )

        return await self.send_email(email, subject, html_body, text_body)


postmark_service = PostmarkService()
