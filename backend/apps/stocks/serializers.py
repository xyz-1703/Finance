from rest_framework import serializers
from .models import StockMaster, StockPrice


class StockPriceSerializer(serializers.ModelSerializer):
    class Meta:
        model = StockPrice
        fields = ("id", "timestamp", "open", "high", "low", "close", "volume")


class StockMasterSerializer(serializers.ModelSerializer):
    latest_price = serializers.SerializerMethodField()
    discount = serializers.SerializerMethodField()
    analysis = serializers.SerializerMethodField()
    sentiment = serializers.SerializerMethodField()

    class Meta:
        model = StockMaster
        fields = ("id", "symbol", "name", "market", "sector", "latest_price", "pe_ratio", "high_52week", "discount", "analysis", "sentiment")

    def get_latest_price(self, obj):
        price = obj.prices.order_by("-timestamp").first()
        return float(price.close) if price else None

    def get_discount(self, obj):
        latest = self.get_latest_price(obj)
        if latest and obj.high_52week and obj.high_52week > 0:
            high = float(obj.high_52week)
            return round(((high - latest) / high) * 100, 2)
        return 0

    def get_analysis(self, obj):
        discount = self.get_discount(obj)
        if discount > 30: return "Deep Discount"
        if discount > 15: return "Value Pick"
        if discount > 5: return "Consolidating"
        if discount < -5: return "All Time High"
        return "Neutral"

    def get_sentiment(self, obj):
        discount = self.get_discount(obj)
        char_val = sum(ord(c) for c in obj.symbol)
        
        metric = (discount * 2 + char_val) % 100
        
        if metric > 60: return "Bullish"
        elif metric < 35: return "Bearish"
        return "Neutral"

