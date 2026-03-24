from django.contrib.auth.hashers import check_password, make_password
<<<<<<< HEAD
=======
from django.contrib.auth.password_validation import validate_password
>>>>>>> f676874015cfdcfa865c247090c40e9cf22a2aba
from rest_framework import serializers

from .models import User

<<<<<<< HEAD
class TelegramOtpRequestSerializer(serializers.Serializer):
=======

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
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)
    first_name = serializers.CharField(required=False, allow_blank=True)
    last_name = serializers.CharField(required=False, allow_blank=True)

    def validate_email(self, value: str) -> str:
        normalized = value.strip().lower()
        if User.objects.filter(email__iexact=normalized).exists():
            raise serializers.ValidationError("Email is already registered.")
        return normalized

    def validate_password(self, value: str) -> str:
        validate_password(value)
        return value


class LogoutSerializer(serializers.Serializer):
    refresh = serializers.CharField()


class PasswordOtpRequestSerializer(serializers.Serializer):
    telegram_username = serializers.CharField(max_length=255)


class PasswordResetSerializer(serializers.Serializer):
    telegram_username = serializers.CharField(max_length=255)
    otp_code = serializers.CharField(max_length=10)
    new_password = serializers.CharField(write_only=True)

    def validate_new_password(self, value: str) -> str:
        validate_password(value)
        return value


class RecoveryOtpRequestSerializer(serializers.Serializer):
>>>>>>> f676874015cfdcfa865c247090c40e9cf22a2aba
    telegram_username = serializers.CharField(max_length=255)


class TelegramOtpVerifySerializer(serializers.Serializer):
    telegram_username = serializers.CharField(max_length=255)
    otp_code = serializers.CharField(max_length=10)


<<<<<<< HEAD
=======
class ResetMpinWithOtpSerializer(serializers.Serializer):
    telegram_username = serializers.CharField(max_length=255)
    otp_code = serializers.CharField(max_length=10)
    mpin = serializers.RegexField(regex=r"^\d{4,6}$")


>>>>>>> f676874015cfdcfa865c247090c40e9cf22a2aba
class SetMpinSerializer(serializers.Serializer):
    mpin = serializers.RegexField(regex=r"^\d{4,6}$")


class VerifyMpinSerializer(serializers.Serializer):
    mpin = serializers.RegexField(regex=r"^\d{4,6}$")


class UserProfileSerializer(serializers.ModelSerializer):
<<<<<<< HEAD
=======
    telegram_connected = serializers.SerializerMethodField()
    has_mpin = serializers.SerializerMethodField()

>>>>>>> f676874015cfdcfa865c247090c40e9cf22a2aba
    class Meta:
        model = User
        fields = (
            "id",
            "email",
            "first_name",
            "last_name",
            "telegram_username",
<<<<<<< HEAD
            "is_staff",
        )

=======
            "telegram_connected",
            "has_mpin",
            "is_staff",
        )

    def get_telegram_connected(self, obj: User) -> bool:
        return bool(obj.telegram_chat_id)

    def get_has_mpin(self, obj: User) -> bool:
        return bool(obj.mpin_hash)

>>>>>>> f676874015cfdcfa865c247090c40e9cf22a2aba

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
