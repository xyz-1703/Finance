<<<<<<< HEAD
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../api/client";

export default function DashboardPage() {
  const [portfolios, setPortfolios] = useState([]);
  const [newPortfolioName, setNewPortfolioName] = useState("");
=======
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import api from "../api/client";

export default function DashboardPage() {
  const [profile, setProfile] = useState(null);
>>>>>>> f676874015cfdcfa865c247090c40e9cf22a2aba
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
<<<<<<< HEAD
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
=======
    const loadProfile = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await api.get("/auth/profile/");
        setProfile(response.data);
        localStorage.setItem("current_user", JSON.stringify(response.data));
      } catch (err) {
        setError(err.response?.data?.detail || "Unable to load profile.");
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  return (
    <main className="dashboard-grid dashboard-main">
      <section className="card">
        <h2>Account Snapshot</h2>
        {loading ? <p>Loading profile...</p> : null}
        {error ? <p className="error">{error}</p> : null}
        {!loading && !error && profile ? (
          <div className="stack">
            <p><strong>Email:</strong> {profile.email}</p>
            <p><strong>Telegram:</strong> {profile.telegram_connected ? `@${profile.telegram_username}` : "Not linked"}</p>
            <p><strong>MPIN:</strong> {profile.has_mpin ? "Configured" : "Not configured"}</p>
          </div>
        ) : null}
      </section>

      <section className="card">
        <h2>Workspace</h2>
        <div className="quick-grid">
          <Link className="quick-link" to="/portfolio">Portfolio</Link>
          <Link className="quick-link" to="/trade">Trade</Link>
          <Link className="quick-link" to="/settings">Settings</Link>
          <Link className="quick-link" to="/">Market Home</Link>
        </div>
      </section>

      <section className="card">
        <h2>Security Flow</h2>
        <div className="stack">
          <p>1. Authenticate using Google OAuth.</p>
          <p>2. Link Telegram in settings to enable OTP recovery.</p>
          <p>3. Configure MPIN for transaction approval.</p>
        </div>
      </section>
    </main>
>>>>>>> f676874015cfdcfa865c247090c40e9cf22a2aba
  );
}
