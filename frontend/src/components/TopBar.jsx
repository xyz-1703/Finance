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
    <header className="flex items-center justify-between py-5 px-8 border-b border-slate-200 bg-white sticky top-0 z-40">
      <Link to="/" className="text-xl font-black tracking-tighter text-slate-800 hover:text-emerald-500 transition-colors">QuantVista</Link>
      <nav className="flex items-center gap-2">
        <Link to="/dashboard" className="nav-link">Dashboard</Link>
        <Link to="/portfolio" className="text-slate-500 hover:text-slate-800 font-bold text-xs uppercase tracking-widest px-4 py-2 rounded-lg hover:bg-slate-50 transition-all">Portfolio</Link>
        <Link to="/trade" className="text-slate-500 hover:text-slate-800 font-bold text-xs uppercase tracking-widest px-4 py-2 rounded-lg hover:bg-slate-50 transition-all">Trade</Link>
        <Link to="/ml" className="text-emerald-500 hover:text-emerald-600 font-black text-xs uppercase tracking-widest px-4 py-2 rounded-lg bg-emerald-50 transition-all">ML</Link>
        {isAuthenticated ? <Link to="/settings" className="text-slate-500 hover:text-slate-800 font-bold text-xs uppercase tracking-widest px-4 py-2 rounded-lg hover:bg-slate-50 transition-all">Settings</Link> : null}
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
          <button className="px-5 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs uppercase tracking-widest hover:bg-slate-200 transition-all" onClick={logout}>
            Logout
          </button>
        </div>
      ) : null}
    </header>
  );
}
