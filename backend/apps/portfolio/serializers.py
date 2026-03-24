from rest_framework import serializers

from apps.stocks.models import Stock

from .models import Portfolio, PortfolioStock


class PortfolioStockSerializer(serializers.ModelSerializer):
    stock_symbol = serializers.CharField(source="stock.symbol", read_only=True)
    stock_name = serializers.CharField(source="stock.name", read_only=True)
    stock_symbol_input = serializers.CharField(write_only=True, required=False)
    stock_name_input = serializers.CharField(write_only=True, required=False, allow_blank=True)
    stock_sector_input = serializers.CharField(write_only=True, required=False, allow_blank=True)

    class Meta:
        model = PortfolioStock
        fields = (
            "id",
            "portfolio",
            "stock",
            "stock_symbol",
            "stock_name",
            "stock_symbol_input",
            "stock_name_input",
            "stock_sector_input",
            "quantity",
            "average_buy_price",
            "updated_at",
        )
        extra_kwargs = {
            "stock": {"required": False},
        }
        validators = []

    def validate(self, attrs):
        stock = attrs.get("stock")
        symbol = attrs.get("stock_symbol_input", "").strip().upper()
        portfolio = attrs.get("portfolio")

        if stock is None and not symbol:
            raise serializers.ValidationError({"stock_symbol_input": "Stock symbol is required."})

        resolved_symbol = stock.symbol if stock is not None else symbol
        if portfolio and PortfolioStock.objects.filter(portfolio=portfolio, stock__symbol=resolved_symbol).exists():
            raise serializers.ValidationError({"stock_symbol_input": "This stock is already in the selected portfolio."})

        return attrs

    def create(self, validated_data):
        stock = validated_data.get("stock")
        if stock is None:
            symbol = validated_data.pop("stock_symbol_input", "").strip().upper()
            name = validated_data.pop("stock_name_input", "").strip() or symbol
            sector = validated_data.pop("stock_sector_input", "").strip() or "Unknown"
            if not symbol:
                raise serializers.ValidationError({"stock_symbol_input": "Stock symbol is required."})
            stock, _ = Stock.objects.get_or_create(
                symbol=symbol,
                defaults={"name": name, "sector": sector},
            )
            validated_data["stock"] = stock
        return super().create(validated_data)


class PortfolioSerializer(serializers.ModelSerializer):
    holdings = PortfolioStockSerializer(many=True, read_only=True)

    class Meta:
        model = Portfolio
        fields = ("id", "user", "name", "created_at", "holdings")
        read_only_fields = ("user",)
