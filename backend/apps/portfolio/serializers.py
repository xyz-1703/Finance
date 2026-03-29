from rest_framework import serializers
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
        fields = ("id", "symbol", "name", "quantity", "average_buy_price", "current_price", "total_value", "profit_loss")

    def get_latest_price_obj(self, obj):
        return StockPrice.objects.filter(stock=obj.stock).order_by("-timestamp").first()

    def get_current_price(self, obj):
        price_obj = self.get_latest_price_obj(obj)
        return price_obj.close if price_obj else None

    def get_total_value(self, obj):
        price = self.get_current_price(obj)
        return obj.quantity * price if price else 0

    def get_profit_loss(self, obj):
        current_value = self.get_total_value(obj)
        invested_value = obj.quantity * obj.average_buy_price
        return current_value - invested_value

class PortfolioSerializer(serializers.ModelSerializer):
    holdings = HoldingSerializer(many=True, read_only=True)
    transactions = TransactionSerializer(many=True, read_only=True)
    total_value = serializers.SerializerMethodField()
    total_quantity = serializers.SerializerMethodField()
    profit_loss = serializers.SerializerMethodField()

    class Meta:
        model = Portfolio
        fields = ("id", "user", "name", "description", "sector", "is_automated", "is_default", "target_allocation", "created_at", "holdings", "transactions", "total_value", "total_quantity", "profit_loss")
        read_only_fields = ("user", "is_default")

    def get_total_value(self, obj):
        holdings = obj.holdings.all()
        return sum(HoldingSerializer(h).get_total_value(h) for h in holdings)

    def get_total_quantity(self, obj):
        return sum(h.quantity for h in obj.holdings.all())

    def get_profit_loss(self, obj):
        holdings = obj.holdings.all()
        return sum(HoldingSerializer(h).get_profit_loss(h) for h in holdings)

