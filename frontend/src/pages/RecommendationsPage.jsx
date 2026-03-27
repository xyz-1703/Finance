import React, { useEffect, useState } from "react";
import api from "../api/client";

const RecommendationsPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [riskProfile, setRiskProfile] = useState("balanced");

  useEffect(() => {
    const fetchRecommendations = async () => {
      setLoading(true);
      try {
        const response = await api.get(`/insights/recommendations/?risk=${riskProfile}`);
        setData(response.data);
      } catch (error) {
        console.error("Error fetching recommendations:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchRecommendations();
  }, [riskProfile]);

  const riskOptions = [
    { id: "conservative", label: "Conservative", color: "blue" },
    { id: "balanced", label: "Balanced", color: "emerald" },
    { id: "aggressive", label: "Aggressive", color: "purple" }
  ];

  return (
    <div className="min-h-screen bg-[#0B0E14] text-white p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6 animate-in fade-in slide-in-from-top duration-700">
          <div>
            <h1 className="text-4xl font-black tracking-tighter mb-2">
              <span className="text-finance-primary">Quality</span> Picks
            </h1>
            <p className="text-finance-muted font-medium">
              Top 5 institution-grade stock recommendations for your portfolio.
            </p>
          </div>

          <div className="flex bg-white/5 border border-white/10 p-1 rounded-xl shadow-2xl backdrop-blur-xl">
            {riskOptions.map((opt) => (
              <button
                key={opt.id}
                onClick={() => setRiskProfile(opt.id)}
                className={`px-6 py-2.5 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${
                  riskProfile === opt.id 
                    ? "bg-finance-primary text-white shadow-lg shadow-finance-primary/20 scale-105" 
                    : "text-finance-muted hover:text-white hover:bg-white/5"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-finance-primary"></div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
              {/* AI Picks - 2 columns on large screens */}
              <div className="lg:col-span-2 space-y-6">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <span className="w-8 h-8 rounded-lg bg-finance-primary/20 flex items-center justify-center text-finance-primary">💎</span>
                  Risk-Adjusted AI Picks
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                  {data?.ai_picks?.map((pick, i) => (
                    <div 
                      key={i} 
                      className="bg-white/5 border border-white/10 p-6 rounded-3xl hover:border-finance-primary/50 transition-all group overflow-hidden relative"
                    >
                      <div className="absolute top-0 right-0 w-32 h-32 bg-finance-primary/5 blur-3xl rounded-full -mr-16 -mt-16"></div>
                      
                      <div className="flex justify-between items-start mb-6 relative z-10">
                        <div>
                          <span className="text-3xl font-black tracking-tighter block">{pick.symbol}</span>
                          <span className="text-xs font-bold text-finance-muted uppercase tracking-widest">{pick.sector || "Sector N/A"}</span>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-500 text-[10px] font-black uppercase tracking-widest border border-emerald-500/20">Target: {pick.target}</span>
                          <span className="px-3 py-1 rounded-full bg-red-500/10 text-red-500 text-[10px] font-black uppercase tracking-widest border border-red-500/20">Stop: {pick.stop_loss}</span>
                        </div>
                      </div>
                      
                      <p className="text-finance-muted text-sm leading-relaxed mb-6 relative z-10">
                        {pick.why}
                      </p>

                      <div className="flex items-center gap-4 pt-6 border-t border-white/5 relative z-10">
                        <div className="flex-1">
                          <span className="text-[10px] text-finance-muted font-black uppercase tracking-widest block mb-1">Buy Range</span>
                          <span className="text-sm font-bold font-mono">{pick.entry}</span>
                        </div>
                        <button className="px-6 py-2 rounded-xl bg-finance-primary text-[#0B0E14] font-black text-xs uppercase tracking-widest hover:brightness-110 transition-all active:scale-95 shadow-lg shadow-finance-primary/20">
                          Trade Now
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Sidebar - Analytics & Momentum */}
              <div className="space-y-8">
                {/* Sector Distribution (Simple CSS Donut) */}
                <div className="bg-white/5 border border-white/10 p-6 rounded-3xl">
                  <h3 className="text-sm font-black uppercase tracking-widest text-finance-muted mb-6">Sector Allocation</h3>
                  <div className="flex items-center gap-6">
                    <div className="relative w-24 h-24">
                      <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                        <circle cx="18" cy="18" r="16" fill="none" className="stroke-white/5" strokeWidth="4"></circle>
                        <circle cx="18" cy="18" r="16" fill="none" className="stroke-finance-primary" strokeWidth="4" strokeDasharray="60 100"></circle>
                        <circle cx="18" cy="18" r="16" fill="none" className="stroke-blue-500" strokeWidth="4" strokeDasharray="25 100" strokeDashoffset="-60"></circle>
                      </svg>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-finance-primary"></div>
                        <span className="text-xs font-bold">Tech · 60%</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                        <span className="text-xs font-bold">Finance · 25%</span>
                      </div>
                      <div className="flex items-center gap-2 text-finance-muted">
                        <div className="w-2 h-2 rounded-full bg-white/20"></div>
                        <span className="text-xs font-bold">Others · 15%</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Market Leaders */}
                <div className="space-y-4">
                  <h3 className="text-sm font-black uppercase tracking-widest text-finance-muted px-2">Trending Fast</h3>
                  <div className="space-y-2">
                    {data?.top_gainers?.map((stock, i) => (
                      <div key={i} className="flex justify-between items-center p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all cursor-pointer">
                        <div>
                          <span className="font-bold block">{stock.symbol}</span>
                          <span className="text-[10px] text-finance-muted font-bold tracking-widest uppercase">₹{stock.price}</span>
                        </div>
                        <span className="text-emerald-500 font-black text-sm">+{stock.change_pct}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Personalized Diversification */}
            {data?.diversification?.length > 0 && (
              <div className="bg-gradient-to-r from-finance-primary/20 via-[#0B0E14] to-blue-500/20 border border-white/10 p-8 rounded-[2rem] relative overflow-hidden group">
                <div className="absolute inset-0 bg-finance-primary/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative z-10">
                  <h3 className="text-sm font-black uppercase tracking-[0.2em] mb-4 flex items-center gap-3 text-finance-primary">
                    <span className="flex h-2 w-2 rounded-full bg-finance-primary animate-ping"></span>
                    Portfolio Diversification Advice
                  </h3>
                  <p className="text-xl font-bold tracking-tight text-white/90 leading-relaxed">
                    "{data.diversification[0]}"
                  </p>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <style jsx>{`
        .text-finance-primary { color: #10B981; }
        .bg-finance-primary { background-color: #10B981; }
        .border-finance-primary { border-color: #10B981; }
        .text-finance-muted { color: #94A3B8; }
        .text-finance-primaryHover:hover { color: #059669; }
      `}</style>
    </div>
  );
};

export default RecommendationsPage;
