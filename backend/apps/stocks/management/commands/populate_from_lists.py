from django.core.management.base import BaseCommand
from apps.stocks.models import StockMaster
from apps.insights.services import ALLOWED_NSE_SYMBOLS, ALLOWED_US_SYMBOLS

class Command(BaseCommand):
    help = 'Populate StockMaster with symbols from ALLOWED_NSE_SYMBOLS and ALLOWED_US_SYMBOLS'

    def handle(self, *args, **options):
        self.stdout.write("Populating NSE stocks...")
        nse_count = 0
        for symbol in ALLOWED_NSE_SYMBOLS:
            obj, created = StockMaster.objects.update_or_create(
                symbol=symbol,
                defaults={'name': symbol.replace(".NS", ""), 'market': 'NSE', 'sector': 'Unknown'}
            )
            if created:
                nse_count += 1
        
        self.stdout.write(f"Created {nse_count} new NSE stocks.")

        self.stdout.write("Populating US stocks...")
        us_count = 0
        for symbol in ALLOWED_US_SYMBOLS:
            obj, created = StockMaster.objects.update_or_create(
                symbol=symbol,
                defaults={'name': symbol, 'market': 'NASDAQ', 'sector': 'Unknown'}
            )
            if created:
                us_count += 1
        
        self.stdout.write(f"Created {us_count} new US stocks.")
        self.stdout.write(self.style.SUCCESS("Successfully populated StockMaster."))
