import sys
import os
from django.core.management.base import BaseCommand
from django.conf import settings
from apps.stocks.models import StockMaster
from apps.mlops.forecasting_service import get_real_forecasting
import concurrent.futures

class Command(BaseCommand):
    help = "Trains and saves ML forecasting models offline for all active stocks."

    def add_arguments(self, parser):
        parser.add_argument(
            '--limit',
            type=int,
            default=0,
            help='Limit the number of stocks to train (useful for testing)'
        )
        parser.add_argument(
            '--models',
            nargs='+',
            default=['linear', 'logistic', 'arima', 'lstm'],
            help='Specific models to train, e.g. --models linear lstm'
        )

    def handle(self, *args, **options):
        limit = options['limit']
        models_to_train = options['models']
        
        self.stdout.write(f"Starting offline ML batch training. Models: {models_to_train}")
        
        # Get the top active stocks or all
        stocks_qs = StockMaster.objects.all()
        if limit > 0:
            stocks_qs = stocks_qs[:limit]
            
        stocks = list(stocks_qs)
        self.stdout.write(f"Found {len(stocks)} stocks to process.")
        
        total_tasks = len(stocks) * len(models_to_train)
        completed = 0
        
        for stock in stocks:
            for model_type in models_to_train:
                self.stdout.write(f"[{completed+1}/{total_tasks}] Training {model_type.upper()} for {stock.symbol}...")
                try:
                    # Calling get_real_forecasting with force_train=True
                    # This fetches the data, trains the model, and saves it to disk (bypassing cache).
                    result = get_real_forecasting(stock.symbol, model_type=model_type, force_train=True)
                    
                    if result.get('error'):
                        self.stdout.write(self.style.WARNING(f"! Failed for {stock.symbol} ({model_type}): {result['error'][:100]}"))
                    else:
                        self.stdout.write(self.style.SUCCESS(f"* Success: {stock.symbol}_{model_type} saved."))
                except Exception as e:
                    self.stdout.write(self.style.ERROR(f"Error training {model_type} for {stock.symbol}: {e}"))
                finally:
                    completed += 1
                    
        self.stdout.write(self.style.SUCCESS(f"\nBatch training complete! All artifacts dumped to saved_models directory."))
