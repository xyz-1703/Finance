from __future__ import annotations

import mlflow
import numpy as np
from django.conf import settings
from sklearn.cluster import KMeans
from sklearn.linear_model import LinearRegression
from statsmodels.tsa.arima.model import ARIMA

from apps.stocks.models import StockMaster

from .models import PredictionRun, StockCluster


def run_portfolio_clustering(*, symbols: list[str], n_clusters: int, created_by):
    stocks = list(StockMaster.objects.filter(symbol__in=symbols))
    if len(stocks) < n_clusters:
        raise ValueError("Number of stocks must be greater than or equal to n_clusters")

    features = []
    for stock in stocks:
        pe_ratio = 0.0
        roe = 0.0
        market_cap = 0.0
        features.append([pe_ratio, roe, market_cap])

    matrix = np.array(features)
    model = KMeans(n_clusters=n_clusters, random_state=42, n_init="auto")
    labels = model.fit_predict(matrix)

    results = []
    for stock, label, vector in zip(stocks, labels, matrix, strict=True):
        result, _ = StockCluster.objects.update_or_create(
            stock=stock,
            cluster_label=int(label),
            defaults={"feature_vector": {"pe": vector[0], "roe": vector[1], "market_cap": vector[2]}, "created_by": created_by},
        )
        results.append(result)

    return results


def run_prediction(*, symbol: str, model_type: str, created_by):
    stock = StockMaster.objects.get(symbol=symbol)
    price_data = list(stock.prices.order_by("updated_at").values_list("price", flat=True))
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
