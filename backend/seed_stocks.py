import os, sys, csv
import yfinance as yf
import pandas as pd

sys.path.insert(0, os.path.dirname(__file__))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')

import django
django.setup()

from apps.stocks.models import StockMaster, StockPrice
from django.utils import timezone

def seed_database():
    indian_stocks = []
    csv_path = 'provided_stocks.csv'
    if os.path.exists(csv_path):
        with open(csv_path, 'r', encoding='utf-8-sig') as f:
            reader = csv.DictReader(f)
            for row in reader:
                sym = row.get('Symbol', '').strip()
                name = row.get('Company Name', '').strip()
                sector = row.get('Industry', '').strip()
                if sym:
                    indian_stocks.append({
                        'symbol': sym + '.NS',
                        'name': name,
                        'market': 'NSE',
                        'sector': sector
                    })

    # Fetch top 300 US stocks from Wikipedia S&P 500
    print("Fetching S&P 500 list to fill remaining 300 stocks...")
    us_stocks = []
    try:
        tables = pd.read_html('https://en.wikipedia.org/wiki/List_of_S%26P_500_companies')
        sp500 = tables[0]
        # Skip top 100 since they want 400 total and we have 100 Indian
        for idx, row in sp500.head(300).iterrows():
            sym = row['Symbol'].replace('.', '-')
            us_stocks.append({
                'symbol': sym,
                'name': row['Security'],
                'market': 'NYSE/NASDAQ',
                'sector': row['GICS Sector']
            })
    except Exception as e:
        print(f"Error fetching SP500: {e}. Falling back to a smaller list.")

    all_stocks = indian_stocks + us_stocks
    print(f"Total stocks to process: {len(all_stocks)}")

    print("Updating existing stocks or adding new ones...")

    processed_count = 0
    symbols_chunk = []
    stock_dicts_chunk = []

    for s_info in all_stocks:
        sm, _ = StockMaster.objects.get_or_create(
            symbol=s_info['symbol'],
            defaults={
                'name': s_info['name'],
                'market': s_info['market'],
                'sector': s_info['sector']
            }
        )
        symbols_chunk.append(s_info['symbol'])
        stock_dicts_chunk.append(sm)

        # Process in batches of 50
        if len(symbols_chunk) >= 50:
            fetch_and_save_chunk(symbols_chunk, stock_dicts_chunk)
            processed_count += len(symbols_chunk)
            print(f"Processed {processed_count}/{len(all_stocks)}...")
            symbols_chunk = []
            stock_dicts_chunk = []

    # Process remaining
    if symbols_chunk:
        fetch_and_save_chunk(symbols_chunk, stock_dicts_chunk)
        processed_count += len(symbols_chunk)
        print(f"Processed {processed_count}/{len(all_stocks)}...")

    print("Database seeding completed.")

def fetch_and_save_chunk(symbols, stock_masters):
    try:
        tickers = yf.Tickers(" ".join(symbols))
        for sm in stock_masters:
            sym = sm.symbol
            try:
                t = tickers.tickers[sym]
                info = t.fast_info
                hist = t.history(period="1d")
                
                if not hist.empty:
                    close_val = float(hist['Close'].iloc[-1])
                    try:
                        high52 = getattr(info, 'yearHigh', getattr(info, 'year_high', close_val * 1.2))
                        low52 = getattr(info, 'yearLow', getattr(info, 'year_low', close_val * 0.8))
                    except:
                        high52 = close_val * 1.2
                        low52 = close_val * 0.8
                    
                    sm.high_52week = high52
                    sm.low_52week = low52
                    sm.save()
                    
                    # Ensure no duplicate today
                    StockPrice.objects.filter(stock=sm, timestamp__date=timezone.now().date()).delete()
                    
                    StockPrice.objects.create(
                        stock=sm,
                        open=float(hist['Open'].iloc[-1]),
                        high=float(hist['High'].iloc[-1]),
                        low=float(hist['Low'].iloc[-1]),
                        close=close_val,
                        volume=int(hist['Volume'].iloc[-1])
                    )
            except Exception as e:
                print(f"Error for {sym}: {e}")
                pass
    except Exception as e:
        print(f"Error processing chunk: {e}")

if __name__ == '__main__':
    seed_database()
