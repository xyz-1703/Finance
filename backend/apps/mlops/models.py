from django.conf import settings
from django.db import models

<<<<<<< HEAD
from apps.stocks.models import StockMaster


class StockCluster(models.Model):
    stock = models.ForeignKey(StockMaster, on_delete=models.CASCADE, related_name="cluster_results")
=======
from apps.portfolio.models import Portfolio
from apps.stocks.models import Stock


class StockCluster(models.Model):
    portfolio = models.ForeignKey(Portfolio, on_delete=models.CASCADE, related_name="clusters", null=True, blank=True)
    stock = models.ForeignKey(Stock, on_delete=models.CASCADE, related_name="cluster_results")
>>>>>>> f676874015cfdcfa865c247090c40e9cf22a2aba
    cluster_label = models.IntegerField()
    feature_vector = models.JSONField(default=dict)
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
<<<<<<< HEAD
        unique_together = ("stock", "cluster_label")
=======
        unique_together = ("portfolio", "stock")
>>>>>>> f676874015cfdcfa865c247090c40e9cf22a2aba


class PredictionRun(models.Model):
    MODEL_LINEAR = "linear_regression"
    MODEL_ARIMA = "arima"
    MODEL_CHOICES = ((MODEL_LINEAR, "Linear Regression"), (MODEL_ARIMA, "ARIMA"))

<<<<<<< HEAD
    stock = models.ForeignKey(StockMaster, on_delete=models.CASCADE, related_name="prediction_runs")
=======
    stock = models.ForeignKey(Stock, on_delete=models.CASCADE, related_name="prediction_runs")
>>>>>>> f676874015cfdcfa865c247090c40e9cf22a2aba
    model_type = models.CharField(max_length=40, choices=MODEL_CHOICES)
    prediction = models.FloatField()
    metrics = models.JSONField(default=dict)
    mlflow_run_id = models.CharField(max_length=128, blank=True)
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]
