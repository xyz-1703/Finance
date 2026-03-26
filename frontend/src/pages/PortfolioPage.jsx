import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/client";

export default function PortfolioPage() {
  const navigate = useNavigate();
  const isAuthenticated = Boolean(localStorage.getItem("access_token"));
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
      const portRes = await api.get("/portfolio/portfolios/");
      setPortfolios(portRes.data || []);
      if (!selectedPortfolio && portRes.data?.length) {
        setSelectedPortfolio(String(portRes.data[0].id));
      }
    } catch(err) {}

    try {
      const holdRes = await api.get("/portfolio/holdings/");
      setHoldings(holdRes.data || []);
    } catch(err) {}

    try {
      const stockRes = await api.get("/insights/stocks/");
      setStocks(stockRes.data || []);
    } catch(err) {}
    
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const createPortfolio = async (event) => {
    event.preventDefault();
    if (!isAuthenticated) return navigate('/login');
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
    if (!isAuthenticated) return navigate('/login');
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
    if (!isAuthenticated) return navigate('/login');
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
    <main className="max-w-[1400px] mx-auto px-6 py-10 animate-fade-in bg-white min-h-screen">
      <header className="mb-10">
        <div className="flex items-center gap-3 mb-4">
          <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 text-[10px] font-bold uppercase tracking-wider border border-emerald-500/20">Portfolio Management</span>
          <span className="text-slate-400 text-xs font-mono uppercase tracking-widest">Analytics & Holdings</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tighter text-slate-800">Asset Control</h1>
        <p className="text-slate-500 text-lg leading-relaxed max-w-3xl">
          Create multiple portfolios, manage your long-term holdings, and use 
          <span className="text-emerald-500 font-semibold"> K-Means Clustering </span> to analyze asset distribution.
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
          <section className="bg-slate-50 border border-slate-200 rounded-3xl p-8 shadow-sm">
            <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
              <svg className="h-5 w-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              New Portfolio
            </h2>
            <form onSubmit={createPortfolio} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5" htmlFor="portfolio-name">Name</label>
                <input
                  id="portfolio-name"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="e.g. Retirement Fund"
                  className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-800 focus:outline-none focus:border-emerald-500 transition-all"
                />
              </div>
              <button className="bg-emerald-500 text-white w-full py-4 rounded-xl font-bold uppercase tracking-widest shadow-lg shadow-emerald-500/20 hover:bg-emerald-400 transition-all" type="submit">Initialize Portfolio</button>
            </form>
          </section>

          <section className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
            <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
              <svg className="h-5 w-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
              </svg>
              Add Holding
            </h2>
            <form onSubmit={addHolding} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5" htmlFor="portfolio-select">Target Portfolio</label>
                <select
                  id="portfolio-select"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 focus:outline-none focus:border-emerald-500 transition-all appearance-none"
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
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5" htmlFor="stock-select">Asset Symbol</label>
                <select
                  id="stock-select"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 focus:outline-none focus:border-emerald-500 transition-all appearance-none"
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
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5" htmlFor="holding-quantity">Qty</label>
                  <input
                    id="holding-quantity"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 focus:outline-none focus:border-emerald-500 transition-all"
                    value={quantity}
                    onChange={(event) => setQuantity(event.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5" htmlFor="holding-price">Avg Price</label>
                  <input
                    id="holding-price"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 focus:outline-none focus:border-emerald-500 transition-all"
                    value={averageBuyPrice}
                    onChange={(event) => setAverageBuyPrice(event.target.value)}
                  />
                </div>
              </div>
              <button className="w-full py-4 bg-slate-800 text-white rounded-xl font-bold uppercase tracking-widest shadow-lg shadow-slate-800/10 hover:bg-slate-700 transition-all" type="submit">Verify & Add</button>
            </form>
          </section>
        </div>

        {/* Right Column: Tables & Analysis */}
        <div className="lg:col-span-2 space-y-8">
          <section className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h2 className="text-xl font-bold text-slate-800">Active Portfolios</h2>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{portfolios.length} Total</span>
            </div>
            <table className="w-full border-separate border-spacing-0">
              <thead>
                <tr className="bg-slate-50">
                  <th className="pl-6 py-4 text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100">Identity</th>
                  <th className="py-4 text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100">Asset Count</th>
                  <th className="py-4 text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 text-center">Name</th>
                  <th className="py-4 text-right text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100">Total Valuation</th>
                  <th className="py-4 text-right text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100">Return (PnL)</th>
                  <th className="pr-6 py-4 text-right text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100">Deployment Date</th>
                </tr>
              </thead>
              <tbody>
                {portfolios.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                    <td className="pl-6 py-4 border-b border-slate-50"><span className="bg-slate-100 px-2 py-1 rounded text-[10px] font-mono font-bold text-emerald-600 border border-slate-200">#{item.id}</span></td>
                    <td className="py-4 border-b border-slate-50 text-slate-800 font-bold">{item.name}</td>
                    <td className="py-4 border-b border-slate-50 text-center text-xs font-bold text-slate-400">
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

          <section className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h2 className="text-xl font-bold text-slate-800">Current Holdings</h2>
              <div className="flex gap-2">
                 <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 text-[10px] font-bold uppercase tracking-wider border border-emerald-500/20">Real-time Stats</span>
              </div>
            </div>
            <table className="w-full border-separate border-spacing-0">
              <thead>
                <tr className="bg-slate-50">
                  <th className="pl-6 py-4 text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100">Asset</th>
                  <th className="py-4 text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100">Position</th>
                  <th className="py-4 text-right text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100">Market Price</th>
                  <th className="py-4 text-right text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100">Valuation</th>
                  <th className="pr-6 py-4 text-right text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100">Management</th>
                </tr>
              </thead>
              <tbody>
                {filteredHoldings.map((item) => (
                  <tr key={item.id} className="group hover:bg-slate-50 transition-colors">
                    <td className="pl-6 py-4 border-b border-slate-50">
                       <div className="font-bold text-slate-800 mb-0.5">{item.stock_symbol}</div>
                       <div className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">{item.stock_name || "Unknown Asset"}</div>
                    </td>
                    <td className="py-4 border-b border-slate-50 text-slate-700 font-medium">{item.quantity} Units</td>
                    <td className="text-right py-4 border-b border-slate-50">
                      <span className="text-slate-400 text-[10px] mr-1">INR</span>
                      <span className="text-slate-800 font-bold">{Number(item.current_price || 0).toLocaleString()}</span>
                    </td>
                    <td className="text-right py-4 border-b border-slate-50">
                       <div className="text-emerald-500 font-black">
                          <span className="text-[10px] mr-1">INR</span>
                          {Number(item.total_value || 0).toLocaleString()}
                       </div>
                    </td>
                    <td className="pr-6 text-right py-4 border-b border-slate-50">
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
                    <td colSpan={5} className="py-20 text-center text-slate-400 italic">No holdings detected for this selection.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </section>

          <section className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
             <div className="p-8 border-b border-slate-100 bg-emerald-500/5">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                  <div>
                    <h2 className="text-2xl font-black text-slate-800 tracking-tight mb-2 uppercase">Portfolio Clustering</h2>
                    <p className="text-slate-500 text-sm">AI-driven KMeans analysis using PE, ROE, and Market Cap.</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="relative group">
                      <input
                        type="number"
                        min="2"
                        max="12"
                        className="w-24 bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-800 focus:outline-none focus:border-emerald-500 transition-all font-bold"
                        value={clusterCount}
                        onChange={(event) => setClusterCount(event.target.value)}
                        placeholder="N"
                      />
                      <span className="absolute -top-6 left-0 text-[10px] items-center font-bold text-slate-400 uppercase tracking-widest">Clusters</span>
                    </div>
                    <button className="bg-emerald-500 text-white px-6 py-3.5 rounded-xl font-black uppercase tracking-widest shadow-lg shadow-emerald-500/20 hover:bg-emerald-400 transition-all" onClick={runClustering}>Execute Analysis</button>
                  </div>
                </div>
             </div>
            <table className="w-full border-separate border-spacing-0">
              <thead>
                <tr className="bg-slate-50">
                  <th className="pl-6 py-4 text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100">Asset Name</th>
                  <th className="py-4 text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100">AI Cluster</th>
                  <th className="py-4 text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100">P/E</th>
                  <th className="py-4 text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100">ROE %</th>
                  <th className="pr-6 py-4 text-right text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100">Market Cap</th>
                </tr>
              </thead>
              <tbody>
                {clusterResults.map((item) => (
                  <tr key={item.id} className="hover:bg-emerald-50 transition-colors">
                    <td className="pl-6 py-4 border-b border-slate-50">
                       <div className="font-bold text-slate-800">{item.stock_name || item.stock_symbol}</div>
                       <code className="text-[10px] text-emerald-600 font-bold">{item.stock_symbol}</code>
                    </td>
                    <td className="py-4 border-b border-slate-50">
                      <span className="px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-700 font-black text-[10px]">
                        CLUSTER_{item.cluster_label}
                      </span>
                    </td>
                    <td className="py-4 border-b border-slate-50 text-slate-800 font-medium">{item.feature_vector?.pe?.toFixed(2) || "-"}</td>
                    <td className="py-4 border-b border-slate-50 text-slate-800 font-medium">{item.feature_vector?.roe?.toFixed(2) || "-"}%</td>
                    <td className="pr-6 text-right py-4 border-b border-slate-50 font-mono text-xs text-slate-500">{(item.feature_vector?.market_cap / 1e9).toFixed(2)}B</td>
                  </tr>
                ))}
                {!clusterResults.length && (
                  <tr>
                    <td colSpan={5} className="py-20 text-center text-slate-400 italic">
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
