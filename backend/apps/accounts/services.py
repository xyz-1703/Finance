import random
from datetime import timedelta

import requests
from django.conf import settings
from django.utils import timezone

from .models import User


def issue_otp(user: User) -> str:
    now = timezone.now()
    if user.otp_request_window_start is None or now - user.otp_request_window_start > timedelta(hours=1):
        user.otp_request_window_start = now
        user.otp_request_count = 0

    if user.otp_request_count >= settings.OTP_REQUEST_LIMIT_PER_HOUR:
        raise ValueError("OTP request limit reached. Try again later.")

    code = f"{random.randint(100000, 999999)}"
    user.otp_code = code
    user.otp_created_at = now
    user.otp_attempts = 0
    user.otp_request_count += 1
    user.save(
        update_fields=[
            "otp_code",
            "otp_created_at",
            "otp_attempts",
            "otp_request_count",
            "otp_request_window_start",
        ]
    )
    return code


def send_telegram_message(chat_id: str, text: str) -> None:
    if not settings.TELEGRAM_BOT_TOKEN:
        raise ValueError("Telegram bot token is not configured")

    url = f"https://api.telegram.org/bot{settings.TELEGRAM_BOT_TOKEN}/sendMessage"
    response = requests.post(url, json={"chat_id": chat_id, "text": text}, timeout=10)
    response.raise_for_status()


def validate_otp(user: User, otp_code: str) -> bool:
    if not user.otp_code or not user.otp_created_at:
        return False

    if timezone.now() - user.otp_created_at > timedelta(minutes=settings.OTP_EXPIRY_MINUTES):
        return False

    if user.otp_attempts >= settings.OTP_MAX_ATTEMPTS:
        return False

    if user.otp_code != otp_code:
        user.otp_attempts += 1
        user.save(update_fields=["otp_attempts"])
        return False

    user.otp_code = ""
    user.otp_created_at = None
    user.otp_attempts = 0
    user.save(update_fields=["otp_code", "otp_created_at", "otp_attempts"])
    return True
