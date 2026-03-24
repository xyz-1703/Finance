from django.urls import path

from .views import AdminHealthView

urlpatterns = [
    path("health/", AdminHealthView.as_view(), name="admin-health"),
]
