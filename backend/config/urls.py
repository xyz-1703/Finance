from django.contrib import admin
from django.urls import include, path
from rest_framework.routers import DefaultRouter

router = DefaultRouter()

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/auth/", include("apps.accounts.urls")),
    path("api/stocks/", include("apps.stocks.urls")),
    path("api/portfolio/", include("apps.portfolio.urls")),
    path("api/trading/", include("apps.trading.urls")),
    path("api/ml/", include("apps.mlops.urls")),
    path("api/admin/", include("apps.admin_api.urls")),
    path("api/insights/", include("apps.insights.urls")),
<<<<<<< HEAD
    path("api/", include("apps.users.urls")),
=======
>>>>>>> f676874015cfdcfa865c247090c40e9cf22a2aba
    path("api/", include(router.urls)),
]
