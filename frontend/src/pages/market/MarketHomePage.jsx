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
    <main className="app-shell animate-fade-in pb-24 mt-10">
      <section className="glass-card p-10 mb-8 flex flex-col md:flex-row justify-between items-center gap-8 border-finance-primary/10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-finance-primary/5 rounded-full blur-[80px] pointer-events-none"></div>
        <div className="max-w-2xl relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <span className="badge badge-primary">NSE Equities</span>
            <span className="text-finance-primary text-xs font-mono uppercase tracking-widest font-black">Real-time Feed</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tighter text-white">Market Screener</h1>
          <p className="text-finance-muted text-sm leading-relaxed uppercase tracking-widest font-bold text-[10px]">
            Live watchlist powered by <span className="text-white font-black">yfinance</span>. Analyze trends, statistics, and 
            <span className="text-finance-success font-black ml-1">FinBERT</span> sentiment scores for Indian stocks.
          </p>
        </div>
        <div className="flex flex-col sm:row gap-4 w-full md:w-auto relative z-10">
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
            className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-[0.2em] transition-all duration-300 ${
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
          <div className="p-8 bg-finance-danger/5 border-b border-finance-danger/20 text-finance-danger flex items-center gap-3 font-black uppercase tracking-widest text-sm">
             <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" /></svg>
             {error}
          </div>
        ) : null}
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/[0.02]">
                <th className="px-6 py-5 text-[10px] font-bold text-finance-muted uppercase tracking-[0.2em] border-b border-white/5">Asset Symbol</th>
                <th className="px-6 py-5 text-[10px] font-bold text-finance-muted uppercase tracking-[0.2em] border-b border-white/5">Authority Name</th>
                <th className="px-6 py-5 text-[10px] font-bold text-finance-muted uppercase tracking-[0.2em] border-b border-white/5">P/E</th>
                <th className="px-6 py-5 text-[10px] font-bold text-finance-muted uppercase tracking-[0.2em] border-b border-white/5">Discount</th>
                <th className="px-6 py-5 text-[10px] font-bold text-finance-muted uppercase tracking-[0.2em] border-b border-white/5">Signal</th>
                <th className="px-6 py-5 text-[10px] font-bold text-finance-muted uppercase tracking-[0.2em] border-b border-white/5">Market</th>
                <th className="px-6 py-5 text-right text-[10px] font-bold text-finance-muted uppercase tracking-[0.2em] border-b border-white/5">Order Control</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredStocks.map((item) => (
                <tr key={item.id} className="group hover:bg-white/[0.02] transition-colors">
                  <td className="px-6 py-5 align-middle">
                     <span className="text-finance-primary font-black tracking-tighter text-lg">{item.symbol}</span>
                  </td>
                  <td className="px-6 py-5 align-middle">
                     <div className="text-white font-bold text-sm">{item.name}</div>
                     <div className="text-[10px] text-finance-muted font-bold uppercase tracking-[0.2em]">{item.sector || 'General'}</div>
                  </td>
                  <td className="px-6 py-5 align-middle">
                     <span className="text-finance-muted font-mono text-xs">{item.pe_ratio || '-'}</span>
                  </td>
                  <td className="px-6 py-5 align-middle">
                     <div className="flex flex-col">
                        <span className="text-finance-success font-black text-xs">-{item.discount}%</span>
                        <span className="text-[9px] text-finance-muted/50 uppercase font-bold tracking-tighter italic">From 52W High</span>
                     </div>
                  </td>
                  <td className="px-6 py-5 align-middle">
                     <span className={`px-2 py-1 rounded text-[9px] font-black uppercase tracking-widest border ${
                       item.analysis === 'Deep Discount' ? 'bg-finance-success/10 text-finance-success border-finance-success/20 shadow-lg shadow-finance-success/5' :
                       item.analysis === 'Value Pick' ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20' :
                       item.analysis === 'All Time High' ? 'bg-finance-danger/10 text-finance-danger border-finance-danger/20' :
                       'bg-white/5 text-finance-muted border-white/5'
                     }`}>
                       {item.analysis}
                     </span>
                  </td>
                  <td className="px-6 py-5 align-middle">
                    <span className="badge bg-white/5 text-finance-muted text-[10px] font-bold border border-white/5 uppercase opacity-60">
                      {item.market}
                    </span>
                  </td>
                  <td className="px-6 py-5 align-middle text-right">
                      <div className="flex items-center justify-end">
                         <Link 
                           to={`/trade?stock_id=${item.id}&side=BUY`} 
                           className="px-6 py-2 rounded-xl bg-finance-success/10 text-finance-success text-[10px] font-black uppercase tracking-[0.2em] hover:bg-finance-success hover:text-[#07361b] transition-all border border-finance-success/20 w-full text-center"
                         >
                           Initialize Buy
                         </Link>
                      </div>
                  </td>
                </tr>
              ))}
              {!filteredStocks.length && !loading ? (
                <tr>
                  <td colSpan={7} className="py-20 text-center text-finance-muted/50 font-bold tracking-widest uppercase text-xs">
                    No stocks found matching your search query.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}

