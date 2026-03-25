from django.contrib.auth import get_user_model
from django.conf import settings
from django.core.mail import send_mail
from rest_framework import permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
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
    TelegramOtpRequestSerializer,
    TelegramOtpVerifySerializer,
    UserProfileSerializer,
    VerifyMpinSerializer,
)
from .services import (
    get_telegram_bot_username,
    get_user_by_telegram_username,
    issue_otp,
    issue_telegram_link_code,
    resolve_telegram_chat_id,
    send_telegram_message,
    validate_otp,
    verify_and_link_telegram,
)

User = get_user_model()


class ProfileView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        return Response(UserProfileSerializer(request.user).data)


class RegisterView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        email = serializer.validated_data["email"]
        username = serializer.validated_data.get("username") or email
        telegram_id = serializer.validated_data.get("telegram_id")

        user = User.objects.create_user(
            email=email,
            username=username,
            password=serializer.validated_data["password"],
            first_name=serializer.validated_data.get("first_name", ""),
            last_name=serializer.validated_data.get("last_name", ""),
            telegram_username=telegram_id,
            telegram_chat_id=telegram_id, # Assuming chat_id = username initially if not resolved
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

        email = serializer.validated_data.get("email")
        tg_username = serializer.validated_data.get("telegram_username")
        
        user = None
        if email:
            user = User.objects.filter(email__iexact=email).first()
        if not user and tg_username:
            user = get_user_by_telegram_username(tg_username)
            if user and not user.telegram_chat_id:
                resolve_telegram_chat_id(user)

        if user is None:
            return Response({"detail": "User not found."}, status=status.HTTP_404_NOT_FOUND)

        try:
            code = issue_otp(user)
            # Send via Email if available
            if user.email:
                send_mail(
                    "Password Reset OTP",
                    f"Your stock portfolio reset OTP is: {code}",
                    getattr(settings, 'EMAIL_HOST_USER', 'noreply@stockportfolio.com'),
                    [user.email],
                    fail_silently=True,
                )
            
            # Send via Telegram if available
            if user.telegram_chat_id:
                send_telegram_message(user.telegram_chat_id, f"Your password reset OTP: {code}")
            
            # LOCAL DEVELOPMENT LOG
            print(f"\n🔐 PASSWORD RESET OTP FOR {user.email}: {code} \n")
            
        except ValueError as exc:
            return Response({"detail": str(exc)}, status=status.HTTP_429_TOO_MANY_REQUESTS)

        return Response({"detail": "OTP sent successfully."})


class PasswordResetView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = PasswordResetSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        email = serializer.validated_data.get("email")
        tg_username = serializer.validated_data.get("telegram_username")
        
        user = None
        if email:
            user = User.objects.filter(email__iexact=email).first()
        if not user and tg_username:
            user = get_user_by_telegram_username(tg_username)

        if user is None:
            return Response({"detail": "Invalid user."}, status=status.HTTP_400_BAD_REQUEST)

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
        if user is None:
            # Fallback for authenticated user
            if request.user.is_authenticated and (request.user.telegram_username == serializer.validated_data["telegram_username"].lstrip("@")):
                 user = request.user
            
        if user is None or not user.telegram_chat_id:
            if user: resolve_telegram_chat_id(user)
            if user is None or not user.telegram_chat_id:
                return Response({"detail": "Telegram account is not linked."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            code = issue_otp(user)
            send_telegram_message(user.telegram_chat_id, f"Your recovery OTP: {code}")
        except ValueError as exc:
            return Response({"detail": str(exc)}, status=status.HTTP_429_TOO_MANY_REQUESTS)

        return Response({"detail": "OTP sent successfully."})


class TelegramOtpVerifyView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = TelegramOtpVerifySerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user = get_user_by_telegram_username(serializer.validated_data["telegram_username"])
        if user is None:
             if request.user.is_authenticated and (request.user.telegram_username == serializer.validated_data["telegram_username"].lstrip("@")):
                 user = request.user

        if user is None:
            return Response({"detail": "Invalid telegram user."}, status=status.HTTP_400_BAD_REQUEST)

        is_valid = validate_otp(user, serializer.validated_data["otp_code"])
        if not is_valid:
            return Response({"detail": "Invalid or expired OTP."}, status=status.HTTP_400_BAD_REQUEST)

        return Response({"detail": "OTP verified."})


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
