from rest_framework import serializers


class MarketTradeSerializer(serializers.Serializer):
    symbol = serializers.CharField(max_length=20)
    side = serializers.ChoiceField(choices=["BUY", "SELL"])
    quantity = serializers.DecimalField(max_digits=14, decimal_places=4)
    price = serializers.DecimalField(max_digits=14, decimal_places=2, required=False)
    mpin = serializers.RegexField(regex=r"^\d{4,6}$")
    portfolio_name = serializers.CharField(max_length=120, required=False, allow_blank=True)
