from rest_framework.routers import DefaultRouter
<<<<<<< HEAD
from .views import PortfolioViewSet, HoldingViewSet, TransactionViewSet

router = DefaultRouter()
router.register(r"portfolios", PortfolioViewSet, basename="portfolio")
router.register(r"holdings", HoldingViewSet, basename="holding")
router.register(r"transactions", TransactionViewSet, basename="transaction")
=======

from .views import PortfolioStockViewSet, PortfolioViewSet

router = DefaultRouter()
router.register(r"portfolios", PortfolioViewSet, basename="portfolio")
router.register(r"holdings", PortfolioStockViewSet, basename="holding")
>>>>>>> f676874015cfdcfa865c247090c40e9cf22a2aba

urlpatterns = router.urls
