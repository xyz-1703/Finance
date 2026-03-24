from pathlib import Path
import os

import mlflow
import numpy as np
import pandas as pd
from sklearn.linear_model import LinearRegression
from statsmodels.tsa.arima.model import ARIMA


def run_training(data_path: str):
    df = pd.read_csv(data_path)
    if "close" not in df.columns:
        raise ValueError("CSV must contain 'close' column")

    series = df["close"].astype(float).values
    x = np.arange(len(series)).reshape(-1, 1)

    mlflow.set_tracking_uri(os.getenv("MLFLOW_TRACKING_URI", "./mlruns"))
    with mlflow.start_run(run_name="offline-training"):
        linear = LinearRegression()
        linear.fit(x, series)
        r2 = float(linear.score(x, series))
        mlflow.log_metric("linear_r2", r2)

        arima = ARIMA(series, order=(2, 1, 1)).fit()
        mlflow.log_metric("arima_aic", float(arima.aic))
        mlflow.log_param("dataset", Path(data_path).name)

    print("Training complete. Metrics logged to MLflow.")


if __name__ == "__main__":
    run_training("sample_prices.csv")
