from rest_framework.routers import DefaultRouter

from .views import FundamentalViewSet, PriceViewSet, StockViewSet

router = DefaultRouter()
router.register(r"stocks", StockViewSet, basename="stock")
router.register(r"prices", PriceViewSet, basename="price")
router.register(r"fundamentals", FundamentalViewSet, basename="fundamental")

urlpatterns = router.urls
