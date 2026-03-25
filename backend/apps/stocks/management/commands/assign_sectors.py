from django.core.management.base import BaseCommand
from apps.stocks.models import StockMaster

class Command(BaseCommand):
    help = 'Assign random sectors to stocks for demonstration'

    def handle(self, *args, **options):
        sectors = [
            'IT', 'Banking', 'Pharma', 'Energy', 'FMCG', 
            'Auto', 'Finance', 'Crypto', 'Metals', 'Real Estate',
            'Infrastructure', 'Media', 'Textiles', 'Chemical', 'Tourism',
            'Agriculture', 'Defense', 'Healthcare', 'Telecommunications', 'Consumer Durables'
        ]
        stocks = list(StockMaster.objects.all())
        self.stdout.write(f'Updating {len(stocks)} stocks...')
        
        for i, stock in enumerate(stocks):
            stock.sector = sectors[i % len(sectors)]
            
        StockMaster.objects.bulk_update(stocks, ['sector'])
        self.stdout.write(self.style.SUCCESS(f'Successfully updated {len(stocks)} stocks.'))
