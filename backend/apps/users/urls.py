from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView
from .views import RegisterView, ForgotPasswordView, VerifyOtpView, ResetPasswordView

urlpatterns = [
    path('register', RegisterView.as_view(), name='register'),
    path('login', TokenObtainPairView.as_view(), name='login'),
    path('forgot-password', ForgotPasswordView.as_view(), name='forgot-password'),
    path('verify-otp', VerifyOtpView.as_view(), name='verify-otp'),
    path('reset-password', ResetPasswordView.as_view(), name='reset-password'),
]
