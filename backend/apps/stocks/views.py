from rest_framework import permissions, viewsets

from .models import Fundamental, Price, Stock
from .serializers import FundamentalSerializer, PriceSerializer, StockSerializer


class StockViewSet(viewsets.ModelViewSet):
    queryset = Stock.objects.all()
    serializer_class = StockSerializer
    permission_classes = [permissions.IsAuthenticated]
    filterset_fields = ["symbol", "sector"]
    search_fields = ["symbol", "name", "sector"]


class PriceViewSet(viewsets.ModelViewSet):
    queryset = Price.objects.select_related("stock").all()
    serializer_class = PriceSerializer
    permission_classes = [permissions.IsAuthenticated]
    filterset_fields = ["stock", "timestamp"]
    ordering_fields = ["timestamp", "close", "volume"]


class FundamentalViewSet(viewsets.ModelViewSet):
    queryset = Fundamental.objects.select_related("stock").all()
    serializer_class = FundamentalSerializer
    permission_classes = [permissions.IsAuthenticated]
    filterset_fields = ["stock"]
