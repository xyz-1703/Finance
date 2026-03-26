import { useState, useEffect } from "react";
import api from "../api/client";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function MLPage() {
  const [activeTab, setActiveTab] = useState("prediction");

  const [sectors, setSectors] = useState({});
  const [selectedSector, setSelectedSector] = useState("");
  const [selectedStock, setSelectedStock] = useState("");
  const [selectedModel, setSelectedModel] = useState("linear");
  
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const modeContent = {
    prediction: {
      title: "AI Prediction Engine",
      subtitle: "Classification & Outcome Analysis",
      buttonText: "RUN PREDICTION",
      models: [
        { id: "linear", name: "Linear Regression" },
        { id: "logistic", name: "Logistic Regression" }
      ]
    },
    forecasting: {
      title: "Market Forecasting",
      subtitle: "30-Day Predictive Trajectories",
      buttonText: "PROJECT TRAJECTORY",
      models: [
        { id: "arima", name: "ARIMA (Time Series)" },
        { id: "lstm", name: "LSTM (Deep Learning)" }
      ]
    }
  };

  const currentContent = modeContent[activeTab];

  useEffect(() => {
    fetchSectors();
  }, []);

  const fetchSectors = async () => {
    try {
      const res = await api.get("/stocks/stocks/by_sector/");
      setSectors(res.data || {});
    } catch (err) {
      setError("Failed to load sectors.");
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSelectedSector("");
    setSelectedStock("");
    setSelectedModel(tab === "prediction" ? "linear" : "arima");
    setResult(null);
    setError("");
  };

  const handleRunModel = async () => {
    if (!selectedStock) return;
    setLoading(true);
    setError("");
    try {
      const endpoint = activeTab === "prediction" 
        ? `/mlops/prediction/?ticker=${selectedStock}&model=${selectedModel}`
        : `/mlops/forecast/?ticker=${selectedStock}&model=${selectedModel}`;
      
      const res = await api.get(endpoint);
      setResult(res.data);
    } catch (err) {
      setError(activeTab === "prediction" 
        ? "Prediction failed. Try another model or stock."
        : "Forecasting failed. Models like LSTM/ARIMA may require more historical data or system resources.");
    } finally {
      setLoading(false);
    }
  };

  const stocksInSector = selectedSector ? sectors[selectedSector] : [];

  const getChartData = () => {
    if (!result) return null;

    if (activeTab === "prediction") {
      return {
        labels: [...result.historical_dates.slice(-30), ...(result.prediction_dates || [])],
        datasets: [
          {
            label: "Historical",
            data: [...result.historical_prices.slice(-30), ...Array(result.prediction_dates?.length || 0).fill(null)],
            borderColor: "rgba(255, 255, 255, 0.5)",
            borderDash: [5, 5],
          },
          {
            label: "Prediction",
            data: [...Array(30).fill(null), ...(result.prediction_prices || [])],
            borderColor: "#3b82f6",
            backgroundColor: "rgba(59, 130, 246, 0.5)",
            pointRadius: 4,
          },
        ],
      };
    } else {
      return {
        labels: [...result.historical_dates.slice(-60), ...(result.prediction_dates || [])],
        datasets: [
          {
            label: "Historical Price",
            data: [...result.historical_prices.slice(-60), ...Array(result.prediction_dates?.length || 0).fill(null)],
            borderColor: "rgba(255, 255, 255, 0.3)",
            borderWidth: 1,
            pointRadius: 0,
          },
          {
            label: "30-Day Forecast",
            data: [...Array(60).fill(null), ...(result.prediction_prices || [])],
            borderColor: "#10b981",
            backgroundColor: "rgba(16, 185, 129, 0.1)",
            fill: true,
            pointRadius: 2,
            tension: 0.4,
          },
        ],
      };
    }
  };

  const chartData = getChartData();

  return (
    <main className="app-shell animate-fade-in flex flex-col md:flex-row gap-8">
      {/* Sidebar for Navigation */}
      <aside className="w-full md:w-64 glass-card p-4 h-fit shrink-0 space-y-2">
        <div className="flex items-center gap-3 px-4 py-3 mb-4">
          <span className="badge badge-primary">ML</span>
          <span className="text-finance-muted text-xs font-mono uppercase tracking-widest">Dashboard</span>
        </div>
        
        <button
          onClick={() => handleTabChange("prediction")}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold text-sm tracking-widest uppercase ${
            activeTab === "prediction"
              ? "bg-finance-primary/20 text-finance-primary border border-finance-primary/30 shadow-lg shadow-finance-primary/10"
              : "text-finance-muted hover:bg-white/5 hover:text-white"
          }`}
        >
          <svg className="w-5 h-5 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
          Prediction
        </button>

        <button
          onClick={() => handleTabChange("forecasting")}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold text-sm tracking-widest uppercase ${
            activeTab === "forecasting"
              ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shadow-lg shadow-emerald-500/10"
              : "text-finance-muted hover:bg-white/5 hover:text-white"
          }`}
        >
          <svg className="w-5 h-5 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
          Forecasting
        </button>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 space-y-8">
        <header className="mb-8">
          <h1 className="text-3xl font-black text-white tracking-tighter uppercase">{currentContent.title}</h1>
          <p className="text-finance-muted text-xs font-bold uppercase tracking-widest mt-1">{currentContent.subtitle}</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Controls */}
          <aside className="glass-card p-6 h-fit space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-finance-muted uppercase tracking-widest">Industry Segment</label>
              <select 
                className="input-field text-sm"
                value={selectedSector}
                onChange={(e) => {
                  setSelectedSector(e.target.value);
                  setSelectedStock("");
                  setResult(null);
                }}
              >
                <option value="">Select Sector</option>
                {Object.keys(sectors).map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-finance-muted uppercase tracking-widest">Target Stock</label>
              <select 
                className="input-field text-sm"
                value={selectedStock}
                onChange={(e) => {
                  setSelectedStock(e.target.value);
                  setResult(null);
                }}
                disabled={!selectedSector}
              >
                <option value="">{stocksInSector.length === 0 ? "No stocks identified" : "Select Stock"}</option>
                {stocksInSector.map(s => <option key={s.id} value={s.symbol}>{s.symbol} - {s.name}</option>)}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-finance-muted uppercase tracking-widest">Model Strategy</label>
              <select 
                className="input-field text-sm"
                value={selectedModel}
                onChange={(e) => {
                  setSelectedModel(e.target.value);
                  setResult(null);
                }}
              >
                {currentContent.models.map(model => (
                  <option key={model.id} value={model.id}>{model.name}</option>
                ))}
              </select>
            </div>

            <button 
              className={`btn-primary w-full py-3 ${activeTab === 'forecasting' ? 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-500/20' : ''}`}
              onClick={handleRunModel}
              disabled={loading || !selectedStock}
            >
              {loading ? "Calculating..." : currentContent.buttonText}
            </button>

            {error && <p className="text-rose-400 text-[10px] font-bold uppercase text-center mt-4">{error}</p>}
          </aside>

          {/* Results */}
          <section className="lg:col-span-3 space-y-8">
            {result && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="glass-card p-6 border-white/5">
                    <span className="block text-[9px] text-finance-muted uppercase font-bold tracking-widest mb-1">Mean Absolute Error</span>
                    <span className="text-2xl font-black text-white">{result.metrics.mae?.toFixed(4) || "N/A"}</span>
                  </div>
                  <div className="glass-card p-6 border-white/5">
                    <span className="block text-[9px] text-finance-muted uppercase font-bold tracking-widest mb-1">Root Mean Square Error</span>
                    <span className="text-2xl font-black text-white">{result.metrics.rmse?.toFixed(4) || "N/A"}</span>
                  </div>
                  <div className="glass-card p-6 border-white/5">
                    <span className="block text-[9px] text-finance-muted uppercase font-bold tracking-widest mb-1">
                      {activeTab === "prediction" ? "R-Squared Score" : "Accuracy (R2)"}
                    </span>
                    <span className={`text-2xl font-black ${activeTab === 'prediction' ? 'text-finance-primary' : 'text-white'}`}>
                      {activeTab === "prediction" 
                        ? result.metrics.r2?.toFixed(4) || "N/A"
                        : (result.metrics.r2 * 100)?.toFixed(1) + "%"}
                    </span>
                  </div>
                </div>

                <div className="glass-card p-8 min-h-[400px]">
                  <h3 className="text-sm font-black text-white uppercase tracking-widest mb-8 flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full animate-pulse ${activeTab === 'prediction' ? 'bg-finance-primary' : 'bg-emerald-400'}`}></span>
                    {activeTab === "prediction" ? "Projected Movement:" : "Forecast Projection:"} {selectedStock}
                  </h3>
                  {chartData && (
                    <div className="h-[350px]">
                      <Line 
                        data={chartData} 
                        options={{
                          responsive: true,
                          maintainAspectRatio: false,
                          plugins: { legend: { display: false } },
                          scales: {
                            x: { grid: { display: false }, ticks: { display: false } },
                            y: { 
                              grid: { color: 'rgba(255,255,255,0.05)' }, 
                              ticks: { 
                                color: '#64748b', 
                                font: { size: 10 },
                                callback: activeTab === 'forecasting' ? (val) => '₹' + Number(val).toLocaleString() : undefined
                              } 
                            }
                          }
                        }} 
                      />
                    </div>
                  )}
                </div>
              </>
            )}

            {!result && !loading && (
              <div className={`glass-card p-24 flex flex-col items-center justify-center text-center border-dashed border-white/10 ${activeTab === 'forecasting' ? 'opacity-60' : ''}`}>
                <div className={`w-16 h-16 rounded-3xl bg-white/5 flex items-center justify-center mb-6`}>
                  {activeTab === "prediction" ? (
                    <svg className="w-8 h-8 text-finance-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
                  ) : (
                    <svg className="w-10 h-10 text-finance-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
                  )}
                </div>
                <h3 className="text-white font-black uppercase tracking-widest text-sm mb-2">
                  {activeTab === "prediction" ? "System Ready" : "Awaiting Optimization"}
                </h3>
                <p className="text-finance-muted text-xs max-w-xs">
                  {activeTab === "prediction" 
                    ? "Select an asset authority and model strategy to generate AI predictions."
                    : "Select an industry segment and stock for 30-day algorithmic projections."}
                </p>
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}
