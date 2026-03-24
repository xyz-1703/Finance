from __future__ import annotations

from datetime import datetime, timedelta, timezone
from functools import lru_cache
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

INDIAN_SYMBOLS = [
    "RELIANCE.NS", "TCS.NS", "INFY.NS", "HDFCBANK.NS", "ICICIBANK.NS", "SBIN.NS", "LT.NS", "ITC.NS",
    "HINDUNILVR.NS", "BHARTIARTL.NS", "AXISBANK.NS", "KOTAKBANK.NS", "BAJFINANCE.NS", "ASIANPAINT.NS",
    "WIPRO.NS", "MARUTI.NS", "HCLTECH.NS", "TITAN.NS", "ULTRACEMCO.NS", "NESTLEIND.NS", "POWERGRID.NS",
    "SUNPHARMA.NS", "TATAMOTORS.NS", "M&M.NS", "NTPC.NS", "ADANIENT.NS", "ADANIPORTS.NS", "ONGC.NS",
    "COALINDIA.NS", "BAJAJFINSV.NS", "HDFCLIFE.NS", "JSWSTEEL.NS", "GRASIM.NS", "INDUSINDBK.NS",
]

LIST_CACHE_TTL_SECONDS = 300
DETAIL_CACHE_TTL_SECONDS = 300
_list_cache: dict = {"ts": 0.0, "data": []}
_detail_cache: dict[str, dict] = {}
BINANCE_BASE_URL = os.getenv("BINANCE_BASE_URL", "https://api.binance.com")


def _to_float(value, default=0.0):
    try:
        if value is None:
            return default
        return float(value)
    except Exception:
        return default


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
        return {
            "symbol": symbol,
            "name": symbol.replace(".NS", ""),
            "sector": "Unknown",
            "currency": "INR",
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


def get_indian_market_watchlist() -> list[dict]:
    if _list_cache["data"] and _is_fresh(_list_cache["ts"], LIST_CACHE_TTL_SECONDS):
        return _list_cache["data"]

    stocks = []
    prices = {}

    try:
        frame = yf.download(
            tickers=" ".join(INDIAN_SYMBOLS),
            period="5d",
            interval="1d",
            group_by="ticker",
            auto_adjust=False,
            progress=False,
            threads=True,
        )
        if not frame.empty:
            for symbol in INDIAN_SYMBOLS:
                try:
                    symbol_df = frame[symbol].dropna(how="all")
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
    except Exception:
        prices = {}

    for symbol in INDIAN_SYMBOLS:
        snapshot = prices.get(symbol, {})
        if not snapshot or _to_float(snapshot.get("market_price"), 0.0) <= 0:
            binance_snapshot = _fetch_binance_ticker_snapshot(symbol)
            if binance_snapshot:
                snapshot = binance_snapshot

        regular_price = _to_float(snapshot.get("market_price"), 0.0)
        previous_close = _to_float(snapshot.get("previous_close"), regular_price)
        day_change = regular_price - previous_close
        pct_change = (day_change / previous_close * 100) if previous_close else 0.0

        stocks.append(
            {
                "symbol": symbol,
                "name": symbol.replace(".NS", ""),
                "sector": "Unknown",
                "market_price": round(regular_price, 2),
                "day_change": round(day_change, 2),
                "day_change_pct": round(pct_change, 2),
                "volume": int(snapshot.get("volume", 0)),
                "market_cap": 0.0,
                "data_source": "binance" if "symbol" in snapshot else "yahoo",
            }
        )

    _list_cache["ts"] = time.time()
    _list_cache["data"] = stocks
    return stocks


def get_stock_detail_analysis(symbol: str) -> dict:
    if not symbol.endswith(".NS"):
        raise ValueError("Only Indian stocks with .NS symbols are supported")

    cached = _detail_cache.get(symbol)
    if cached and _is_fresh(cached.get("ts", 0.0), DETAIL_CACHE_TTL_SECONDS):
        return cached["data"]

    ticker = yf.Ticker(symbol)
    try:
        history = ticker.history(period="6mo", interval="1d")
    except YFRateLimitError:
        binance_points = _fetch_binance_klines(symbol)
        if binance_points:
            payload = _build_detail_payload_from_points(symbol, binance_points, "binance_fallback")
            _detail_cache[symbol] = {"ts": time.time(), "data": payload}
            return payload
        if cached:
            return cached["data"]
        return {
            "symbol": symbol,
            "name": symbol.replace(".NS", ""),
            "sector": "Unknown",
            "currency": "INR",
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
        binance_points = _fetch_binance_klines(symbol)
        if binance_points:
            payload = _build_detail_payload_from_points(symbol, binance_points, "binance_fallback")
            _detail_cache[symbol] = {"ts": time.time(), "data": payload}
            return payload
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
        "currency": info.get("currency", "INR"),
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
    if not symbol.endswith(".NS"):
        raise ValueError("Only Indian stocks with .NS symbols are supported")

    ticker = yf.Ticker(symbol)
    last_close = _to_float(getattr(ticker.fast_info, "last_price", 0), 0)
    execution_price = price or last_close
    if execution_price <= 0:
        raise ValueError("Unable to resolve valid market price")

    stock, _ = Stock.objects.get_or_create(
        symbol=symbol,
        defaults={
            "name": ticker.info.get("longName", symbol),
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
        "symbol": symbol,
        "side": trade.side,
        "quantity": float(trade.quantity),
        "price": float(trade.price),
        "executed_at": trade.executed_at.isoformat(),
    }
