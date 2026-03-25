from __future__ import annotations

from datetime import datetime, timedelta, timezone
from functools import lru_cache
import logging
import os
import statistics
import time

import requests
import yfinance as yf
from yfinance.exceptions import YFRateLimitError

try:
    from transformers import pipeline
except Exception:  # pragma: no cover
    pipeline = None

from apps.portfolio.models import Portfolio
from apps.stocks.models import StockMaster
from apps.trading.models import Transaction
from apps.trading.services import execute_trade
from .models import MarketStockSnapshot

ALLOWED_NSE_SYMBOLS = [
    "360ONE.NS", "ABB.NS", "ACC.NS", "APLAPOLLO.NS", "AUBANK.NS", "ADANIENSOL.NS", "ADANIENT.NS",
    "ADANIGREEN.NS", "ADANIPORTS.NS", "ADANIPOWER.NS", "ATGL.NS", "ABCAPITAL.NS", "ALKEM.NS", "AMBUJACEM.NS",
    "APOLLOHOSP.NS", "ASHOKLEY.NS", "ASIANPAINT.NS", "ASTRAL.NS", "AUROPHARMA.NS", "DMART.NS", "AXISBANK.NS",
    "BSE.NS", "BAJAJ-AUTO.NS", "BAJFINANCE.NS", "BAJAJFINSV.NS", "BAJAJHLDNG.NS", "BAJAJHFL.NS", "BANKBARODA.NS",
    "BANKINDIA.NS", "BDL.NS", "BEL.NS", "BHARATFORG.NS", "BHEL.NS", "BPCL.NS", "BHARTIARTL.NS", "BHARTIHEXA.NS",
    "BIOCON.NS", "BLUESTARCO.NS", "BOSCHLTD.NS", "BRITANNIA.NS", "CGPOWER.NS", "CANBK.NS", "CHOLAFIN.NS",
    "CIPLA.NS", "COALINDIA.NS", "COCHINSHIP.NS", "COFORGE.NS", "COLPAL.NS", "CONCOR.NS", "COROMANDEL.NS",
    "CUMMINSIND.NS", "DLF.NS", "DABUR.NS", "DIVISLAB.NS", "DIXON.NS", "DRREDDY.NS", "EICHERMOT.NS", "ETERNAL.NS",
    "EXIDEIND.NS", "NYKAA.NS", "FEDERALBNK.NS", "FORTIS.NS", "GAIL.NS", "GMRAIRPORT.NS", "GLENMARK.NS",
    "GODFRYPHLP.NS", "GODREJCP.NS", "GODREJPROP.NS", "GRASIM.NS", "HCLTECH.NS", "HDFCAMC.NS", "HDFCBANK.NS",
    "HDFCLIFE.NS", "HAVELLS.NS", "HEROMOTOCO.NS", "HINDALCO.NS", "HAL.NS", "HINDPETRO.NS", "HINDUNILVR.NS",
    "HINDZINC.NS", "POWERINDIA.NS", "HUDCO.NS", "HYUNDAI.NS", "ICICIBANK.NS", "ICICIGI.NS", "IDFCFIRSTB.NS",
    "IRB.NS", "ITCHOTELS.NS", "ITC.NS", "INDIANB.NS", "INDHOTEL.NS", "IOC.NS", "IRCTC.NS", "IRFC.NS", "IREDA.NS",
    "IGL.NS", "INDUSTOWER.NS", "INDUSINDBK.NS", "NAUKRI.NS", "INFY.NS", "INDIGO.NS", "JSWENERGY.NS", "JSWSTEEL.NS",
    "JINDALSTEL.NS", "JIOFIN.NS", "JUBLFOOD.NS", "KEI.NS", "KPITTECH.NS", "KALYANKJIL.NS", "KOTAKBANK.NS", "LTF.NS",
    "LICHSGFIN.NS", "LTM.NS", "LT.NS", "LICI.NS", "LODHA.NS", "LUPIN.NS", "MRF.NS", "M&MFIN.NS", "M&M.NS",
    "MANKIND.NS", "MARICO.NS", "MARUTI.NS", "MFSL.NS", "MAXHEALTH.NS", "MAZDOCK.NS", "MOTILALOFS.NS", "MPHASIS.NS",
    "MUTHOOTFIN.NS", "NHPC.NS", "NMDC.NS", "NTPCGREEN.NS", "NTPC.NS", "NATIONALUM.NS", "NESTLEIND.NS",
    "OBEROIRLTY.NS", "ONGC.NS", "OIL.NS", "PAYTM.NS", "OFSS.NS", "POLICYBZR.NS", "PIIND.NS", "PAGEIND.NS",
    "PATANJALI.NS", "PERSISTENT.NS", "PHOENIXLTD.NS", "PIDILITIND.NS", "POLYCAB.NS", "PFC.NS", "POWERGRID.NS",
    "PREMIERENE.NS", "PRESTIGE.NS", "PNB.NS", "RECLTD.NS", "RVNL.NS", "RELIANCE.NS", "SBICARD.NS", "SBILIFE.NS",
    "SRF.NS", "MOTHERSON.NS", "SHREECEM.NS", "SHRIRAMFIN.NS", "ENRIN.NS", "SIEMENS.NS", "SOLARINDS.NS",
    "SONACOMS.NS", "SBIN.NS", "SAIL.NS", "SUNPHARMA.NS", "SUPREMEIND.NS", "SUZLON.NS", "SWIGGY.NS", "TVSMOTOR.NS",
    "TATACOMM.NS", "TCS.NS", "TATACONSUM.NS", "TATAELXSI.NS", "TMPV.NS", "TATAPOWER.NS", "TATASTEEL.NS",
    "TATATECH.NS", "TECHM.NS", "TITAN.NS", "TORNTPHARM.NS", "TORNTPOWER.NS", "TRENT.NS", "TIINDIA.NS", "UPL.NS",
    "ULTRACEMCO.NS", "UNIONBANK.NS", "UNITDSPR.NS", "VBL.NS", "VEDL.NS", "VMM.NS", "IDEA.NS", "VOLTAS.NS",
    "WAAREEENER.NS", "WIPRO.NS", "YESBANK.NS", "ZYDUSLIFE.NS",
]

