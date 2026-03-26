import React from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/client";

export default function TopBar({ isAuthenticated }) {
  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem("current_user") || "null");
  const userInitial = currentUser?.email ? currentUser.email[0].toUpperCase() : "U";

  const logout = async () => {
    const refresh = localStorage.getItem("refresh_token");
    if (refresh) {
      try {
        await api.post("/auth/logout/", { refresh });
      } catch {
        // Ignore logout errors; client cleanup still applies.
      }
    }
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("current_user");
    window.dispatchEvent(new Event("auth-changed"));

    navigate("/");
  };

  return (
    <header className="topbar px-6">
      <Link to="/" className="brand-logo">QuantVista</Link>
      <nav className="flex items-center gap-2">
        <Link to="/" className="nav-link">Home</Link>
        {isAuthenticated ? <Link to="/dashboard" className="nav-link">Dashboard</Link> : null}
        {isAuthenticated ? <Link to="/portfolio" className="nav-link">Portfolio</Link> : null}
        {isAuthenticated ? <Link to="/trade" className="nav-link">Trade</Link> : null}
        {isAuthenticated ? <Link to="/ml" className="nav-link text-finance-primary/80">ML</Link> : null}
        {isAuthenticated ? <Link to="/settings" className="nav-link">Settings</Link> : null}
        {!isAuthenticated ? <Link to="/login" className="nav-link">Login</Link> : null}
        {!isAuthenticated ? <Link to="/register" className="nav-link">Register</Link> : null}
      </nav>
      {isAuthenticated ? (
        <div className="flex items-center gap-4">
          <button 
            className="w-10 h-10 rounded-full bg-finance-primary/20 text-finance-primary font-bold flex items-center justify-center border border-finance-primary/30 hover:bg-finance-primary hover:text-white transition-all shadow-lg shadow-finance-primary/10" 
            onClick={() => navigate("/settings")}
          >
            {userInitial}
          </button>
          <button className="btn-secondary py-2" onClick={logout}>
            Logout
          </button>
        </div>
      ) : null}
    </header>
  );
}
