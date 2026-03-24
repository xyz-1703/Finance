from rest_framework import permissions, viewsets
<<<<<<< HEAD
from .models import StockMaster, StockPrice
from .serializers import StockMasterSerializer, StockPriceSerializer


class StockMasterViewSet(viewsets.ModelViewSet):
    queryset = StockMaster.objects.all()
    serializer_class = StockMasterSerializer
    permission_classes = [permissions.IsAuthenticated]
    filterset_fields = ["symbol", "market"]
    search_fields = ["symbol", "name"]


class StockPriceViewSet(viewsets.ModelViewSet):
    queryset = StockPrice.objects.select_related("stock").all()
    serializer_class = StockPriceSerializer
    permission_classes = [permissions.IsAuthenticated]
    filterset_fields = ["stock", "symbol"]
    ordering_fields = ["updated_at", "price"]
=======

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
>>>>>>> f676874015cfdcfa865c247090c40e9cf22a2aba
