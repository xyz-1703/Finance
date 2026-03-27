from django.urls import path

from .views import (
    IndianStockDetailView, IndianStocksView, 
    MarketTradeView, StockSentimentView, RecommendationAPIView
)

urlpatterns = [
    path("stocks/", IndianStocksView.as_view(), name="indian-stocks"),
    path("stocks/<str:symbol>/", IndianStockDetailView.as_view(), name="indian-stock-detail"),
    path("stocks/<str:symbol>/sentiment/", StockSentimentView.as_view(), name="indian-stock-sentiment"),
    path("trade/", MarketTradeView.as_view(), name="indian-stock-trade"),
    path("recommendations/", RecommendationAPIView.as_view(), name="recommendations"),
]
