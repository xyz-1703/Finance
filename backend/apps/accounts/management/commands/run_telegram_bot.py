import time
import requests
from django.core.management.base import BaseCommand
from django.conf import settings
from django.contrib.auth import get_user_model

User = get_user_model()

class Command(BaseCommand):
    help = "Runs a simple long-polling Telegram bot to handle /start and associate chat IDs."

    def handle(self, *args, **options):
        token = getattr(settings, "TELEGRAM_BOT_TOKEN", None)
        if not token:
            self.stderr.write("TELEGRAM_BOT_TOKEN is not configured in settings.")
            return

        self.stdout.write(self.style.SUCCESS(f"Starting Telegram Bot poller..."))
        offset = 0
        
        while True:
            try:
                url = f"https://api.telegram.org/bot{token}/getUpdates"
                params = {"offset": offset, "timeout": 30}
                response = requests.get(url, params=params, timeout=35)
                
                if response.status_code != 200:
                    self.stderr.write(f"Error from Telegram API: {response.text}")
                    time.sleep(5)
                    continue

                updates = response.json().get("result", [])
                for update in updates:
                    offset = update["update_id"] + 1
                    message = update.get("message")
                    if not message or "text" not in message:
                        continue

                    chat_id = message["chat"]["id"]
                    text = message.get("text", "")
                    from_user = message.get("from", {})
                    tg_username = from_user.get("username")

                    if text.startswith("/start"):
                        self.process_start(chat_id, tg_username, text)

            except Exception as e:
                self.stderr.write(f"Poller error: {e}")
                time.sleep(5)

    def process_start(self, chat_id, tg_username, text):
        if not tg_username:
            self.send_message(chat_id, "Hello! Please set a Telegram username in your profile and retry.")
            return

        # Try to find the user in our database
        user = User.objects.filter(telegram_username__iexact=tg_username).first()
        if not user:
            # Try without @ if it was provided with @
            user = User.objects.filter(telegram_username__iexact=tg_username.lstrip("@")).first()

        if user:
            user.telegram_chat_id = str(chat_id)
            user.save(update_fields=["telegram_chat_id"])
            self.stdout.write(self.style.SUCCESS(f"Associated Chat ID {chat_id} with user {user.username} (@{tg_username})"))
            
            msg = (
                f"✅ *Connection Successful!*\n\n"
                f"Hello {user.username}, your Telegram account is now linked to your Stock Portfolio profile.\n\n"
                f"You will receive OTP codes here for security actions like password resets."
            )
            self.send_message(chat_id, msg, parse_mode="Markdown")
        else:
            self.stdout.write(self.style.WARNING(f"Received /start from @{tg_username} but no match found in database."))
            self.send_message(
                chat_id, 
                f"Hello @{tg_username}! I couldn't find your username in our system.\n\n"
                f"Please make sure you entered '@{tg_username}' (without quotes) in the registration form."
            )

    def send_message(self, chat_id, text, parse_mode=None):
        token = settings.TELEGRAM_BOT_TOKEN
        url = f"https://api.telegram.org/bot{token}/sendMessage"
        payload = {"chat_id": chat_id, "text": text}
        if parse_mode:
            payload["parse_mode"] = parse_mode
        try:
            requests.post(url, json=payload, timeout=10)
        except Exception as e:
            self.stderr.write(f"Error sending message to {chat_id}: {e}")
