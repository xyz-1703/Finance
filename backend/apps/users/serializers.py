from rest_framework import serializers
from django.contrib.auth import get_user_model

User = get_user_model()

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    telegram_id = serializers.CharField(write_only=True, required=False, allow_blank=True, allow_null=True)

    class Meta:
        model = User
        fields = ["username", "email", "password", "telegram_id"]

    def create(self, validated_data):
        telegram_id = validated_data.pop("telegram_id", "")
        username = validated_data.pop("username", None)
        
        # Strip leading '@' so lookups always work with the clean username
        clean_tg = telegram_id.lstrip('@') if telegram_id else ""
        
        user = User.objects.create_user(
            email=validated_data["email"],
            password=validated_data["password"],
            telegram_chat_id=clean_tg,
            telegram_username=clean_tg,
        )
        
        if username and username != user.email:
            user.username = username
            user.save()
            
        return user

    def validate_telegram_id(self, value):
        if not value:
            return value
        clean_val = value.lstrip('@')
        if User.objects.filter(telegram_username__iexact=clean_val).exists():
            raise serializers.ValidationError("This Telegram username is already linked to another account.")
        return value

class ForgotPasswordSerializer(serializers.Serializer):
    email = serializers.EmailField(required=False, allow_blank=True)
    telegram_id = serializers.CharField(required=False, allow_blank=True)

class VerifyOtpSerializer(serializers.Serializer):
    email = serializers.EmailField(required=False, allow_blank=True)
    telegram_id = serializers.CharField(required=False, allow_blank=True)
    code = serializers.CharField(max_length=6)

class ResetPasswordSerializer(serializers.Serializer):
    email = serializers.EmailField(required=False, allow_blank=True)
    telegram_id = serializers.CharField(required=False, allow_blank=True)
    code = serializers.CharField(max_length=6)
    new_password = serializers.CharField(write_only=True)
