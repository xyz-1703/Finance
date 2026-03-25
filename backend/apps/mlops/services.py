try:
    import mlflow
except ImportError:
    mlflow = None

try:
    import numpy as np
except ImportError:
    np = None

try:
    from sklearn.cluster import KMeans
    from sklearn.linear_model import LinearRegression
    from sklearn.preprocessing import StandardScaler
except ImportError:
    KMeans = LinearRegression = StandardScaler = None

try:
    from statsmodels.tsa.arima.model import ARIMA
except ImportError:
    ARIMA = None

from apps.portfolio.models import Portfolio, Holding
from apps.stocks.models import StockMaster
import yfinance as yf

from .models import PredictionRun, StockCluster


def _cluster_symbols(*, symbols: list[str], n_clusters: int, created_by, portfolio: Portfolio | None = None):
    if np is None or KMeans is None:
        raise ValueError("ML Clustering dependencies (numpy, sklearn) are not available in this environment.")
    
    stocks = list(StockMaster.objects.filter(symbol__in=symbols))
    if len(stocks) < n_clusters:
        # Fallback: adjust clusters if user has fewer stocks than requested
        n_clusters = max(2, len(stocks))
        if len(stocks) < 2:
             raise ValueError("At least 2 stocks are required for clustering analysis.")

    features = []
    valid_stocks = []
    
    for stock in stocks:
        try:
            ticker = yf.Ticker(stock.symbol)
            info = ticker.info
            
            pe_ratio = info.get('trailingPE') or info.get('forwardPE') or 0.0
            roe = info.get('returnOnEquity') or 0.0
            market_cap = info.get('marketCap') or 0.0
            
            features.append([float(pe_ratio), float(roe), float(market_cap)])
            valid_stocks.append(stock)
        except Exception:
            continue

    if len(valid_stocks) < n_clusters:
        n_clusters = len(valid_stocks)
        if n_clusters < 2:
            raise ValueError("Insufficient data fetched for clustering. Try again later.")

    matrix = np.array(features)
    # Basic normalization to improve KMeans performance
    if StandardScaler:
        try:
            scaler = StandardScaler()
            matrix_scaled = scaler.fit_transform(matrix)
        except Exception:
            matrix_scaled = matrix
    else:
        matrix_scaled = matrix

    model = KMeans(n_clusters=n_clusters, random_state=42, n_init="auto")
    labels = model.fit_predict(matrix_scaled)

    results = []
    for stock, label, vector in zip(valid_stocks, labels, features, strict=True):
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
        Holding.objects.filter(portfolio=portfolio)
        .select_related("stock")
        .values_list("stock__symbol", flat=True)
    )
    if not symbols:
        raise ValueError("Portfolio has no stocks to cluster")

    return _cluster_symbols(symbols=symbols, n_clusters=n_clusters, created_by=created_by, portfolio=portfolio)


def run_prediction(*, symbol: str, model_type: str, created_by):
    if np is None:
        raise ValueError("Numpy is required for prediction but is not available.")

    stock = StockMaster.objects.get(symbol=symbol)
    price_data = list(stock.prices.order_by("timestamp").values_list("close", flat=True))
    if len(price_data) < 5:
        raise ValueError("At least 5 price points required for prediction")

    series = np.array([float(x) for x in price_data])
    
    # MLflow tracking
    tracking_uri = getattr(settings, 'MLFLOW_TRACKING_URI', None)
    if mlflow and tracking_uri:
        mlflow.set_tracking_uri(tracking_uri)
        active_run = mlflow.start_run(run_name=f"{symbol}-{model_type}")
    else:
        active_run = None

    try:
        if model_type == PredictionRun.MODEL_LINEAR:
            if LinearRegression is None:
                raise ValueError("LinearRegression is not available.")
            x = np.arange(len(series)).reshape(-1, 1)
            model = LinearRegression()
            model.fit(x, series)
            prediction = float(model.predict(np.array([[len(series)]]))[0])
            score = float(model.score(x, series))
            metrics = {"r2": score}
            if active_run:
                mlflow.log_metric("r2", score)
        else:
            if ARIMA is None:
                raise ValueError("ARIMA is not available.")
            arima_model = ARIMA(series, order=(2, 1, 1)).fit()
            forecast = arima_model.forecast(steps=1)
            prediction = float(forecast[0])
            aic = float(arima_model.aic)
            metrics = {"aic": aic}
            if active_run:
                mlflow.log_metric("aic", aic)

        if active_run:
            mlflow.log_param("symbol", symbol)
            mlflow.log_param("model_type", model_type)
            run_id = active_run.info.run_id
        else:
            run_id = "local_only"

        return PredictionRun.objects.create(
            stock=stock,
            model_type=model_type,
            prediction=prediction,
            metrics=metrics,
            mlflow_run_id=run_id,
            created_by=created_by,
        )
    finally:
        if active_run:
            mlflow.end_run()