ALLOWED_US_SYMBOLS = [
    "NVDA", "AAPL", "MSFT", "AMZN", "GOOGL", "GOOG", "META", "AVGO", "TSLA", "BRK.B", "WMT", "LLY",
    "JPM", "XOM", "V", "JNJ", "MU", "MA", "COST", "ORCL", "CVX", "NFLX", "ABBV", "PLTR", "BAC", "PG",
    "AMD", "KO", "HD", "CAT", "CSCO", "GE", "LRCX", "AMAT", "MRK", "RTX", "MS", "PM", "UNH", "GS",
    "WFC", "TMUS", "GEV", "IBM", "LIN", "MCD", "INTC", "VZ", "PEP", "AXP", "T", "KLAC", "C", "AMGN",
    "NEE", "ABT", "CRM", "DIS", "TMO", "TJX", "TXN", "GILD", "ISRG", "SCHW", "ANET", "APH", "COP",
    "PFE", "BA", "UBER", "DE", "ADI", "APP", "BLK", "LMT", "HON", "UNP", "QCOM", "ETN", "BKNG", "WELL",
    "DHR", "PANW", "SYK", "SPGI", "LOW", "INTU", "CB", "ACN", "PGR", "PLD", "BMY", "NOW", "VRTX",
    "PH", "COF", "MDT", "HCA", "CME", "MCK", "MO", "GLW", "SBUX", "SNDK", "SO", "CMCSA", "NEM", "CRWD",
    "BSX", "CEG", "DELL", "ADBE", "NOC", "WDC", "DUK", "EQIX", "GD", "WM", "HWM", "STX", "CVS", "TT",
    "ICE", "WMB", "BX", "MRSH", "MAR", "FDX", "ADP", "PWR", "AMT", "UPS", "PNC", "SNPS", "KKR", "USB",
    "JCI", "BK", "CDNS", "NKE", "REGN", "MCO", "ABNB", "SHW", "MSI", "FCX", "EOG", "MMM", "ITW", "CMI",
    "ORLY", "KMI", "ECL", "MNST", "MDLZ", "EMR", "CTAS", "VLO", "RCL", "CSX", "PSX", "SLB", "AON", "CI",
    "MPC", "ROST", "CL", "DASH", "WBD", "AEP", "RSG", "CRH", "HLT", "TDG", "LHX", "GM", "APO", "ELV",
    "TRV", "HOOD", "COR", "NSC", "APD", "FTNT", "SPG", "SRE", "OXY", "BKR", "DLR", "PCAR", "TEL", "O",
    "OKE", "AJG", "AFL", "TFC", "CIEN", "AZO", "FANG", "ALL",
]

ALLOWED_STOCK_SYMBOLS = set(ALLOWED_NSE_SYMBOLS + ALLOWED_US_SYMBOLS)

LIST_CACHE_TTL_SECONDS = 300
DETAIL_CACHE_TTL_SECONDS = 300
WATCHLIST_PRICE_SNAPSHOT_LIMIT = int(os.getenv("WATCHLIST_PRICE_SNAPSHOT_LIMIT", "30"))
WATCHLIST_CELERY_SNAPSHOT_LIMIT = int(os.getenv("WATCHLIST_CELERY_SNAPSHOT_LIMIT", "400"))
WATCHLIST_REFRESH_CHUNK_SIZE = int(os.getenv("WATCHLIST_REFRESH_CHUNK_SIZE", "40"))
YF_RATE_LIMIT_COOLDOWN_SECONDS = int(os.getenv("YF_RATE_LIMIT_COOLDOWN_SECONDS", "180"))
_list_cache: dict = {"ts": 0.0, "data": []}
_detail_cache: dict[str, dict] = {}
_yf_rate_limited_until: float = 0.0
BINANCE_BASE_URL = os.getenv("BINANCE_BASE_URL", "https://api.binance.com")
NSE_BASE_URL = os.getenv("NSE_BASE_URL", "https://www.nseindia.com")
_nse_session: requests.Session | None = None
_nse_session_warm_ts: float = 0.0

yf.utils.get_yf_logger().setLevel(logging.CRITICAL)


def _is_indian_symbol(symbol: str) -> bool:
    return symbol.endswith(".NS")


def _to_yf_symbol(symbol: str) -> str:
    if _is_indian_symbol(symbol):
        return symbol
    return symbol.replace(".", "-")


def _to_float(value, default=0.0):
    try:
        if value is None:
            return default
        return float(value)
    except Exception:
        return default


def _nse_series_symbol(symbol: str) -> str:
    return symbol.replace(".NS", "").strip().upper()


def _get_nse_session() -> requests.Session:
    global _nse_session, _nse_session_warm_ts
    now = time.time()
    if _nse_session is None:
        _nse_session = requests.Session()
        _nse_session.headers.update(
            {
                "User-Agent": "Mozilla/5.0",
                "Accept": "application/json,text/plain,*/*",
                "Referer": "https://www.nseindia.com/",
            }
        )
        _nse_session_warm_ts = 0.0

    # NSE APIs rely on cookie-backed sessions; refresh periodically.
    if now - _nse_session_warm_ts > 900:
        try:
            _nse_session.get(NSE_BASE_URL, timeout=10)
            _nse_session_warm_ts = now
        except Exception:
            pass

    return _nse_session


