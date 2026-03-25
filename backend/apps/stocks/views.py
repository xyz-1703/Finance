from rest_framework import viewsets, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import StockMaster, StockPrice
from .serializers import StockMasterSerializer, StockPriceSerializer


class StockMasterViewSet(viewsets.ModelViewSet):
    queryset = StockMaster.objects.all()
    serializer_class = StockMasterSerializer
    permission_classes = [permissions.IsAuthenticated]
    filterset_fields = ["symbol", "market", "sector"]
    search_fields = ["symbol", "name", "sector"]

    @action(detail=False, methods=['get'])
    def by_sector(self, request):
        raw_sectors = StockMaster.objects.exclude(sector__isnull=True).exclude(sector='').values_list('sector', flat=True).distinct()
        data = {}
        for s in raw_sectors:
            clean_s = s.strip()
            if not clean_s: continue
            # Use icontains to be safer against whitespace/case
            stocks = StockMaster.objects.filter(sector__icontains=clean_s)[:50]
            data[clean_s] = StockMasterSerializer(stocks, many=True).data
        return Response(data)


class StockPriceViewSet(viewsets.ModelViewSet):
    queryset = StockPrice.objects.select_related("stock").all()
    serializer_class = StockPriceSerializer
    permission_classes = [permissions.IsAuthenticated]
    filterset_fields = ["stock", "symbol"]
    ordering_fields = ["timestamp", "close"]
