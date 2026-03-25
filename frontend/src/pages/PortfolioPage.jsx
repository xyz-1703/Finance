import { useEffect, useState } from "react";

import api from "../api/client";

export default function PortfolioPage() {
  const [portfolios, setPortfolios] = useState([]);
  const [holdings, setHoldings] = useState([]);
  const [stocks, setStocks] = useState([]);
  const [name, setName] = useState("");
  const [selectedPortfolio, setSelectedPortfolio] = useState("");
  const [selectedStock, setSelectedStock] = useState("");
  const [quantity, setQuantity] = useState("1");
  const [averageBuyPrice, setAverageBuyPrice] = useState("0");
  const [clusterCount, setClusterCount] = useState("3");
  const [clusterResults, setClusterResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const loadData = async () => {
    setLoading(true);
    setError("");
    try {
      const [portfolioResponse, holdingsResponse, stockResponse] = await Promise.all([
        api.get("/portfolio/portfolios/"),
        api.get("/portfolio/holdings/"),
        api.get("/insights/stocks/"),
      ]);
      setPortfolios(portfolioResponse.data || []);
      setHoldings(holdingsResponse.data || []);
      setStocks(stockResponse.data || []);
      if (!selectedPortfolio && portfolioResponse.data?.length) {
        setSelectedPortfolio(String(portfolioResponse.data[0].id));
      }
    } catch (err) {
      setError(err.response?.data?.detail || "Unable to load portfolio data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const createPortfolio = async (event) => {
    event.preventDefault();
    setMessage("");
    setError("");
    if (!name.trim()) {
      setError("Portfolio name is required.");
      return;
    }

    try {
      await api.post("/portfolio/portfolios/", { name: name.trim() });
      setMessage("Portfolio created.");
      setName("");
      loadData();
    } catch (err) {
      console.error("Portfolio creation error:", err);
      setError(err.response?.data?.error || err.response?.data?.detail || "Unable to create portfolio.");
    }
  };

  const addHolding = async (event) => {
    event.preventDefault();
    setMessage("");
    setError("");
    if (!selectedPortfolio || !selectedStock) {
      setError("Select a portfolio and stock.");
      return;
    }

    try {
      const stockInfo = stocks.find((item) => String(item.symbol) === String(selectedStock));
      await api.post("/portfolio/holdings/", {
        portfolio: Number(selectedPortfolio),
        stock_symbol_input: selectedStock,
        stock_name_input: stockInfo?.name || selectedStock,
        stock_sector_input: stockInfo?.sector || "Unknown",
        quantity,
        average_buy_price: averageBuyPrice,
      });
      setMessage("Stock added to portfolio.");
      setSelectedStock("");
      loadData();
    } catch (err) {
      setError(err.response?.data?.detail || "Unable to add stock.");
    }
  };

  const removeHolding = async (holdingId) => {
    setMessage("");
    setError("");
    try {
      await api.delete(`/portfolio/holdings/${holdingId}/`);
      setMessage("Stock removed from portfolio.");
      loadData();
    } catch (err) {
      setError(err.response?.data?.detail || "Unable to remove stock.");
    }
  };

  const runClustering = async () => {
    setMessage("");
    setError("");
    if (!selectedPortfolio) {
      setError("Select a portfolio to run clustering.");
      return;
    }
    try {
      const response = await api.post("/mlops/portfolio/cluster/run/", {
        portfolio_id: Number(selectedPortfolio),
        n_clusters: Number(clusterCount),
      });
      setClusterResults(response.data || []);
      setMessage("Clustering completed.");
    } catch (err) {
      setError(err.response?.data?.detail || "Clustering failed.");
    }
  };

  const filteredHoldings = holdings.filter(
    (item) => String(item.portfolio) === String(selectedPortfolio)
  );
  return (
    <main className="app-shell animate-fade-in">
      <header className="mb-10">
        <div className="flex items-center gap-3 mb-4">
          <span className="badge badge-primary">Portfolio Management</span>
          <span className="text-finance-muted text-xs font-mono uppercase tracking-widest">Analytics & Holdings</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tighter text-white">Asset Control</h1>
        <p className="text-finance-muted text-lg leading-relaxed max-w-3xl">
          Create multiple portfolios, manage your long-term holdings, and use 
          <span className="text-finance-primary font-semibold"> K-Means Clustering </span> to analyze asset distribution.
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
        {/* Left Column: Management Tools */}
        <div className="lg:col-span-1 space-y-8">
          <section className="glass-card p-8 bg-finance-primary/5 border-finance-primary/20">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <svg className="h-5 w-5 text-finance-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              New Portfolio
            </h2>
            <form onSubmit={createPortfolio} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-finance-muted uppercase tracking-widest mb-1.5" htmlFor="portfolio-name">Name</label>
                <input
                  id="portfolio-name"
                  className="input-field"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="e.g. Retirement Fund"
                />
              </div>
              <button className="btn-primary w-full py-3" type="submit">Initialize Portfolio</button>
            </form>
          </section>

          <section className="glass-card p-8">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <svg className="h-5 w-5 text-finance-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
              </svg>
              Add Holding
            </h2>
            <form onSubmit={addHolding} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-finance-muted uppercase tracking-widest mb-1.5" htmlFor="portfolio-select">Target Portfolio</label>
                <select
                  id="portfolio-select"
                  className="input-field appearance-none"
                  value={selectedPortfolio}
                  onChange={(event) => setSelectedPortfolio(event.target.value)}
                >
                  <option value="">Choose...</option>
                  {portfolios.map((item) => (
                    <option key={item.id} value={item.id}>{item.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-finance-muted uppercase tracking-widest mb-1.5" htmlFor="stock-select">Asset Symbol</label>
                <select
                  id="stock-select"
                  className="input-field appearance-none"
                  value={selectedStock}
                  onChange={(event) => setSelectedStock(event.target.value)}
                >
                  <option value="">Choose asset...</option>
                  {stocks.map((item) => (
                    <option key={item.symbol} value={item.symbol}>{item.symbol} - {item.name}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-finance-muted uppercase tracking-widest mb-1.5" htmlFor="holding-quantity">Qty</label>
                  <input
                    id="holding-quantity"
                    className="input-field"
                    value={quantity}
                    onChange={(event) => setQuantity(event.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-finance-muted uppercase tracking-widest mb-1.5" htmlFor="holding-price">Avg Price</label>
                  <input
                    id="holding-price"
                    className="input-field"
                    value={averageBuyPrice}
                    onChange={(event) => setAverageBuyPrice(event.target.value)}
                  />
                </div>
              </div>
              <button className="btn-secondary w-full py-3" type="submit">Verify & Add</button>
            </form>
          </section>
        </div>

        {/* Right Column: Tables & Analysis */}
        <div className="lg:col-span-2 space-y-8">
          <section className="glass-card overflow-hidden">
            <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/[0.01]">
              <h2 className="text-xl font-bold text-white">Active Portfolios</h2>
              <span className="text-xs font-bold text-finance-muted uppercase tracking-widest">{portfolios.length} Total</span>
            </div>
            <table className="modern-table">
              <thead>
                <tr>
                  <th>Identity</th>
                  <th>Asset Count</th>
                  <th className="text-right">Total Valuation</th>
                  <th className="text-right">Return (PnL)</th>
                  <th className="text-right">Deployment Date</th>
                </tr>
              </thead>
              <tbody>
                {portfolios.map((item) => (
                  <tr key={item.id}>
                    <td><span className="bg-white/5 px-2 py-1 rounded text-[10px] font-mono font-bold text-finance-primary border border-white/5">#{item.id}</span></td>
                    <td className="text-white font-bold">
                       {item.name}
                    </td>
                    <td className="text-center text-xs font-bold text-finance-muted">
                       {item.holdings?.length || 0} Assets
                    </td>
                    <td className="text-right">
                       <div className="text-emerald-400 font-black">
                          <span className="text-[10px] mr-1">INR</span>
                          {Number(item.total_value || 0).toLocaleString()}
                       </div>
                    </td>
                    <td className="text-right">
                       <div className={`font-black ${Number(item.profit_loss) >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                          {Number(item.profit_loss) >= 0 ? '+' : ''}
                          {Number(item.profit_loss || 0).toLocaleString()}
                       </div>
                    </td>
                    <td className="text-right text-finance-muted text-[10px] font-mono uppercase tracking-widest">
                       {new Date(item.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
                {!portfolios.length && !loading && (
                  <tr>
                    <td colSpan={3} className="py-20 text-center text-finance-muted italic">No active portfolios found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </section>

          <section className="glass-card overflow-hidden">
            <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/[0.01]">
              <h2 className="text-xl font-bold text-white">Current Holdings</h2>
              <div className="flex gap-2">
                 <span className="badge badge-primary">Real-time Stats</span>
              </div>
            </div>
            <table className="modern-table">
              <thead>
                <tr>
                  <th>Asset</th>
                  <th>Position</th>
                  <th className="text-right">Market Price</th>
                  <th className="text-right">Valuation</th>
                  <th className="text-right">Management</th>
                </tr>
              </thead>
              <tbody>
                {filteredHoldings.map((item) => (
                  <tr key={item.id} className="group">
                    <td>
                       <div className="font-bold text-white mb-0.5">{item.stock_symbol}</div>
                       <div className="text-[10px] uppercase font-bold text-finance-muted tracking-widest">{item.stock_name || "Unknown Asset"}</div>
                    </td>
                    <td className="text-white font-medium">{item.quantity} Units</td>
                    <td className="text-right">
                      <span className="text-finance-muted text-[10px] mr-1">INR</span>
                      <span className="text-white font-bold">{Number(item.current_price || 0).toLocaleString()}</span>
                    </td>
                    <td className="text-right">
                       <div className="text-emerald-400 font-black">
                          <span className="text-[10px] mr-1">INR</span>
                          {Number(item.total_value || 0).toLocaleString()}
                       </div>
                    </td>
                    <td className="text-right">
                      <button 
                        className="px-4 py-1.5 rounded-lg bg-rose-500/10 text-rose-500 text-xs font-bold hover:bg-rose-500 hover:text-white transition-all opacity-0 group-hover:opacity-100" 
                        onClick={() => removeHolding(item.id)}
                      >
                        Liquidate
                      </button>
                    </td>
                  </tr>
                ))}
                {!filteredHoldings.length && (
                  <tr>
                    <td colSpan={4} className="py-20 text-center text-finance-muted italic">No holdings detected for this selection.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </section>

          <section className="glass-card overflow-hidden">
             <div className="p-8 border-b border-white/5 bg-finance-primary/5">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                  <div>
                    <h2 className="text-2xl font-black text-white tracking-tight mb-2">Portfolio Clustering</h2>
                    <p className="text-finance-muted text-sm">AI-driven KMeans analysis using PE, ROE, and Market Cap.</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="relative group">
                      <input
                        type="number"
                        min="2"
                        max="12"
                        className="input-field w-24 pl-4 pr-4"
                        value={clusterCount}
                        onChange={(event) => setClusterCount(event.target.value)}
                        placeholder="N"
                      />
                      <span className="absolute -top-6 left-0 text-[10px] items-center font-bold text-finance-muted uppercase tracking-widest">Clusters</span>
                    </div>
                    <button className="btn-primary whitespace-nowrap" onClick={runClustering}>Execute Analysis</button>
                  </div>
                </div>
             </div>
            <table className="modern-table">
              <thead>
                <tr>
                  <th>Asset Name</th>
                  <th>AI Cluster</th>
                  <th>P/E</th>
                  <th>ROE %</th>
                  <th className="text-right">Market Cap</th>
                </tr>
              </thead>
              <tbody>
                {clusterResults.map((item) => (
                  <tr key={item.id} className="hover:bg-finance-primary/5 transition-colors">
                    <td>
                       <div className="font-bold text-white">{item.stock_name || item.stock_symbol}</div>
                       <code className="text-[10px] text-finance-primary font-bold">{item.stock_symbol}</code>
                    </td>
                    <td>
                      <span className="px-3 py-1 rounded-full bg-white/5 border border-white/5 text-white font-black text-[10px]">
                        CLUSTER_{item.cluster_label}
                      </span>
                    </td>
                    <td className="text-white font-medium">{item.feature_vector?.pe?.toFixed(2) || "-"}</td>
                    <td className="text-white font-medium">{item.feature_vector?.roe?.toFixed(2) || "-"}%</td>
                    <td className="text-right font-mono text-xs text-finance-muted">{(item.feature_vector?.market_cap / 1e9).toFixed(2)}B</td>
                  </tr>
                ))}
                {!clusterResults.length && (
                  <tr>
                    <td colSpan={5} className="py-20 text-center text-finance-muted italic">
                      Start clustering analysis to categorize your holdings.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </section>
        </div>
      </div>
    </main>
  );
}
