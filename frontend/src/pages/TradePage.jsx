import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import api from "../api/client";

export default function TradePage() {
  const location = useLocation();
  const navigate = useNavigate();
  const isAuthenticated = Boolean(localStorage.getItem("access_token"));
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
    
    // Fetch Stocks individually since it is publicly accessible
    try {
      const stockRes = await api.get("/stocks/stocks/");
      setStocks(stockRes.data || []);
    } catch(err) {
      if (!skipError) setError("Unable to load market components.");
    }
    
    // Fetch Portfolios & Transactions individually 
    try {
      const pRes = await api.get("/portfolio/portfolios/");
      setPortfolios(pRes.data || []);
      if (pRes.data?.length > 0) {
        setForm(prev => ({ ...prev, portfolio_id: prev.portfolio_id || String(pRes.data[0].id) }));
      }
    } catch(err) {
       // Suppress generic 401s for anonymous browsing
       if (err.response?.status !== 401 && !skipError) setError("Unable to load portfolios.");
    }
    
    try {
       const tRes = await api.get("/trading/transactions/");
       setTransactions(tRes.data || []);
    } catch(err) {
       // Suppress generic 401
    }
    
    setLoading(false);
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
    if (!isAuthenticated) return navigate('/login');
    
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
    event.preventDefault();
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
    <main className="app-shell animate-fade-in pb-24 mt-10">
      
      <header className="mb-12 relative z-10">
        <div className="flex items-center gap-3 mb-4">
          <span className="badge badge-primary">Trading Desk</span>
          <span className="text-finance-primary text-xs font-mono uppercase tracking-widest font-black flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-finance-primary animate-pulse"></span>
            Execute & Audit
          </span>
        </div>
        <h1 className="text-4xl md:text-6xl font-black mb-4 tracking-tighter text-white">Market Execution</h1>
        <p className="text-finance-muted font-bold text-lg leading-relaxed max-w-3xl uppercase tracking-widest text-[11px]">
          Execute precision trades across your portfolios with 
          <span className="text-finance-success ml-2">MPIN-secured</span> authorization and real-time audit logs.
        </p>
      </header>

      {message && (
        <div className="glass-card mb-8 p-6 border-finance-success/30 bg-finance-success/5 animate-slide-up">
          <div className="flex items-center gap-4 text-finance-success font-black text-sm uppercase tracking-widest">
            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-finance-success/20">
              <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
            </span>
            {message}
          </div>
        </div>
      )}
      
      {error && (
        <div className="glass-card mb-8 p-6 border-finance-danger/30 bg-finance-danger/5 animate-shake">
          <div className="flex items-center gap-4 text-finance-danger font-black text-sm uppercase tracking-widest">
            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-finance-danger/20">
              <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" /></svg>
            </span>
            {error}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10">
        {/* Left Column: Trade Ticket */}
        <div className="lg:col-span-1">
          <section className="glass-card p-8 sticky top-28 border-finance-primary/20 bg-[#0c1017]/80">
            <h2 className="text-xl font-black text-white mb-8 flex items-center gap-3 uppercase tracking-tighter">
              <svg className="h-6 w-6 text-finance-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
              </svg>
              Execution Ticket
            </h2>
            <form className="space-y-6" onSubmit={openMpinStep}>
              <div className="space-y-2">
                <label className="block text-[10px] font-bold text-finance-muted uppercase tracking-[0.2em]" htmlFor="trade-portfolio">Source Portfolio</label>
                <select
                  id="trade-portfolio"
                  className="input-field cursor-pointer"
                  value={form.portfolio_id}
                  onChange={(event) => setForm((prev) => ({ ...prev, portfolio_id: event.target.value }))}
                >
                  <option value="" className="bg-[#151A22]">Select Account...</option>
                  {portfolios.map((item) => (
                    <option key={item.id} value={item.id} className="bg-[#151A22]">{item.name}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-[10px] font-bold text-finance-muted uppercase tracking-[0.2em]" htmlFor="trade-stock">Asset Authority</label>
                <select
                  id="trade-stock"
                  className="input-field cursor-pointer"
                  value={form.stock_id}
                  onChange={(event) => setForm((prev) => ({ ...prev, stock_id: event.target.value }))}
                >
                  <option value="" className="bg-[#151A22]">Choose Asset...</option>
                  {stocks.map((item) => (
                    <option key={item.id} value={item.id} className="bg-[#151A22] uppercase font-mono">{item.symbol} - {item.name}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-[10px] font-bold text-finance-muted uppercase tracking-[0.2em]" htmlFor="trade-side">Action</label>
                  <select
                    id="trade-side"
                    className={`input-field font-black cursor-pointer bg-[#0c1017] ${form.side === 'BUY' ? 'text-finance-success border-finance-success/30' : 'text-finance-danger border-finance-danger/30'}`}
                    value={form.side}
                    onChange={(event) => setForm((prev) => ({ ...prev, side: event.target.value }))}
                  >
                    <option value="BUY" className="bg-[#151A22] text-finance-success">BUYING</option>
                    <option value="SELL" className="bg-[#151A22] text-finance-danger">SELLING</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="block text-[10px] font-bold text-finance-muted uppercase tracking-[0.2em]" htmlFor="trade-quantity">Quantity</label>
                  <input
                    id="trade-quantity"
                    type="number"
                    min="1"
                    className="input-field font-mono font-black"
                    value={form.quantity}
                    onChange={(event) => setForm((prev) => ({ ...prev, quantity: event.target.value }))}
                  />
                </div>
              </div>

              <div className="pt-6">
                <button 
                  className={`w-full py-4 rounded-xl font-black uppercase tracking-[0.2em] text-xs transition-all shadow-xl active:scale-95 text-white 
                  ${form.side === 'BUY' ? 'bg-finance-success hover:bg-[#00c565] shadow-finance-success/20' : 'bg-finance-danger hover:bg-[#e03126] shadow-finance-danger/20'}`} 
                  type="submit"
                >
                   Init Authorization
                </button>
              </div>
            </form>
          </section>
        </div>

        {/* Right Column: Transactions */}
        <div className="lg:col-span-2 space-y-8">
          <section className="glass-card overflow-hidden">
            <div className="p-8 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
              <h2 className="text-xl font-black text-white flex items-center gap-3 tracking-tighter uppercase">
                 <svg className="h-6 w-6 text-finance-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                Execution Registry
              </h2>
              <div className="flex items-center gap-4">
                 <span className="badge badge-primary hidden md:inline-flex">Immutable Ledger</span>
                 <span className="text-[10px] font-mono text-finance-primary font-black uppercase tracking-[0.2em]">{transactions.length} Records</span>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-white/[0.02]">
                    <th className="px-6 py-5 text-[10px] font-bold text-finance-muted uppercase tracking-[0.2em] border-b border-white/5">Reference</th>
                    <th className="px-6 py-5 text-[10px] font-bold text-finance-muted uppercase tracking-[0.2em] border-b border-white/5">Core Asset</th>
                    <th className="px-6 py-5 text-center text-[10px] font-bold text-finance-muted uppercase tracking-[0.2em] border-b border-white/5">Action</th>
                    <th className="px-6 py-5 text-right text-[10px] font-bold text-finance-muted uppercase tracking-[0.2em] border-b border-white/5">Valuation</th>
                    <th className="px-6 py-5 text-right text-[10px] font-bold text-finance-muted uppercase tracking-[0.2em] border-b border-white/5">Timestamp</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {transactions.map((item) => (
                    <tr key={item.id} className="hover:bg-white/[0.02] transition-colors group">
                      <td className="px-6 py-5 align-middle">
                         <span className="bg-white/5 px-2 py-1 rounded text-[10px] font-mono font-black text-finance-primary border border-white/10 uppercase tracking-widest group-hover:bg-finance-primary/10 transition-colors">
                           #TX-{item.id}
                         </span>
                      </td>
                      <td className="px-6 py-5 align-middle">
                         <div className="font-black text-white text-sm mb-1 uppercase tracking-wider">{item.stock_symbol || item.stock}</div>
                         <div className="text-[9px] uppercase font-bold text-finance-muted tracking-[0.2em] truncate max-w-[150px]">
                           {item.portfolio_name || `Portfolio ${item.portfolio}`}
                         </div>
                      </td>
                      <td className="px-6 py-5 align-middle text-center">
                        <span className={`px-2 py-1 rounded text-[9px] font-black uppercase tracking-[0.2em] border ${item.side === 'BUY' ? 'bg-finance-success/10 text-finance-success border-finance-success/30' : 'bg-finance-danger/10 text-finance-danger border-finance-danger/30'}`}>
                          {item.side}
                        </span>
                      </td>
                      <td className="px-6 py-5 align-middle text-right">
                        <div className="text-white font-black font-mono tracking-tight">{item.quantity} U</div>
                        <div className="text-[10px] text-finance-muted font-mono tracking-[0.1em]">@ ₹{item.price}</div>
                      </td>
                      <td className="px-6 py-5 align-middle text-right text-[10px] font-mono font-bold text-finance-muted uppercase leading-relaxed tracking-widest whitespace-nowrap">
                         {new Date(item.executed_at).toLocaleDateString()}<br/>
                         <span className="opacity-60">{new Date(item.executed_at).toLocaleTimeString()}</span>
                      </td>
                    </tr>
                  ))}
                  {!transactions.length && !loading && (
                    <tr>
                      <td colSpan={5} className="py-24 text-center">
                         <div className="inline-flex items-center justify-center p-4 rounded-full bg-white/5 mb-4 border border-white/10">
                            <svg className="w-8 h-8 text-finance-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                            </svg>
                         </div>
                         <p className="text-finance-muted font-bold tracking-widest uppercase text-xs">No execution records found in current ledger</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>

          {form.stock_id && (
            <section className="glass-card p-10 border-l-[3px] border-l-finance-danger bg-finance-danger/5 animate-fade-in">
              <div className="flex items-start gap-6">
                <div className="w-14 h-14 shrink-0 rounded-2xl bg-finance-danger/10 flex items-center justify-center text-finance-danger border border-finance-danger/20 shadow-inner">
                  <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-black text-finance-danger uppercase tracking-[0.2em] mb-3">High Frequency Risk Protocol</h3>
                  <p className="text-finance-muted font-bold text-sm leading-relaxed">
                    Trading involves significant financial exposure. Ensure you have analyzed market 
                    quantifiers and FinBERT sentiments before committing allocations. 
                    <strong className="text-white ml-2 block mt-2">All executions are finalized immutably upon MPIN authorization.</strong>
                  </p>
                </div>
              </div>
            </section>
          )}
        </div>
      </div>

      {mpinOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 backdrop-blur-xl bg-[#0c1017]/90 animate-fade-in shadow-2xl">
          
          <div className="absolute inset-0 bg-finance-bg/50 pointer-events-none"></div>
          
          <div className="glass-card border-finance-primary/30 w-full max-w-md p-10 shadow-[0_0_100px_rgba(41,98,255,0.15)] animate-slide-up relative z-10 w-full">
            <button 
              className="absolute top-6 right-6 text-finance-muted hover:text-white transition-colors"
              onClick={() => setMpinOpen(false)}
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>

            <form onSubmit={submitTrade}>
               <div className="w-20 h-20 mx-auto mb-8 rounded-2xl bg-finance-primary/10 flex items-center justify-center text-finance-primary border border-finance-primary/30 shadow-inner overflow-hidden relative">
                  <div className="absolute inset-0 bg-finance-primary/20 animate-pulse"></div>
                  <svg className="w-10 h-10 relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
               </div>
              
              <h3 className="text-2xl font-black text-white text-center mb-2 tracking-tighter uppercase">Authorize Trade</h3>
              <p className="text-finance-primary text-center mb-10 text-[10px] font-bold uppercase tracking-[0.2em]">Global Security Gateway</p>
              
              <div className="space-y-8">
                 <div className="p-5 rounded-2xl bg-white/5 border border-white/10 text-center shadow-inner">
                    <span className="block text-[10px] text-finance-muted uppercase font-bold tracking-[0.2em] mb-2">Execution Directive</span>
                    <span className={`text-2xl font-black uppercase tracking-tighter ${form.side === 'BUY' ? 'text-finance-success' : 'text-finance-danger'}`}>{form.side}ING {form.quantity} U</span>
                 </div>

                 <div>
                  <label className="block text-[10px] font-bold text-finance-primary uppercase tracking-[0.2em] mb-3 text-center" htmlFor="mpin-input">Enter 4-Digit MPIN</label>
                  <input
                    id="mpin-input"
                    type="password"
                    className="w-full bg-[#0c1017] border border-finance-primary/30 rounded-2xl text-center text-4xl tracking-[2rem] py-6 font-black text-white focus:outline-none focus:border-finance-primary focus:ring-1 focus:ring-finance-primary shadow-inner placeholder-finance-muted/30 transition-all font-mono"
                    value={mpin}
                    onChange={(event) => setMpin(event.target.value)}
                    placeholder="••••"
                    maxLength={6}
                    required
                    autoFocus
                  />
                 </div>
              </div>

              <div className="mt-10">
                <button 
                  type="submit" 
                  className="w-full bg-finance-primary text-white py-5 rounded-xl font-black uppercase tracking-[0.2em] shadow-[0_0_20px_rgba(41,98,255,0.4)] hover:bg-[#3d6eff] transition-all text-sm mb-4"
                >
                  Verify & Deploy Execution
                </button>
                <button 
                  type="button" 
                  className="w-full text-finance-muted py-3 rounded-xl font-bold uppercase tracking-widest hover:text-white transition-all text-[10px]" 
                  onClick={() => setMpinOpen(false)}
                >
                  Abort Order Priority
                </button>
              </div>
              
              <p className="mt-8 text-center text-[9px] font-bold text-finance-muted/50 uppercase tracking-[0.3em] flex items-center justify-center gap-2">
                 <svg className="w-3 h-3 text-finance-primary" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" /></svg>
                 End-to-end Encrypted Handshake
              </p>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
