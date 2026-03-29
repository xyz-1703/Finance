import numpy as np
import pandas as pd
from sklearn.linear_model import LinearRegression
from statsmodels.tsa.arima.model import ARIMA
import tensorflow as tf
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import LSTM, Dense
import mlflow
import mlflow.tensorflow
import mlflow.sklearn
import mlflow.statsmodels
import datetime
import os

# Set explicit tracking URI to avoid permission issues on OneDrive
tracking_uri = f"file:///{os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', 'mlruns'))}".replace('\\', '/')
mlflow.set_tracking_uri(tracking_uri)
mlflow.set_experiment("QuantVista_Forecasting")

def prepare_data(df, lookback=15):
    """Simple scaling and sequence preparation for LSTM"""
    data = df['close'].values.reshape(-1, 1)
    
    # Simple MinMax scaling manually to avoid more dependencies
    min_val = np.min(data)
    max_val = np.max(data)
    scaled_data = (data - min_val) / (max_val - min_val + 1e-8)
    
    X, y = [], []
    for i in range(len(scaled_data) - lookback):
        X.append(scaled_data[i:i+lookback, 0])
        y.append(scaled_data[i+lookback, 0])
    
    return np.array(X).reshape(-1, lookback, 1), np.array(y), min_val, max_val

def run_prediction_models(df, symbol):
    """Runs ARIMA, LSTM, and Linear Regression with MLflow tracking"""
    results = {}
    
    # 1. Linear Regression
    with mlflow.start_run(run_name=f"LR_{symbol}"):
        mlflow.log_param("model_type", "LinearRegression")
        mlflow.log_param("symbol", symbol)
        
        X = np.arange(len(df)).reshape(-1, 1)
        y = df['close'].values
        model = LinearRegression().fit(X, y)
        
        # Predict next 30 steps
        future_X = np.arange(len(df), len(df) + 30).reshape(-1, 1)
        lr_pred = model.predict(future_X)
        results['linear_regression'] = lr_pred.tolist()
        
        mlflow.log_metric("final_price", lr_pred[-1])
        mlflow.sklearn.log_model(model, "model")

    # 2. ARIMA
    with mlflow.start_run(run_name=f"ARIMA_{symbol}"):
        mlflow.log_param("model_type", "ARIMA")
        mlflow.log_param("order", "(5,1,0)")
        
        try:
            # ARIMA(5,1,0) is a safe default for short series
            model = ARIMA(df['close'].values, order=(5, 1, 0))
            model_fit = model.fit()
            arima_pred = model_fit.forecast(steps=30)
            results['arima'] = arima_pred.tolist()
            mlflow.log_metric("final_price", arima_pred[-1])
        except Exception as e:
            print(f"ARIMA failed for {symbol}: {e}")
            results['arima'] = results['linear_regression'] # Fallback

    # 3. LSTM
    with mlflow.start_run(run_name=f"LSTM_{symbol}"):
        mlflow.log_param("model_type", "LSTM")
        mlflow.log_param("epochs", 5)
        
        try:
            lookback = 15
            if len(df) > lookback + 5:
                X, y, min_val, max_val = prepare_data(df, lookback)
                
                model = Sequential([
                    LSTM(10, input_shape=(lookback, 1)),
                    Dense(1)
                ])
                model.compile(optimizer='adam', loss='mse')
                model.fit(X, y, epochs=5, verbose=0)
                
                # Recursive prediction for 30 steps
                current_batch = X[-1].reshape(1, lookback, 1)
                lstm_predictions = []
                
                for _ in range(30):
                    current_pred = model.predict(current_batch, verbose=0)[0]
                    lstm_predictions.append(current_pred[0])
                    # Update batch
                    current_batch = np.append(current_batch[:, 1:, :], [[current_pred]], axis=1)
                
                # Inverse scale
                lstm_final = np.array(lstm_predictions) * (max_val - min_val) + min_val
                results['lstm'] = lstm_final.tolist()
                mlflow.log_metric("final_price", lstm_final[-1])
                mlflow.tensorflow.log_model(model, "model")
            else:
                results['lstm'] = results['linear_regression']
        except Exception as e:
            print(f"LSTM failed for {symbol}: {e}")
            results['lstm'] = results['linear_regression']
            
    return results
