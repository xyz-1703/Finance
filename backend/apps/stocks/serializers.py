from rest_framework import serializers
from .models import StockMaster, StockPrice


class StockPriceSerializer(serializers.ModelSerializer):
    class Meta:
        model = StockPrice
        fields = ("id", "symbol", "price", "updated_at")


class StockMasterSerializer(serializers.ModelSerializer):
    latest_price = serializers.SerializerMethodField()

    class Meta:
        model = StockMaster
        fields = ("id", "symbol", "name", "market", "sector", "latest_price")

    def get_latest_price(self, obj):
        price = obj.prices.first()
        return price.price if price else None