def _fetch_nse_quote_snapshot(nse_symbol: str) -> dict | None:
    try:
        session = _get_nse_session()
        symbol = _nse_series_symbol(nse_symbol)
        response = session.get(f"{NSE_BASE_URL}/api/quote-equity", params={"symbol": symbol}, timeout=10)
        if response.status_code != 200:
            return None
        payload = response.json()
        info = payload.get("priceInfo") or {}
        market_price = _to_float(info.get("lastPrice"), 0.0)
        previous_close = _to_float(info.get("previousClose"), market_price)
        volume = int(
            _to_float(info.get("totalTradedVolume"), 0.0)
            or _to_float((payload.get("preOpenMarket") or {}).get("totalTradedVolume"), 0.0)
            or 0
        )
        if market_price <= 0:
            return None
        return {
            "market_price": market_price,
            "previous_close": previous_close if previous_close > 0 else market_price,
            "volume": volume,
        }
    except Exception:
        return None


def _fetch_nse_historical_points(nse_symbol: str, limit: int = 120) -> list[dict]:
    try:
        session = _get_nse_session()
        symbol = _nse_series_symbol(nse_symbol)
        to_date = datetime.now(timezone.utc).date()
        from_date = to_date - timedelta(days=220)
        response = session.get(
            f"{NSE_BASE_URL}/api/historical/cm/equity",
            params={
                "symbol": symbol,
                "series": '["EQ"]',
                "from": from_date.strftime("%d-%m-%Y"),
                "to": to_date.strftime("%d-%m-%Y"),
            },
            timeout=15,
        )
        if response.status_code != 200:
            return []

        rows = (response.json() or {}).get("data") or []
        points: list[dict] = []
        for row in reversed(rows):
            close = _to_float(row.get("CH_CLOSING_PRICE"), 0.0)
            if close <= 0:
                continue
            points.append(
                {
                    "date": str(row.get("CH_TIMESTAMP", "")),
                    "open": round(_to_float(row.get("CH_OPENING_PRICE"), close), 2),
                    "high": round(_to_float(row.get("CH_TRADE_HIGH_PRICE"), close), 2),
                    "low": round(_to_float(row.get("CH_TRADE_LOW_PRICE"), close), 2),
                    "close": round(close, 2),
                    "volume": int(_to_float(row.get("CH_TOT_TRADED_QTY"), 0.0)),
                }
            )

        if len(points) > limit:
            points = points[-limit:]
        return points
    except Exception:
        return []

def _is_fresh(timestamp: float, ttl_seconds: int) -> bool:
    return (time.time() - timestamp) < ttl_seconds


def _binance_symbol_candidates(nse_symbol: str) -> list[str]:
    base = nse_symbol.replace(".NS", "").replace("-", "").upper()
    return [f"{base}USDT", f"{base}BUSD", f"{base}BTC"]


def _fetch_binance_ticker_snapshot(nse_symbol: str) -> dict | None:
    for candidate in _binance_symbol_candidates(nse_symbol):
        try:
            response = requests.get(
                f"{BINANCE_BASE_URL}/api/v3/ticker/24hr",
                params={"symbol": candidate},
                timeout=5,
            )
            if response.status_code != 200:
                continue
            payload = response.json()
            return {
                "symbol": candidate,
                "market_price": _to_float(payload.get("lastPrice"), 0.0),
                "previous_close": _to_float(payload.get("lastPrice"), 0.0)
                - _to_float(payload.get("priceChange"), 0.0),
                "volume": int(_to_float(payload.get("volume"), 0.0)),
            }
        except Exception:
            continue
    return None


def _fetch_binance_klines(nse_symbol: str, limit: int = 120) -> list[dict]:
    for candidate in _binance_symbol_candidates(nse_symbol):
        try:
            response = requests.get(
                f"{BINANCE_BASE_URL}/api/v3/klines",
                params={"symbol": candidate, "interval": "1d", "limit": limit},
                timeout=8,
            )
            if response.status_code != 200:
                continue
            rows = response.json()
            points = []
            for row in rows:
                points.append(
                    {
                        "date": datetime.fromtimestamp(row[0] / 1000, tz=timezone.utc).strftime("%Y-%m-%d"),
                        "open": round(_to_float(row[1]), 2),
                        "high": round(_to_float(row[2]), 2),
                        "low": round(_to_float(row[3]), 2),
                        "close": round(_to_float(row[4]), 2),
                        "volume": int(_to_float(row[5])),
                    }
                )
            if points:
                return points
        except Exception:
            continue
    return []


def _build_detail_payload_from_points(symbol: str, points: list[dict], source_label: str) -> dict:
    closes = [float(item["close"]) for item in points if _to_float(item["close"], 0.0) > 0]
    volumes = [float(item["volume"]) for item in points]
    if len(closes) < 2:
        latest_price = round(closes[-1], 2) if closes else 0.0

        return {
            "symbol": symbol,
            "name": symbol.replace(".NS", ""),
            "sector": "Unknown",
            "currency": "INR",
            "market_price": latest_price,

            "fundamentals": {
                "pe_ratio": 0.0,
                "market_cap": 0.0,
                "roe": 0.0,
                "dividend_yield": 0.0,
            },
            "statistics": {
                "avg_daily_return_pct": 0.0,
                "annualized_volatility_pct": 0.0,
                "rsi_14": 50.0,
                "six_month_return_pct": 0.0,
                "avg_volume": round(statistics.mean(volumes), 2) if volumes else 0.0,
            },
            "sentiment": {"label": "neutral", "score": 0.0, "source_count": 0},
            "headlines": [],
            "trend": points,
            "data_status": source_label,
        }

    returns = []
    for i in range(1, len(closes)):
        prev = closes[i - 1]
        current = closes[i]
        if prev:
            returns.append((current - prev) / prev)

    avg_return = statistics.mean(returns) if returns else 0.0
    volatility = statistics.stdev(returns) if len(returns) > 1 else 0.0

    return {
        "symbol": symbol,
        "name": symbol.replace(".NS", ""),
        "sector": "Unknown",
        "currency": "INR",
        "market_price": round(closes[-1], 2),
        "fundamentals": {
            "pe_ratio": 0.0,
            "market_cap": 0.0,
            "roe": 0.0,
            "dividend_yield": 0.0,
        },
        "statistics": {
            "avg_daily_return_pct": round(avg_return * 100, 3),
            "annualized_volatility_pct": round(volatility * (252 ** 0.5) * 100, 3),
            "rsi_14": 50.0,
            "six_month_return_pct": round(((closes[-1] - closes[0]) / closes[0]) * 100, 2) if closes[0] else 0.0,
            "avg_volume": round(statistics.mean(volumes), 2) if volumes else 0.0,
        },
        "sentiment": {"label": "neutral", "score": 0.0, "source_count": 0},
        "headlines": [],
        "trend": points,
        "data_status": source_label,
    }


