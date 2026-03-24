from __future__ import annotations

import mlflow
import numpy as np
from django.conf import settings
from sklearn.cluster import KMeans
from sklearn.linear_model import LinearRegression
from statsmodels.tsa.arima.model import ARIMA

from apps.portfolio.models import Portfolio, PortfolioStock
from apps.stocks.models import Stock

from .models import PredictionRun, StockCluster


def _cluster_symbols(*, symbols: list[str], n_clusters: int, created_by, portfolio: Portfolio | None = None):
    stocks = list(Stock.objects.filter(symbol__in=symbols).select_related("fundamental"))
    if len(stocks) < n_clusters:
        raise ValueError("Number of stocks must be greater than or equal to n_clusters")

    features = []
    for stock in stocks:
        fundamental = getattr(stock, "fundamental", None)
        pe_ratio = float(fundamental.pe_ratio) if fundamental and fundamental.pe_ratio is not None else 0.0
        roe = float(fundamental.roe) if fundamental and fundamental.roe is not None else 0.0
        market_cap = float(fundamental.market_cap) if fundamental and fundamental.market_cap is not None else 0.0
        features.append([pe_ratio, roe, market_cap])

    matrix = np.array(features)
    model = KMeans(n_clusters=n_clusters, random_state=42, n_init="auto")
    labels = model.fit_predict(matrix)

    results = []
    for stock, label, vector in zip(stocks, labels, matrix, strict=True):
        result, _ = StockCluster.objects.update_or_create(
            portfolio=portfolio,
            stock=stock,
            defaults={
                "cluster_label": int(label),
                "feature_vector": {"pe": vector[0], "roe": vector[1], "market_cap": vector[2]},
                "created_by": created_by,
            },
        )
        results.append(result)

    return results


def run_portfolio_clustering(*, symbols: list[str], n_clusters: int, created_by):
    return _cluster_symbols(symbols=symbols, n_clusters=n_clusters, created_by=created_by)


def run_portfolio_clustering_for_portfolio(*, portfolio_id: int, n_clusters: int, created_by):
    portfolio = Portfolio.objects.filter(id=portfolio_id, user=created_by).first()
    if portfolio is None:
        raise ValueError("Portfolio not found")

    symbols = list(
        PortfolioStock.objects.filter(portfolio=portfolio)
        .select_related("stock")
        .values_list("stock__symbol", flat=True)
    )
    if not symbols:
        raise ValueError("Portfolio has no stocks to cluster")

    return _cluster_symbols(symbols=symbols, n_clusters=n_clusters, created_by=created_by, portfolio=portfolio)


def run_prediction(*, symbol: str, model_type: str, created_by):
    stock = Stock.objects.get(symbol=symbol)
    price_data = list(stock.prices.order_by("timestamp").values_list("close", flat=True))
    if len(price_data) < 5:
        raise ValueError("At least 5 price points required for prediction")

    series = np.array([float(x) for x in price_data])
    mlflow.set_tracking_uri(settings.MLFLOW_TRACKING_URI)

    with mlflow.start_run(run_name=f"{symbol}-{model_type}") as run:
        if model_type == PredictionRun.MODEL_LINEAR:
            x = np.arange(len(series)).reshape(-1, 1)
            model = LinearRegression()
            model.fit(x, series)
            prediction = float(model.predict(np.array([[len(series)]]))[0])
            score = float(model.score(x, series))
            metrics = {"r2": score}
            mlflow.log_metric("r2", score)
        else:
            arima_model = ARIMA(series, order=(2, 1, 1)).fit()
            forecast = arima_model.forecast(steps=1)
            prediction = float(forecast[0])
            aic = float(arima_model.aic)
            metrics = {"aic": aic}
            mlflow.log_metric("aic", aic)

        mlflow.log_param("symbol", symbol)
        mlflow.log_param("model_type", model_type)

        return PredictionRun.objects.create(
            stock=stock,
            model_type=model_type,
            prediction=prediction,
            metrics=metrics,
            mlflow_run_id=run.info.run_id,
            created_by=created_by,
        )
