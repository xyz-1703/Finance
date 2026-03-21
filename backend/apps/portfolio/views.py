from rest_framework import permissions, viewsets

from .models import Portfolio, PortfolioStock
from .serializers import PortfolioSerializer, PortfolioStockSerializer


class PortfolioViewSet(viewsets.ModelViewSet):
    serializer_class = PortfolioSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Portfolio.objects.filter(user=self.request.user).prefetch_related("holdings")

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class PortfolioStockViewSet(viewsets.ModelViewSet):
    serializer_class = PortfolioStockSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return PortfolioStock.objects.filter(portfolio__user=self.request.user).select_related("portfolio", "stock")
