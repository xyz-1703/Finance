import random
import requests
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


def resolve_telegram_chat_id(user, bot_token: str | None = None) -> str | None:
    """
    Attempts to resolve a Telegram username to a numeric chat_id.
    If already numeric, returns as is.
    Otherwise, checks getUpdates for the username.
    """
    if not bot_token:
        bot_token = getattr(settings, "TELEGRAM_BOT_TOKEN", None)

    if not bot_token:
        return None

    chat_id = user.telegram_chat_id
    if not chat_id:
        chat_id = user.telegram_username

    if not chat_id:
        return None

    # If it's already a numeric ID, return it
    if str(chat_id).lstrip("-").isdigit():
        return str(chat_id)

    # It's a username, try to resolve it from updates
    username_to_find = str(chat_id).lstrip("@").lower()
    try:
        url = f"https://api.telegram.org/bot{bot_token}/getUpdates"
        response = requests.get(url, timeout=5)
        if response.status_code == 200:
            updates = response.json().get("result", [])
            for update in updates:
                message = update.get("message")
                if message and "from" in message:
                    msg_username = message["from"].get("username", "").lower()
                    if msg_username == username_to_find:
                        new_chat_id = str(message["chat"]["id"])
                        user.telegram_chat_id = new_chat_id
                        user.save(update_fields=["telegram_chat_id"])
                        return new_chat_id
    except Exception as e:
        print(f"Error resolving Telegram ID: {e}")

    return chat_id if str(chat_id).lstrip("-").isdigit() else None
