import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  TrendingUp, TrendingDown, DollarSign, Wallet, 
  Target, Globe, Lock, Plus, Search, ChevronRight,
  Clock, Bell, LayoutGrid, List, Activity
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import api from '../api/client';

const StatCard = ({ title, value, change, icon: Icon, colorClass }) => (
  <div className="glass-panel p-6 group hover:bg-white/5 transition-all">
    <div className="flex items-start justify-between mb-4">
      <div className={`p-3 rounded-xl bg-white/5 group-hover:bg-white/10 transition-colors ${colorClass}`}>
        <Icon className="w-5 h-5" />
      </div>
      <div className={`px-2 py-1 rounded-full text-[10px] font-bold flex items-center gap-1 ${parseFloat(change) >= 0 ? 'bg-success/10 text-success' : 'bg-danger/10 text-danger'}`}>
        {parseFloat(change) >= 0 ? '+' : ''}{change}%
      </div>
    </div>
    <div className="space-y-1">
      <p className="text-2xl font-bold text-main-text tracking-tight">{value}</p>
      <p className="text-xs opacity-50 font-medium uppercase tracking-wider">{title}</p>
    </div>
  </div>
);

const PortfolioTile = ({ name, count, color }) => (
  <div className="glass-panel p-6 relative group overflow-hidden">
    <div className="flex justify-between items-start mb-12">
      <div className="flex items-center gap-2">
        <div className={`w-2 h-2 rounded-full ${color}`} />
        <h4 className="text-main-text font-bold">{name}</h4>
      </div>
      <span className="opacity-50 text-xs text-main-text">{count} stocks</span>
    </div>
    
    <div className="space-y-4">
      <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
        <div className={`h-full ${color} w-2/3 opacity-50`} />
      </div>
      <button className="flex items-center gap-2 text-primary-400 text-xs font-bold hover:text-primary-300 transition-colors">
        <Lock className="w-3 h-3" /> Unlock with MPIN
      </button>
    </div>

    {/* Decorative background shape */}
    <div className={`absolute -right-4 -bottom-4 w-24 h-24 ${color} opacity-[0.03] rounded-full blur-2xl group-hover:opacity-[0.06] transition-opacity`} />
  </div>
);

