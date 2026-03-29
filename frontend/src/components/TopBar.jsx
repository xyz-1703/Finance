import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import api from "../api/client";

export default function TopBar({ isAuthenticated }) {
  const navigate = useNavigate();
  const location = useLocation();
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

  const isNavActive = (path) => location.pathname.startsWith(path);

  return (
    <header className="flex items-center justify-between py-5 px-8 border-b border-finance-border bg-finance-bg sticky top-0 z-50 backdrop-blur-md bg-opacity-90">
      <Link to="/" className="flex items-center gap-2 group">
        <div className="w-8 h-8 rounded bg-gradient-to-br from-finance-gold to-yellow-200 flex items-center justify-center transform group-hover:scale-105 transition-transform shadow-[0_0_15px_rgba(212,168,67,0.4)]">
          <span className="text-finance-bg font-bold text-lg">Q</span>
        </div>
        <span className="text-xl font-bold tracking-tight text-white group-hover:text-finance-gold transition-colors">QuantVista</span>
      </Link>
      
      <nav className="hidden md:flex items-center gap-2">
        <Link to="/market-home" className={`nav-link ${isNavActive('/market') ? 'active' : ''}`}>Markets</Link>
        <Link to="/dashboard" className={`nav-link ${location.pathname === '/dashboard' ? 'active' : ''}`}>Dashboard</Link>
        <Link to="/ml" className={`nav-link ${location.pathname === '/ml' ? 'active' : ''}`}>Analysis</Link>
        {isAuthenticated && <Link to="/settings" className={`nav-link ${location.pathname === '/settings' ? 'active' : ''}`}>Settings</Link>}
      </nav>

      <div className="flex items-center gap-6">
        {/* Dark Mode Icon Stub (Visual Only currently) */}
        <button className="text-finance-muted hover:text-finance-gold transition-colors w-8 h-8 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        </button>

        {isAuthenticated ? (
          <div className="flex items-center gap-4">
            <button 
              className="w-9 h-9 rounded-full bg-finance-gold/10 text-finance-gold font-bold flex items-center justify-center border border-finance-gold/20 hover:bg-finance-gold hover:text-finance-bg transition-all shadow-[0_0_10px_rgba(212,168,67,0.2)]" 
              onClick={() => navigate("/settings")}
            >
              {userInitial}
            </button>
            <button className="text-sm font-bold text-finance-muted hover:text-white transition-colors uppercase tracking-wider" onClick={logout}>
              Sign Out
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <Link to="/login" className="text-sm font-bold text-finance-muted hover:text-white transition-colors">Sign in</Link>
            <Link to="/register" className="btn-primary py-2 text-sm shadow-[0_4px_14px_0_rgba(41,98,255,0.39)]">Get Started</Link>
          </div>
        )}
      </div>
    </header>
  );
}
