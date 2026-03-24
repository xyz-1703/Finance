from django.conf import settings
from django.db import models

from apps.stocks.models import StockMaster


class Portfolio(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="portfolios")
    name = models.CharField(max_length=120)
    sector = models.CharField(max_length=100, blank=True, null=True)
    is_automated = models.BooleanField(default=False)
    target_allocation = models.JSONField(default=dict, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("user", "name")

    def __str__(self) -> str:
        return f"{self.user.email} - {self.name}"


class Transaction(models.Model):
    ACTION_CHOICES = [
        ('BUY', 'Buy'),
        ('SELL', 'Sell'),
    ]
    
    portfolio = models.ForeignKey(Portfolio, on_delete=models.CASCADE, related_name="portfolio_transactions")
    symbol = models.ForeignKey(StockMaster, on_delete=models.CASCADE, related_name="stock_transactions")
    action = models.CharField(max_length=4, choices=ACTION_CHOICES)
    quantity = models.DecimalField(max_digits=18, decimal_places=4)
    price = models.DecimalField(max_digits=18, decimal_places=4)
    time = models.DateTimeField(auto_now_add=True)

    def __str__(self) -> str:
        return f"{self.action} {self.quantity} {self.symbol.symbol} in {self.portfolio.name}"


class Holding(models.Model):
    portfolio = models.ForeignKey(Portfolio, on_delete=models.CASCADE, related_name="holdings")
    stock = models.ForeignKey(StockMaster, on_delete=models.CASCADE)
    quantity = models.DecimalField(max_digits=18, decimal_places=4, default=0)
    
    class Meta:
        unique_together = ("portfolio", "stock")

    def __str__(self) -> str:
        return f"{self.stock.symbol} in {self.portfolio.name} (Qty: {self.quantity})"
