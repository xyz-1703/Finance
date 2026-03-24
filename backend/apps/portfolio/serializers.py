from rest_framework import serializers
<<<<<<< HEAD
from .models import Portfolio, Holding, Transaction
from apps.stocks.models import StockPrice

class TransactionSerializer(serializers.ModelSerializer):
    symbol_name = serializers.CharField(source='symbol.name', read_only=True)
    symbol_ticker = serializers.CharField(source='symbol.symbol', read_only=True)

    class Meta:
        model = Transaction
        fields = ("id", "portfolio", "symbol", "symbol_name", "symbol_ticker", "action", "quantity", "price", "time")

class HoldingSerializer(serializers.ModelSerializer):
    symbol = serializers.CharField(source='stock.symbol', read_only=True)
    name = serializers.CharField(source='stock.name', read_only=True)
    current_price = serializers.SerializerMethodField()
    total_value = serializers.SerializerMethodField()
    profit_loss = serializers.SerializerMethodField()

    class Meta:
        model = Holding
        fields = ("id", "symbol", "name", "quantity", "current_price", "total_value", "profit_loss")

    def get_latest_price_obj(self, obj):
        return StockPrice.objects.filter(stock=obj.stock).first()

    def get_current_price(self, obj):
        price_obj = self.get_latest_price_obj(obj)
        return price_obj.price if price_obj else None

    def get_total_value(self, obj):
        price = self.get_current_price(obj)
        return obj.quantity * price if price else 0

    def get_profit_loss(self, obj):
        # Calc P/L from transactions for this stock in this portfolio
        transactions = Transaction.objects.filter(portfolio=obj.portfolio, symbol=obj.stock)
        total_cost = 0
        total_qty = 0
        for t in transactions:
            if t.action == 'BUY':
                total_cost += t.quantity * t.price
                total_qty += t.quantity
            else:
                # Approximation of cost basis
                if total_qty > 0:
                    avg_cost = total_cost / total_qty
                    total_cost -= t.quantity * avg_cost
                    total_qty -= t.quantity
        
        current_value = self.get_total_value(obj)
        return current_value - total_cost

class PortfolioSerializer(serializers.ModelSerializer):
    holdings = HoldingSerializer(many=True, read_only=True)
    transactions = TransactionSerializer(many=True, read_only=True)
    total_portfolio_value = serializers.SerializerMethodField()
    total_profit_loss = serializers.SerializerMethodField()

    class Meta:
        model = Portfolio
        fields = ("id", "user", "name", "is_automated", "target_allocation", "created_at", "holdings", "transactions", "total_portfolio_value", "total_profit_loss")
        read_only_fields = ("user",)

    def get_total_portfolio_value(self, obj):
        holdings = obj.holdings.all()
        return sum(HoldingSerializer(h).get_total_value(h) for h in holdings)

    def get_total_profit_loss(self, obj):
        holdings = obj.holdings.all()
        return sum(HoldingSerializer(h).get_profit_loss(h) for h in holdings)
=======

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
>>>>>>> f676874015cfdcfa865c247090c40e9cf22a2aba
