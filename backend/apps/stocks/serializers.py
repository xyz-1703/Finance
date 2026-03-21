from rest_framework import serializers

from .models import Fundamental, Price, Stock


class FundamentalSerializer(serializers.ModelSerializer):
    class Meta:
        model = Fundamental
        fields = "__all__"


class PriceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Price
        fields = "__all__"


class StockSerializer(serializers.ModelSerializer):
    fundamental = FundamentalSerializer(read_only=True)

    class Meta:
        model = Stock
        fields = ("id", "symbol", "name", "sector", "fundamental")