const DashboardPage = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [watchlistTab, setWatchlistTab] = useState('ALL');
  const [portfolios, setPortfolios] = useState([]);

  const fetchPortfolios = async () => {
    try {
      const res = await api.get('/portfolio/portfolios/');
      const data = res.data?.results || res.data || [];
      setPortfolios(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to load portfolios:", error);
    }
  };

  const watchlist = [
    { symbol: 'NVDA', name: 'NVIDIA Corp.', price: '$875.20', change: '+2.14%', market: 'US' },
    { symbol: 'RELIANCE', name: 'Reliance Industries', price: '₹2,847', change: '+1.23%', market: 'IN' },
    { symbol: 'AMD', name: 'Advanced Micro Devices', price: '$167.30', change: '+3.21%', market: 'US' },
    { symbol: 'BAJFINANCE', name: 'Bajaj Finance', price: '₹6,890', change: '+1.87%', market: 'IN' },
    { symbol: 'META', name: 'Meta Platforms', price: '$512.45', change: '+1.78%', market: 'US' },
    { symbol: 'TSLA', name: 'Tesla Inc.', price: '$178.20', change: '-2.34%', market: 'US' },
    { symbol: 'ASIANPAINT', name: 'Asian Paints', price: '₹2,934', change: '-1.12%', market: 'IN' },
  ];

  const heatMapStocks = [
    { s: 'NVDA', c: '+4.21%', g: 'bg-emerald-500/80' },
    { s: 'AMD', c: '+3.15%', g: 'bg-emerald-500/60' },
    { s: 'RELIANCE', c: '+2.34%', g: 'bg-emerald-500/40' },
    { s: 'SUNPH...', c: '+2.14%', g: 'bg-emerald-500/30' },
    { s: 'META', c: '+1.78%', g: 'bg-emerald-500/20' },
    { s: 'GOOGL', c: '+1.45%', g: 'bg-emerald-500/10' },
    { s: 'BAJFIN...', c: '+1.07%', g: 'bg-emerald-500/5' },
    { s: 'AAPL', c: '+0.87%', g: 'bg-emerald-500/5' },
    { s: 'HDFCB...', c: '+0.56%', g: 'bg-emerald-500/5' },
    { s: 'TATAST...', c: '+1.18%', g: 'bg-emerald-500/10' },
    { s: 'WMT', c: '+0.12%', g: 'bg-emerald-500/5' },
    { s: 'INFY', c: '+0.44%', g: 'bg-emerald-500/5' },
    { s: 'AXISBA...', c: '+0.11%', g: 'bg-emerald-500/5' },
    { s: 'HINDAL...', c: '+0.13%', g: 'bg-emerald-500/5' },
    { s: 'ICICIBA...', c: '-0.75%', g: 'bg-red-500/10' },
    { s: 'KOTAK...', c: '-0.34%', g: 'bg-red-500/5' },
    { s: 'MSFT', c: '-1.12%', g: 'bg-red-500/20' },
    { s: 'HCLTECH', c: '-0.17%', g: 'bg-red-500/5' },
    { s: 'KO', c: '-0.12%', g: 'bg-red-500/5' },
    { s: 'WIPRO', c: '-0.57%', g: 'bg-red-500/5' },
    { s: 'TCS', c: '-2.34%', g: 'bg-red-500/40' },
    { s: 'NESTLEI...', c: '-3.18%', g: 'bg-red-500/60' },
    { s: 'ASIANP...', c: '-1.12%', g: 'bg-red-500/20' },
    { s: 'ONGC', c: '-1.32%', g: 'bg-red-500/30' },
    { s: 'GAIL', c: '-0.81%', g: 'bg-red-500/10' },
    { s: 'DIS', c: '-1.48%', g: 'bg-red-500/30' },
    { s: 'INTC', c: '-1.23%', g: 'bg-red-500/20' },
    { s: 'TSLA', c: '-2.34%', g: 'bg-red-500/40' },
    { s: 'PTC', c: '-3.24%', g: 'bg-red-500/60' },
    { s: 'CRM', c: '-0.88%', g: 'bg-red-500/10' },
  ];

  useEffect(() => {
    fetchPortfolios();
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary-500"></div>
      </div>
    );
  }

  const totalValue = portfolios.reduce((sum, p) => sum + (p.total_value || 0), 0);
  const totalPnL = portfolios.reduce((sum, p) => sum + (p.profit_loss || 0), 0);
  const totalPnlPercent = totalValue > 0 ? (totalPnL / (totalValue - totalPnL)) * 100 : 0;
  const activeStocksCount = portfolios.reduce((sum, p) => sum + (p.holdings?.length || 0), 0);

  return (
    <div className="px-4 py-8 max-w-7xl mx-auto space-y-8 pb-20">
      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-bold text-main-text tracking-tight">
            Good afternoon, <span className="text-accent-gold font-serif italic">{user?.first_name || 'Arjun'}</span>
          </h1>
          <div className="flex items-center gap-4 mt-2">
            <p className="text-gray-500 text-sm font-medium">Thursday, 26 March 2026 · Markets open</p>
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1.5 text-[10px] font-bold text-success uppercase tracking-widest">
                <div className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" /> NSE Open
              </span>
              <span className="flex items-center gap-1.5 text-[10px] font-bold text-success uppercase tracking-widest">
                <div className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" /> NYSE Open
              </span>
            </div>
          </div>
        </div>
        <div className="flex gap-3">
          <button className="p-2.5 rounded-xl bg-white/5 border border-white/5 text-gray-400 hover:text-white transition-colors">
            <Bell className="w-5 h-5" />
          </button>
          <button className="btn-primary flex items-center gap-2">
            <Plus className="w-4 h-4" /> Add Asset
          </button>
        </div>
      </header>

      {/* KPI Row */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Portfolio Value" value={`₹${totalValue.toLocaleString('en-IN', {maximumFractionDigits: 2})}`} change={totalPnlPercent.toFixed(1)} icon={Wallet} colorClass="text-primary-400" />
        <StatCard title="Total P&L" value={`₹${totalPnL.toLocaleString('en-IN', {maximumFractionDigits: 2})}`} change={totalPnlPercent.toFixed(1)} icon={TrendingUp} colorClass={totalPnL >= 0 ? 'text-success' : 'text-danger'} />
        <StatCard title="Today's Gain" value="N/A" change="0.0" icon={DollarSign} colorClass="text-accent-gold" />
        <StatCard title="Active Stocks" value={activeStocksCount.toString()} change="0.0" icon={Target} colorClass="text-accent-purple" />
      </section>

      {/* Portfolio Breakdown Row */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {portfolios.length > 0 ? (
          portfolios.slice(0, 3).map((port, idx) => (
            <PortfolioTile 
              key={port.id} 
              name={port.name} 
              count={port.holdings?.length || 0} 
              color={idx === 0 ? "bg-primary-500" : idx === 1 ? "bg-accent-gold" : "bg-success"} 
            />
          ))
        ) : (
          <div className="md:col-span-3 text-center py-8 opacity-50 text-sm glass-panel font-bold">No portfolios created yet. Navigate to Portfolios to initialize your first basket.</div>
        )}
      </section>

      {/* Charts & Lists Row */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Risk Clustering */}
        <div className="lg:col-span-2 glass-panel p-8 relative min-h-[500px] flex flex-col">
          <div className="flex justify-between items-center mb-10">
            <div>
              <h3 className="text-xl font-bold text-main-text">Portfolio Clustering</h3>
              <p className="text-xs opacity-50 mt-1">3 clusters · Risk vs Return · 1 month</p>
            </div>
            <div className="flex gap-4">
              {['Low Risk', 'Medium Risk', 'High Risk'].map((r, i) => (
                <div key={r} className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${i === 0 ? 'bg-success' : i === 1 ? 'bg-accent-gold' : 'bg-danger'}`} />
                  <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{r}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex-grow relative flex items-center justify-center">
            {/* Mock Scatter plot background */}
            <div className="grid grid-cols-5 grid-rows-5 w-full h-full opacity-10 absolute inset-0">
              {Array(25).fill(0).map((_, i) => <div key={i} className="border-t border-l border-white/20" />)}
            </div>
            
            <div className="w-full h-full relative">
               {[
                  { x: '10%', y: '80%', c: 'bg-success' }, { x: '15%', y: '85%', c: 'bg-success' },
                  { x: '12%', y: '75%', c: 'bg-success' }, { x: '40%', y: '50%', c: 'bg-accent-gold' },
                  { x: '45%', y: '55%', c: 'bg-accent-gold' }, { x: '42%', y: '48%', c: 'bg-accent-gold' },
                  { x: '70%', y: '20%', c: 'bg-danger' }, { x: '75%', y: '25%', c: 'bg-danger' },
               ].map((dot, i) => (
                 <div key={i} style={{ left: dot.x, top: dot.y }} className={`absolute w-3 h-3 rounded-full ${dot.c} blur-[1px] opacity-60`} />
               ))}
            </div>

            {/* Locked Overlay */}
            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center backdrop-blur-[2px] bg-main-bg/20">
              <div className="p-4 rounded-2xl bg-main-bg border border-glass-border shadow-glass-strong mb-4">
                <Lock className="w-10 h-10 opacity-50" />
              </div>
              <h4 className="text-main-text font-bold text-xl">Portfolio Locked</h4>
              <p className="opacity-50 text-sm mt-1">Enter MPIN to view your cluster analysis</p>
            </div>
          </div>
        </div>

        {/* Watchlist */}
        <div className="glass-panel p-6 flex flex-col">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-xl font-bold text-main-text tracking-tight">Watchlist</h3>
            <div className="flex bg-white/5 rounded-lg p-1 border border-glass-border">
              {['ALL', 'IN', 'US'].map(tab => (
                <button 
                  key={tab}
                  onClick={() => setWatchlistTab(tab)}
                  className={`px-3 py-1 rounded-md text-[10px] font-bold transition-all ${watchlistTab === tab ? 'bg-primary-600 text-white shadow-lg' : 'text-gray-500 hover:text-white'}`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-6 flex-grow">
            {watchlist.map((stock, i) => (
              <div key={i} className="flex items-center justify-between group cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-xs font-bold text-gray-400 group-hover:bg-primary-500/10 group-hover:text-primary-500 transition-colors">
                    {stock.symbol.slice(0, 2)}
                  </div>
                  <div>
                    <h5 className="text-sm font-bold text-white group-hover:text-primary-400 transition-colors">{stock.symbol}</h5>
                    <p className="text-[10px] text-gray-500 font-medium">{stock.name}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-white">{stock.price}</p>
                  <p className={`text-[10px] font-bold ${stock.change.includes('+') ? 'text-success' : 'text-danger'}`}>{stock.change}</p>
                </div>
              </div>
            ))}
          </div>

          <button className="w-full mt-10 py-3 border border-dashed border-white/10 rounded-xl text-xs font-bold text-gray-500 hover:text-white hover:border-white/20 transition-all flex items-center justify-center gap-2">
            <Plus className="w-4 h-4" /> Add to Watchlist
          </button>
        </div>
      </section>

      {/* Heatmap & Activity */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Heatmap */}
        <div className="lg:col-span-2 glass-panel p-8">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-xl font-bold text-white">Market Heatmap</h3>
            <div className="flex items-center gap-3">
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => <div key={i} className={`w-3 h-2 rounded-sm ${i < 2 ? 'bg-danger opacity-60' : i === 2 ? 'bg-gray-600' : 'bg-success opacity-60'}`} />)}
              </div>
              <span className="text-[10px] text-gray-500 font-medium uppercase tracking-widest">-3% → +3%</span>
            </div>
          </div>

          <div className="grid grid-cols-5 md:grid-cols-10 gap-2">
            {heatMapStocks.map((stock, i) => (
              <div 
                key={i} 
                className={`aspect-square rounded flex flex-col items-center justify-center p-1 transition-transform hover:scale-105 cursor-pointer ${stock.g}`}
              >
                <span className="text-[8px] font-bold text-white/90 truncate w-full text-center leading-none">{stock.s}</span>
                <span className="text-[6px] text-white/60 font-medium mt-1 uppercase">{stock.c}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="glass-panel p-6">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-xl font-bold text-white tracking-tight">Recent Activity</h3>
            <Link to="/activity" className="text-[10px] font-bold text-primary-500 uppercase tracking-widest hover:underline">View all</Link>
          </div>
          
          <div className="space-y-8 relative before:absolute before:left-[19px] before:top-2 before:bottom-2 before:w-[1px] before:bg-white/5">
            {[
              { type: 'buy', label: 'NVDA', sub: 'Buy 5 shares @ $882.40', time: '2h ago', color: 'text-success bg-success/10' },
              { type: 'alert', label: 'RELIANCE', sub: 'RSI crossed 70 — overbought signal', time: '4h ago', color: 'text-accent-gold bg-accent-gold/10' },
              { type: 'sell', label: 'WIPRO', sub: 'Sell 50 shares @ ₹481', time: '1d ago', color: 'text-danger bg-danger/10' },
              { type: 'signal', label: 'AAPL', sub: 'LSTM forecast updated: $198 (+4.5%)', time: '1d ago', color: 'text-primary-500 bg-primary-500/10' },
              { type: 'buy', label: 'BAJFINANCE', sub: 'Buy 10 shares @ ₹6,750', time: '2d ago', color: 'text-success bg-success/10' },
            ].map((item, i) => (
              <div key={i} className="relative flex items-start gap-4 pl-1">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center relative z-10 ${item.color} border border-white/5`}>
                  {item.type === 'buy' ? <TrendingUp className="w-4 h-4" /> : item.type === 'sell' ? <TrendingDown className="w-4 h-4" /> : item.type === 'alert' ? <Bell className="w-4 h-4" /> : <Activity className="w-4 h-4" />}
                </div>
                <div className="flex-grow">
                  <div className="flex justify-between items-start">
                    <h5 className="text-sm font-bold text-white flex items-center gap-1.5">
                      {item.label} 
                      <span className="bg-white/5 text-[8px] px-1 py-0.5 rounded text-gray-500">US</span>
                    </h5>
                    <span className="text-[10px] text-gray-500 font-medium">{item.time}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">{item.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default DashboardPage;
