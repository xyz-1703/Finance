from django.contrib.auth import get_user_model
from rest_framework import permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken

from .serializers import (
    GoogleLoginSerializer,
    MpinMixin,
    SetMpinSerializer,
    TelegramOtpRequestSerializer,
    TelegramOtpVerifySerializer,
    UserProfileSerializer,
    VerifyMpinSerializer,
)
from .services import issue_otp, send_telegram_message, validate_otp, verify_google_id_token

User = get_user_model()


class GoogleOAuthLoginView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = GoogleLoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        token_payload = verify_google_id_token(serializer.validated_data["id_token"])
        email = token_payload.get("email")
        if not email:
            return Response({"detail": "Google account email unavailable."}, status=status.HTTP_400_BAD_REQUEST)

        user, _ = User.objects.get_or_create(
            email=email,
            defaults={
                "username": email,
                "first_name": token_payload.get("given_name", ""),
                "last_name": token_payload.get("family_name", ""),
            },
        )

        refresh = RefreshToken.for_user(user)
        return Response(
            {
                "access": str(refresh.access_token),
                "refresh": str(refresh),
                "user": UserProfileSerializer(user).data,
            }
        )


class ProfileView(APIView):
    def get(self, request):
        return Response(UserProfileSerializer(request.user).data)


class TelegramOtpRequestView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        serializer = TelegramOtpRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        telegram_username = serializer.validated_data["telegram_username"]
        if request.user.telegram_username != telegram_username or not request.user.telegram_chat_id:
            return Response(
                {"detail": "Telegram account is not linked for this user."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            code = issue_otp(request.user)
            send_telegram_message(request.user.telegram_chat_id, f"Your recovery OTP: {code}")
        except ValueError as exc:
            return Response({"detail": str(exc)}, status=status.HTTP_429_TOO_MANY_REQUESTS)

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
