from rest_framework import permissions, viewsets
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