@lru_cache(maxsize=1)
def _finbert_pipeline():
    model_id = os.getenv("FINBERT_MODEL", "ProsusAI/finbert")
    if pipeline is None:
        return None
    try:
        return pipeline("sentiment-analysis", model=model_id, tokenizer=model_id)
    except Exception:
        return None


def _sentiment_from_headlines(headlines: list[str]) -> dict:
    if not headlines:
        return {"label": "neutral", "score": 0.0, "source_count": 0}

    clf = _finbert_pipeline()
    if clf is None:
        return {"label": "neutral", "score": 0.0, "source_count": len(headlines)}

    predictions = clf(headlines[:12])
    score = 0.0
    for pred in predictions:
        label = pred["label"].lower()
        confidence = _to_float(pred.get("score", 0.0))
        if "positive" in label:
            score += confidence
        elif "negative" in label:
            score -= confidence

    if score > 0.2:
        label = "positive"
    elif score < -0.2:
        label = "negative"
    else:
        label = "neutral"

    return {"label": label, "score": round(score, 4), "source_count": len(predictions)}


def _download_snapshots(symbols: list[str]) -> dict:
    global _yf_rate_limited_until
    prices = {}
    if not symbols:
        return prices

    # Fast and reliable path for Indian equities: use NSE quote endpoint directly.
    if all(_is_indian_symbol(symbol) for symbol in symbols):
        for symbol in symbols:
            snapshot = _fetch_nse_quote_snapshot(symbol)
            if snapshot:
                prices[symbol] = snapshot
        return prices

    yf_cooldown_active = time.time() < _yf_rate_limited_until

    chunk_size = 50
    if not yf_cooldown_active:
        for i in range(0, len(symbols), chunk_size):
            chunk = symbols[i : i + chunk_size]
            yf_chunk = [_to_yf_symbol(symbol) for symbol in chunk]
            try:
                frame = yf.download(
                    tickers=" ".join(yf_chunk),
                    period="5d",
                    interval="1d",
                    group_by="ticker",
                    auto_adjust=False,
                    progress=False,
                    threads=True,
                )
            except YFRateLimitError:
                _yf_rate_limited_until = max(_yf_rate_limited_until, time.time() + YF_RATE_LIMIT_COOLDOWN_SECONDS)
                frame = None
            except Exception as exc:
                if "Too Many Requests" in str(exc):
                    _yf_rate_limited_until = max(_yf_rate_limited_until, time.time() + YF_RATE_LIMIT_COOLDOWN_SECONDS)
                frame = None

            if frame is None or getattr(frame, "empty", True):
                continue

            for symbol, yf_symbol in zip(chunk, yf_chunk):
                try:
                    if len(yf_chunk) == 1:
                        symbol_df = frame.dropna(how="all")
                    else:
                        symbol_df = frame[yf_symbol].dropna(how="all")
                    if symbol_df.empty:
                        continue
                    last_row = symbol_df.iloc[-1]
                    prev_row = symbol_df.iloc[-2] if len(symbol_df.index) > 1 else last_row
                    close = _to_float(last_row.get("Close"), 0.0)
                    prev_close = _to_float(prev_row.get("Close"), close)
                    prices[symbol] = {
                        "market_price": close,
                        "previous_close": prev_close,
                        "volume": int(_to_float(last_row.get("Volume"), 0.0)),
                    }
                except Exception:
                    continue

    # Yahoo quote endpoint fallback (may be blocked in some environments).
    if not prices:
        for i in range(0, len(symbols), 70):
            chunk = symbols[i : i + 70]
            yf_chunk = [_to_yf_symbol(symbol) for symbol in chunk]
            symbol_by_yf = {yf_symbol: original for yf_symbol, original in zip(yf_chunk, chunk)}
            try:
                response = requests.get(
                    "https://query1.finance.yahoo.com/v7/finance/quote",
                    params={"symbols": ",".join(yf_chunk)},
                    timeout=8,
                )
                if response.status_code != 200:
                    continue
                payload = response.json()
                results = payload.get("quoteResponse", {}).get("result", [])
                for row in results:
                    yf_symbol = str(row.get("symbol", "")).strip().upper()
                    original_symbol = symbol_by_yf.get(yf_symbol)
                    if not original_symbol:
                        continue
                    market_price = _to_float(row.get("regularMarketPrice"), 0.0)
                    previous_close = _to_float(row.get("regularMarketPreviousClose"), market_price)
                    volume = int(_to_float(row.get("regularMarketVolume"), 0.0))
                    if market_price > 0:
                        prices[original_symbol] = {
                            "market_price": market_price,
                            "previous_close": previous_close,
                            "volume": volume,
                        }
            except Exception:
                continue

    # Chart API fallback remains available even when yfinance endpoints are throttled.
    if len(prices) < min(len(symbols), 20):
        _merge_prices_from_chart_api(symbols[: max(25, min(len(symbols), 80))], prices)

    # NSE fallback for Indian equities when Yahoo endpoints are throttled.
    if len(prices) < min(len(symbols), 20):
        for symbol in symbols:
            if not _is_indian_symbol(symbol):
                continue
            if symbol in prices and _to_float(prices[symbol].get("market_price"), 0.0) > 0:
                continue
            snapshot = _fetch_nse_quote_snapshot(symbol)
            if snapshot:
                prices[symbol] = snapshot

    return prices


