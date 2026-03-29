import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-main-bg/50 border-t border-glass-border pt-16 pb-8 text-main-text backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-12">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-[#3b82f6] to-[#8b5cf6] rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">Q</span>
            </div>
            <span className="text-xl font-bold text-main-text tracking-tight">
              QuantVista
            </span>
          </div>

          <div className="flex flex-wrap gap-8">
            <Link to="/" className="opacity-50 hover:text-primary-500 hover:opacity-100 transition-colors text-sm font-bold uppercase tracking-widest">Markets</Link>
            <Link to="/dashboard" className="opacity-50 hover:text-primary-500 hover:opacity-100 transition-colors text-sm font-bold uppercase tracking-widest">Dashboard</Link>
            <Link to="/analysis" className="opacity-50 hover:text-primary-500 hover:opacity-100 transition-colors text-sm font-bold uppercase tracking-widest">Analysis</Link>
            <Link to="/privacy" className="opacity-50 hover:text-primary-500 hover:opacity-100 transition-colors text-sm font-bold uppercase tracking-widest">Privacy</Link>
            <Link to="/terms" className="opacity-50 hover:text-primary-500 hover:opacity-100 transition-colors text-sm font-bold uppercase tracking-widest">Terms</Link>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-glass-border gap-4">
          <p className="opacity-50 text-sm italic font-medium">
            Built for the <span className="text-accent-gold font-bold">serious investor</span>
          </p>
          <p className="opacity-50 text-sm font-medium">
            © {new Date().getFullYear()} QuantVista. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
