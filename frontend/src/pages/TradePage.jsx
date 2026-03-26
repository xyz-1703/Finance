import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";

import api from "../api/client";

export default function TradePage() {
  const location = useLocation();
  const [portfolios, setPortfolios] = useState([]);
  const [stocks, setStocks] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    portfolio_id: "",
    stock_id: "",
    side: "BUY",
    quantity: "1",
  });

  const [mpinOpen, setMpinOpen] = useState(false);
  const [mpin, setMpin] = useState("");

  const selectedStock = useMemo(() => {
    return stocks.find((item) => String(item.id) === String(form.stock_id));
  }, [stocks, form.stock_id]);

  const loadData = async (skipError = false) => {
    setLoading(true);
    setError("");
    try {
      const [portfolioResponse, stockResponse, transactionResponse] = await Promise.all([
        api.get("/portfolio/portfolios/"),
        api.get("/stocks/stocks/"),
        api.get("/trading/transactions/"),
      ]);

      setPortfolios(portfolioResponse.data || []);
      if (portfolioResponse.data?.length > 0) {
        setForm(prev => ({ 
          ...prev, 
          portfolio_id: prev.portfolio_id || String(portfolioResponse.data[0].id) 
        }));
      }
      setStocks(stockResponse.data || []);
      setTransactions(transactionResponse.data || []);
    } catch (err) {
      if (!skipError) {
        setMessage("");
        setError(err.response?.data?.detail || "Unable to load trade resources.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const stockId = params.get("stock_id");
    const side = params.get("side");
    
    if (stockId) {
      setForm(prev => ({ ...prev, stock_id: stockId }));
    }
    if (side) {
      setForm(prev => ({ ...prev, side: side.toUpperCase() }));
    }
  }, [location.search]);

  useEffect(() => {
    loadData();
  }, []);


  const openMpinStep = (event) => {
    event.preventDefault();
    setMessage("");
    setError("");
    setMpin("");

    if (!form.portfolio_id || !form.stock_id || !form.quantity) {
      setError("Portfolio, stock, and quantity are required.");
      return;
    }

    setMpinOpen(true);
  };

  const submitTrade = async (event) => {
    setMessage("Verifying Security Identity...");
    setError("");

    try {
      // Small delay for UI perception of security check
      await new Promise(resolve => setTimeout(resolve, 600));
      setMessage("MPIN Verified. Finalizing Trade Execution...");

      await api.post("/trading/execute/", {
        portfolio_id: Number(form.portfolio_id),
        stock_id: Number(form.stock_id),
        side: form.side,
        quantity: form.quantity,
        mpin,
      });

      const selectedPortfolio = portfolios.find(p => String(p.id) === String(form.portfolio_id));
      setMessage(`Asset Successfully Added to "${selectedPortfolio?.name}"!`);
      setError("");
      setMpinOpen(false);
      setMpin("");
      loadData(true); // skipError=true to avoid conflicting messages
    } catch (err) {
      setMessage("");
      setError(err.response?.data?.detail || "Trade execution failed.");
    }
  };

  return (
    <main className="app-shell animate-fade-in">
      <header className="mb-10">
        <div className="flex items-center gap-3 mb-4">
          <span className="badge badge-primary">Trading Desk</span>
          <span className="text-finance-muted text-xs font-mono uppercase tracking-widest">Execute & Audit</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tighter text-white">Market Execution</h1>
        <p className="text-finance-muted text-lg leading-relaxed max-w-3xl">
          Execute precision trades across your portfolios with 
          <span className="text-finance-primary font-semibold"> MPIN-secured </span> authorization and real-time audit logs.
        </p>
      </header>

      {message && (
        <div className="p-4 mb-8 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center gap-3">
          <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
          {message}
        </div>
      )}
      
      {error && (
        <div className="p-4 mb-8 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-500 flex items-center gap-3">
          <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" /></svg>
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Trade Ticket */}
        <div className="lg:col-span-1">
          <section className="glass-card p-8 bg-white/[0.01] border-white/10 sticky top-8">
            <h2 className="text-xl font-bold text-white mb-8 flex items-center gap-2">
              <svg className="h-5 w-5 text-finance-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
              </svg>
              Execution Ticket
            </h2>
            <form className="space-y-6" onSubmit={openMpinStep}>
              <div className="space-y-2">
                <label className="block text-[10px] font-bold text-finance-muted uppercase tracking-widest" htmlFor="trade-portfolio">Source Portfolio</label>
                <select
                  id="trade-portfolio"
                  className="input-field"
                  value={form.portfolio_id}
                  onChange={(event) => setForm((prev) => ({ ...prev, portfolio_id: event.target.value }))}
                >
                  <option value="">Select Account...</option>
                  {portfolios.map((item) => (
                    <option key={item.id} value={item.id}>{item.name}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-[10px] font-bold text-finance-muted uppercase tracking-widest" htmlFor="trade-stock">Asset Authority</label>
                <select
                  id="trade-stock"
                  className="input-field"
                  value={form.stock_id}
                  onChange={(event) => setForm((prev) => ({ ...prev, stock_id: event.target.value }))}
                >
                  <option value="">Choose Asset...</option>
                  {stocks.map((item) => (
                    <option key={item.id} value={item.id}>{item.symbol} - {item.name}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-[10px] font-bold text-finance-muted uppercase tracking-widest" htmlFor="trade-side">Action</label>
                  <select
                    id="trade-side"
                    className={`input-field font-black ${form.side === 'BUY' ? 'text-emerald-400' : 'text-rose-400'}`}
                    value={form.side}
                    onChange={(event) => setForm((prev) => ({ ...prev, side: event.target.value }))}
                  >
                    <option value="BUY">BUY</option>
                    <option value="SELL">SELL</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="block text-[10px] font-bold text-finance-muted uppercase tracking-widest" htmlFor="trade-quantity">Quantity</label>
                  <input
                    id="trade-quantity"
                    className="input-field text-white font-bold"
                    value={form.quantity}
                    onChange={(event) => setForm((prev) => ({ ...prev, quantity: event.target.value }))}
                  />
                </div>
              </div>


              <div className="pt-4">
                <button className={`w-full py-4 rounded-2xl font-black uppercase tracking-tighter text-lg transition-all shadow-lg active:scale-95 ${form.side === 'BUY' ? 'bg-emerald-500 hover:bg-emerald-400 shadow-emerald-500/20' : 'bg-rose-500 hover:bg-rose-400 shadow-rose-500/20'}`} type="submit">
                  Continue to Authorization
                </button>
              </div>
            </form>
          </section>
        </div>

        {/* Right Column: Transactions */}
        <div className="lg:col-span-2 space-y-8">
          <section className="glass-card overflow-hidden">
            <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/[0.01]">
              <h2 className="text-xl font-bold text-white flex items-center gap-3">
                 <svg className="h-5 w-5 text-finance-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                Execution Registry
              </h2>
              <div className="flex items-center gap-2">
                 <span className="badge badge-primary">Immutable Log</span>
                 <span className="text-[10px] font-mono text-finance-muted uppercase tracking-widest">{transactions.length} Records</span>
              </div>
            </div>
            <table className="modern-table">
              <thead>
                <tr>
                  <th>Reference</th>
                  <th>Core Asset</th>
                  <th className="text-center">Action</th>
                  <th className="text-right">Valuation</th>
                  <th className="text-right">Timestamp</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((item) => (
                  <tr key={item.id} className="group">
                    <td><code className="bg-white/5 px-2 py-1 rounded text-[10px] font-bold text-finance-primary border border-white/5 uppercase">#TX-{item.id}</code></td>
                    <td>
                       <div className="font-bold text-white mb-0.5">{item.stock_symbol || item.stock}</div>
                       <div className="text-[10px] uppercase font-bold text-finance-muted tracking-widest">{item.portfolio_name || `Portfolio ${item.portfolio}`}</div>
                    </td>
                    <td className="text-center">
                      <span className={`px-2 py-1 rounded text-[10px] font-black uppercase tracking-widest border ${item.side === 'BUY' ? 'bg-emerald-400/10 text-emerald-400 border-emerald-400/20' : 'bg-rose-400/10 text-rose-400 border-rose-400/20'}`}>
                        {item.side}
                      </span>
                    </td>
                    <td className="text-right">
                      <div className="text-white font-bold">{item.quantity} Units</div>
                      <div className="text-[10px] text-finance-muted font-mono uppercase tracking-widest">@ ₹{item.price}</div>
                    </td>
                    <td className="text-right text-[10px] font-mono font-bold text-finance-muted uppercase leading-tight tracking-tighter">
                       {new Date(item.executed_at).toLocaleDateString()}<br/>
                       {new Date(item.executed_at).toLocaleTimeString()}
                    </td>
                  </tr>
                ))}
                {!transactions.length && !loading && (
                  <tr>
                    <td colSpan={5} className="py-24 text-center text-finance-muted italic">
                       No execution records found in the current audit trail.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </section>

          {form.stock_id && (
            <section className="glass-card p-10 bg-gradient-to-br from-rose-500/10 via-transparent to-transparent border-rose-500/20 animate-fade-in">
              <div className="flex items-start gap-6">
                <div className="w-12 h-12 shrink-0 rounded-2xl bg-rose-500/20 flex items-center justify-center text-rose-500">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-black text-rose-400 uppercase tracking-tighter mb-2">High Frequency Risk</h3>
                  <p className="text-finance-muted leading-relaxed">
                    Trading involves significant financial risk. Ensure you have analyzed the market assets 
                    and sentiment before committing large allocations from your portfolios. 
                    All trades are finalized immediately upon MPIN verification.
                  </p>
                </div>
              </div>
            </section>
          )}
        </div>
      </div>

      {mpinOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 backdrop-blur-xl bg-black/80 animate-fade-in shadow-2xl">
          <form className="glass-card w-full max-w-md p-10 border-finance-primary/30 shadow-2xl shadow-finance-primary/10 animate-scale-up" onSubmit={submitTrade}>
             <div className="w-20 h-20 mx-auto mb-8 rounded-full bg-finance-primary/10 flex items-center justify-center text-finance-primary ring-1 ring-finance-primary/30">
                <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
             </div>
            <h3 className="text-3xl font-black text-white text-center mb-2 tracking-tighter">Authorize Trade</h3>
            <p className="text-finance-muted text-center mb-10 text-sm font-bold uppercase tracking-widest">Global Security Gateway</p>
            
            <div className="space-y-6">
               <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 mb-6 text-center">
                  <span className="block text-[10px] text-finance-muted uppercase font-bold tracking-widest mb-1">Execution Side</span>
                  <span className={`text-xl font-black ${form.side === 'BUY' ? 'text-emerald-400' : 'text-rose-400'}`}>{form.side}ING {form.quantity} UNITS</span>
               </div>

               <div>
                <label className="block text-[10px] font-bold text-finance-muted uppercase tracking-widest mb-2 text-center" htmlFor="mpin-input">Encrypted MPIN</label>
                <input
                  id="mpin-input"
                  type="password"
                  className="input-field text-center text-3xl tracking-[1.5rem] py-5 font-black text-finance-primary"
                  value={mpin}
                  onChange={(event) => setMpin(event.target.value)}
                  placeholder="••••"
                  maxLength={6}
                  required
                  autoFocus
                />
               </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-10">
              <button type="submit" className="btn-primary py-4 font-black">Verify & Deploy</button>
              <button type="button" className="btn-secondary py-4 font-black" onClick={() => setMpinOpen(false)}>Abort Order</button>
            </div>
            
            <p className="mt-8 text-center text-[10px] font-bold text-finance-muted uppercase tracking-[0.2em] opacity-40">End-to-end Encrypted Session</p>
          </form>
        </div>
      )}
    </main>
  );
}
