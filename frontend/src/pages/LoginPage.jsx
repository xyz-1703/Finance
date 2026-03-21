import { useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../api/client";

export default function LoginPage() {
  const [idToken, setIdToken] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      const response = await api.post("/auth/google/", { id_token: idToken });
      localStorage.setItem("access_token", response.data.access);
      localStorage.setItem("refresh_token", response.data.refresh);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.detail || "Google login failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="layout">
      <section className="card hero">
        <p className="kicker">Institutional-grade stack</p>
        <h1>Trade, cluster, and forecast from one command center.</h1>
        <p>
          Backend security uses JWT, Telegram OTP, and MPIN verification. Use a Google ID token to authenticate and access the portfolio console.
        </p>
      </section>
      <section className="card form-card">
        <h2>Google OAuth Login</h2>
        <form onSubmit={handleLogin}>
          <label htmlFor="id-token">Google ID Token</label>
          <textarea
            id="id-token"
            value={idToken}
            onChange={(e) => setIdToken(e.target.value)}
            rows={5}
            placeholder="Paste Google id_token from your OAuth client flow"
            required
          />
          {error ? <p className="error">{error}</p> : null}
          <button type="submit" disabled={loading}>
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>
      </section>
    </main>
  );
}
