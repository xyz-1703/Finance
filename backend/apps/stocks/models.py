from django.db import models


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

    def __str__(self) -> str:
        return f"{self.symbol} - {self.name} ({self.market})"


class StockPrice(models.Model):
    stock = models.ForeignKey(StockMaster, on_delete=models.CASCADE, related_name="prices")
    symbol = models.CharField(max_length=20)  # Redundant but kept for easy access as per requirement
    price = models.DecimalField(max_digits=18, decimal_places=4)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-updated_at"]

    def __str__(self) -> str:
        return f"{self.symbol}: {self.price} at {self.updated_at}"
