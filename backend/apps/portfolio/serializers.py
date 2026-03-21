from rest_framework import serializers

from .models import Portfolio, PortfolioStock


class PortfolioStockSerializer(serializers.ModelSerializer):
    stock_symbol = serializers.CharField(source="stock.symbol", read_only=True)

    class Meta:
        model = PortfolioStock
        fields = ("id", "portfolio", "stock", "stock_symbol", "quantity", "average_buy_price", "updated_at")


class PortfolioSerializer(serializers.ModelSerializer):
    holdings = PortfolioStockSerializer(many=True, read_only=True)

    class Meta:
        model = Portfolio
        fields = ("id", "user", "name", "created_at", "holdings")
        read_only_fields = ("user",)
