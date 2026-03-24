from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from .views import (
<<<<<<< HEAD
    ProfileView,
    SetMpinView,
=======
    LogoutView,
    PasswordOtpRequestView,
    PasswordResetView,
    ProfileView,
    RegisterView,
    ResetMpinWithOtpView,
    SetMpinView,
    TelegramLinkCodeRequestView,
    TelegramLinkCodeVerifyView,
>>>>>>> f676874015cfdcfa865c247090c40e9cf22a2aba
    TelegramOtpRequestView,
    TelegramOtpVerifyView,
    VerifyMpinView,
)

urlpatterns = [
<<<<<<< HEAD
    path("token/", TokenObtainPairView.as_view(), name="token-obtain-pair"),
    path("token/refresh/", TokenRefreshView.as_view(), name="token-refresh"),
    path("profile/", ProfileView.as_view(), name="profile"),
    path("otp/request/", TelegramOtpRequestView.as_view(), name="otp-request"),
    path("otp/verify/", TelegramOtpVerifyView.as_view(), name="otp-verify"),
    path("mpin/set/", SetMpinView.as_view(), name="mpin-set"),
=======
    path("register/", RegisterView.as_view(), name="register"),
    path("token/", TokenObtainPairView.as_view(), name="token-obtain-pair"),
    path("token/refresh/", TokenRefreshView.as_view(), name="token-refresh"),
    path("logout/", LogoutView.as_view(), name="logout"),
    path("password/otp/request/", PasswordOtpRequestView.as_view(), name="password-otp-request"),
    path("password/reset/", PasswordResetView.as_view(), name="password-reset"),
    path("profile/", ProfileView.as_view(), name="profile"),
    path("telegram/link/code/", TelegramLinkCodeRequestView.as_view(), name="telegram-link-code"),
    path("telegram/link/verify/", TelegramLinkCodeVerifyView.as_view(), name="telegram-link-verify"),
    path("otp/request/", TelegramOtpRequestView.as_view(), name="otp-request"),
    path("otp/verify/", TelegramOtpVerifyView.as_view(), name="otp-verify"),
    path("mpin/set/", SetMpinView.as_view(), name="mpin-set"),
    path("mpin/reset/", ResetMpinWithOtpView.as_view(), name="mpin-reset"),
>>>>>>> f676874015cfdcfa865c247090c40e9cf22a2aba
    path("mpin/verify/", VerifyMpinView.as_view(), name="mpin-verify"),
]
