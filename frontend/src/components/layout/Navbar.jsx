import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { LogOut, User as UserIcon, Settings, Menu, X, Sun, Moon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const auth = useAuth() || {};
  const { user, logout } = auth;
  
  const themeContext = useTheme() || {};
  const { theme = 'dark', toggleTheme = () => {} } = themeContext;
  
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    if (logout) logout();
    setIsOpen(false);
    navigate('/');
  };

  const navLinks = [
    { name: 'Markets', path: '/' },
    { name: 'Quality', path: '/quality' },
    { name: 'Portfolios', path: '/portfolios' },
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Analysis', path: '/analysis' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 bg-main-bg/80 backdrop-blur-xl border-b border-glass-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          
          {/* Logo */}
          <div className="flex items-center gap-2 cursor-pointer flex-1" onClick={() => navigate('/')}>
            <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-accent-purple rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">Q</span>
            </div>
            <span className="text-xl font-bold text-main-text tracking-tight">
              QuantVista
            </span>
          </div>

          {/* Desktop Menu - Centered */}
          <div className="hidden md:flex items-center gap-10">
            {navLinks.map((link) => (
              <Link 
                key={link.name}
                to={link.path} 
                className={`text-sm font-bold uppercase tracking-widest transition-all ${isActive(link.path) ? 'text-primary-500' : 'text-main-text/50 hover:text-main-text'}`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Right Actions */}
          <div className="hidden md:flex items-center justify-end gap-6 flex-1">
            <button 
              onClick={toggleTheme}
              className="p-2.5 rounded-xl bg-white/5 text-main-text border border-glass-border hover:bg-white/10 transition-colors"
              title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {user ? (
              <div className="relative group">
                <button className="flex items-center gap-2 text-main-text/70 hover:text-main-text transition-colors">
                  <div className="w-9 h-9 rounded-full bg-white/5 border border-glass-border flex items-center justify-center overflow-hidden">
                    <UserIcon className="w-5 h-5" />
                  </div>
                </button>
                <div className="absolute right-0 mt-2 w-64 glass-panel p-2 shadow-glass-strong opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top-right scale-95 group-hover:scale-100">
                  <div className="p-4 border-b border-glass-border">
                    <p className="text-sm font-bold text-main-text truncate uppercase tracking-tight">{user.first_name || user.username || 'Investor'}</p>
                    <p className="text-[10px] text-main-text/50 truncate mt-0.5">{user.email || 'N/A'}</p>
                  </div>
                  <div className="p-1">
                    <Link to="/profile" className="flex items-center gap-3 px-3 py-2.5 text-xs font-bold uppercase tracking-widest text-main-text/60 hover:text-main-text hover:bg-white/5 rounded-lg transition-colors">
                      <Settings className="w-4 h-4" /> Account Settings
                    </Link>
                    <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2.5 text-xs font-bold uppercase tracking-widest text-danger hover:bg-danger/10 rounded-lg transition-colors mt-1">
                      <LogOut className="w-4 h-4" /> Sign Out
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link to="/login" className="text-xs font-bold uppercase tracking-widest text-main-text/60 hover:text-main-text transition-colors">
                  Sign in
                </Link>
                <Link to="/register" className="btn-primary text-[10px] uppercase tracking-widest py-2 px-5">
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-3">
             <button 
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-white/5 text-main-text border border-glass-border"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            <button onClick={() => setIsOpen(!isOpen)} className="text-main-text/60 hover:text-main-text p-2">
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="md:hidden glass-panel rounded-none border-x-0 border-t border-glass-border overflow-hidden"
        >
          <div className="px-4 pt-2 pb-8 space-y-1">
            {navLinks.map((link) => (
              <Link 
                key={link.name}
                to={link.path} 
                onClick={() => setIsOpen(false)}
                className={`block px-4 py-4 text-sm font-bold uppercase tracking-widest rounded-xl hover:bg-white/5 ${isActive(link.path) ? 'text-primary-500 bg-white/5' : 'text-main-text/60'}`}
              >
                {link.name}
              </Link>
            ))}
            {!user ? (
              <div className="pt-6 flex flex-col gap-3">
                <Link to="/login" onClick={() => setIsOpen(false)} className="text-center py-4 text-sm font-bold uppercase tracking-widest text-main-text/60">Sign In</Link>
                <Link to="/register" onClick={() => setIsOpen(false)} className="btn-primary text-center py-4 uppercase tracking-widest text-sm">Get Started</Link>
              </div>
            ) : (
                <button onClick={handleLogout} className="w-full text-left px-4 py-4 text-sm font-bold uppercase tracking-widest text-danger hover:bg-danger/10 rounded-xl transition-colors">
                   Sign Out
                </button>
            )}
          </div>
        </motion.div>
      )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
