from django.contrib.auth import get_user_model
<<<<<<< HEAD
from django.conf import settings
from rest_framework import permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from .serializers import (
    MpinMixin,
    SetMpinSerializer,
    TelegramOtpRequestSerializer,
=======
from rest_framework import permissions, status
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.views import APIView

from .serializers import (
    LogoutSerializer,
    MpinMixin,
    PasswordOtpRequestSerializer,
    PasswordResetSerializer,
    RegisterSerializer,
    RecoveryOtpRequestSerializer,
    ResetMpinWithOtpSerializer,
    SetMpinSerializer,
    TelegramLinkCodeVerifySerializer,
>>>>>>> f676874015cfdcfa865c247090c40e9cf22a2aba
    TelegramOtpVerifySerializer,
    UserProfileSerializer,
    VerifyMpinSerializer,
)
<<<<<<< HEAD
from .services import issue_otp, resolve_telegram_chat_id, send_telegram_message, validate_otp
=======
from .services import (
    get_telegram_bot_username,
    get_user_by_telegram_username,
    issue_otp,
    issue_telegram_link_code,
    send_telegram_message,
    validate_otp,
    verify_and_link_telegram,
)
>>>>>>> f676874015cfdcfa865c247090c40e9cf22a2aba

User = get_user_model()


class ProfileView(APIView):
<<<<<<< HEAD
=======
    permission_classes = [permissions.IsAuthenticated]

>>>>>>> f676874015cfdcfa865c247090c40e9cf22a2aba
    def get(self, request):
        return Response(UserProfileSerializer(request.user).data)


<<<<<<< HEAD
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
=======
class RegisterView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user = User.objects.create_user(
            email=serializer.validated_data["email"],
            password=serializer.validated_data["password"],
            first_name=serializer.validated_data.get("first_name", ""),
            last_name=serializer.validated_data.get("last_name", ""),
        )
        refresh = RefreshToken.for_user(user)
        return Response(
            {
                "access": str(refresh.access_token),
                "refresh": str(refresh),
                "user": UserProfileSerializer(user).data,
            },
            status=status.HTTP_201_CREATED,
        )


class LogoutView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = LogoutSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        try:
            token = RefreshToken(serializer.validated_data["refresh"])
            token.blacklist()
        except Exception:
            return Response({"detail": "Invalid refresh token."}, status=status.HTTP_400_BAD_REQUEST)

        return Response({"detail": "Logged out."})


class PasswordOtpRequestView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = PasswordOtpRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user = get_user_by_telegram_username(serializer.validated_data["telegram_username"])
        if user is None or not user.telegram_chat_id:
            return Response({"detail": "Telegram account is not linked."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            code = issue_otp(user)
            send_telegram_message(user.telegram_chat_id, f"Your password reset OTP: {code}")
        except ValueError as exc:
            return Response({"detail": str(exc)}, status=status.HTTP_429_TOO_MANY_REQUESTS)

        return Response({"detail": "OTP sent successfully."})


class PasswordResetView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = PasswordResetSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user = get_user_by_telegram_username(serializer.validated_data["telegram_username"])
        if user is None:
            return Response({"detail": "Invalid telegram user."}, status=status.HTTP_400_BAD_REQUEST)

        if not validate_otp(user, serializer.validated_data["otp_code"]):
            return Response({"detail": "Invalid or expired OTP."}, status=status.HTTP_400_BAD_REQUEST)

        user.set_password(serializer.validated_data["new_password"])
        user.save(update_fields=["password"])
        return Response({"detail": "Password reset successfully."})


class TelegramLinkCodeRequestView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        code = issue_telegram_link_code(request.user)
        payload = {
            "verification_code": code,
            "detail": "Send this code to your Telegram bot from the account you want to link.",
        }
        bot_username = get_telegram_bot_username()
        if bot_username:
            payload["bot_username"] = bot_username
            payload["bot_deep_link"] = f"https://t.me/{bot_username}?start={code}"

        return Response(payload)


class TelegramLinkCodeVerifyView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        serializer = TelegramLinkCodeVerifySerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        try:
            verify_and_link_telegram(request.user, serializer.validated_data["link_code"])
        except ValueError as exc:
            return Response({"detail": str(exc)}, status=status.HTTP_400_BAD_REQUEST)

        return Response({"detail": "Telegram account linked.", "user": UserProfileSerializer(request.user).data})


class TelegramOtpRequestView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = RecoveryOtpRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user = get_user_by_telegram_username(serializer.validated_data["telegram_username"])
        if user is None or not user.telegram_chat_id:
            return Response({"detail": "Telegram account is not linked."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            code = issue_otp(user)
            send_telegram_message(user.telegram_chat_id, f"Your recovery OTP: {code}")
        except ValueError as exc:
            return Response({"detail": str(exc)}, status=status.HTTP_429_TOO_MANY_REQUESTS)
>>>>>>> f676874015cfdcfa865c247090c40e9cf22a2aba

        return Response({"detail": "OTP sent successfully."})


class TelegramOtpVerifyView(APIView):
<<<<<<< HEAD
    permission_classes = [permissions.IsAuthenticated]
=======
    permission_classes = [permissions.AllowAny]
>>>>>>> f676874015cfdcfa865c247090c40e9cf22a2aba

    def post(self, request):
        serializer = TelegramOtpVerifySerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

<<<<<<< HEAD
        if request.user.telegram_username != serializer.validated_data["telegram_username"]:
            return Response({"detail": "Invalid telegram user."}, status=status.HTTP_400_BAD_REQUEST)

        is_valid = validate_otp(request.user, serializer.validated_data["otp_code"])
=======
        user = get_user_by_telegram_username(serializer.validated_data["telegram_username"])
        if user is None:
            return Response({"detail": "Invalid telegram user."}, status=status.HTTP_400_BAD_REQUEST)

        is_valid = validate_otp(user, serializer.validated_data["otp_code"])
>>>>>>> f676874015cfdcfa865c247090c40e9cf22a2aba
        if not is_valid:
            return Response({"detail": "Invalid or expired OTP."}, status=status.HTTP_400_BAD_REQUEST)

        return Response({"detail": "OTP verified."})


<<<<<<< HEAD
=======
class ResetMpinWithOtpView(APIView, MpinMixin):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = ResetMpinWithOtpSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user = get_user_by_telegram_username(serializer.validated_data["telegram_username"])
        if user is None:
            return Response({"detail": "Invalid telegram user."}, status=status.HTTP_400_BAD_REQUEST)

        if not validate_otp(user, serializer.validated_data["otp_code"]):
            return Response({"detail": "Invalid or expired OTP."}, status=status.HTTP_400_BAD_REQUEST)

        self.set_mpin(user, serializer.validated_data["mpin"])
        return Response({"detail": "MPIN reset successfully."})


>>>>>>> f676874015cfdcfa865c247090c40e9cf22a2aba
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
