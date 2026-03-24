from rest_framework import serializers

from .models import PredictionRun, StockCluster


class ClusterRequestSerializer(serializers.Serializer):
    symbols = serializers.ListField(child=serializers.CharField(max_length=20), min_length=1)
    n_clusters = serializers.IntegerField(min_value=2, max_value=12, default=3)


<<<<<<< HEAD
=======
class PortfolioClusterRequestSerializer(serializers.Serializer):
    portfolio_id = serializers.IntegerField(min_value=1)
    n_clusters = serializers.IntegerField(min_value=2, max_value=12, default=3)


>>>>>>> f676874015cfdcfa865c247090c40e9cf22a2aba
class PredictionRequestSerializer(serializers.Serializer):
    symbol = serializers.CharField(max_length=20)
    model_type = serializers.ChoiceField(choices=[PredictionRun.MODEL_LINEAR, PredictionRun.MODEL_ARIMA])


class StockClusterSerializer(serializers.ModelSerializer):
<<<<<<< HEAD
=======
    stock_symbol = serializers.CharField(source="stock.symbol", read_only=True)
    stock_name = serializers.CharField(source="stock.name", read_only=True)

>>>>>>> f676874015cfdcfa865c247090c40e9cf22a2aba
    class Meta:
        model = StockCluster
        fields = "__all__"


class PredictionRunSerializer(serializers.ModelSerializer):
    class Meta:
        model = PredictionRun
        fields = "__all__"
