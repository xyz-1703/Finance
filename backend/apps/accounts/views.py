from django.contrib.auth import get_user_model
from django.conf import settings
from rest_framework import permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from .serializers import (
    MpinMixin,
    SetMpinSerializer,
    TelegramOtpRequestSerializer,
    TelegramOtpVerifySerializer,
    UserProfileSerializer,
    VerifyMpinSerializer,
)
from .services import issue_otp, resolve_telegram_chat_id, send_telegram_message, validate_otp

User = get_user_model()


class ProfileView(APIView):
    def get(self, request):
        return Response(UserProfileSerializer(request.user).data)


class TelegramOtpRequestView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        serializer = TelegramOtpRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        telegram_username = serializer.validated_data["telegram_username"]
        if request.user.telegram_username != telegram_username and request.user.telegram_username != telegram_username.lstrip("@"):
            return Response(
                {"detail": "Telegram username does not match your profile."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            # Resolve numeric chat ID if we only have a username
            chat_id = resolve_telegram_chat_id(request.user)
            if not chat_id:
                bot_username = getattr(settings, "TELEGRAM_BOT_USERNAME", "the bot")
                return Response(
                    {"detail": f"Could not resolve Telegram ID. Please message @{bot_username} first."},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            code = issue_otp(request.user)
            send_telegram_message(chat_id, f"Your recovery OTP: {code}")
        except ValueError as exc:
            return Response({"detail": str(exc)}, status=status.HTTP_429_TOO_MANY_REQUESTS)
        except Exception as e:
            return Response({"detail": f"Failed to send Telegram message: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        return Response({"detail": "OTP sent successfully."})


class TelegramOtpVerifyView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        serializer = TelegramOtpVerifySerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        if request.user.telegram_username != serializer.validated_data["telegram_username"]:
            return Response({"detail": "Invalid telegram user."}, status=status.HTTP_400_BAD_REQUEST)

        is_valid = validate_otp(request.user, serializer.validated_data["otp_code"])
        if not is_valid:
            return Response({"detail": "Invalid or expired OTP."}, status=status.HTTP_400_BAD_REQUEST)

        return Response({"detail": "OTP verified."})


class SetMpinView(APIView, MpinMixin):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        serializer = SetMpinSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.set_mpin(request.user, serializer.validated_data["mpin"])
        return Response({"detail": "MPIN configured."})


class VerifyMpinView(APIView, MpinMixin):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        serializer = VerifyMpinSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        if not self.verify_mpin(request.user, serializer.validated_data["mpin"]):
            return Response({"detail": "Invalid MPIN."}, status=status.HTTP_400_BAD_REQUEST)

        return Response({"detail": "MPIN verified."})
