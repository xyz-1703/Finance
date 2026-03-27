import React from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/client";
import { useTheme } from "../context/ThemeContext";
import ThemeToggle from "./ThemeToggle";

export default function TopBar({ isAuthenticated }) {
  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem("current_user") || "null");
  const userInitial = currentUser?.email ? currentUser.email[0].toUpperCase() : "U";

  const { theme } = useTheme();

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
    <header className="flex items-center justify-between py-5 px-8 border-b border-slate-200 dark:border-white/5 bg-white dark:bg-[#0B0E14] sticky top-0 z-40 transition-colors duration-300">
      <Link to="/" className="text-xl font-black tracking-tighter text-slate-800 dark:text-white hover:text-emerald-500 dark:hover:text-finance-primary transition-colors">QuantVista</Link>
      <nav className="flex items-center gap-2">
        <Link to="/dashboard" className="nav-link text-slate-500 dark:text-finance-muted hover:text-slate-800 dark:hover:text-white font-bold text-xs uppercase tracking-widest px-4 py-2 rounded-lg hover:bg-slate-50 dark:hover:bg-white/5 transition-all">Dashboard</Link>
        <Link to="/portfolio" className="nav-link text-slate-500 dark:text-finance-muted hover:text-slate-800 dark:hover:text-white font-bold text-xs uppercase tracking-widest px-4 py-2 rounded-lg hover:bg-slate-50 dark:hover:bg-white/5 transition-all">Portfolio</Link>
        <Link to="/trade" className="nav-link text-slate-500 dark:text-finance-muted hover:text-slate-800 dark:hover:text-white font-bold text-xs uppercase tracking-widest px-4 py-2 rounded-lg hover:bg-slate-50 dark:hover:bg-white/5 transition-all">Trade</Link>
        <Link to="/ml" className="nav-link text-slate-500 dark:text-finance-muted hover:text-slate-800 dark:hover:text-white font-bold text-xs uppercase tracking-widest px-4 py-2 rounded-lg hover:bg-slate-50 dark:hover:bg-white/5 transition-all">ML</Link>
        <Link to="/recommendations" className="nav-link text-emerald-500 dark:text-finance-primary hover:text-emerald-600 dark:hover:text-finance-primaryHover font-black text-xs uppercase tracking-widest px-4 py-2 rounded-lg bg-emerald-50 dark:bg-finance-primary/10 transition-all">Quality</Link>
        {isAuthenticated ? <Link to="/settings" className="nav-link text-slate-500 dark:text-finance-muted hover:text-slate-800 dark:hover:text-white font-bold text-xs uppercase tracking-widest px-4 py-2 rounded-lg hover:bg-slate-50 dark:hover:bg-white/5 transition-all">Settings</Link> : null}
        {!isAuthenticated ? <Link to="/login" className="nav-link text-slate-500 dark:text-finance-muted hover:text-slate-800 dark:hover:text-white font-bold text-xs uppercase tracking-widest px-4 py-2 rounded-lg hover:bg-slate-50 dark:hover:bg-white/5 transition-all">Login</Link> : null}
        {!isAuthenticated ? <Link to="/register" className="nav-link text-slate-500 dark:text-finance-muted hover:text-slate-800 dark:hover:text-white font-bold text-xs uppercase tracking-widest px-4 py-2 rounded-lg hover:bg-slate-50 dark:hover:bg-white/5 transition-all">Register</Link> : null}
      </nav>
      <div className="flex items-center gap-4">
        <ThemeToggle />
        {isAuthenticated ? (
          <div className="flex items-center gap-4">
            <button 
              className="w-10 h-10 rounded-full bg-emerald-50 dark:bg-finance-primary/20 text-emerald-500 dark:text-finance-primary font-bold flex items-center justify-center border border-emerald-500/30 dark:border-finance-primary/30 hover:bg-emerald-500 dark:hover:bg-finance-primary hover:text-white transition-all shadow-lg shadow-emerald-500/10 dark:shadow-finance-primary/10" 
              onClick={() => navigate("/settings")}
            >
              {userInitial}
            </button>
            <button className="px-5 py-2 rounded-xl bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-white font-bold text-xs uppercase tracking-widest hover:bg-slate-200 dark:hover:bg-white/10 border dark:border-white/10 transition-all" onClick={logout}>
              Logout
            </button>
          </div>
        ) : null}
      </div>
    </header>
  );
}
