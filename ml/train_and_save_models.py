import os
import joblib
import pandas as pd
import yfinance as yf
from sklearn.linear_model import LinearRegression
from sklearn.ensemble import RandomForestRegressor
from datetime import datetime
import shutil

def build_model_registry():
    """
    Downloads historical data for top index stocks, 
    aggregates them into a single dataset,
    trains ONE global machine learning model, 
    and saves physical artifacts into the ML folder registry.
    """
    base_dir = os.path.dirname(os.path.abspath(__file__))
    models_dir = os.path.join(base_dir, 'models')
    dataset_dir = os.path.join(base_dir, 'datasets')
    
    # Recreate the directories to clean up the per-stock artifacts
    if os.path.exists(models_dir):
        shutil.rmtree(models_dir)
    os.makedirs(models_dir, exist_ok=True)
    os.makedirs(dataset_dir, exist_ok=True)
    
    print(f"Initializing Unified ML Pipeline in {base_dir}...")
    
    symbols = ['AAPL', 'MSFT', 'RELIANCE.NS', 'TCS.NS', 'INFY.NS', 'HDFCBANK.NS']
    all_data = []
    
    print("Fetching and aggregating data for global model...")
    for symbol in symbols:
        try:
            ticker = yf.Ticker(symbol)
            df = ticker.history(period="2y")
            if df.empty: continue
            
            # Feature Engineering per stock before aggregation
            df['Target'] = df['Close'].shift(-1)
            df.dropna(inplace=True)
            df['Symbol'] = symbol # Keep track of symbol in raw dataset, though model won't use it directly
            
            all_data.append(df)
            print(f"  ✓ Added {len(df)} rows from {symbol}")
        except Exception as e:
            print(f"Error fetching data for {symbol}: {e}")
            
    if not all_data:
        print("Failed to fetch any data. Exiting.")
        return

    # Combine all stocks into ONE dataset
    master_df = pd.concat(all_data, ignore_index=True)
    
    dataset_path = os.path.join(dataset_dir, "unified_global_dataset.csv")
    master_df.to_csv(dataset_path, index=False)
    print(f"\n✅ Aggregated {len(master_df)} total rows across all stocks into {dataset_path}")
    
    # Train Global Models
    features = ['Open', 'High', 'Low', 'Close', 'Volume']
    X = master_df[features]
    y = master_df['Target']
    
    print("\nTraining ONE Unified Global Linear Regression Model...")
    lr_model = LinearRegression()
    lr_model.fit(X, y)
    lr_path = os.path.join(models_dir, "global_linear_regression.pkl")
    joblib.dump(lr_model, lr_path)
    
    print("Training ONE Unified Global Random Forest Model...")
    rf_model = RandomForestRegressor(n_estimators=100, random_state=42)
    rf_model.fit(X, y)
    rf_path = os.path.join(models_dir, "global_random_forest.pkl")
    joblib.dump(rf_model, rf_path)
    
    # Write a metadata registry file
    registry_meta = os.path.join(models_dir, "model_registry.txt")
    with open(registry_meta, 'w') as f:
        f.write(f"Model Registry Last Updated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n")
        f.write("Status: UNIFIED GLOBAL MODEL COMPILED\n")
        f.write(f"Trained on {len(master_df)} rows across {len(symbols)} stocks.\n")
        
    print("\n✅ Initialized ML Registry successfully.")
    print("The 'ml/models' folder now contains ONLY the single global predictive models.")

if __name__ == "__main__":
    build_model_registry()

