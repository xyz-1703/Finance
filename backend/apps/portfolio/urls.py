from rest_framework.routers import DefaultRouter

from .views import PortfolioStockViewSet, PortfolioViewSet

router = DefaultRouter()
router.register(r"portfolios", PortfolioViewSet, basename="portfolio")
router.register(r"holdings", PortfolioStockViewSet, basename="holding")

urlpatterns = router.urls
