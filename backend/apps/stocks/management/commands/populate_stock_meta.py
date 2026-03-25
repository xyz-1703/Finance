import random
from django.core.management.base import BaseCommand
from apps.stocks.models import StockMaster, StockPrice
from django.db.models import Max

class Command(BaseCommand):
    help = 'Populate PE ratio and 52-week High/Low for stocks'

    def handle(self, *args, **options):
        stocks = StockMaster.objects.all()
        self.stdout.write(f"Populating metadata for {stocks.count()} stocks...")
        
        for stock in stocks:
            # Get latest price
            latest_price_obj = stock.prices.order_by('-timestamp').first()
            if not latest_price_obj:
                continue
            
            latest_price = float(latest_price_obj.close)
            
            # Generate realistic PE (12 to 85)
            stock.pe_ratio = round(random.uniform(12.5, 85.0), 2)
            
            # Generate 52-week High (Current * 1.05 to 1.6)
            stock.high_52week = round(latest_price * random.uniform(1.05, 1.6), 2)
            
            # Generate 52-week Low (Current * 0.5 to 0.95)
            stock.low_52week = round(latest_price * random.uniform(0.5, 0.95), 2)
            
            stock.save()

        self.stdout.write(self.style.SUCCESS('Successfully populated stock metadata'))
