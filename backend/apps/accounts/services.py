import random
import re
import string
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


def issue_telegram_link_code(user: User) -> str:
    code = "".join(random.choices(string.ascii_uppercase + string.digits, k=8))
    user.telegram_link_code = code
    user.telegram_link_code_created_at = timezone.now()
    user.save(update_fields=["telegram_link_code", "telegram_link_code_created_at"])
    return code


def get_telegram_bot_username() -> str | None:
    if not settings.TELEGRAM_BOT_TOKEN:
        return None

    url = f"https://api.telegram.org/bot{settings.TELEGRAM_BOT_TOKEN}/getMe"
    try:
        response = requests.get(url, timeout=10)
        response.raise_for_status()
        payload = response.json()
    except requests.RequestException:
        return None

    if payload.get("ok") is False:
        return None

    username = str(payload.get("result", {}).get("username", "")).strip()
    return username or None


def resolve_telegram_link_from_bot(link_code: str) -> tuple[str, str] | None:
    if not settings.TELEGRAM_BOT_TOKEN:
        raise ValueError("Telegram bot token is not configured")

    normalized_code = link_code.strip().upper()
    url = f"https://api.telegram.org/bot{settings.TELEGRAM_BOT_TOKEN}/getUpdates"
    response = requests.get(url, params={"limit": 200, "timeout": 0}, timeout=10)
    response.raise_for_status()
    payload = response.json()
    if payload.get("ok") is False:
        description = str(payload.get("description", "Telegram API request failed")).strip()
        raise ValueError(description or "Telegram API request failed")
    updates = payload.get("result", [])

    for update in reversed(updates):
        message = (
            update.get("message")
            or update.get("edited_message")
            or update.get("channel_post")
            or update.get("edited_channel_post")
            or {}
        )
        text = str(message.get("text", "")).strip()
        normalized_text = text.upper().strip()
        tokens = set(re.findall(r"[A-Z0-9]{6,16}", normalized_text))
        if normalized_text != normalized_code and normalized_code not in tokens:
            continue
        chat = message.get("chat", {})
        from_user = message.get("from", {})
        chat_id = str(chat.get("id", "")).strip()
        username = str(from_user.get("username", "")).strip()
        if chat_id:
            return username, chat_id

    return None


def verify_and_link_telegram(user: User, link_code: str) -> User:
    if not user.telegram_link_code or not user.telegram_link_code_created_at:
        raise ValueError("No active Telegram linking request found")
    if link_code != user.telegram_link_code:
        raise ValueError("Invalid verification code")
    if timezone.now() - user.telegram_link_code_created_at > timedelta(minutes=getattr(settings, "TELEGRAM_LINK_CODE_EXPIRY_MINUTES", 10)):
        raise ValueError("Telegram verification code has expired")

    resolved = resolve_telegram_link_from_bot(link_code)
    if resolved is None:
        raise ValueError(
            "Verification code not found in Telegram bot messages yet. Open a direct chat with your bot, press Start, send only the code, then retry."
        )

    username, chat_id = resolved
    user.telegram_username = username
    user.telegram_chat_id = chat_id
    user.telegram_link_code = ""
    user.telegram_link_code_created_at = None
    user.save(
        update_fields=[
            "telegram_username",
            "telegram_chat_id",
            "telegram_link_code",
            "telegram_link_code_created_at",
        ]
    )
    return user


def get_user_by_telegram_username(telegram_username: str) -> User | None:
    normalized = telegram_username.lstrip("@").strip()
    if not normalized:
        return None
    return User.objects.filter(telegram_username__iexact=normalized).first()


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
