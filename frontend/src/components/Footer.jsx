import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="w-full bg-finance-bg pt-16 pb-8 px-6 md:px-12 border-t border-finance-border">
      <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row justify-between items-center z-10 relative">
        <Link to="/" className="flex items-center gap-2 mb-6 md:mb-0 group">
          <div className="w-6 h-6 rounded bg-gradient-to-br from-finance-gold to-yellow-200 flex items-center justify-center">
            <span className="text-finance-bg font-bold text-sm">Q</span>
          </div>
          <span className="text-lg font-bold tracking-tight text-white group-hover:text-finance-gold transition-colors">QuantVista</span>
        </Link>

        <nav className="flex gap-8 mb-6 md:mb-0 text-sm font-medium">
          <Link to="/market-home" className="text-finance-muted hover:text-white transition-colors">Markets</Link>
          <Link to="/dashboard" className="text-finance-muted hover:text-white transition-colors">Dashboard</Link>
          <Link to="/ml" className="text-finance-muted hover:text-white transition-colors">Analysis</Link>
        </nav>

        <div className="flex gap-6 text-xs text-finance-muted text-center md:text-right">
          <span>&copy; {new Date().getFullYear()} QuantVista</span>
          <a href="#" className="hover:text-white transition-colors">Privacy</a>
          <a href="#" className="hover:text-white transition-colors">Terms</a>
        </div>
      </div>
    </footer>
  );
}
