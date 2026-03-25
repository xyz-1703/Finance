import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import api from "../../api/client";

export default function StockInsightsPage() {
  const { symbol } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchDetail = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await api.get(`/insights/stocks/${symbol}/`);
        setData(response.data);
      } catch (err) {
        setError(err.response?.data?.detail || "Unable to load stock insights.");
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [symbol]);

  if (loading) return (
    <main className="app-shell flex items-center justify-center min-h-[60vh]">
      <div className="flex flex-col items-center gap-4">
        <svg className="animate-spin h-10 w-10 text-finance-primary" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p className="text-finance-muted font-medium">Analyzing market data...</p>
      </div>
    </main>
  );

  if (error) return (
    <main className="app-shell">
      <div className="glass-card p-12 border-rose-500/20 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-rose-500/10 text-rose-500 mb-6">
          <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.268 14c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Error Loading Insights</h2>
        <p className="text-rose-400 mb-8">{error}</p>
        <button className="btn-primary" onClick={() => navigate("/market")}>Return to Screener</button>
      </div>
    </main>
  );

  if (!data) return null;



  const isInr = (data.currency || "").toUpperCase() === "INR";
  const priceFormatter = (value) => {
    const num = Number(value || 0);
    if (isInr) return `\u20B9${num.toLocaleString("en-IN", { maximumFractionDigits: 2 })}`;
    return `${(data.currency || "").toUpperCase()} ${num.toLocaleString("en-US", { maximumFractionDigits: 2 })}`;
  };

  const volumeFormatter = (value) => Number(value || 0).toLocaleString("en-IN");

  const trendTooltipFormatter = (value, name) => {
    if (name === "close" || name === "open") {
      return [priceFormatter(value), name.toUpperCase()];
    }
    return [value, name];
  };

  const volumeTooltipFormatter = (value, name) => [volumeFormatter(value), String(name).toUpperCase()];


  return (
    <main className="app-shell animate-fade-in">
      <section className="glass-card p-10 mb-8">
        <button 
          className="text-finance-muted hover:text-white mb-8 flex items-center gap-2 group transition-colors" 
          onClick={() => navigate("/market")}
        >
          <svg className="h-4 w-4 transform group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Screener
        </button>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="badge badge-primary">{data.sector || "General"}</span>
              <span className="badge bg-white/5 text-white/60 border-white/10 uppercase tracking-widest">{data.currency}</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter mb-2">{data.name}</h1>
            <p className="text-finance-muted font-mono font-bold text-lg uppercase tracking-widest">{data.symbol}</p>
          </div>
          <div className="glass-card p-6 border-finance-primary/20 bg-finance-primary/5">
            <p className="text-finance-muted text-xs font-bold uppercase tracking-widest mb-1">Current Value</p>
            <div className="text-4xl font-black text-white">
              {priceFormatter(data.market_price)}
            </div>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        <article className="glass-card p-6 hover:border-white/20">
          <p className="text-[10px] font-bold text-finance-muted uppercase tracking-widest mb-2">P/E Ratio</p>
          <p className="text-2xl font-black text-white">{data.fundamentals.pe_ratio || "N/A"}</p>
        </article>
        <article className="glass-card p-6 hover:border-white/20">
          <p className="text-[10px] font-bold text-finance-muted uppercase tracking-widest mb-2">ROE</p>
          <p className="text-2xl font-black text-white">{data.fundamentals.roe || "N/A"}%</p>
        </article>
        <article className="glass-card p-6 hover:border-white/20">
          <p className="text-[10px] font-bold text-finance-muted uppercase tracking-widest mb-2">6M Return</p>
          <p className={`text-2xl font-black ${data.statistics.six_month_return_pct >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
            {data.statistics.six_month_return_pct}%
          </p>
        </article>
        <article className="glass-card p-6 hover:border-white/20">
          <p className="text-[10px] font-bold text-finance-muted uppercase tracking-widest mb-2">Volatility</p>
          <p className="text-2xl font-black text-white">{data.statistics.annualized_volatility_pct}%</p>
        </article>
        <article className="glass-card p-6 hover:border-white/20">
          <p className="text-[10px] font-bold text-finance-muted uppercase tracking-widest mb-2">RSI (14)</p>
          <p className="text-2xl font-black text-white">{data.statistics.rsi_14 || "N/A"}</p>
        </article>
        <article className="glass-card p-6 hover:border-white/20">
          <p className="text-[10px] font-bold text-finance-muted uppercase tracking-widest mb-2">Price/Book</p>
          <p className="text-2xl font-black text-white">{data.fundamentals.pb_ratio || "N/A"}</p>
        </article>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <section className="glass-card p-8">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <svg className="h-5 w-5 text-finance-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
            </svg>
            Price Action (Trend)
          </h2>
          <div className="h-[360px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.trend}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis 
                  dataKey="date" 
                  minTickGap={28} 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#59657D', fontSize: 10, fontWeight: 'bold' }}
                />
                <YAxis 
                  tickFormatter={priceFormatter} 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#59657D', fontSize: 10, fontWeight: 'bold' }}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#151A22', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }}
                  itemStyle={{ fontWeight: 'bold' }}
                  formatter={trendTooltipFormatter} 
                />
                <Legend iconType="circle" />
                <Line type="monotone" dataKey="close" stroke="#2962FF" dot={false} strokeWidth={3} />
                <Line type="monotone" dataKey="open" stroke="#59657D" dot={false} strokeWidth={1} strokeDasharray="5 5" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="glass-card p-8">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
             <svg className="h-5 w-5 text-finance-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            Volume Distribution
          </h2>
          <div className="h-[360px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.trend.slice(-40)}>
                 <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis 
                  dataKey="date" 
                  minTickGap={22} 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#59657D', fontSize: 10, fontWeight: 'bold' }}
                />
                <YAxis 
                  tickFormatter={volumeFormatter} 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#59657D', fontSize: 10, fontWeight: 'bold' }}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#151A22', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }}
                  formatter={volumeTooltipFormatter} 
                />
                <Bar dataKey="volume" fill="#2962FF" radius={[4, 4, 0, 0]} opacity={0.6} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>
      </div>

      <section className="glass-card p-10 mb-8 border-finance-primary/10">
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-3xl font-black text-white tracking-tight">FinBERT AI Analysis</h2>
          <div className={`badge ${data.sentiment.label === 'positive' ? 'badge-success' : data.sentiment.label === 'negative' ? 'badge-danger' : 'badge-primary'}`}>
            {data.sentiment.label}
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <div className="glass-card p-8 bg-white/[0.02] border-none text-center">
              <p className="text-finance-muted font-bold uppercase tracking-widest text-xs mb-4">Sentiment Score</p>
              <div className="text-6xl font-black text-white mb-2">{data.sentiment.score.toFixed(2)}</div>
              <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden mb-4">
                <div 
                  className={`h-full transition-all duration-1000 ${data.sentiment.label === 'positive' ? 'bg-emerald-500' : data.sentiment.label === 'negative' ? 'bg-rose-500' : 'bg-finance-primary'}`}
                  style={{ width: `${Math.min(100, data.sentiment.score * 100)}%` }}
                ></div>
              </div>
              <p className="text-finance-muted text-sm italic">AI-powered confidence score across recent headlines.</p>
            </div>
          </div>
          
          <div className="lg:col-span-2">
            <h3 className="text-finance-muted font-bold uppercase tracking-widest text-xs mb-6">Recent Market Intelligence</h3>
            <ul className="space-y-4">
              {data.headlines.map((headline, idx) => (
                <li key={idx} className="flex gap-4 group">
                  <span className="text-finance-primary font-black opacity-30 group-hover:opacity-100 transition-opacity">0{idx + 1}</span>
                  <p className="text-white font-medium leading-relaxed group-hover:text-finance-primary transition-colors cursor-default">
                    {headline}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </main>
  );
}
