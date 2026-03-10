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
                        "inactive): {}",
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

    async def send_verification_email(self, email: str, token: str):
        """
        Sends a verification link email to the user.
        """
        api_url = os.getenv("API_URL", "http://localhost:8000")
        verification_link = f"{api_url}/api/auth/verify-email?token={token}"

        subject = "Verify your email address - SUL"
        html_body = f"""
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;
        padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px;">
            <h1 style="color: #4F46E5; text-align: center;">Welcome to SUL!</h1>
            <p style="font-size: 16px; color: #374151;">Thank you for registering.
            Please click the button below to verify your email address:</p>
            <div style="text-align: center; margin: 30px 0;">
                <a href="{verification_link}" style="background-color: #4F46E5;
                color: white; padding: 12px 24px; text-decoration: none;
                border-radius: 6px; font-weight: bold; display: inline-block;">
                    Verify Email Address
                </a>
            </div>
            <p style="font-size: 14px; color: #6b7280; text-align: center;">
            If the button above doesn't work, copy and paste the following link
            into your browser:</p>
            <p style="font-size: 12px; color: #4F46E5; text-align: center;
            word-break: break-all;">
                {verification_link}
            </p>
            <p style="font-size: 14px; color: #6b7280; text-align: center;">
            This link will expire in 15 minutes.</p>
            <hr style="border: 0; border-top: 1px solid #e5e7eb; margin: 20px 0;">
            <p style="font-size: 12px; color: #9ca3af; text-align: center;">
            If you didn't create an account, you can safely ignore this email.</p>
        </div>
        """
        text_body = (
            f"Welcome to SUL!\n\nPlease click the following link to verify "
            f"your email address: {verification_link}\n\n"
            "This link will expire in 15 minutes.\n\n"
            "If you didn't create an account, you can safely ignore this email."
        )

        return await self.send_email(email, subject, html_body, text_body)

    async def send_password_reset_email(self, email: str, token: str):
        """
        Sends a password reset link email to the user.
        """
        frontend_url = os.getenv("FRONTEND_URL", "http://localhost:3000")
        reset_link = f"{frontend_url}/reset-password?token={token}"

        subject = "Reset your password - SUL"
        html_body = f"""
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;
        padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px;">
            <h1 style="color: #4F46E5; text-align: center;">Reset Your Password</h1>
            <p style="font-size: 16px; color: #374151;">You requested to reset
            your password. Please click the button below to set a new password:</p>
            <div style="text-align: center; margin: 30px 0;">
                <a href="{reset_link}" style="background-color: #4F46E5;
                color: white; padding: 12px 24px; text-decoration: none;
                border-radius: 6px; font-weight: bold; display: inline-block;">
                    Reset Password
                </a>
            </div>
            <p style="font-size: 14px; color: #6b7280; text-align: center;">
            If the button above doesn't work, copy and paste the following link
            into your browser:</p>
            <p style="font-size: 12px; color: #4F46E5; text-align: center;
            word-break: break-all;">
                {reset_link}
            </p>
            <p style="font-size: 14px; color: #6b7280; text-align: center;">
            This link will expire in 1 hour.</p>
            <hr style="border: 0; border-top: 1px solid #e5e7eb; margin: 20px 0;">
            <p style="font-size: 12px; color: #9ca3af; text-align: center;">
            If you didn't request a password reset, you can safely ignore this
            email.</p>
        </div>
        """
        text_body = (
            f"Reset Your Password\n\nPlease click the following link to reset "
            f"your password: {reset_link}\n\nThis link will expire in 1 hour.\n\n"
            "If you didn't request a password reset, you can safely ignore "
            "this email."
        )

        return await self.send_email(email, subject, html_body, text_body)


postmark_service = PostmarkService()
