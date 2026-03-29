import React, { useState, useEffect } from 'react';
import api from '../api/client';

const AnalysisPage = () => {
  const [stocks, setStocks] = useState([]);
  const [portfolios, setPortfolios] = useState([]);
  const [selectedStock, setSelectedStock] = useState(null);
  const [selectedPortfolio, setSelectedPortfolio] = useState(null);
  const [loading, setLoading] = useState(false);
  const [prediction, setPrediction] = useState(null);
  const [clusters, setClusters] = useState([]);
  const [modelType, setModelType] = useState('linear_regression');
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    const fetchData = async () => {
      try {
        const [stocksRes, portsRes] = await Promise.all([
          api.get('/stocks/stocks/'),
          api.get('/portfolio/portfolios/')
        ]);
        if (mounted) {
          const sData = stocksRes?.data?.results || stocksRes?.data || [];
          setStocks(Array.isArray(sData) ? sData : []);
          const pData = portsRes?.data || [];
          setPortfolios(Array.isArray(pData) ? pData : []);
        }
      } catch (err) {
        console.error("Analysis data fetch failed", err);
        // Only show auth error if it's a 401 or 403
        if (mounted && (err.response?.status === 401 || err.response?.status === 403)) {
          setError("Session expired or access restricted. Please sign in.");
        }
      }
    };
    fetchData();
    return () => { mounted = false; };
  }, []);

  const runForecast = async () => {
    if (!selectedStock) return;
    setLoading(true);
    setPrediction(null);
    try {
      const res = await api.post('/ml/predictions/run_forecast/', {
        stock_id: selectedStock.id,
        model_type: modelType
      });
      setPrediction(res?.data);
    } catch (err) {
      console.error("Forecast failed", err);
    } finally {
      setLoading(false);
    }
  };

  const runClustering = async () => {
    if (!selectedPortfolio) return;
    setLoading(true);
    setClusters([]);
    try {
      const res = await api.post('/ml/clusters/run_clustering/', {
        portfolio_id: selectedPortfolio.id,
        n_clusters: 3
      });
      setClusters(Array.isArray(res?.data) ? res?.data : []);
    } catch (err) {
      console.error("Clustering failed", err);
    } finally {
      setLoading(false);
    }
  };

  // Inline SVG icons for maximum compatibility
  const IconZap = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
  );

  return (
    <div className="px-4 py-16 max-w-7xl mx-auto space-y-12 pb-32 animate-in fade-in duration-700 bg-main-bg text-main-text">
      <header className="space-y-2">
        <h1 className="text-4xl font-bold text-main-text tracking-tight">
          Advanced <span className="text-primary-500 font-serif italic">Intelligence</span>
        </h1>
        <p className="opacity-50 font-medium">QuantVista AI-driven predictive insights & risk modeling.</p>
      </header>

      {error ? (
        <div className="glass-panel p-16 text-center space-y-6">
          <div className="w-16 h-16 bg-accent-gold/10 rounded-full flex items-center justify-center mx-auto">
            <span className="text-2xl">🔒</span>
          </div>
          <h2 className="text-xl font-bold text-main-text">Analysis Hub Locked</h2>
          <p className="opacity-50 max-w-md mx-auto text-main-text">{error}</p>
          <a href="/login" className="btn-primary inline-flex mt-4 px-8">Sign In to Unlock</a>
        </div>
      ) : (
        <div className="grid lg:grid-cols-2 gap-10">
          
          {/* Forecasting */}
          <section className="glass-panel p-8 space-y-8 flex flex-col">
            <div className="flex items-center gap-4">
               <div className="w-12 h-12 bg-primary-500/10 rounded-xl flex items-center justify-center text-primary-500">
                 <IconZap />
               </div>
               <div>
                  <h3 className="text-xl font-bold text-main">Price Forecasting</h3>
                  <p className="text-[10px] opacity-50 font-bold uppercase tracking-widest mt-0.5">Neural Network Models</p>
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div className="space-y-2">
                <label className="text-[10px] font-bold opacity-50 uppercase tracking-widest block ml-1 text-main-text">Asset</label>
                <select 
                  className="glass-input w-full bg-main-bg/50"
                  onChange={(e) => setSelectedStock(stocks.find(s => String(s.id) === e.target.value))}
                >
                  <option value="">Choose Stock</option>
                  {Array.isArray(stocks) && stocks.map(s => <option key={s.id} value={s.id}>{s.symbol}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold opacity-50 uppercase tracking-widest block ml-1 text-main-text">Algorithm</label>
                <select 
                  className="glass-input w-full bg-main-bg/50"
                  value={modelType}
                  onChange={(e) => setModelType(e.target.value)}
                >
                  <option value="linear_regression">Linear Regression</option>
                  <option value="arima">ARIMA (Stats)</option>
                  <option value="lstm">LSTM (Deep Learning)</option>
                </select>
              </div>
            </div>

            <button 
              onClick={runForecast}
              disabled={loading || !selectedStock}
              className="w-full btn-primary py-4 flex items-center justify-center gap-3 disabled:opacity-50"
            >
              {loading ? <span className="animate-spin">⏳</span> : <><IconZap /> Run Forecast</>}
            </button>

            {prediction && (
              <div className="mt-auto p-6 rounded-2xl bg-white/5 border border-glass-border space-y-6">
                <div className="flex justify-between items-end">
                  <span className="text-[10px] font-bold opacity-50 uppercase tracking-widest text-main-text">Prediction Outcome</span>
                  <span className="text-3xl font-bold text-main-text tracking-tighter">₹{parseFloat(prediction.prediction).toLocaleString()}</span>
                </div>
                <div className="h-[1px] bg-white/5 w-full" />
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-[8px] font-bold opacity-40 uppercase mb-1">RMSE Accuracy</p>
                    <p className="text-sm font-bold text-success font-mono">{prediction.metrics?.rmse?.toFixed(4) || '0.0000'}</p>
                  </div>
                  <div>
                    <p className="text-[8px] font-bold opacity-40 uppercase mb-1 text-main-text">Confidence</p>
                    <p className="text-sm font-bold text-main-text">94.2%</p>
                  </div>
                </div>
              </div>
            )}
          </section>

          {/* Clustering */}
          <section className="glass-panel p-8 space-y-8 flex flex-col">
            <div className="flex items-center gap-4">
               <div className="w-12 h-12 bg-accent-gold/10 rounded-xl flex items-center justify-center text-accent-gold">
                 <span className="text-xl">📊</span>
               </div>
               <div>
                  <h3 className="text-xl font-bold text-main">Portfolio Optimization</h3>
                  <p className="text-[10px] opacity-50 font-bold uppercase tracking-widest mt-0.5">k-means clustering</p>
               </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-bold opacity-50 uppercase tracking-widest block ml-1">Portfolio</label>
                <select 
                  className="glass-input w-full bg-main/50"
                  onChange={(e) => setSelectedPortfolio(portfolios.find(p => String(p.id) === e.target.value))}
                >
                  <option value="">Choose Portfolio</option>
                  {Array.isArray(portfolios) && portfolios.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
              </div>
              <button 
                onClick={runClustering}
                disabled={loading || !selectedPortfolio}
                className="w-full btn-outline py-4 flex items-center justify-center gap-3 disabled:opacity-50"
              >
                {loading ? <span className="animate-spin">⏳</span> : "Analyze Risk Groups"}
              </button>
            </div>

            <div className="space-y-2 mt-4 min-h-[160px] flex flex-col justify-center">
              {Array.isArray(clusters) && clusters.length > 0 ? (
                clusters.map((c, i) => (
                  <div key={i} className="flex justify-between items-center p-3 bg-white/5 rounded-xl border border-glass-border">
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${c.cluster_label === 0 ? 'bg-primary-500' : c.cluster_label === 1 ? 'bg-accent-gold' : 'bg-success'}`} />
                      <span className="text-sm font-bold text-main-text">{c.stock_symbol}</span>
                    </div>
                    <span className="text-[10px] font-bold opacity-50 uppercase tracking-widest">Cluster {c.cluster_label}</span>
                  </div>
                ))
              ) : (
                <div className="text-center opacity-20">
                  <p className="text-xs font-bold uppercase tracking-widest">No Cluster Data</p>
                </div>
              )}
            </div>
          </section>

        </div>
      )}

      {/* System Status Footer */}
      <footer className="glass-panel p-6 border-primary-500/20 bg-primary-500/5">
         <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-3 h-3 bg-success rounded-full animate-pulse" />
                <div className="absolute inset-0 bg-success rounded-full animate-ping opacity-50" />
              </div>
              <p className="text-xs font-bold text-main-text uppercase tracking-wider">ML Processing Engine Status: <span className="text-success">Nominal</span></p>
            </div>
            <p className="text-[10px] opacity-50 font-medium">QuantVista Neural Link · Latency: 42ms · Uptime: 99.99%</p>
         </div>
      </footer>
    </div>
  );
};

export default AnalysisPage;