def _fetch_chart_points(symbol: str, *, range_window: str = "6mo", interval: str = "1d", limit: int | None = None) -> list[dict]:
    try:
        yf_symbol = _to_yf_symbol(symbol)
        response = requests.get(
            f"https://query1.finance.yahoo.com/v8/finance/chart/{yf_symbol}",
            params={"range": range_window, "interval": interval},
            timeout=10,
        )
        if response.status_code != 200:
            return []
        payload = response.json()
        result = (payload.get("chart", {}) or {}).get("result", [])
        if not result:
            return []

        chart = result[0]
        timestamps = chart.get("timestamp") or []
        quote = ((chart.get("indicators") or {}).get("quote") or [{}])[0]
        opens = quote.get("open") or []
        highs = quote.get("high") or []
        lows = quote.get("low") or []
        closes = quote.get("close") or []
        volumes = quote.get("volume") or []

        points: list[dict] = []
        for idx, ts in enumerate(timestamps):
            close = _to_float(closes[idx] if idx < len(closes) else None, 0.0)
            open_ = _to_float(opens[idx] if idx < len(opens) else close, close)
            high = _to_float(highs[idx] if idx < len(highs) else close, close)
            low = _to_float(lows[idx] if idx < len(lows) else close, close)
            volume = int(_to_float(volumes[idx] if idx < len(volumes) else 0, 0.0))
            if close <= 0:
                continue
            points.append(
                {
                    "date": datetime.fromtimestamp(int(ts), tz=timezone.utc).strftime("%Y-%m-%d"),
                    "open": round(open_, 2),
                    "high": round(high, 2),
                    "low": round(low, 2),
                    "close": round(close, 2),
                    "volume": volume,
                }
            )

        if limit is not None and len(points) > limit:
            points = points[-limit:]
        return points
    except Exception:
        return []


def _merge_prices_from_chart_api(symbols: list[str], prices: dict) -> None:
    for symbol in symbols:
        if symbol in prices and _to_float(prices[symbol].get("market_price"), 0.0) > 0:
            continue
        points = _fetch_chart_points(symbol, range_window="5d", interval="1d", limit=5)
        if not points:
            continue
        last_row = points[-1]
        prev_row = points[-2] if len(points) > 1 else last_row
        prices[symbol] = {
            "market_price": _to_float(last_row.get("close"), 0.0),
            "previous_close": _to_float(prev_row.get("close"), _to_float(last_row.get("close"), 0.0)),
            "volume": int(_to_float(last_row.get("volume"), 0.0)),
        }


def _has_meaningful_prices(rows: list[dict]) -> bool:
    for row in rows:
        if _to_float(row.get("market_price"), 0.0) > 0:
            return True
    return False


def _all_watchlist_symbols() -> list[str]:
    return ALLOWED_NSE_SYMBOLS + ALLOWED_US_SYMBOLS


def _seed_watchlist_symbols_in_db(symbols: list[str]) -> None:
    if not symbols:
        return

    existing = set(MarketStockSnapshot.objects.filter(symbol__in=symbols).values_list("symbol", flat=True))
    to_create: list[MarketStockSnapshot] = []

    for symbol in symbols:
        if symbol in existing:
            continue
        to_create.append(
            MarketStockSnapshot(
                symbol=symbol,
                name=symbol.replace(".NS", ""),
                sector="Unknown",
                market="IN" if _is_indian_symbol(symbol) else "US",
                market_price=0.0,
                day_change=0.0,
                day_change_pct=0.0,
                volume=0,
                market_cap=0.0,
                data_source="seeded",
            )
        )

    if to_create:
        MarketStockSnapshot.objects.bulk_create(to_create, batch_size=400)


def _load_watchlist_from_db(symbols: list[str]) -> list[dict]:
    if not symbols:
        return []

    snapshots = MarketStockSnapshot.objects.filter(symbol__in=symbols)
    snapshot_by_symbol = {obj.symbol: obj for obj in snapshots}

    rows: list[dict] = []
    for symbol in symbols:
        obj = snapshot_by_symbol.get(symbol)
        if obj is None:
            continue
        rows.append(
            {
                "symbol": obj.symbol,
                "name": obj.name,
                "sector": obj.sector,
                "market": obj.market,
                "market_price": round(_to_float(obj.market_price), 2),
                "day_change": round(_to_float(obj.day_change), 2),
                "day_change_pct": round(_to_float(obj.day_change_pct), 2),
                "volume": int(_to_float(obj.volume, 0)),
                "market_cap": _to_float(obj.market_cap),
                "data_source": obj.data_source,
            }
        )
    return rows


def _persist_watchlist_to_db(rows: list[dict]) -> None:
    if not rows:
        return

    symbols = [str(row.get("symbol", "")).strip().upper() for row in rows if str(row.get("symbol", "")).strip()]
    if not symbols:
        return

    existing = MarketStockSnapshot.objects.filter(symbol__in=symbols)
    existing_by_symbol = {obj.symbol: obj for obj in existing}

    to_create: list[MarketStockSnapshot] = []
    to_update: list[MarketStockSnapshot] = []

    for row in rows:
        symbol = str(row.get("symbol", "")).strip().upper()
        if not symbol:
            continue

        market_price = _to_float(row.get("market_price"), 0.0)

        payload = {
            "name": str(row.get("name") or symbol.replace(".NS", "")),
            "sector": str(row.get("sector") or "Unknown"),
            "market": str(row.get("market") or ("IN" if _is_indian_symbol(symbol) else "US")),
            "market_price": market_price,
            "day_change": _to_float(row.get("day_change"), 0.0),
            "day_change_pct": _to_float(row.get("day_change_pct"), 0.0),
            "volume": int(_to_float(row.get("volume"), 0.0)),
            "market_cap": _to_float(row.get("market_cap"), 0.0),
            "data_source": str(row.get("data_source") or "unknown")[:32],
        }

        obj = existing_by_symbol.get(symbol)
        if obj is None:
            if market_price <= 0:
                continue
            to_create.append(MarketStockSnapshot(symbol=symbol, **payload))
            continue

        if market_price <= 0:
            # Preserve last known good price in DB during transient provider failures.
            continue

        obj.name = payload["name"]
        obj.sector = payload["sector"]
        obj.market = payload["market"]
        obj.market_price = payload["market_price"]
        obj.day_change = payload["day_change"]
        obj.day_change_pct = payload["day_change_pct"]
        obj.volume = payload["volume"]
        obj.market_cap = payload["market_cap"]
        obj.data_source = payload["data_source"]
        to_update.append(obj)

    if to_create:
        MarketStockSnapshot.objects.bulk_create(to_create, batch_size=200)
    if to_update:
        MarketStockSnapshot.objects.bulk_update(
            to_update,
            fields=[
                "name",
                "sector",
                "market",
                "market_price",
                "day_change",
                "day_change_pct",
                "volume",
                "market_cap",
                "data_source",
            ],
            batch_size=200,
        )


