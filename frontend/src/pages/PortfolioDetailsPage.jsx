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
  const [addSymbol, setAddSymbol] = useState('');
  const [addQuantity, setAddQuantity] = useState('1');
  const [addingAsset, setAddingAsset] = useState(false);

  useEffect(() => {
    fetchPortfolio();
  }, [id]);

  const fetchPortfolio = async () => {
    try {
      const res = await api.get(`/portfolio/portfolios/${id}/`);
      setPortfolio(res.data);
      setLoading(false);
      
      // Auto-run clustering if portfolio has 2+ stocks
      if (res.data.holdings && res.data.holdings.length >= 2) {
        performClustering(res.data.holdings);
      }
    } catch (err) {
      setError(err.response?.data?.error || err.response?.data?.detail || "Failed to load portfolio details.");
      setLoading(false);
    }
  };

  const performClustering = async (holdings) => {
    try {
      setIsClustering(true);
      const symbols = [...new Set(holdings.map(h => h.symbol))];
      const res = await api.post("/mlops/cluster/run/", {
        symbols,
        n_clusters: Math.min(3, symbols.length)
      });
      setClusters(res.data);
    } catch (err) {
      console.error("Clustering failed:", err);
      // Don't show error for clustering - it's optional
    } finally {
      setIsClustering(false);
    }
  };

  const handleRunClustering = async () => {
    if (!portfolio || portfolio.holdings.length < 2) {
      setError("At least 2 unique stocks are required for clustering.");
      return;
    }
    
    await performClustering(portfolio.holdings);
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
              {portfolio.is_default && <span className="badge bg-accent-gold/10 text-accent-gold text-[8px]">TEMPLATE</span>}
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
                <p className="text-finance-muted text-sm">
                  {portfolio.holdings.length} {portfolio.holdings.length === 1 ? 'stock held' : 'stocks held'}
                </p>
              </div>

              {portfolio.holdings.length >= 2 && (
                <button 
                  className="btn-primary py-2 px-6 text-xs h-auto flex items-center gap-2" 
                  onClick={handleRunClustering} 
                  disabled={isClustering}
                >
                  <svg className={`w-4 h-4 ${isClustering ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                  {isClustering ? 'Analyzing...' : 'Refresh AI Analysis'}
                </button>
              )}
            </div>
          </div>

          <div className="p-6 border-b border-white/5 bg-white/[0.01] flex items-center gap-4">
            <input
              type="text"
              placeholder="Ticker (e.g. RELIANCE)"
              value={addSymbol}
              onChange={(e) => setAddSymbol(e.target.value.toUpperCase())}
              className="glass-input w-44"
            />
            <input
              type="number"
              min="1"
              value={addQuantity}
              onChange={(e) => setAddQuantity(e.target.value)}
              className="glass-input w-28"
            />
            <button
              onClick={async () => {
                if (!addSymbol || Number(addQuantity) <= 0) return;
                setAddingAsset(true);
                try {
                  await api.post('/portfolio/transactions/', {
                    portfolio: Number(id),
                    symbol: addSymbol,
                    quantity: Number(addQuantity),
                    action: 'BUY'
                  });
                  setAddSymbol('');
                  setAddQuantity('1');
                  fetchPortfolio();
                } catch (err) {
                  setError(err?.response?.data?.error || err?.response?.data?.detail || 'Add asset failed');
                } finally {
                  setAddingAsset(false);
                }
              }}
              className="btn-primary py-2 px-4"
              disabled={addingAsset}
            >
              {addingAsset ? 'Adding...' : 'Add Asset'}
            </button>
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
                        className="px-4 py-1.5 rounded-lg bg-rose-500/10 text-rose-500 font-bold uppercase tracking-widest hover:bg-rose-500 hover:text-white transition-all border border-rose-500/20 disabled:opacity-50 disabled:cursor-not-allowed" 
                        onClick={() => handleSell(holding.symbol, holding.quantity)}
                        disabled={submitting || portfolio.is_default}
                      >
                        SELL
                      </button>
                      <button className="text-finance-muted hover:text-rose-400 transition-colors uppercase font-bold tracking-widest text-[8px] disabled:opacity-50 disabled:cursor-not-allowed" onClick={async () => {
                        if (window.confirm("Delete this entire holding entry?")) {
                          await api.delete(`/portfolio/holdings/${holding.id}/`);
                          fetchPortfolio();
                        }
                      }} disabled={portfolio.is_default}>Liquidate</button>
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
          <section className="glass-card p-8 bg-gradient-to-br from-finance-primary/10 to-finance-primary/5 border border-finance-primary/20">
            <div className="mb-8">
              <h2 className="text-2xl font-black text-white tracking-tight mb-2">AI-Powered Clustering Analysis</h2>
              <p className="text-finance-muted text-sm italic">Your portfolio stocks are automatically grouped by similar characteristics (P/E Ratio, ROI, Market Cap)</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...new Set(clusters.map(c => c.cluster_label))].map(label => {
                const groupClusters = clusters.filter(c => c.cluster_label === label);
                return (
                  <div key={label} className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-finance-primary/40 transition-all group">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-12 h-12 rounded-xl bg-finance-primary/20 flex items-center justify-center text-finance-primary font-black text-lg group-hover:bg-finance-primary/30 transition-all">
                        {label}
                      </div>
                      <div>
                        <h3 className="font-black text-white uppercase tracking-widest text-xs">Group {label}</h3>
                        <p className="text-finance-muted text-[10px] mt-1">{groupClusters.length} {groupClusters.length === 1 ? 'stock' : 'stocks'}</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      {groupClusters.map(c => {
                        const holding = portfolio.holdings.find(h => h.symbol === c.stock_symbol);
                        return (
                          <div key={c.id} className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 group-hover:border-finance-primary/20 transition-all">
                            <div className="flex items-center justify-between">
                              <span className="text-finance-primary font-black text-xs uppercase tracking-widest">{holding?.symbol || c.stock_symbol}</span>
                              <span className="text-finance-muted text-[10px]">{holding?.name}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
