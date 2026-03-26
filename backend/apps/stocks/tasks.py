from celery import shared_task
from apps.stocks.models import StockMaster, StockPrice
from apps.stocks.services import PriceService
from django.utils import timezone

@shared_task
def update_stock_prices():
    """
    Background task to fetch live prices for all stocks in StockMaster 
    and update StockPrice table.
    """
    stocks = StockMaster.objects.all()
    count = 0
    for stock in stocks:
        price = PriceService.get_price(stock.symbol)
        if price is not None:
            StockPrice.objects.create(
                stock=stock,
                close=price,
                open=price,  # Optionally set all to same for instant update
                high=price,
                low=price
            )
            count += 1
    return f"Updated {count} stock prices."
