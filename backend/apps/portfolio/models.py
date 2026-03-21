from django.conf import settings
from django.db import models

from apps.stocks.models import Stock


class Portfolio(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="portfolios")
    name = models.CharField(max_length=120)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("user", "name")

    def __str__(self) -> str:
        return f"{self.user.email} - {self.name}"


class PortfolioStock(models.Model):
    portfolio = models.ForeignKey(Portfolio, on_delete=models.CASCADE, related_name="holdings")
    stock = models.ForeignKey(Stock, on_delete=models.CASCADE, related_name="portfolio_positions")
    quantity = models.DecimalField(max_digits=14, decimal_places=4)
    average_buy_price = models.DecimalField(max_digits=14, decimal_places=2, default=0)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ("portfolio", "stock")
