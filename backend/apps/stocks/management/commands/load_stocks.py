import os
import pandas as pd
from django.core.management.base import BaseCommand
from apps.stocks.models import StockMaster

class Command(BaseCommand):
    help = 'Load stocks from CSV and Excel files into StockMaster'

    def handle(self, *args, **kwargs):
        # Paths to files
        indian_stocks_file = 'ind_nifty200list.csv'
        us_stocks_file_xlsx = 'USA Top 200 Stocks.xlsx'
        us_stocks_file_csv = 'USA Top 200 Stocks.csv' # Fallback for mock

        # Load Indian Stocks
        if os.path.exists(indian_stocks_file):
            self.stdout.write(f"Loading Indian stocks from {indian_stocks_file}...")
            df = pd.read_csv(indian_stocks_file)
            # Standardize columns: Symbol, Company Name
            for _, row in df.iterrows():
                symbol = str(row.get('Symbol', '')).strip()
                name = str(row.get('Company Name', '')).strip()
                if symbol:
                    StockMaster.objects.update_or_create(
                        symbol=symbol,
                        defaults={'name': name, 'market': 'NSE'}
                    )
            self.stdout.write(self.style.SUCCESS(f"Successfully loaded Indian stocks."))
        else:
            self.stdout.write(self.style.WARNING(f"File {indian_stocks_file} not found."))

        # Load US Stocks
        us_file = us_stocks_file_xlsx if os.path.exists(us_stocks_file_xlsx) else (us_stocks_file_csv if os.path.exists(us_stocks_file_csv) else None)
        
        if us_file:
            self.stdout.write(f"Loading US stocks from {us_file}...")
            if us_file.endswith('.xlsx'):
                df = pd.read_excel(us_file)
            else:
                df = pd.read_csv(us_file)
            
            # Standardize columns: Symbol, Name
            for _, row in df.iterrows():
                symbol = str(row.get('Symbol', '')).strip()
                name = str(row.get('Name', '')).strip()
                if symbol:
                    StockMaster.objects.update_or_create(
                        symbol=symbol,
                        defaults={'name': name, 'market': 'NASDAQ'} # Defaulting to NASDAQ for US mock
                    )
            self.stdout.write(self.style.SUCCESS(f"Successfully loaded US stocks."))
        else:
            self.stdout.write(self.style.WARNING(f"US stocks file not found."))
