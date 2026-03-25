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

export default function ForecastingPage() {
  const [sectors, setSectors] = useState({});
  const [selectedSector, setSelectedSector] = useState("");
  const [selectedStock, setSelectedStock] = useState("");
  const [selectedModel, setSelectedModel] = useState("arima");
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

  const handleForecast = async () => {
    if (!selectedStock) return;
    setLoading(true);
    setError("");
    try {
      const res = await api.get(`/mlops/forecast/?ticker=${selectedStock}&model=${selectedModel}`);
      setResult(res.data);
    } catch (err) {
      setError("Forecasting failed. Models like LSTM/ARIMA may require more historical data or system resources.");
    } finally {
      setLoading(false);
    }
  };

  const stocksInSector = selectedSector ? sectors[selectedSector] : [];

  const chartData = result
    ? {
        labels: [...result.historical_dates.slice(-60), ...(result.forecast_dates || [])],
        datasets: [
          {
            label: "Historical Price",
            data: [...result.historical_prices.slice(-60), ...Array(result.forecast_dates?.length || 0).fill(null)],
            borderColor: "rgba(255, 255, 255, 0.3)",
            borderWidth: 1,
            pointRadius: 0,
          },
          {
            label: "30-Day Forecast",
            data: [...Array(60).fill(null), ...(result.forecast_prices || [])],
            borderColor: "#10b981",
            backgroundColor: "rgba(16, 185, 129, 0.1)",
            fill: true,
            pointRadius: 2,
            tension: 0.4,
          },
        ],
      }
    : null;

  return (
    <main className="app-shell animate-fade-in">
      <header className="mb-8">
        <h1 className="text-3xl font-black text-white tracking-tighter uppercase">Market Forecasting</h1>
        <p className="text-finance-muted text-xs font-bold uppercase tracking-widest mt-1">30-Day Predictive Trajectories</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <aside className="glass-card p-6 h-fit space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-finance-muted uppercase tracking-widest">Industry Segment</label>
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
            <label className="text-[10px] font-bold text-finance-muted uppercase tracking-widest">Target Stock</label>
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
            <label className="text-[10px] font-bold text-finance-muted uppercase tracking-widest">Forecasting Algorithm</label>
            <select 
              className="input-field text-sm"
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
            >
              <option value="arima">ARIMA (Time Series)</option>
              <option value="lstm">LSTM (Deep Learning)</option>
              <option value="linear">Linear Regression</option>
              <option value="logistic">Logistic Path</option>
            </select>
          </div>

          <button 
            className="btn-primary w-full py-3 bg-emerald-600 hover:bg-emerald-500 shadow-emerald-500/20" 
            onClick={handleForecast}
            disabled={loading || !selectedStock}
          >
            {loading ? "Calculating..." : "PROJECT TRAJECTORY"}
          </button>

          {error && <p className="text-rose-400 text-[10px] font-bold uppercase text-center mt-4">{error}</p>}
        </aside>

        <section className="lg:col-span-3 space-y-8">
          {result && (
            <div className="glass-card p-8 min-h-[500px]">
              <div className="flex justify-between items-start mb-8">
                <div>
                  <h3 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    Forecast Projection: {selectedStock}
                  </h3>
                  <p className="text-[10px] text-finance-muted font-bold uppercase tracking-widest mt-1">Generated via {selectedModel.toUpperCase()} Strategy</p>
                </div>
                <div className="flex gap-4">
                  <div className="text-right">
                    <span className="block text-[8px] text-finance-muted uppercase font-bold">Accuracy (R2)</span>
                    <span className="text-lg font-black text-white">{(result.metrics.r2 * 100).toFixed(1)}%</span>
                  </div>
                </div>
              </div>

              {chartData && (
                <div className="h-[400px]">
                  <Line 
                    data={chartData} 
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: { legend: { display: false } },
                      scales: {
                        x: { grid: { display: false }, ticks: { display: false } },
                        y: { 
                          grid: { color: 'rgba(255,255,255,0.02)' }, 
                          ticks: { 
                            color: '#64748b', 
                            font: { size: 10 },
                            callback: (val) => '₹' + Number(val).toLocaleString()
                          } 
                        }
                      }
                    }} 
                  />
                </div>
              )}
            </div>
          )}

          {!result && !loading && (
            <div className="glass-card p-32 flex flex-col items-center justify-center text-center border-dashed border-white/10 opacity-60">
              <div className="w-20 h-20 rounded-[40px] bg-white/5 flex items-center justify-center mb-8">
                <svg className="w-10 h-10 text-finance-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
              </div>
              <h3 className="text-white font-black uppercase tracking-widest text-base mb-3">Awaiting Optimization</h3>
              <p className="text-finance-muted text-xs max-w-sm">Select an industry segment and stock for 30-day algorithmic projections.</p>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
