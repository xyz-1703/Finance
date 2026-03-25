from django.db import models
from django.utils import timezone


class StockMaster(models.Model):
    MARKET_CHOICES = [
        ('NSE', 'National Stock Exchange'),
        ('BSE', 'Bombay Stock Exchange'),
        ('NASDAQ', 'NASDAQ'),
        ('NYSE', 'NYSE'),
        ('OTHER', 'Other'),
    ]
    
    symbol = models.CharField(max_length=20, unique=True)
    name = models.CharField(max_length=255)
    market = models.CharField(max_length=20, choices=MARKET_CHOICES, default='NSE')
    sector = models.CharField(max_length=100, blank=True, null=True)
    pe_ratio = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    high_52week = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    low_52week = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)

    def __str__(self) -> str:
        return f"{self.symbol} - {self.name} ({self.market})"


class StockPrice(models.Model):
    stock = models.ForeignKey(StockMaster, on_delete=models.CASCADE, related_name="prices")
    timestamp = models.DateTimeField(default=timezone.now)
    open = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    high = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    low = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    close = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    volume = models.BigIntegerField(default=0)

    class Meta:
        ordering = ["-timestamp"]
        unique_together = (('stock', 'timestamp'),)

    def __str__(self) -> str:
        return f"{self.stock.symbol}: {self.close} at {self.timestamp}"
