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
