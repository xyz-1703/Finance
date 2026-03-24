from rest_framework import serializers
<<<<<<< HEAD
from .models import StockMaster, StockPrice


class StockPriceSerializer(serializers.ModelSerializer):
    class Meta:
        model = StockPrice
        fields = ("id", "symbol", "price", "updated_at")


class StockMasterSerializer(serializers.ModelSerializer):
    latest_price = serializers.SerializerMethodField()

    class Meta:
        model = StockMaster
        fields = ("id", "symbol", "name", "market", "latest_price")

    def get_latest_price(self, obj):
        price = obj.prices.first()
        return price.price if price else None
=======

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
>>>>>>> f676874015cfdcfa865c247090c40e9cf22a2aba
