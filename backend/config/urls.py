from django.contrib import admin
from django.urls import include, path
from apps.mlops.forecasting_views import forecast_view, prediction_view

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/auth/", include("apps.accounts.urls")),
    path("api/stocks/", include("apps.stocks.urls")),
    path("api/portfolio/", include("apps.portfolio.urls")),
    path("api/trading/", include("apps.trading.urls")),
    path("api/mlops/", include("apps.mlops.urls")),
    path("api/insights/", include("apps.insights.urls")),
    path("api/admin/", include("apps.admin_api.urls")),
    path("api/forecast/", forecast_view, name="api-forecast"),
    path("api/prediction/", prediction_view, name="api-prediction"),
    path("api/chat/", include("apps.chatbot.urls")),
]
