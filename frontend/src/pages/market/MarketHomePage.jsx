import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import api from "../../api/client";

export default function MarketHomePage() {
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [sector, setSector] = useState("All");

  const loadStocks = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await api.get("/stocks/stocks/");
      setStocks(response.data || []);
    } catch (err) {
      setError("Unable to load market data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStocks();
  }, []);

  const sectors = useMemo(() => {
    const all = new Set(stocks.map((item) => item.sector || "Unknown"));
    return ["All", ...Array.from(all).sort()];
  }, [stocks]);

  const filteredStocks = useMemo(() => {
    return stocks.filter((item) => {
      const matchQuery = `${item.symbol} ${item.name}`.toLowerCase().includes(query.toLowerCase());
      const matchSector = sector === "All" || item.sector === sector;
      return matchQuery && matchSector;
    });
  }, [query, sector, stocks]);

  const executeTrade = async (symbol, side) => {
    const quantity = window.prompt(`Enter quantity for ${side} (${symbol})`, "1");
    if (!quantity) return;
    const mpin = window.prompt("Enter MPIN");
    if (!mpin) return;

    try {
      await api.post("/insights/trade/", { symbol, side, quantity, mpin });
      window.alert(`${side} order placed for ${symbol}`);
    } catch (err) {
      window.alert(err.response?.data?.detail || "Order failed.");
    }
  };

  return (
    <main className="app-shell animate-fade-in">
      <section className="glass-card p-10 mb-8 flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="max-w-2xl">
          <div className="flex items-center gap-3 mb-4">
            <span className="badge badge-primary">NSE Equities</span>
            <span className="text-finance-muted text-xs font-mono uppercase tracking-widest">Real-time Feed</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tighter text-white">Market Screener</h1>
          <p className="text-finance-muted text-lg leading-relaxed">
            Live watchlist powered by <span className="text-white font-medium italic">yfinance</span>. Analyze trends, statistics, and 
            <span className="text-finance-primary font-semibold"> FinBERT </span> sentiment scores for Indian stocks.
          </p>
        </div>
        <div className="flex flex-col sm:row gap-4 w-full md:w-auto">
          <div className="relative group">
            <input
              type="text"
              className="input-field pr-12 min-w-[300px]"
              placeholder="Search symbol or company..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-finance-primary transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
          <button className="btn-primary" onClick={loadStocks} disabled={loading}>
            {loading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Refreshing
              </span>
            ) : "Refresh List"}
          </button>
        </div>
      </section>

      <section className="glass-card p-2 mb-8 flex flex-wrap gap-2">
        {sectors.map((item) => (
          <button
            key={item}
            className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
              item === sector 
                ? "bg-finance-primary text-white shadow-lg shadow-finance-primary/20" 
                : "text-finance-muted hover:text-white hover:bg-white/5"
            }`}
            onClick={() => setSector(item)}
          >
            {item}
          </button>
        ))}
      </section>

      <section className="glass-card overflow-hidden">
        {error ? (
          <div className="p-8 bg-rose-500/10 border-b border-rose-500/20 text-rose-500 flex items-center gap-3">
             <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" /></svg>
             {error}
          </div>
        ) : null}
        
        <table className="modern-table">
          <thead>
            <tr>
              <th className="pl-6">Asset Symbol</th>
              <th>Authority Name</th>
              <th>P/E</th>
              <th>Discount</th>
              <th>Signal</th>
              <th>Market</th>
              <th className="text-right pr-6">Order Control</th>
            </tr>
          </thead>
          <tbody>
            {filteredStocks.map((item) => (
              <tr key={item.id} className="group hover:bg-white/[0.02] transition-colors">
                <td className="pl-6 py-5">
                   <span className="text-finance-primary font-black tracking-tighter text-lg">{item.symbol}</span>
                </td>
                <td>
                   <div className="text-white font-bold text-sm">{item.name}</div>
                   <div className="text-[10px] text-finance-muted font-bold uppercase tracking-widest">{item.sector || 'General'}</div>
                </td>
                <td>
                   <span className="text-white font-mono text-xs">{item.pe_ratio || '-'}</span>
                </td>
                <td>
                   <div className="flex flex-col">
                      <span className="text-emerald-400 font-black text-xs">-{item.discount}%</span>
                      <span className="text-[9px] text-finance-muted uppercase font-bold tracking-tighter italic">From 52W High</span>
                   </div>
                </td>
                <td>
                   <span className={`px-2 py-1 rounded text-[9px] font-black uppercase tracking-widest border ${
                     item.analysis === 'Deep Discount' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-lg shadow-emerald-500/5' :
                     item.analysis === 'Value Pick' ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20' :
                     item.analysis === 'All Time High' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' :
                     'bg-white/5 text-finance-muted border-white/5'
                   }`}>
                     {item.analysis}
                   </span>
                </td>
                <td>
                  <span className="badge bg-white/5 text-finance-muted text-[10px] font-bold border border-white/5 uppercase opacity-60">
                    {item.market}
                  </span>
                </td>
                <td className="pr-6 text-right">
                    <div className="flex items-center justify-end">
                       <Link 
                         to={`/trade?stock_id=${item.id}&side=BUY`} 
                         className="px-6 py-2 rounded-xl bg-emerald-500/10 text-emerald-400 text-[10px] font-black uppercase tracking-widest hover:bg-emerald-400 hover:text-white transition-all border border-emerald-500/20 w-full text-center"
                       >
                         Initalize Buy
                       </Link>
                    </div>
                </td>
              </tr>
            ))}
            {!filteredStocks.length && !loading ? (
              <tr>
                <td colSpan={7} className="py-20 text-center text-finance-muted italic">
                  No stocks found matching your search.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </section>
    </main>
  );
}
