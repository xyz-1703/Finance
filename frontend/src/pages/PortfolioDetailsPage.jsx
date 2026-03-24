import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/client";

export default function PortfolioDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [portfolio, setPortfolio] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [addPayload, setAddPayload] = useState({ symbol: "", quantity: "" });
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
      setError("Failed to load portfolio details.");
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
      const res = await api.post("/ml/cluster/run/", {
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

  const handleAddStock = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      await api.post("/portfolio/transactions/", {
        portfolio: Number(id),
        symbol: addPayload.symbol.toUpperCase(),
        quantity: Number(addPayload.quantity),
        action: "BUY",
      });
      setAddPayload({ symbol: "", quantity: "" });
      fetchPortfolio();
    } catch (err) {
      setError(err.response?.data?.error || "Failed to add stock. Check symbol.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="loading">Loading Portfolio...</div>;
  if (!portfolio) return <div className="error">Portfolio not found.</div>;

  return (
    <div className="portfolio-details-container">
      <header className="details-header">
        <button className="btn-back" onClick={() => navigate("/dashboard")}>← Back to Dashboard</button>
        <h1>{portfolio.name}</h1>
        <div className="header-stats">
          <div className="stat">
            <span className="label">Total Value</span>
            <span className="value highlight">${Number(portfolio.total_value || 0).toLocaleString()}</span>
          </div>
          <div className="stat">
            <span className="label">Holdings</span>
            <span className="value">{portfolio.holdings?.length || 0}</span>
          </div>
        </div>
      </header>

      {error && <div className="error-alert">{error}</div>}

      <section className="holdings-section">
        <div className="section-header">
          <div className="title-group">
            <h2>Assets</h2>
            <button 
              className="btn-analyze" 
              onClick={handleRunClustering} 
              disabled={isClustering || portfolio.holdings.length < 2}
            >
              {isClustering ? "Analyzing..." : "Analyze Portfolio Clustering"}
            </button>
          </div>
          <form className="add-stock-form" onSubmit={handleAddStock}>
            <input
              placeholder="Symbol (BTCUSDT, AAPL)"
              value={addPayload.symbol}
              onChange={(e) => setAddPayload({ ...addPayload, symbol: e.target.value })}
              required
            />
            <input
              type="number"
              step="any"
              placeholder="Quantity"
              value={addPayload.quantity}
              onChange={(e) => setAddPayload({ ...addPayload, quantity: e.target.value })}
              required
            />
            <button type="submit" disabled={submitting}>
              {submitting ? "Adding..." : "Add Asset"}
            </button>
          </form>
        </div>

        <table className="holdings-table">
          <thead>
            <tr>
              <th>Symbol</th>
              <th>Quantity</th>
              <th>Price</th>
              <th>Total Value</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {portfolio.holdings.map((holding) => (
              <tr key={holding.id}>
                <td className="symbol">{holding.symbol}</td>
                <td>{Number(holding.quantity).toLocaleString()}</td>
                <td>${Number(holding.current_price || 0).toLocaleString()}</td>
                <td>${Number(holding.total_value || 0).toLocaleString()}</td>
                <td>
                  <button className="btn-delete" onClick={async () => {
                    if (window.confirm("Delete this holding?")) {
                      await api.delete(`/portfolio/holdings/${holding.id}/`);
                      fetchPortfolio();
                    }
                  }}>Delete</button>
                </td>
              </tr>
            ))}
            {portfolio.holdings.length === 0 && (
              <tr>
                <td colSpan="5" className="empty-state">No assets added yet. Add your first stock or crypto above!</td>
              </tr>
            )}
          </tbody>
        </table>
      </section>

      {clusters.length > 0 && (
        <section className="clustering-results-section">
          <h2>Clustering Insights</h2>
          <p className="insight-desc">Stocks grouped by similar fundamental profiles (PE, ROI, Market Cap):</p>
          <div className="clusters-grid">
            {[...new Set(clusters.map(c => c.cluster_label))].map(label => (
              <div key={label} className="cluster-group">
                <h3>Cluster {label}</h3>
                <div className="cluster-badges">
                  {clusters.filter(c => c.cluster_label === label).map(c => {
                    const stockDetails = portfolio.holdings.find(h => h.symbol === c.stock_symbol) || { symbol: `ID: ${c.stock}` };
                    return (
                      <span key={c.id} className="stock-badge">
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
  );
}
