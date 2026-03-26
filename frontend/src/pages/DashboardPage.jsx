import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/client";

export default function DashboardPage() {
  const navigate = useNavigate();
  const isAuthenticated = Boolean(localStorage.getItem("access_token"));
  const [portfolios, setPortfolios] = useState([]);
  const [newPortfolioName, setNewPortfolioName] = useState("");
  const [profile, setProfile] = useState(null);
  const [stocks, setStocks] = useState([]);
  const [sectorGroups, setSectorGroups] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showMpinModal, setShowMpinModal] = useState(false);
  const [mpinValue, setMpinValue] = useState("");
  const [mpinLoading, setMpinLoading] = useState(false);
  const [isCreatingPortfolio, setIsCreatingPortfolio] = useState(false);

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
            if (e.response?.status !== 401) {
              console.error("Profile load error", e); 
              setError("Session authentication error. Please try signing in again.");
            }
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
    if (!isAuthenticated) return navigate('/login');
    if (!newPortfolioName.trim()) return;
    
    setIsCreatingPortfolio(true);
    setError("");
    setSuccessMessage("");
    
    try {
      await api.post("/portfolio/portfolios/", { name: newPortfolioName.trim() });
      setSuccessMessage(`Portfolio "${newPortfolioName.trim()}" created successfully.`);
      setNewPortfolioName("");
      // Refresh portfolios
      const res = await api.get("/portfolio/portfolios/");
      setPortfolios(res.data);
      setTimeout(() => setSuccessMessage(""), 5000);
    } catch (err) {
      console.error("Portfolio creation error:", err);
      let msg = "Failed to initialize portfolio.";
      if (err.response?.data) {
        const data = err.response.data;
        if (typeof data === 'string') msg = data;
        else if (data.detail) msg = data.detail;
        else if (data.error) msg = data.error;
        else if (data.name) msg = `Name Error: ${Array.isArray(data.name) ? data.name[0] : data.name}`;
        else msg = JSON.stringify(data);
      }
      setError(msg);
    } finally {
      setIsCreatingPortfolio(false);
    }
  };

  const handleQuickBuy = async (stockId, symbol) => {
    if (!isAuthenticated) return navigate('/login');
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

  const handleSetMpin = async (e) => {
    e.preventDefault();
    if (mpinValue.length < 4) {
      setError("MPIN must be 4-6 digits.");
      return;
    }
    setMpinLoading(true);
    setError("");
    try {
      await api.post("/auth/mpin/set/", { mpin: mpinValue });
      setSuccessMessage("MPIN configured successfully.");
      setMpinValue("");
      setShowMpinModal(false);
      // Refresh profile
      const res = await api.get("/auth/profile/");
      setProfile(res.data);
      setTimeout(() => setSuccessMessage(""), 5000);
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to set MPIN.");
    } finally {
      setMpinLoading(false);
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
    <main className="max-w-[1400px] mx-auto px-6 py-10 animate-fade-in bg-white min-h-screen">
      {/* Header Section */}
      <header className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 text-[10px] font-bold uppercase tracking-wider border border-emerald-500/20">Institutional Access</span>
            <span className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em] opacity-80">System Active</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-black tracking-tighter text-slate-800">
            Hello{profile?.first_name ? `, ${profile.first_name}` : ''}
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/trade" className="px-6 py-3 rounded-xl bg-emerald-500 text-white font-bold text-sm shadow-lg shadow-emerald-500/20 hover:scale-105 transition-all">Trade Desk</Link>
          <Link to="/market-home" className="px-6 py-3 rounded-xl bg-slate-100 text-slate-700 font-bold text-sm hover:bg-slate-200 transition-all">Market Screener</Link>
        </div>
      </header>

      {error && (
        <div className="mb-8 p-4 rounded-xl bg-rose-50 border border-rose-100 text-rose-500 text-[11px] font-bold flex items-center gap-3 animate-shake">
          <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          <span className="uppercase tracking-widest">{error}</span>
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
                <Link to={`/portfolio/${portfolio.id}`} key={portfolio.id} className="bg-white border border-slate-200 rounded-3xl p-6 hover:border-emerald-500/30 transition-all group relative overflow-hidden shadow-sm hover:shadow-md">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 blur-3xl -mr-12 -mt-12 group-hover:bg-emerald-500/10 transition-all"></div>
                  
                  <div className="flex justify-between items-start mb-4 relative z-10">
                    <div>
                      <h3 className="text-lg font-black text-slate-800 group-hover:text-emerald-500 transition-colors tracking-tight">{portfolio.name}</h3>
                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">ID: #{portfolio.id.toString().slice(0,8)}</p>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-50/50 text-emerald-600 border border-emerald-100 text-[9px] font-bold uppercase tracking-wider">Verified</span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 relative z-10">
                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                      <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-2">Unique Assets</span>
                      <p className="text-xl md:text-2xl font-black text-slate-800 tracking-tighter mb-1 mt-auto">{portfolio.holdings.length}</p>
                      <p className="text-[10px] text-slate-400 mt-1 font-bold">{portfolio.total_quantity} Unit{portfolio.total_quantity !== 1 ? 's' : ''} Owned</p>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                      <span className="block text-[9px] text-slate-400 uppercase font-bold tracking-widest mb-1">Valuation</span>
                      <span className="text-xl font-black text-emerald-500">
                        <span className="text-[10px] mr-1">₹</span>
                        {Number(portfolio.total_value || 0).toLocaleString()}
                      </span>
                    </div>
                  </div>
                  
                  <div className="mt-6 pt-5 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-slate-400 group-hover:text-slate-800 transition-colors relative z-10">
                    <span className="uppercase tracking-widest">Strategic Performance</span>
                    <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </div>
                </Link>
              ))}

              {/* Create Portfolio Card */}
              <div className="bg-white border-2 border-dashed border-slate-200 rounded-3xl hover:border-emerald-500/50 transition-all flex flex-col justify-center p-8 min-h-[160px]">
                <h3 className="text-center text-slate-400 mb-6 font-bold uppercase tracking-widest text-xs">
                  {isAuthenticated ? "Initialize New Portfolio" : "Login To Build Portfolios"}
                </h3>
                <form onSubmit={handleCreatePortfolio} className="flex gap-2">
                  <input
                    type="text"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-emerald-500 transition-all"
                    placeholder="Name (e.g. Blue Chips)"
                    value={newPortfolioName}
                    onChange={(e) => setNewPortfolioName(e.target.value)}
                    required
                  />
                  <button 
                    type="submit" 
                    disabled={isCreatingPortfolio || !newPortfolioName.trim()}
                    className="w-12 h-12 rounded-xl bg-emerald-500 hover:scale-105 active:scale-95 text-white flex items-center justify-center transition-all shadow-lg shadow-emerald-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isCreatingPortfolio ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" /></svg>
                    )}
                  </button>
                </form>
              </div>
            </div>
          </section>

          {/* Sector Portfolios Section */}
          <section className="mt-14">
            <div className="flex items-center justify-between mb-8 px-2">
              <div>
                <h2 className="text-xl font-black text-slate-800 tracking-tighter flex items-center gap-3 uppercase">
                  <svg className="h-5 w-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                  Sector Direct Access
                </h2>
                <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em] mt-1 opacity-80">Market Matrices</p>
              </div>
            </div>
            
            <div className="max-h-[700px] overflow-y-auto pr-2 custom-scrollbar">
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                {Object.keys(sectorGroups).map((sector) => (
                  <div key={sector} className="bg-slate-50 border border-slate-200 rounded-2xl p-5 relative overflow-hidden group hover:bg-white transition-all shadow-sm">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 blur-3xl -mr-12 -mt-12 group-hover:bg-emerald-500/10 transition-all"></div>
                    <div className="flex justify-between items-center mb-4 relative z-10">
                      <h3 className="text-sm font-black text-slate-700 uppercase tracking-tighter truncate max-w-[120px]">{sector}</h3>
                      <span className="text-[10px] font-bold text-emerald-500">{sectorGroups[sector].length} Stocks</span>
                    </div>
                    <div className="space-y-2 relative z-10 max-h-48 overflow-y-auto pr-1.5 custom-scrollbar">
                      {sectorGroups[sector].map((stock) => (
                        <div key={stock.id} className="flex items-center justify-between p-2 rounded-lg bg-white border border-slate-100 hover:border-emerald-200 transition-all">
                          <div className="truncate pr-2">
                            <span className="text-emerald-500 font-black block leading-none text-xs truncate">{stock.symbol}</span>
                            <span className="text-[8px] text-slate-400 font-bold uppercase tracking-widest truncate">{stock.name}</span>
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
        <div className="space-y-8">
          <section className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
            <h2 className="text-sm font-black text-slate-800 mb-6 flex items-center gap-2 uppercase tracking-tighter">
              <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
              Profile Access
            </h2>
            {!isAuthenticated && (
              <div className="text-center py-6">
                 <p className="text-slate-400 text-[10px] uppercase font-bold tracking-widest leading-relaxed mb-4">Connect Account to Unveil Secure Configurations</p>
                 <button onClick={() => navigate('/login')} className="bg-emerald-500 text-white py-3 px-6 rounded-xl font-bold uppercase tracking-widest shadow-lg shadow-emerald-500/20 w-full text-xs">Authenticate</button>
              </div>
            )}
            {profile && isAuthenticated && (
              <div className="space-y-4">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="block text-[8px] text-slate-400 uppercase font-bold tracking-[0.2em] mb-1">Email Authority</span>
                  <span className="text-slate-800 font-bold text-xs truncate block">{profile.email}</span>
                </div>
                
                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <div>
                    <span className="block text-[8px] text-slate-400 uppercase font-bold tracking-[0.2em] mb-1">Telegram</span>
                    <span className={`font-black uppercase text-[10px] ${profile.telegram_connected ? 'text-emerald-500' : 'text-rose-400'}`}>
                      {profile.telegram_connected ? `@${profile.telegram_username}` : "Not Bound"}
                    </span>
                  </div>
                  <div className={`w-6 h-6 rounded-md flex items-center justify-center ${profile.telegram_connected ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-50'}`}>
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <div>
                    <span className="block text-[8px] text-slate-400 uppercase font-bold tracking-[0.2em] mb-1">MPIN Guard</span>
                    <div className="flex items-center gap-2">
                       <span className={`font-black uppercase text-[10px] ${profile.has_mpin ? 'text-emerald-500' : 'text-slate-400'}`}>
                        {profile.has_mpin ? "Active" : "Disabled"}
                      </span>
                      {!profile.has_mpin && (
                        <button 
                          onClick={() => setShowMpinModal(true)} 
                          className="text-[8px] text-emerald-500 hover:text-emerald-600 transition-colors font-bold uppercase tracking-[0.1em]"
                        >
                          [Configure]
                        </button>
                      )}
                    </div>
                  </div>
                   <div className={`w-6 h-6 rounded-md flex items-center justify-center ${profile.has_mpin ? 'bg-emerald-500/10 text-emerald-500' : 'bg-slate-50 text-slate-400'}`}>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                    </div>
                </div>

                <Link to="/settings" className="w-full py-3 bg-slate-100 text-slate-700 text-center block rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-200 transition-all">Master Controls</Link>
              </div>
            )}
          </section>

          <section className="bg-emerald-500/5 border border-emerald-500/20 rounded-3xl p-6">
            <h2 className="text-sm font-black text-slate-800 mb-4 flex items-center gap-2 uppercase tracking-tighter">
              <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
              Safety Ops
            </h2>
            <ul className="space-y-4 text-[10px] text-slate-500 font-bold uppercase tracking-wider">
              <li className="flex gap-3 text-slate-600">
                <span className="w-1 h-1 rounded-full bg-emerald-500 mt-1 shrink-0"></span>
                <p>Use <span className="text-slate-900">Telegram</span> Recov Ops</p>
              </li>
              <li className="flex gap-3 text-slate-600">
                <span className="w-1 h-1 rounded-full bg-emerald-500 mt-1 shrink-0"></span>
                <p>Deploy <span className="text-slate-900">6-Digit</span> MPIN</p>
              </li>
              <li className="flex gap-3 text-slate-600">
                <span className="w-1 h-1 rounded-full bg-emerald-500 mt-1 shrink-0"></span>
                <p>Audit <span className="text-slate-900">Access Logs</span></p>
              </li>
            </ul>
          </section>
        </div>
      </div>
      
      {/* MPIN Setup Modal */}
      {showMpinModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 backdrop-blur-xl bg-black/80 animate-fade-in shadow-2xl">          <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-sm p-10 shadow-2xl relative">
             <button 
               onClick={() => setShowMpinModal(false)}
               className="absolute top-6 right-6 text-slate-400 hover:text-slate-800 transition-colors"
             >
               <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
               </svg>
             </button>
 
             <div className="w-20 h-20 mx-auto mb-8 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500 ring-1 ring-emerald-500/30">
                <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
             </div>
            <h3 className="text-3xl font-black text-slate-800 text-center mb-2 tracking-tighter uppercase">Set Your MPIN</h3>
            <p className="text-slate-400 text-center mb-10 text-[10px] font-bold uppercase tracking-widest leading-relaxed">
              Create a secure 6-digit pin to authorize <br/> transactions and safeguard your assets.
            </p>
            
            <form onSubmit={handleSetMpin} className="space-y-6">
               <div>                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 text-center" htmlFor="new-mpin">Numeric Security Code</label>
                <input
                  id="new-mpin"
                  type="password"
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl text-center text-3xl tracking-[1.5rem] py-5 font-black text-emerald-500 focus:outline-none focus:border-emerald-500 transition-all"
                  value={mpinValue}
                  onChange={(e) => setMpinValue(e.target.value.replace(/\D/g, ''))}
                  placeholder="••••"
                  maxLength={6}
                  required
                  autoFocus
                />
               </div>
 
               <button 
                 type="submit" 
                 disabled={mpinLoading || mpinValue.length < 4}
                 className="bg-emerald-500 text-white w-full py-5 rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-emerald-500/20 hover:bg-emerald-400 transition-all disabled:hidden"
               >
                 {mpinLoading ? "Securing..." : "Configure Guard"}
               </button>
            </form>
            
            <p className="mt-8 text-center text-[9px] font-bold text-slate-300 uppercase tracking-[0.2em] opacity-80">AES-256 Encrypted Storage</p>
          </div>
        </div>
      )}
    </main>
  );
}
