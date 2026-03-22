import { useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../api/client";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      const response = await api.post("/auth/token/", { email, password });
      localStorage.setItem("access_token", response.data.access);
      localStorage.setItem("refresh_token", response.data.refresh);
      navigate("/market");
    } catch (err) {
      setError(err.response?.data?.detail || "JWT login failed.");
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
          Backend security uses JWT, Telegram OTP, and MPIN verification. Sign in with your email and password to access the portfolio console.
        </p>
      </section>
      <section className="card form-card">
        <h2>JWT Login</h2>
        <form onSubmit={handleLogin}>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your account email"
            required
          />
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
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