def _apply_watchlist_filters(stocks: list[dict], market: str, per_market: int) -> list[dict]:
    filtered = stocks
    if market == "IN":
        filtered = [item for item in filtered if item["market"] == "IN"]
    elif market == "US":
        filtered = [item for item in filtered if item["market"] == "US"]
    return filtered[:per_market]


def _refresh_watchlist_in_chunks(symbols: list[str], seed_rows: list[dict]) -> list[dict]:
    if not symbols:
        return []

    seed_by_symbol = {str(row.get("symbol")): row for row in seed_rows}
    result_rows: list[dict] = []
    chunk_size = max(10, min(WATCHLIST_REFRESH_CHUNK_SIZE, len(symbols)))

    for start in range(0, len(symbols), chunk_size):
        chunk_symbols = symbols[start : start + chunk_size]
        chunk_seed = [seed_by_symbol[s] for s in chunk_symbols if s in seed_by_symbol]
        chunk_rows = _build_watchlist_data(
            price_snapshot_limit=len(chunk_symbols),
            seed_rows=chunk_seed,
            symbols=chunk_symbols,
        )
        result_rows.extend(chunk_rows)

    return result_rows


def _build_watchlist_data(
    price_snapshot_limit: int,
    seed_rows: list[dict] | None = None,
    symbols: list[str] | None = None,
) -> list[dict]:
    stocks = []
    symbols = symbols or _all_watchlist_symbols()
    price_symbols = symbols[: max(0, min(price_snapshot_limit, len(symbols)))]
    prices = _download_snapshots(price_symbols) if price_symbols else {}
    yahoo_bulk_unavailable = len(prices) == 0
    seed_map = {str(row.get("symbol")): row for row in (seed_rows or [])}

    for symbol in symbols:
        snapshot = prices.get(symbol, {})
        seed_row = seed_map.get(symbol, {})

        if (not snapshot or _to_float(snapshot.get("market_price"), 0.0) <= 0) and _to_float(seed_row.get("market_price"), 0.0) > 0:
            snapshot = {
                "market_price": _to_float(seed_row.get("market_price"), 0.0),
                "previous_close": _to_float(seed_row.get("market_price"), 0.0) - _to_float(seed_row.get("day_change"), 0.0),
                "volume": int(_to_float(seed_row.get("volume"), 0.0)),
            }
            seeded = True
        else:
            seeded = False

        regular_price = _to_float(snapshot.get("market_price"), 0.0)
        previous_close = _to_float(snapshot.get("previous_close"), regular_price)
        day_change = regular_price - previous_close
        pct_change = (day_change / previous_close * 100) if previous_close else 0.0

        stocks.append(
            {
                "symbol": symbol,
                "name": symbol.replace(".NS", ""),
                "sector": "Unknown",
                "market": "IN" if _is_indian_symbol(symbol) else "US",

                "market_price": round(regular_price, 2),
                "day_change": round(day_change, 2),
                "day_change_pct": round(pct_change, 2),
                "volume": int(snapshot.get("volume", 0)),
                "market_cap": 0.0,
                "data_source": (
                    "cached"
                    if seeded
                    else ("yahoo" if snapshot else ("rate_limited" if yahoo_bulk_unavailable else "deferred"))
                ),
            }
        )

    return stocks


def get_indian_market_watchlist(market: str = "ALL", per_market: int = 400) -> list[dict]:
    symbols = _all_watchlist_symbols()
    _seed_watchlist_symbols_in_db(symbols)
    db_rows = _load_watchlist_from_db(symbols)
    if db_rows:
        _list_cache["ts"] = time.time()
        _list_cache["data"] = db_rows
        return _apply_watchlist_filters(db_rows, market, per_market)

    # Bootstrap path for first run before Celery seeds snapshots.
    previous = _list_cache.get("data") or []
    stocks = _refresh_watchlist_in_chunks(symbols, previous)

    if _has_meaningful_prices(stocks) or not previous:
        _persist_watchlist_to_db(stocks)
        _list_cache["ts"] = time.time()
        _list_cache["data"] = stocks
    else:
        stocks = previous

    return _apply_watchlist_filters(stocks, market, per_market)


def refresh_watchlist_cache(price_snapshot_limit: int | None = None) -> dict:
    symbols = _all_watchlist_symbols()
    _seed_watchlist_symbols_in_db(symbols)
    snapshot_limit = len(symbols) if price_snapshot_limit is None else int(price_snapshot_limit)
    target_symbols = symbols[: max(0, min(snapshot_limit, len(symbols)))]
    previous = _load_watchlist_from_db(symbols)
    if not previous:
        previous = _list_cache.get("data") or []

    stocks = _refresh_watchlist_in_chunks(target_symbols, previous)
    if _has_meaningful_prices(stocks) or not previous:
        _persist_watchlist_to_db(stocks)
        _list_cache["ts"] = time.time()
        _list_cache["data"] = stocks
    else:
        stocks = previous

    sources: dict[str, int] = {}
    for row in stocks:
        key = str(row.get("data_source", "unknown"))
        sources[key] = sources.get(key, 0) + 1

    return {
        "total": len(stocks),
        "snapshot_limit": snapshot_limit,
        "sources": sources,
        "refreshed_at": datetime.now(timezone.utc).isoformat(),
    }


