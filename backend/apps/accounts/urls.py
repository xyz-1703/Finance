from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from .views import (
    ProfileView,
    SetMpinView,
    TelegramOtpRequestView,
    TelegramOtpVerifyView,
    VerifyMpinView,
)

urlpatterns = [
    path("token/", TokenObtainPairView.as_view(), name="token-obtain-pair"),
    path("token/refresh/", TokenRefreshView.as_view(), name="token-refresh"),
    path("profile/", ProfileView.as_view(), name="profile"),
    path("otp/request/", TelegramOtpRequestView.as_view(), name="otp-request"),
    path("otp/verify/", TelegramOtpVerifyView.as_view(), name="otp-verify"),
    path("mpin/set/", SetMpinView.as_view(), name="mpin-set"),
    path("mpin/verify/", VerifyMpinView.as_view(), name="mpin-verify"),
]
