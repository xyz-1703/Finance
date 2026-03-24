import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import api from "../api/client";

export default function DashboardPage() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
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
  );
}
