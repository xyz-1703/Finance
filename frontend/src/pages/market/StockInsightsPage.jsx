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
  Area,
  AreaChart
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
    <main className="app-shell flex items-center justify-center min-h-[80vh] bg-finance-bg">
      <div className="flex flex-col items-center gap-4 animate-pulse">
        <div className="w-12 h-12 rounded-full border-4 border-white/10 border-t-finance-primary animate-spin"></div>
        <p className="text-finance-muted font-bold tracking-widest uppercase text-xs">Analyzing Market Data</p>
      </div>
    </main>
  );

  if (error) return (
    <main className="app-shell bg-finance-bg min-h-screen pt-12">
      <div className="glass-card p-12 border-finance-danger/20 text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-finance-danger/10 text-finance-danger mb-6 ring-1 ring-finance-danger/30">
          <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.268 14c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h2 className="text-2xl font-black text-white mb-2 tracking-tighter uppercase">Error Loading Insights</h2>
        <p className="text-finance-danger mb-8 font-bold">{error}</p>
        <button className="btn-primary" onClick={() => navigate("/market-home")}>Return to Screener</button>
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

  const volumeFormatter = (value) => {
    if (value >= 1e7) return `${(value / 1e7).toFixed(2)}Cr`;
    if (value >= 1e5) return `${(value / 1e5).toFixed(2)}L`;
    if (value >= 1e3) return `${(value / 1e3).toFixed(1)}K`;
    return Number(value || 0).toLocaleString("en-IN");
  };

  const trendTooltipFormatter = (value, name) => {
    if (name === "close" || name === "open") {
      return [priceFormatter(value), name.toUpperCase()];
    }
    return [value, name];
  };

  const volumeTooltipFormatter = (value, name) => [volumeFormatter(value), String(name).toUpperCase()];

  const isPositiveReturns = data.statistics.six_month_return_pct >= 0;

  return (
    <main className="app-shell animate-fade-in pb-20 mt-10 min-h-screen">
      <section className="glass-card p-10 mb-8 border-white/5 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
          <svg className="w-64 h-64 text-finance-primary" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" /></svg>
        </div>
        
        <button 
          className="text-finance-muted hover:text-white mb-8 flex items-center gap-2 group transition-colors text-sm font-bold tracking-widest uppercase relative z-10" 
          onClick={() => navigate("/market-home")}
        >
          <svg className="h-4 w-4 transform group-hover:-translate-x-1 transition-transform text-finance-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Screener
        </button>
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="badge badge-primary">{data.sector || "General"}</span>
              <span className="badge bg-white/5 text-white/60 border-white/10 uppercase tracking-widest">{data.currency}</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter mb-2">{data.name}</h1>
            <p className="text-finance-primary font-mono font-bold text-xl uppercase tracking-widest">{data.symbol}</p>
          </div>
          
          <div className="glass-card p-6 border-finance-primary/20 bg-finance-primary/5 min-w-[200px]">
            <p className="text-finance-muted text-[10px] font-bold uppercase tracking-widest mb-1">Current Valuation</p>
            <div className="text-4xl font-black text-white font-mono">
              {priceFormatter(data.market_price)}
            </div>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        <article className="glass-card p-6 border-white/5 hover:bg-white/5 transition-colors group">
          <p className="text-[10px] font-bold text-finance-muted uppercase tracking-[0.2em] mb-2 group-hover:text-white transition-colors">P/E Ratio</p>
          <p className="text-2xl font-black text-white font-mono">{data.fundamentals.pe_ratio || "N/A"}</p>
        </article>
        <article className="glass-card p-6 border-white/5 hover:bg-white/5 transition-colors group">
          <p className="text-[10px] font-bold text-finance-muted uppercase tracking-[0.2em] mb-2 group-hover:text-white transition-colors">ROE</p>
          <p className="text-2xl font-black text-white font-mono">{data.fundamentals.roe || "N/A"}{data.fundamentals.roe ? '%' : ''}</p>
        </article>
        <article className="glass-card p-6 border-white/5 hover:bg-white/5 transition-colors group">
          <p className="text-[10px] font-bold text-finance-muted uppercase tracking-[0.2em] mb-2 group-hover:text-white transition-colors">6M Return</p>
          <p className={`text-2xl font-black font-mono ${isPositiveReturns ? "text-finance-success" : "text-finance-danger"}`}>
            {isPositiveReturns ? "+" : ""}{data.statistics.six_month_return_pct}%
          </p>
        </article>
        <article className="glass-card p-6 border-white/5 hover:bg-white/5 transition-colors group">
          <p className="text-[10px] font-bold text-finance-muted uppercase tracking-[0.2em] mb-2 group-hover:text-white transition-colors">Volatility (Ann.)</p>
          <p className="text-2xl font-black text-finance-gold font-mono">{data.statistics.annualized_volatility_pct}%</p>
        </article>
        <article className="glass-card p-6 border-white/5 hover:bg-white/5 transition-colors group">
          <p className="text-[10px] font-bold text-finance-muted uppercase tracking-[0.2em] mb-2 group-hover:text-white transition-colors">RSI (14)</p>
          <p className="text-2xl font-black text-white font-mono">{data.statistics.rsi_14 || "N/A"}</p>
        </article>
        <article className="glass-card p-6 border-white/5 hover:bg-white/5 transition-colors group">
          <p className="text-[10px] font-bold text-finance-muted uppercase tracking-[0.2em] mb-2 group-hover:text-white transition-colors">Price/Book</p>
          <p className="text-2xl font-black text-white font-mono">{data.fundamentals.pb_ratio || "N/A"}</p>
        </article>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Trend Chart */}
        <section className="glass-card p-8 border-white/5">
          <div className="flex justify-between items-center mb-6">
             <h2 className="text-lg font-bold text-white flex items-center gap-2">
               <svg className="h-5 w-5 text-finance-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
               </svg>
               Price Action Matrix
             </h2>
             <span className="badge bg-white/5 text-finance-muted border-none">Timeline: 6M</span>
          </div>
          
          <div className="h-[360px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.trend}>
                <defs>
                  <linearGradient id="colorClose" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2962FF" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#2962FF" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis 
                  dataKey="date" 
                  minTickGap={28} 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#8B94A5', fontSize: 10, fontWeight: 'bold' }}
                  dy={10}
                />
                <YAxis 
                  domain={['auto', 'auto']}
                  tickFormatter={priceFormatter} 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#8B94A5', fontSize: 10, fontWeight: 'bold' }}
                  width={80}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0c1017', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }}
                  itemStyle={{ fontWeight: 'bold', fontFamily: 'monospace' }}
                  formatter={trendTooltipFormatter} 
                  cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 1, strokeDasharray: '3 3' }}
                />
                <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
                <Area type="monotone" dataKey="close" stroke="#2962FF" fill="url(#colorClose)" strokeWidth={3} />
                <Line type="monotone" dataKey="open" stroke="#D4A843" dot={false} strokeWidth={1.5} strokeDasharray="4 4" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* Volume Chart */}
        <section className="glass-card p-8 border-white/5">
          <div className="flex justify-between items-center mb-6">
             <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <svg className="h-5 w-5 text-finance-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
               </svg>
               Volume Distribution
             </h2>
             <span className="badge bg-white/5 text-finance-muted border-none">Recent 40 Days</span>
          </div>
          
          <div className="h-[360px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.trend.slice(-40)}>
                 <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis 
                  dataKey="date" 
                  minTickGap={22} 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#8B94A5', fontSize: 10, fontWeight: 'bold' }}
                  dy={10}
                />
                <YAxis 
                  tickFormatter={volumeFormatter} 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#8B94A5', fontSize: 10, fontWeight: 'bold' }}
                  width={60}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0c1017', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }}
                  itemStyle={{ fontWeight: 'bold', fontFamily: 'monospace' }}
                  formatter={volumeTooltipFormatter} 
                  cursor={{ fill: 'rgba(255,255,255,0.02)' }}
                />
                <Bar dataKey="volume" fill="#D4A843" radius={[4, 4, 0, 0]} opacity={0.8} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>
      </div>

      <section className="glass-card p-10 mb-8 border-finance-primary/20 bg-gradient-to-br from-[#0c1017] to-finance-bg relative overflow-hidden">
        
        <div className="absolute top-0 right-0 p-8 opacity-10">
           <svg className="w-48 h-48 text-finance-primary" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" /></svg>
        </div>

        <div className="flex items-center justify-between mb-10 relative z-10 border-b border-white/10 pb-6">
          <h2 className="text-3xl font-black text-white tracking-tighter uppercase">FinBERT AI Analysis</h2>
          <div className={`badge ${data.sentiment.label === 'positive' ? 'badge-success' : data.sentiment.label === 'negative' ? 'badge-danger' : 'badge-primary'}`}>
            {data.sentiment.label}
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 relative z-10">
          <div className="lg:col-span-1 border-r border-white/5 pr-8">
            <div className="text-center h-full flex flex-col justify-center">
              <p className="text-finance-muted font-bold uppercase tracking-[0.2em] text-[10px] mb-6">AI Confidence Score</p>
              <div className="text-7xl font-black text-white mb-6 font-mono tracking-tighter shadow-finance-primary/50">{data.sentiment.score.toFixed(2)}</div>
              
              <div className="w-full bg-white/5 h-3 rounded-full overflow-hidden mb-6 ring-1 ring-white/10">
                <div 
                  className={`h-full transition-all duration-1000 ${data.sentiment.label === 'positive' ? 'bg-finance-success' : data.sentiment.label === 'negative' ? 'bg-finance-danger' : 'bg-finance-primary'}`}
                  style={{ width: `${Math.min(100, data.sentiment.score * 100)}%` }}
                ></div>
              </div>
              
              <p className="text-finance-muted text-xs font-bold leading-relaxed">QuantVista LLM analyzing real-time NLP stream for predictive price movements.</p>
            </div>
          </div>
          
          <div className="lg:col-span-2">
            <h3 className="text-finance-primary font-bold uppercase tracking-[0.2em] text-[10px] mb-8 flex items-center gap-2">
               <span className="w-2 h-2 rounded-full bg-finance-primary animate-pulse"></span>
               Live Market Intelligence
            </h3>
            <ul className="space-y-5">
              {data.headlines.map((headline, idx) => (
                <li key={idx} className="flex gap-6 group hover:bg-white/5 p-4 rounded-xl transition-colors border border-transparent hover:border-white/5">
                  <span className="text-finance-primary font-mono font-black opacity-30 group-hover:opacity-100 transition-opacity">0{idx + 1}</span>
                  <p className="text-white font-bold leading-relaxed text-sm">
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
