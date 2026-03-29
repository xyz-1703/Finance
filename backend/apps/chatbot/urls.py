from django.urls import path
from .views import GeneralChatbotView, PersonalizedChatbotView

app_name = "chatbot"

urlpatterns = [
    path("general/", GeneralChatbotView.as_view(), name="general"),
    path("personalized/", PersonalizedChatbotView.as_view(), name="personalized"),
]
