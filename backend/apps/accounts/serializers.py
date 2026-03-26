from django.contrib.auth.hashers import check_password, make_password
from django.contrib.auth.password_validation import validate_password
from rest_framework import serializers

from .models import User


class TelegramLinkCodeVerifySerializer(serializers.Serializer):
    link_code = serializers.CharField(max_length=16, required=False)
    verification_code = serializers.CharField(max_length=16, required=False, write_only=True)

    def validate(self, attrs):
        code = attrs.get("link_code") or attrs.get("verification_code")
        if not code:
            raise serializers.ValidationError({"link_code": "This field is required."})

        attrs["link_code"] = code.strip().upper()
        return attrs


class RegisterSerializer(serializers.Serializer):
    username = serializers.CharField(required=False, allow_blank=True)
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)
    first_name = serializers.CharField(required=False, allow_blank=True)
    last_name = serializers.CharField(required=False, allow_blank=True)
    telegram_id = serializers.CharField(required=False, allow_blank=True, allow_null=True)

    def validate_username(self, value: str) -> str:
        if not value:
            return value
        normalized = value.strip()
        if User.objects.filter(username__iexact=normalized).exists():
            raise serializers.ValidationError("Username is already taken.")
        return normalized

    def validate_email(self, value: str) -> str:
        normalized = value.strip().lower()
        if User.objects.filter(email__iexact=normalized).exists():
            raise serializers.ValidationError("Email is already registered.")
        return normalized

    def validate_telegram_id(self, value: str) -> str:
        if not value:
            return None
        clean_val = value.lstrip('@')
        if User.objects.filter(telegram_username__iexact=clean_val).exists():
            raise serializers.ValidationError("This Telegram username is already linked to another account.")
        return clean_val

    def validate_password(self, value: str) -> str:
        validate_password(value)
        return value


class LogoutSerializer(serializers.Serializer):
    refresh = serializers.CharField()


class PasswordOtpRequestSerializer(serializers.Serializer):
    email = serializers.EmailField(required=False, allow_blank=True)
    telegram_username = serializers.CharField(max_length=255, required=False, allow_blank=True)

    def validate(self, attrs):
        if not attrs.get("email") and not attrs.get("telegram_username"):
            raise serializers.ValidationError("Either email or telegram_username is required.")
        return attrs


class PasswordResetSerializer(serializers.Serializer):
    email = serializers.EmailField(required=False, allow_blank=True)
    telegram_username = serializers.CharField(max_length=255, required=False, allow_blank=True)
    otp_code = serializers.CharField(max_length=10)
    new_password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        if not attrs.get("email") and not attrs.get("telegram_username"):
            raise serializers.ValidationError("Either email or telegram_username is required.")
        return attrs

    def validate_new_password(self, value: str) -> str:
        validate_password(value)
        return value


class RecoveryOtpRequestSerializer(serializers.Serializer):
    telegram_username = serializers.CharField(max_length=255)


class TelegramOtpVerifySerializer(serializers.Serializer):
    telegram_username = serializers.CharField(max_length=255)
    otp_code = serializers.CharField(max_length=10)


class TelegramOtpRequestSerializer(serializers.Serializer):
    telegram_username = serializers.CharField(max_length=255)


class ResetMpinWithOtpSerializer(serializers.Serializer):
    telegram_username = serializers.CharField(max_length=255)
    otp_code = serializers.CharField(max_length=10)
    mpin = serializers.RegexField(regex=r"^\d{4,6}$")


class SetMpinSerializer(serializers.Serializer):
    mpin = serializers.RegexField(regex=r"^\d{4,6}$")


class VerifyMpinSerializer(serializers.Serializer):
    mpin = serializers.RegexField(regex=r"^\d{4,6}$")


class UserProfileSerializer(serializers.ModelSerializer):
    telegram_connected = serializers.SerializerMethodField()
    has_mpin = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = (
            "id",
            "email",
            "first_name",
            "last_name",
            "telegram_username",
            "telegram_connected",
            "has_mpin",
            "is_staff",
        )

    def get_telegram_connected(self, obj: User) -> bool:
        return bool(obj.telegram_chat_id)

    def get_has_mpin(self, obj: User) -> bool:
        return bool(obj.mpin_hash)


class MpinMixin:
    @staticmethod
    def set_mpin(user: User, mpin: str) -> None:
        user.mpin_hash = make_password(mpin)
        user.save(update_fields=["mpin_hash"])

    @staticmethod
    def verify_mpin(user: User, mpin: str) -> bool:
        if not user.mpin_hash:
            return False
        return check_password(mpin, user.mpin_hash)