def _build_detail_payload_from_db_snapshot(symbol: str) -> dict | None:
    snapshot = MarketStockSnapshot.objects.filter(symbol=symbol).first()
    if snapshot is None or _to_float(snapshot.market_price, 0.0) <= 0:
        return None

    market_price = round(_to_float(snapshot.market_price, 0.0), 2)
    previous_close = round(market_price - _to_float(snapshot.day_change, 0.0), 2)
    point = {
        "date": datetime.now(timezone.utc).strftime("%Y-%m-%d"),
        "open": previous_close,
        "high": max(market_price, previous_close),
        "low": min(market_price, previous_close),
        "close": market_price,
        "volume": int(_to_float(snapshot.volume, 0.0)),
    }
    payload = _build_detail_payload_from_points(symbol, [point], "db_cache_fallback")
    payload["name"] = snapshot.name
    payload["sector"] = snapshot.sector
    payload["currency"] = "INR" if snapshot.market == "IN" else "USD"
    return payload


def get_stock_detail_analysis(symbol: str) -> dict:
    symbol = symbol.upper()
    if symbol in ALLOWED_US_SYMBOLS:
        pass
    elif not symbol.endswith(".NS"):
        symbol = f"{symbol}.NS"

    if symbol not in ALLOWED_STOCK_SYMBOLS:
        raise ValueError("Symbol is outside configured stock universe")


    cached = _detail_cache.get(symbol)
    if cached and _is_fresh(cached.get("ts", 0.0), DETAIL_CACHE_TTL_SECONDS):
        return cached["data"]

    yf_symbol = _to_yf_symbol(symbol)
    ticker = yf.Ticker(yf_symbol)
    try:
        history = ticker.history(period="6mo", interval="1d")
    except YFRateLimitError:
        if _is_indian_symbol(symbol):
            nse_points = _fetch_nse_historical_points(symbol, limit=120)
            if nse_points:
                payload = _build_detail_payload_from_points(symbol, nse_points, "nse_fallback")
                _detail_cache[symbol] = {"ts": time.time(), "data": payload}
                return payload

            nse_snapshot = _fetch_nse_quote_snapshot(symbol)
            if nse_snapshot:
                now_point = {
                    "date": datetime.now(timezone.utc).strftime("%Y-%m-%d"),
                    "open": round(_to_float(nse_snapshot.get("previous_close"), nse_snapshot.get("market_price")), 2),
                    "high": round(max(_to_float(nse_snapshot.get("market_price"), 0.0), _to_float(nse_snapshot.get("previous_close"), 0.0)), 2),
                    "low": round(min(_to_float(nse_snapshot.get("market_price"), 0.0), _to_float(nse_snapshot.get("previous_close"), 0.0)), 2),
                    "close": round(_to_float(nse_snapshot.get("market_price"), 0.0), 2),
                    "volume": int(_to_float(nse_snapshot.get("volume"), 0.0)),
                }
                payload = _build_detail_payload_from_points(symbol, [now_point], "nse_quote_fallback")
                _detail_cache[symbol] = {"ts": time.time(), "data": payload}
                return payload

        chart_points = _fetch_chart_points(symbol, range_window="6mo", interval="1d", limit=120)
        if chart_points:
            payload = _build_detail_payload_from_points(symbol, chart_points, "yahoo_chart")
            _detail_cache[symbol] = {"ts": time.time(), "data": payload}
            return payload
        binance_points = _fetch_binance_klines(symbol)
        if binance_points:
            payload = _build_detail_payload_from_points(symbol, binance_points, "binance_fallback")
            _detail_cache[symbol] = {"ts": time.time(), "data": payload}
            return payload
        snapshot_payload = _build_detail_payload_from_db_snapshot(symbol)
        if snapshot_payload:
            _detail_cache[symbol] = {"ts": time.time(), "data": snapshot_payload}
            return snapshot_payload

        if cached:
            return cached["data"]
        return {
            "symbol": symbol,
            "name": symbol.replace(".NS", ""),
            "sector": "Unknown",
            "currency": "INR" if _is_indian_symbol(symbol) else "USD",

            "market_price": 0.0,
            "fundamentals": {
                "pe_ratio": 0.0,
                "market_cap": 0.0,
                "roe": 0.0,
                "dividend_yield": 0.0,
            },
            "statistics": {
                "avg_daily_return_pct": 0.0,
                "annualized_volatility_pct": 0.0,
                "rsi_14": 50.0,
                "six_month_return_pct": 0.0,
                "avg_volume": 0.0,
            },
            "sentiment": {"label": "neutral", "score": 0.0, "source_count": 0},
            "headlines": [],
            "trend": [],
            "data_status": "rate_limited",
        }

    if history.empty:
        if _is_indian_symbol(symbol):
            nse_points = _fetch_nse_historical_points(symbol, limit=120)
            if nse_points:
                payload = _build_detail_payload_from_points(symbol, nse_points, "nse_fallback")
                _detail_cache[symbol] = {"ts": time.time(), "data": payload}
                return payload

            nse_snapshot = _fetch_nse_quote_snapshot(symbol)
            if nse_snapshot:
                now_point = {
                    "date": datetime.now(timezone.utc).strftime("%Y-%m-%d"),
                    "open": round(_to_float(nse_snapshot.get("previous_close"), nse_snapshot.get("market_price")), 2),
                    "high": round(max(_to_float(nse_snapshot.get("market_price"), 0.0), _to_float(nse_snapshot.get("previous_close"), 0.0)), 2),
                    "low": round(min(_to_float(nse_snapshot.get("market_price"), 0.0), _to_float(nse_snapshot.get("previous_close"), 0.0)), 2),
                    "close": round(_to_float(nse_snapshot.get("market_price"), 0.0), 2),
                    "volume": int(_to_float(nse_snapshot.get("volume"), 0.0)),
                }
                payload = _build_detail_payload_from_points(symbol, [now_point], "nse_quote_fallback")
                _detail_cache[symbol] = {"ts": time.time(), "data": payload}
                return payload

        chart_points = _fetch_chart_points(symbol, range_window="6mo", interval="1d", limit=120)
        if chart_points:
            payload = _build_detail_payload_from_points(symbol, chart_points, "yahoo_chart")
            _detail_cache[symbol] = {"ts": time.time(), "data": payload}
            return payload
        binance_points = _fetch_binance_klines(symbol)
        if binance_points:
            payload = _build_detail_payload_from_points(symbol, binance_points, "binance_fallback")
            _detail_cache[symbol] = {"ts": time.time(), "data": payload}
            return payload
        snapshot_payload = _build_detail_payload_from_db_snapshot(symbol)
        if snapshot_payload:
            _detail_cache[symbol] = {"ts": time.time(), "data": snapshot_payload}
            return snapshot_payload

        if cached:
            return cached["data"]
        raise ValueError("No market data found for symbol")

    closes = [float(x) for x in history["Close"].dropna().tolist()]
    volumes = [float(x) for x in history["Volume"].fillna(0).tolist()]

    returns = []
    for i in range(1, len(closes)):
        prev = closes[i - 1]
        current = closes[i]
        if prev:
            returns.append((current - prev) / prev)

    avg_return = statistics.mean(returns) if returns else 0.0
    volatility = statistics.stdev(returns) if len(returns) > 1 else 0.0

    def _simple_rsi(period: int = 14):
        if len(closes) <= period:
            return 50.0
        gains, losses = [], []
        for i in range(-period + 1, 0):
            delta = closes[i] - closes[i - 1]
            gains.append(max(delta, 0))
            losses.append(abs(min(delta, 0)))
        avg_gain = sum(gains) / period
        avg_loss = sum(losses) / period if losses else 0.0001
        rs = avg_gain / avg_loss if avg_loss else 0
        return 100 - (100 / (1 + rs))

    try:
        info = ticker.info
    except Exception:
        info = {}

    try:
        news_items = ticker.news or []
    except Exception:
        news_items = []
    headlines = [item.get("title", "") for item in news_items if item.get("title")]
    sentiment = _sentiment_from_headlines(headlines)

    chart_points = []
    for index, row in history.tail(120).iterrows():
        chart_points.append(
            {
                "date": index.strftime("%Y-%m-%d"),
                "close": round(_to_float(row.get("Close")), 2),
                "open": round(_to_float(row.get("Open")), 2),
                "high": round(_to_float(row.get("High")), 2),
                "low": round(_to_float(row.get("Low")), 2),
                "volume": int(_to_float(row.get("Volume"))),
            }
        )

    payload = {
        "symbol": symbol,
        "name": info.get("longName", symbol.replace(".NS", "")),
        "sector": info.get("sector", "Unknown"),
        "currency": info.get("currency", "INR" if _is_indian_symbol(symbol) else "USD"),

        "market_price": round(closes[-1], 2),
        "fundamentals": {
            "pe_ratio": _to_float(info.get("trailingPE"), 0.0),
            "market_cap": _to_float(info.get("marketCap"), 0.0),
            "roe": _to_float(info.get("returnOnEquity"), 0.0),
            "dividend_yield": _to_float(info.get("dividendYield"), 0.0),
        },
        "statistics": {
            "avg_daily_return_pct": round(avg_return * 100, 3),
            "annualized_volatility_pct": round(volatility * (252 ** 0.5) * 100, 3),
            "rsi_14": round(_simple_rsi(), 2),
            "six_month_return_pct": round(((closes[-1] - closes[0]) / closes[0]) * 100, 2) if closes[0] else 0.0,
            "avg_volume": round(statistics.mean(volumes), 2) if volumes else 0.0,
        },
        "sentiment": sentiment,
        "headlines": headlines[:8],
        "trend": chart_points,
    }
    _detail_cache[symbol] = {"ts": time.time(), "data": payload}
    return payload


