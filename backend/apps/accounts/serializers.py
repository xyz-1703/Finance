from django.contrib.auth.hashers import check_password, make_password
from rest_framework import serializers

from .models import User

class TelegramOtpRequestSerializer(serializers.Serializer):
    telegram_username = serializers.CharField(max_length=255)


class TelegramOtpVerifySerializer(serializers.Serializer):
    telegram_username = serializers.CharField(max_length=255)
    otp_code = serializers.CharField(max_length=10)


class SetMpinSerializer(serializers.Serializer):
    mpin = serializers.RegexField(regex=r"^\d{4,6}$")


class VerifyMpinSerializer(serializers.Serializer):
    mpin = serializers.RegexField(regex=r"^\d{4,6}$")


class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = (
            "id",
            "email",
            "first_name",
            "last_name",
            "telegram_username",
            "is_staff",
        )


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
