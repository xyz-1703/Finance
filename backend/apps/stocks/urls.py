from rest_framework.routers import DefaultRouter
from .views import StockMasterViewSet, StockPriceViewSet

router = DefaultRouter()
router.register(r"stocks", StockMasterViewSet, basename="stock")
router.register(r"prices", StockPriceViewSet, basename="price")

urlpatterns = router.urls
