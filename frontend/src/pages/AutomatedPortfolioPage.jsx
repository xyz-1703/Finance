import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/client";

export default function AutomatedPortfolioPage() {
  const navigate = useNavigate();
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [creating, setCreating] = useState(false);
  const [newPortfolioName, setNewPortfolioName] = useState("AI Optimized Portfolio");

  useEffect(() => {
    fetchSuggestions();
  }, []);

  const fetchSuggestions = async () => {
    try {
      const res = await api.get("/portfolio/portfolios/suggest_diversified/");
      setSuggestions(res.data);
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch AI suggestions. Make sure clustering is run first.");
      setLoading(false);
    }
  };

  const handleCreateAutomated = async () => {
    if (suggestions.length === 0) return;
    setCreating(true);
    try {
      // 1. Create Portfolio
      const portRes = await api.post("/portfolio/portfolios/", {
        name: newPortfolioName,
        is_automated: true,
        target_allocation: suggestions.reduce((acc, s) => {
          acc[s.symbol] = Math.floor(100 / suggestions.length);
          return acc;
        }, {})
      });
      
      const portfolioId = portRes.data.id;

      // 2. Initial BUY for each suggested stock (starting small)
      for (const stock of suggestions) {
        await api.post("/portfolio/transactions/", {
          portfolio: portfolioId,
          symbol: stock.symbol,
          quantity: 1, // Default initial buy
          action: "BUY"
        });
      }

      navigate(`/portfolio/${portfolioId}`);
    } catch (err) {
      setError("Failed to create automated portfolio.");
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="automated-portfolio-container">
      <header className="page-header">
        <h1>Automated Portfolios</h1>
        <p className="subtitle">Let AI manage your wealth with data-driven diversification.</p>
      </header>

      {error && <div className="error-alert">{error}</div>}

      <section className="suggestion-section">
        <div className="card-panel p-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">AI Suggested Diversification</h2>
              <p className="text-gray-400">Based on recent KMeans clustering results from the Market.</p>
            </div>
            <button 
              className="btn-primary" 
              onClick={handleCreateAutomated} 
              disabled={creating || suggestions.length === 0}
            >
              {creating ? "Creating..." : "Launch Automated Portfolio"}
            </button>
          </div>

          <div className="mb-6">
            <label className="block text-gray-500 text-sm mb-2">Portfolio Name</label>
            <input 
              className="input-field"
              value={newPortfolioName}
              onChange={(e) => setNewPortfolioName(e.target.value)}
              placeholder="Enter portfolio name..."
            />
          </div>

          {loading ? (
            <div className="loading">Analyzing Market Clusters...</div>
          ) : (
            <div className="suggestions-grid">
              {suggestions.map(stock => (
                <div key={stock.id} className="suggestion-card">
                  <span className="symbol">{stock.symbol}</span>
                  <span className="name">{stock.name}</span>
                  <span className="badge">Diversifier</span>
                </div>
              ))}
              {suggestions.length === 0 && (
                <div className="empty-state">No suggestions yet. Run clustering on a portfolio first to calibrate the AI.</div>
              )}
            </div>
          )}
        </div>
      </section>

      <section className="how-it-works mt-12 grid grid-cols-1 md:grid-cols-2 gap-8 text-gray-400">
        <div className="card-panel p-6">
          <h3 className="text-white font-bold mb-3">AI Diversification</h3>
          <p>We pick the leaders from different performance clusters to ensure your portfolio isn't concentrated in one market sector.</p>
        </div>
        <div className="card-panel p-6">
          <h3 className="text-white font-bold mb-3">Auto-Rebalancing</h3>
          <p>Once active, the system checks hourly if your holdings have drifted from the ideal target and executes correction trades automatically.</p>
        </div>
      </section>
    </div>
  );
}
