import requests
import yfinance as yf

class PriceService:
    @staticmethod
    def get_price(symbol: str):
        """
        Fetch live price. 
        If symbol ends with 'USDT', assume it's crypto and use Binance.
        Otherwise, use Yahoo Finance.
        """
        symbol = symbol.upper()
        
        # Crypto check (Binance)
        if symbol.endswith("USDT"):
            return PriceService.get_binance_price(symbol)
        else:
            return PriceService.get_yahoo_price(symbol)

    @staticmethod
    def get_binance_price(symbol: str):
        try:
            url = f"https://api.binance.com/api/v3/ticker/price?symbol={symbol}"
            response = requests.get(url, timeout=5)
            response.raise_for_status()
            data = response.json()
            return float(data["price"])
        except Exception as e:
            print(f"Binance Error for {symbol}: {e}")
            return None

    @staticmethod
    def get_yahoo_price(symbol: str):
        try:
            ticker = yf.Ticker(symbol)
            # Use 'regularMarketPrice' or fast_info
            price = ticker.fast_info['lastPrice']
            if price is None:
                # Fallback to history for some symbols
                hist = ticker.history(period="1d")
                if not hist.empty:
                    price = hist['Close'].iloc[-1]
            return float(price) if price else None
        except Exception as e:
            print(f"Yahoo Finance Error for {symbol}: {e}")
            return None
