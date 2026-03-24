from rest_framework.routers import DefaultRouter
<<<<<<< HEAD
from .views import StockMasterViewSet, StockPriceViewSet

router = DefaultRouter()
router.register(r"stocks", StockMasterViewSet, basename="stock")
router.register(r"prices", StockPriceViewSet, basename="price")
=======

from .views import FundamentalViewSet, PriceViewSet, StockViewSet

router = DefaultRouter()
router.register(r"stocks", StockViewSet, basename="stock")
router.register(r"prices", PriceViewSet, basename="price")
router.register(r"fundamentals", FundamentalViewSet, basename="fundamental")
>>>>>>> f676874015cfdcfa865c247090c40e9cf22a2aba

urlpatterns = router.urls
