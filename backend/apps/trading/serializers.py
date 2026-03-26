from rest_framework import serializers

from .models import Transaction


class TradeRequestSerializer(serializers.Serializer):
    portfolio_id = serializers.IntegerField()
    stock_id = serializers.IntegerField()
    side = serializers.ChoiceField(choices=["BUY", "SELL"])
    quantity = serializers.DecimalField(max_digits=14, decimal_places=4)
    price = serializers.DecimalField(max_digits=14, decimal_places=2, required=False)
    mpin = serializers.RegexField(regex=r"^\d{4,6}$")


class TransactionSerializer(serializers.ModelSerializer):
    stock_symbol = serializers.CharField(source='stock.symbol', read_only=True)
    portfolio_name = serializers.CharField(source='portfolio.name', read_only=True)

    class Meta:
        model = Transaction
        fields = "__all__"
