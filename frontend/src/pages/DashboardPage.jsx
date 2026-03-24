import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../api/client";

export default function DashboardPage() {
  const [portfolios, setPortfolios] = useState([]);
  const [newPortfolioName, setNewPortfolioName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchPortfolios();
  }, []);

  const fetchPortfolios = async () => {
    try {
      const res = await api.get("/portfolio/portfolios/");
      setPortfolios(res.data);
      setLoading(false);
    } catch (err) {
      setError("Failed to load portfolios.");
      setLoading(false);
    }
  };

  const handleCreatePortfolio = async (e) => {
    e.preventDefault();
    if (!newPortfolioName) return;
    try {
      await api.post("/portfolio/portfolios/", { name: newPortfolioName });
      setNewPortfolioName("");
      fetchPortfolios();
    } catch (err) {
      setError("Failed to create portfolio.");
    }
  };

  if (loading) return <div className="loading">Loading Dashbaord...</div>;

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>My Portfolios</h1>
        <p>Manage your stocks and crypto investments in one place.</p>
      </header>

      {error && <div className="error-alert">{error}</div>}

      <section className="portfolio-grid">
        {portfolios.map((portfolio) => (
          <Link to={`/portfolio/${portfolio.id}`} key={portfolio.id} className="portfolio-card">
            <h3>{portfolio.name}</h3>
            <div className="portfolio-stats">
              <div className="stat">
                <span className="label">Assets</span>
                <span className="value">{portfolio.holdings?.length || 0}</span>
              </div>
              <div className="stat">
                <span className="label">Total Value</span>
                <span className="value success">${Number(portfolio.total_value || 0).toLocaleString()}</span>
              </div>
            </div>
            <div className="card-footer">
              <span>View Details →</span>
            </div>
          </Link>
        ))}

        <div className="portfolio-card create-card">
          <h3>Create New Portfolio</h3>
          <form onSubmit={handleCreatePortfolio}>
            <input
              type="text"
              placeholder="Portfolio Name (e.g. Crypto)"
              value={newPortfolioName}
              onChange={(e) => setNewPortfolioName(e.target.value)}
              required
            />
            <button type="submit" className="btn-primary">Create</button>
          </form>
        </div>
      </section>
    </div>
  );
}
