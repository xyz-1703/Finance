from django.urls import path
from rest_framework.routers import DefaultRouter

from .views import TradeExecuteView, TransactionViewSet

router = DefaultRouter()
router.register(r"transactions", TransactionViewSet, basename="transaction")

urlpatterns = [
    path("execute/", TradeExecuteView.as_view(), name="trade-execute"),
    *router.urls,
]
