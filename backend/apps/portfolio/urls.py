from rest_framework.routers import DefaultRouter
from .views import PortfolioViewSet, HoldingViewSet, TransactionViewSet

router = DefaultRouter()
router.register(r"portfolios", PortfolioViewSet, basename="portfolio")
router.register(r"holdings", HoldingViewSet, basename="holding")
router.register(r"transactions", TransactionViewSet, basename="transaction")

urlpatterns = router.urls