def get_stock_sentiment(symbol: str) -> dict:
    detail = get_stock_detail_analysis(symbol)
    return {
        "symbol": detail["symbol"],
        "sentiment": detail["sentiment"],
        "headlines": detail["headlines"],
    }


def execute_market_trade(*, user, symbol: str, side: str, quantity, price=None, mpin: str = "", portfolio_name: str = "Primary"):
    symbol = symbol.upper()
    if symbol in ALLOWED_US_SYMBOLS:
        resolved_symbol = symbol
    elif symbol.endswith(".NS"):
        resolved_symbol = symbol
    elif f"{symbol}.NS" in ALLOWED_NSE_SYMBOLS:
        resolved_symbol = f"{symbol}.NS"
    else:
        raise ValueError("Symbol is outside configured stock universe")

    yf_symbol = _to_yf_symbol(resolved_symbol)
    ticker = yf.Ticker(yf_symbol)
    last_close = _to_float(getattr(ticker.fast_info, "last_price", 0), 0)
    execution_price = price or last_close
    if execution_price <= 0:
        raise ValueError("Unable to resolve valid market price")

    stock, _ = StockMaster.objects.get_or_create(
        symbol=resolved_symbol,
        defaults={
            "name": ticker.info.get("longName", resolved_symbol),
            "sector": ticker.info.get("sector", "Unknown"),
        },
    )
    portfolio, _ = Portfolio.objects.get_or_create(user=user, name=portfolio_name or "Primary")

    trade = execute_trade(
        user=user,
        portfolio_id=portfolio.id,
        stock_id=stock.id,
        side=side,
        quantity=quantity,
        price=execution_price,
        mpin=mpin,
    )

    return {
        "transaction_id": trade.id,
        "symbol": resolved_symbol,

        "side": trade.side,
        "quantity": float(trade.quantity),
        "price": float(trade.price),
        "executed_at": trade.executed_at.isoformat(),
    }
