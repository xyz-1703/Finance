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
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function PredictionPage() {
  const [sectors, setSectors] = useState({});
  const [selectedSector, setSelectedSector] = useState("");
  const [selectedStock, setSelectedStock] = useState("");
  const [selectedModel, setSelectedModel] = useState("linear");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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

  const handlePredict = async () => {
    if (!selectedStock) return;
    setLoading(true);
    setError("");
    try {
      const res = await api.get(`/mlops/predict/?ticker=${selectedStock}&model=${selectedModel}`);
      setResult(res.data);
    } catch (err) {
      setError("Prediction failed. Try another model or stock.");
    } finally {
      setLoading(false);
    }
  };

  const stocksInSector = selectedSector ? sectors[selectedSector] : [];

  const chartData = result
    ? {
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
      }
    : null;

  return (
    <main className="app-shell animate-fade-in">
      <header className="mb-8">
        <h1 className="text-3xl font-black text-white tracking-tighter uppercase">AI Prediction Engine</h1>
        <p className="text-finance-muted text-xs font-bold uppercase tracking-widest mt-1">Classification & Outcome Analysis</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <aside className="glass-card p-6 h-fit space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-finance-muted uppercase tracking-widest">Sector Authority</label>
            <select 
              className="input-field text-sm"
              value={selectedSector}
              onChange={(e) => {
                setSelectedSector(e.target.value);
                setSelectedStock("");
              }}
            >
              <option value="">Select Sector</option>
              {Object.keys(sectors).map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-finance-muted uppercase tracking-widest">Asset Ticker</label>
            <select 
              className="input-field text-sm"
              value={selectedStock}
              onChange={(e) => setSelectedStock(e.target.value)}
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
              onChange={(e) => setSelectedModel(e.target.value)}
            >
              <option value="linear">Linear Regression</option>
              <option value="logistic">Logistic Regression</option>
              <option value="arima">ARIMA (Stats)</option>
              <option value="lstm">LSTM (Neural)</option>
            </select>
          </div>

          <button 
            className="btn-primary w-full py-3" 
            onClick={handlePredict}
            disabled={loading || !selectedStock}
          >
            {loading ? "Analyzing..." : "RUN PREDICTION"}
          </button>

          {error && <p className="text-rose-400 text-[10px] font-bold uppercase text-center mt-4">{error}</p>}
        </aside>

        <section className="lg:col-span-3 space-y-8">
          {result && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="glass-card p-6 border-white/5">
                  <span className="block text-[9px] text-finance-muted uppercase font-bold tracking-widest mb-1">Mean Absolute Error</span>
                  <span className="text-2xl font-black text-white">{result.metrics.mae.toFixed(4)}</span>
                </div>
                <div className="glass-card p-6 border-white/5">
                  <span className="block text-[9px] text-finance-muted uppercase font-bold tracking-widest mb-1">Root Mean Square Error</span>
                  <span className="text-2xl font-black text-white">{result.metrics.rmse.toFixed(4)}</span>
                </div>
                <div className="glass-card p-6 border-white/5">
                  <span className="block text-[9px] text-finance-muted uppercase font-bold tracking-widest mb-1">R-Squared Score</span>
                  <span className="text-2xl font-black text-finance-primary">{result.metrics.r2.toFixed(4)}</span>
                </div>
              </div>

              <div className="glass-card p-8 min-h-[400px]">
                <h3 className="text-sm font-black text-white uppercase tracking-widest mb-8 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-finance-primary animate-pulse"></span>
                  Projected Movement: {selectedStock}
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
                          y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#64748b', font: { size: 10 } } }
                        }
                      }} 
                    />
                  </div>
                )}
              </div>
            </>
          )}

          {!result && !loading && (
            <div className="glass-card p-24 flex flex-col items-center justify-center text-center border-dashed border-white/10">
              <div className="w-16 h-16 rounded-3xl bg-white/5 flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-finance-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
              </div>
              <h3 className="text-white font-black uppercase tracking-widest text-sm mb-2">System Ready</h3>
              <p className="text-finance-muted text-xs max-w-xs">Select an asset authority and model strategy to generate AI predictions.</p>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
