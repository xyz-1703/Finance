import random
import requests
from django.conf import settings
from django.core.mail import send_mail
from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from apps.otp.models import OTP
from .serializers import (
    RegisterSerializer, ForgotPasswordSerializer, 
    VerifyOtpSerializer, ResetPasswordSerializer
)
from apps.accounts.services import resolve_telegram_chat_id

User = get_user_model()

from django.utils import timezone
from datetime import timedelta

from django.db.models import Q

def get_user_from_identifier(data):
    email = data.get('email')
    telegram_id = data.get('telegram_id')
    user = None
    if email:
        user = User.objects.filter(email=email).first()
    if not user and telegram_id:
        # Clean the telegram_id by removing '@' if present
        clean_tg_id = telegram_id.lstrip('@')
        # Also search with '@' prefix to handle legacy users registered before the @ was stripped
        at_tg_id = '@' + clean_tg_id
        user = User.objects.filter(
            Q(telegram_chat_id=clean_tg_id) | 
            Q(telegram_chat_id=at_tg_id) |
            Q(telegram_username=clean_tg_id) |
            Q(telegram_username=at_tg_id)
        ).first()
    return user

    return user

class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "User registered successfully"}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ForgotPasswordView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = ForgotPasswordSerializer(data=request.data)
        if serializer.is_valid():
            user = get_user_from_identifier(serializer.validated_data)
            if not user:
                return Response({"error": "User with this email or Telegram ID does not exist"}, status=status.HTTP_404_NOT_FOUND)
            
            email = getattr(user, 'email', '')
            
            # Generate OTP
            code = str(random.randint(100000, 999999))
            OTP.objects.create(user=user, code=code)
            
            # LOCAL DEVELOPMENT LOG
            print(f"\n{'='*50}\n 🔐 LOCAL DEVELOPMENT OTP FOR {email}: {code} \n{'='*50}\n")
            
            # Send Email
            if email:
                try:
                    send_mail(
                        "Password Reset OTP",
                        f"Your OTP for password reset is: {code}",
                        getattr(settings, 'EMAIL_HOST_USER', 'noreply@stockportfolio.com'),
                        [email],
                        fail_silently=True,
                    )
                except Exception as e:
                    pass
                
            # Send Telegram Message
            bot_token = getattr(settings, "TELEGRAM_BOT_TOKEN", None)
            if (getattr(user, "telegram_chat_id", None) or getattr(user, "telegram_username", None)) and bot_token:
                real_chat_id = resolve_telegram_chat_id(user, bot_token)
                if real_chat_id:
                    try:
                        telegram_url = f"https://api.telegram.org/bot{bot_token}/sendMessage"
                        response = requests.post(
                            telegram_url,
                            json={
                                "chat_id": real_chat_id,
                                "text": f"Your stock portfolio reset OTP is: {code}",
                            },
                            timeout=5,
                        )
                        if response.status_code != 200:
                            print(f"[Telegram Box Error] {response.text}")
                    except Exception as e:
                        print(f"Failed to send Telegram message: {e}")
                else:
                    bot_username = getattr(settings, "TELEGRAM_BOT_USERNAME", "the bot")
                    print(
                        f"Could not resolve Telegram username. Did the user message @{bot_username} yet?"
                    )
                    
            return Response({"message": "OTP sent successfully to email and telegram"}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class VerifyOtpView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = VerifyOtpSerializer(data=request.data)
        if serializer.is_valid():
            code = serializer.validated_data['code']
            user = get_user_from_identifier(serializer.validated_data)
            
            print(f"--- OTP Verification Debug ---")
            print(f"Payload: {request.data}")
            print(f"User Found: {user.email if user else 'None'}")

            if not user:
                return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)
                
            # DEBUG: REMOVE EXPIRY FOR NOW TO TEST MATCHING
            otp = OTP.objects.filter(
                user=user, 
                code=code, 
                is_used=False
            ).order_by('-created_at').first()
            
            if not otp:
                # Fallback: check if ANY otp exists for this user/code combo (even used ones) for debug
                any_otp = OTP.objects.filter(user=user, code=code).first()
                print(f"OTP Match Found: No (Any OTP exists? {'Yes' if any_otp else 'No'})")
                return Response({"error": "Invalid or expired OTP"}, status=status.HTTP_400_BAD_REQUEST)
                
            print(f"OTP Match Found: Yes (ID: {otp.id})")
            return Response({"message": "OTP verified successfully"}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ResetPasswordView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = ResetPasswordSerializer(data=request.data)
        if serializer.is_valid():
            code = serializer.validated_data['code']
            new_password = serializer.validated_data['new_password']
            
            user = get_user_from_identifier(serializer.validated_data)
            if not user:
                return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)
                
            # DEBUG: REMOVE EXPIRY FOR NOW TO TEST MATCHING
            otp = OTP.objects.filter(
                user=user, 
                code=code, 
                is_used=False
            ).order_by('-created_at').first()
            
            if not otp:
                return Response({"error": "Invalid or unused OTP"}, status=status.HTTP_400_BAD_REQUEST)
                
            otp.is_used = True
            otp.save()
            
            user.set_password(new_password)
            user.save()
            return Response({"message": "Password reset successfully"}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
