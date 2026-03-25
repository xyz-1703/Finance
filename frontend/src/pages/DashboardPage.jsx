import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../api/client";

export default function DashboardPage() {
  const [portfolios, setPortfolios] = useState([]);
  const [newPortfolioName, setNewPortfolioName] = useState("");
  const [profile, setProfile] = useState(null);
  const [stocks, setStocks] = useState([]);
  const [sectorGroups, setSectorGroups] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    const loadData = async () => {
      try {
        const fetchPortfolios = async () => {
          try {
            const res = await api.get("/portfolio/portfolios/");
            setPortfolios(res.data);
          } catch (e) { console.error("Portfolios load error", e); }
        };

        const fetchProfile = async () => {
          try {
            const res = await api.get("/auth/profile/");
            setProfile(res.data);
            localStorage.setItem("current_user", JSON.stringify(res.data));
          } catch (e) { 
            console.error("Profile load error", e); 
            setError("Session authentication error. Please try signing in again.");
          }
        };

        const fetchStocks = async () => {
          try {
            const res = await api.get("/stocks/stocks/");
            setStocks(res.data || []);
          } catch (e) { console.error("Stocks load error", e); }
        };

        const fetchSectors = async () => {
          try {
            const res = await api.get("/stocks/stocks/by_sector/");
            setSectorGroups(res.data || {});
          } catch (e) { console.error("Sectors load error", e); }
        };

        await Promise.all([fetchPortfolios(), fetchProfile(), fetchStocks(), fetchSectors()]);
      } catch (err) {
        console.error("Dashboard load error:", err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleCreatePortfolio = async (e) => {
    e.preventDefault();
    if (!newPortfolioName.trim()) return;
    try {
      await api.post("/portfolio/portfolios/", { name: newPortfolioName.trim() });
      setNewPortfolioName("");
      // Refresh portfolios
      const res = await api.get("/portfolio/portfolios/");
      setPortfolios(res.data);
    } catch (err) {
      console.error("Portfolio creation error:", err);
      const msg = err.response?.data?.error || 
                 err.response?.data?.detail || 
                 (err.response?.data ? JSON.stringify(err.response.data) : "Failed to create portfolio.");
      setError(msg);
    }
  };

  const handleQuickBuy = async (stockId, symbol) => {
    if (portfolios.length === 0) {
      setError("Please create a portfolio first before buying stocks.");
      return;
    }
    setError("");
    setSuccessMessage("");
    try {
      await api.post("/portfolio/transactions/", {
        portfolio: portfolios[0].id, // Default to first portfolio
        symbol: symbol,
        quantity: 1,
        action: "BUY",
      });
      setSuccessMessage(`Successfully added 1 unit of ${symbol} to ${portfolios[0].name}`);
      // Refresh portfolios
      const res = await api.get("/portfolio/portfolios/");
      setPortfolios(res.data);
      setTimeout(() => setSuccessMessage(""), 5000);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to execute quick buy.");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-finance-primary animate-pulse text-xl font-semibold">Loading Dashboard...</div>
      </div>
    );
  }
  return (
    <main className="app-shell animate-fade-in">
      {/* Header Section */}
      <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-white/5">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="badge badge-primary scale-90 origin-left">Institutional Access</span>
            <span className="text-finance-muted text-[10px] font-bold uppercase tracking-[0.2em] opacity-40">System Active</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-black tracking-tighter text-white">
            Hello{profile?.first_name ? `, ${profile.first_name}` : ''}
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/trade" className="btn-primary py-2.5 px-6 text-sm">Trade Desk</Link>
          <Link to="/market-home" className="btn-secondary py-2.5 px-6 text-sm">Market Screener</Link>
        </div>
      </header>

      {error && (
        <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-[10px] font-bold flex items-center gap-3 animate-shake">
          <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          <span className="uppercase tracking-[0.1em]">{error}</span>
        </div>
      )}

      {successMessage && (
        <div className="p-4 mb-8 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center gap-3">
          <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
          {successMessage}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content: Portfolios */}
        <div className="lg:col-span-2 space-y-8">
          <section>
            <div className="flex items-center justify-between mb-6 px-2">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <svg className="h-5 w-5 text-finance-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                My Assets
              </h2>
              <span className="badge bg-white/5 text-finance-muted font-bold">{portfolios.length} Active</span>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {portfolios.map((portfolio) => (
                <Link to={`/portfolio/${portfolio.id}`} key={portfolio.id} className="glass-card p-6 border-white/5 hover:border-finance-primary/30 transition-all group relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-finance-primary/5 blur-3xl -mr-12 -mt-12 group-hover:bg-finance-primary/10 transition-all"></div>
                  
                  <div className="flex justify-between items-start mb-4 relative z-10">
                    <div>
                      <h3 className="text-lg font-black text-white group-hover:text-finance-primary transition-colors tracking-tight">{portfolio.name}</h3>
                      <p className="text-[9px] font-bold text-finance-muted uppercase tracking-widest mt-0.5">ID: #{portfolio.id.toString().slice(0,8)}</p>
                    </div>
                    <span className="badge badge-success text-[9px] px-2 py-0.5">Verified</span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 relative z-10">
                    <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
                      <span className="block text-[9px] text-finance-muted uppercase font-bold tracking-widest mb-1">Holdings</span>
                      <span className="text-xl font-black text-white">{portfolio.holdings?.length || 0}</span>
                    </div>
                    <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
                      <span className="block text-[9px] text-finance-muted uppercase font-bold tracking-widest mb-1">Valuation</span>
                      <span className="text-xl font-black text-emerald-400">
                        <span className="text-[10px] mr-1">₹</span>
                        {Number(portfolio.total_value || 0).toLocaleString()}
                      </span>
                    </div>
                  </div>
                  
                  <div className="mt-6 pt-5 border-t border-white/5 flex items-center justify-between text-xs font-bold text-finance-muted group-hover:text-white transition-colors relative z-10">
                    <span className="uppercase tracking-widest">Strategic Performance</span>
                    <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </div>
                </Link>
              ))}

              {/* Create Portfolio Card */}
              <div className="glass-card border-dashed border-white/10 hover:border-finance-primary/50 transition-all flex flex-col justify-center p-8 min-h-[160px] bg-white/[0.01]">
                <h3 className="text-center text-finance-muted mb-6 font-bold uppercase tracking-widest text-xs">Initialize New Portfolio</h3>
                <form onSubmit={handleCreatePortfolio} className="flex gap-2">
                  <input
                    type="text"
                    className="input-field py-3 text-sm"
                    placeholder="Name (e.g. Blue Chips)"
                    value={newPortfolioName}
                    onChange={(e) => setNewPortfolioName(e.target.value)}
                    required
                  />
                  <button type="submit" className="w-12 h-12 rounded-xl bg-finance-primary hover:scale-105 active:scale-95 text-white flex items-center justify-center transition-all shadow-lg shadow-finance-primary/20">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" /></svg>
                  </button>
                </form>
              </div>
            </div>
          </section>

          {/* Sector Portfolios Section */}
          <section className="mt-12">
            <div className="flex items-center justify-between mb-6 px-2">
              <div>
                <h2 className="text-xl font-black text-white tracking-tighter flex items-center gap-3 uppercase">
                  <svg className="h-5 w-5 text-finance-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                  Sector Direct Access
                </h2>
                <p className="text-finance-muted text-[10px] font-bold uppercase tracking-[0.2em] mt-1 opacity-40">Diversity Matrices</p>
              </div>
            </div>
            
            <div className="max-h-[700px] overflow-y-auto pr-2 custom-scrollbar">
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                {Object.keys(sectorGroups).map((sector) => (
                  <div key={sector} className="glass-card p-5 border-white/5 relative overflow-hidden group bg-white/[0.01]">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-finance-primary/5 blur-3xl -mr-12 -mt-12 group-hover:bg-finance-primary/10 transition-all"></div>
                    <div className="flex justify-between items-center mb-4 relative z-10">
                      <h3 className="text-sm font-black text-white uppercase tracking-tighter truncate max-w-[120px]">{sector}</h3>
                      <span className="text-[10px] font-bold text-finance-primary/60">{sectorGroups[sector].length} Stocks</span>
                    </div>
                    <div className="space-y-2 relative z-10 max-h-48 overflow-y-auto pr-1.5 custom-scrollbar">
                      {sectorGroups[sector].map((stock) => (
                        <div key={stock.id} className="flex items-center justify-between p-2 rounded-lg bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all">
                          <div className="truncate pr-2">
                            <span className="text-finance-primary font-black block leading-none text-xs truncate">{stock.symbol}</span>
                            <span className="text-[8px] text-finance-muted font-bold uppercase tracking-widest truncate">{stock.name}</span>
                          </div>
                          <button 
                            onClick={() => handleQuickBuy(stock.id, stock.symbol)}
                            className="px-3 py-1 rounded-md bg-emerald-500/10 text-emerald-400 text-[9px] font-black uppercase tracking-widest hover:bg-emerald-400 hover:text-white transition-all border border-emerald-500/20 shrink-0"
                          >
                            BUY
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>


        </div>

        {/* Sidebar Section: Profile & Security */}
        <div className="space-y-6">
          <section className="glass-card p-6 bg-white/[0.01]">
            <h2 className="text-sm font-black text-white mb-6 flex items-center gap-2 uppercase tracking-tighter">
              <svg className="w-4 h-4 text-finance-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
              Profile Access
            </h2>
            {profile && (
              <div className="space-y-4">
                <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
                  <span className="block text-[8px] text-finance-muted uppercase font-bold tracking-[0.2em] mb-1">Email Authority</span>
                  <span className="text-white font-bold text-xs truncate block">{profile.email}</span>
                </div>
                
                <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/5">
                  <div>
                    <span className="block text-[8px] text-finance-muted uppercase font-bold tracking-[0.2em] mb-1">Telegram</span>
                    <span className={`font-black uppercase text-[10px] ${profile.telegram_connected ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {profile.telegram_connected ? `@${profile.telegram_username}` : "Not Bound"}
                    </span>
                  </div>
                  <div className={`w-6 h-6 rounded-md flex items-center justify-center ${profile.telegram_connected ? 'bg-emerald-400/20 text-emerald-400' : 'bg-rose-400/20 text-rose-400'}`}>
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/5">
                  <div>
                    <span className="block text-[8px] text-finance-muted uppercase font-bold tracking-[0.2em] mb-1">MPIN Guard</span>
                    <span className={`font-black uppercase text-[10px] ${profile.has_mpin ? 'text-emerald-400' : 'text-finance-muted'}`}>
                      {profile.has_mpin ? "Active" : "Disabled"}
                    </span>
                  </div>
                   <div className={`w-6 h-6 rounded-md flex items-center justify-center ${profile.has_mpin ? 'bg-finance-primary/20 text-finance-primary' : 'bg-white/5 text-finance-muted'}`}>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                    </div>
                </div>

                <Link to="/settings" className="btn-secondary w-full py-2.5 text-center block text-[10px] font-black uppercase tracking-widest">Master Controls</Link>
              </div>
            )}
          </section>

          <section className="glass-card p-6 border-finance-success/20 bg-finance-success/5">
            <h2 className="text-sm font-black text-white mb-4 flex items-center gap-2 uppercase tracking-tighter">
              <svg className="w-4 h-4 text-finance-success" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
              Safety Ops
            </h2>
            <ul className="space-y-4 text-[10px] text-finance-muted font-bold uppercase tracking-wider">
              <li className="flex gap-3">
                <span className="w-1 h-1 rounded-full bg-finance-success mt-1 shrink-0"></span>
                <p>Use <span className="text-white">Telegram</span> Recov Ops</p>
              </li>
              <li className="flex gap-3">
                <span className="w-1 h-1 rounded-full bg-finance-success mt-1 shrink-0"></span>
                <p>Deploy <span className="text-white">6-Digit</span> MPIN</p>
              </li>
              <li className="flex gap-3">
                <span className="w-1 h-1 rounded-full bg-finance-success mt-1 shrink-0"></span>
                <p>Audit <span className="text-white">Access Logs</span></p>
              </li>
            </ul>
          </section>
        </div>
      </div>
    </main>
  );
}
