import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/client";

export default function PortfolioDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [portfolio, setPortfolio] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [clusters, setClusters] = useState([]);
  const [isClustering, setIsClustering] = useState(false);

  useEffect(() => {
    fetchPortfolio();
  }, [id]);

  const fetchPortfolio = async () => {
    try {
      const res = await api.get(`/portfolio/portfolios/${id}/`);
      setPortfolio(res.data);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.error || err.response?.data?.detail || "Failed to load portfolio details.");
      setLoading(false);
    }
  };

  const handleRunClustering = async () => {
    if (!portfolio || portfolio.holdings.length < 2) {
      setError("At least 2 unique stocks are required for clustering.");
      return;
    }
    
    setIsClustering(true);
    setError("");
    try {
      const symbols = [...new Set(portfolio.holdings.map(h => h.symbol))];
      const res = await api.post("/mlops/cluster/run/", {
        symbols,
        n_clusters: Math.min(3, symbols.length)
      });
      setClusters(res.data);
    } catch (err) {
      setError(err.response?.data?.detail || "Clustering analysis failed. Ensure dependencies are installed.");
    } finally {
      setIsClustering(false);
    }
  };

  const handleSell = async (symbol, currentQty) => {
    const qtyToSell = window.prompt(`How many units of ${symbol} do you want to sell? (Max: ${currentQty})`);
    if (!qtyToSell || isNaN(qtyToSell) || Number(qtyToSell) <= 0) return;
    
    if (Number(qtyToSell) > Number(currentQty)) {
      alert("You cannot sell more than you own.");
      return;
    }

    setSubmitting(true);
    try {
      await api.post("/portfolio/transactions/", {
        portfolio: Number(id),
        symbol: symbol,
        quantity: Number(qtyToSell),
        action: "SELL"
      });
      fetchPortfolio();
    } catch (err) {
      setError(err.response?.data?.error || "Sell order failed.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="loading">Loading Portfolio...</div>;
  if (!portfolio) return <div className="error">Portfolio not found.</div>;

  return (
    <main className="app-shell animate-fade-in">
      <header className="mb-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div>
            <button 
              className="flex items-center gap-2 text-finance-muted hover:text-white transition-colors text-xs font-bold uppercase tracking-widest mb-4 group" 
              onClick={() => navigate("/dashboard")}
            >
              <svg className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M11 17l-5-5m0 0l5-5m-5 5h12" /></svg>
              Back to Dashboard
            </button>
            <div className="flex items-center gap-3 mb-2">
              <span className="badge badge-primary">Portfolio Detail</span>
              <span className="text-finance-muted text-[10px] font-mono uppercase tracking-widest">ID: {id}</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-white">{portfolio.name}</h1>
          </div>
          
          <div className="flex gap-4">
            <div className="glass-card px-8 py-4 border-emerald-500/20 bg-emerald-500/5">
              <span className="block text-[10px] text-finance-muted uppercase font-bold tracking-widest mb-1">Cumulative Valuation</span>
              <span className="text-3xl font-black text-emerald-400">
                <span className="text-sm mr-1 font-bold">INR</span>
                {Number(portfolio.total_value || 0).toLocaleString()}
              </span>
            </div>
            <div className="glass-card px-8 py-4">
              <span className="block text-[10px] text-finance-muted uppercase font-bold tracking-widest mb-1">Total Units</span>
              <span className="text-3xl font-black text-white">{Number(portfolio.total_quantity || 0).toLocaleString()}</span>
            </div>
            <div className="glass-card px-8 py-4">
              <span className="block text-[10px] text-finance-muted uppercase font-bold tracking-widest mb-1">Asset Count</span>
              <span className="text-3xl font-black text-white">{portfolio.holdings?.length || 0}</span>
            </div>
          </div>
        </div>
      </header>

      {error && (
        <div className="p-4 mb-8 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-500 flex items-center gap-3">
          <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" /></svg>
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-8">
        <section className="glass-card overflow-hidden">
          <div className="p-8 border-b border-white/5 bg-white/[0.01]">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
              <div>
                <h2 className="text-2xl font-black text-white tracking-tight mb-2">Current Asset Allocation</h2>
                <div className="flex items-center gap-4">
                  <button 
                    className="btn-primary py-2 px-6 text-xs h-auto" 
                    onClick={handleRunClustering} 
                    disabled={isClustering || portfolio.holdings.length < 2}
                  >
                    {isClustering ? "Clustering..." : "Run AI Cluster Analysis"}
                  </button>
                </div>
              </div>

            </div>
          </div>

          <table className="modern-table">
            <thead>
              <tr>
                <th>Reference</th>
                <th>Identity</th>
                <th className="text-right">Market Price</th>
                <th className="text-right">Valuation</th>
                <th className="text-right">Profit/Loss</th>
                <th className="text-center">Management</th>
              </tr>
            </thead>
            <tbody>
              {portfolio.holdings.map((holding) => (
                <tr key={holding.id} className="group">
                  <td><code className="bg-white/5 px-2 py-1 rounded text-[10px] font-bold text-finance-primary border border-white/5 uppercase">{holding.symbol}</code></td>
                  <td>
                    <div className="text-white font-bold">{Number(holding.quantity).toLocaleString()} Units</div>
                  </td>
                  <td className="text-right">
                    <span className="text-finance-muted text-xs mr-1">INR</span>
                    <span className="text-white font-medium">{Number(holding.current_price || 0).toLocaleString()}</span>
                  </td>
                  <td className="text-right">
                    <div className="text-emerald-400 font-black">
                      <span className="text-[10px] mr-1">INR</span>
                      {Number(holding.total_value || 0).toLocaleString()}
                    </div>
                  </td>
                  <td className="text-right">
                    <div className={`font-black ${Number(holding.profit_loss) >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {Number(holding.profit_loss) >= 0 ? '+' : ''}
                      {Number(holding.profit_loss || 0).toLocaleString()}
                    </div>
                  </td>
                  <td className="text-center">
                    <div className="flex items-center justify-center gap-2 text-[10px]">
                      <button 
                        className="px-4 py-1.5 rounded-lg bg-rose-500/10 text-rose-500 font-bold uppercase tracking-widest hover:bg-rose-500 hover:text-white transition-all border border-rose-500/20" 
                        onClick={() => handleSell(holding.symbol, holding.quantity)}
                        disabled={submitting}
                      >
                        SELL
                      </button>
                      <button className="text-finance-muted hover:text-rose-400 transition-colors uppercase font-bold tracking-widest text-[8px]" onClick={async () => {
                        if (window.confirm("Delete this entire holding entry?")) {
                          await api.delete(`/portfolio/holdings/${holding.id}/`);
                          fetchPortfolio();
                        }
                      }}>Liquidate</button>
                    </div>
                  </td>
                </tr>
              ))}
              {portfolio.holdings.length === 0 && (
                <tr>
                  <td colSpan="5" className="py-24 text-center text-finance-muted italic">
                    The strategic vault is empty. Deposit your first asset above.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </section>

        {clusters.length > 0 && (
          <section className="glass-card p-8 bg-finance-primary/5 border-finance-primary/20">
            <h2 className="text-2xl font-black text-white tracking-tight mb-2">Clustering Intelligence</h2>
            <p className="text-finance-muted text-sm mb-8 italic">Algorithmic categorization based on P/E Ratio, ROI, and Market Capitalization.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...new Set(clusters.map(c => c.cluster_label))].map(label => (
                <div key={label} className="p-6 rounded-3xl bg-white/[0.02] border border-white/5 hover:border-finance-primary/30 transition-all">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-finance-primary/10 flex items-center justify-center text-finance-primary font-black">
                      {label}
                    </div>
                    <h3 className="font-black text-white uppercase tracking-widest text-xs">Tactical Group {label}</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {clusters.filter(c => c.cluster_label === label).map(c => {
                      const stockDetails = portfolio.holdings.find(h => h.symbol === c.stock_symbol) || { symbol: `ID: ${c.stock}` };
                      return (
                        <span key={c.id} className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/5 text-[10px] font-black text-finance-primary uppercase tracking-widest">
                          {stockDetails.symbol}
                        </span>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
