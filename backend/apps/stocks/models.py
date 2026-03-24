from django.db import models


<<<<<<< HEAD
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
=======
class Stock(models.Model):
    symbol = models.CharField(max_length=20, unique=True)
    name = models.CharField(max_length=255)
    sector = models.CharField(max_length=100)

    def __str__(self) -> str:
        return f"{self.symbol} - {self.name}"


class Price(models.Model):
    stock = models.ForeignKey(Stock, on_delete=models.CASCADE, related_name="prices")
    timestamp = models.DateTimeField(db_index=True)
    open = models.DecimalField(max_digits=12, decimal_places=2)
    high = models.DecimalField(max_digits=12, decimal_places=2)
    low = models.DecimalField(max_digits=12, decimal_places=2)
    close = models.DecimalField(max_digits=12, decimal_places=2)
    volume = models.BigIntegerField()

    class Meta:
        unique_together = ("stock", "timestamp")
        ordering = ["-timestamp"]


class Fundamental(models.Model):
    stock = models.OneToOneField(Stock, on_delete=models.CASCADE, related_name="fundamental")
    pe_ratio = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    roe = models.DecimalField(max_digits=8, decimal_places=2, null=True, blank=True)
    market_cap = models.DecimalField(max_digits=20, decimal_places=2, null=True, blank=True)
    updated_at = models.DateTimeField(auto_now=True)
>>>>>>> f676874015cfdcfa865c247090c40e9cf22a2aba
