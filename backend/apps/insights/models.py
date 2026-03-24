from django.db import models


class MarketStockSnapshot(models.Model):
    symbol = models.CharField(max_length=20, unique=True)
    name = models.CharField(max_length=255)
    sector = models.CharField(max_length=100, default="Unknown")
    market = models.CharField(max_length=2, db_index=True)
    market_price = models.FloatField(default=0.0)
    day_change = models.FloatField(default=0.0)
    day_change_pct = models.FloatField(default=0.0)
    volume = models.BigIntegerField(default=0)
    market_cap = models.FloatField(default=0.0)
    data_source = models.CharField(max_length=32, default="unknown")
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["symbol"]

    def __str__(self) -> str:
        return f"{self.symbol} ({self.market_price})"
