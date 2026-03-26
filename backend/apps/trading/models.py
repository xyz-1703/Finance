from django.conf import settings
from django.db import models

from apps.portfolio.models import Portfolio
from apps.stocks.models import StockMaster


class Transaction(models.Model):
    BUY = "BUY"
    SELL = "SELL"
    SIDE_CHOICES = ((BUY, "Buy"), (SELL, "Sell"))

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="trading_transactions")
    portfolio = models.ForeignKey(Portfolio, on_delete=models.CASCADE, related_name="trading_transactions")
    stock = models.ForeignKey(StockMaster, on_delete=models.CASCADE, related_name="transactions")

    side = models.CharField(max_length=4, choices=SIDE_CHOICES)
    quantity = models.DecimalField(max_digits=14, decimal_places=4)
    price = models.DecimalField(max_digits=14, decimal_places=2)
    executed_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-executed_at"]
