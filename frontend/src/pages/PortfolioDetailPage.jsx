import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ChevronRight, ArrowLeft, ArrowUpRight, ArrowDownRight, Briefcase, Clock, Activity, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../api/client';
import { useAuth } from '../contexts/AuthContext';

const PortfolioDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [portfolio, setPortfolio] = useState(null);
  const [loading, setLoading] = useState(true);
  const [recommendations, setRecommendations] = useState([]);
  const [recLoading, setRecLoading] = useState(false);
  const [recError, setRecError] = useState('');
  
  // Sell Modal State
  const [showSellModal, setShowSellModal] = useState(false);
  const [selectedHolding, setSelectedHolding] = useState(null);
  const [sellQuantity, setSellQuantity] = useState('');
  const [sellError, setSellError] = useState('');

  const fetchPortfolio = async () => {
    try {
      const res = await api.get(`/portfolio/portfolios/${id}/`);
      setPortfolio(res.data);
    } catch (error) {
      console.error("Failed to load portfolio details:", error);
      navigate('/portfolios');
    } finally {
      setLoading(false);
    }
  };

  const fetchRecommendations = async () => {
    setRecLoading(true);
    setRecError('');
    try {
      const res = await api.get(`/portfolio/portfolios/${id}/recommendations/`);
      setRecommendations(res.data || []);
    } catch (error) {
      setRecError(error?.response?.data?.detail || "Unable to load recommendations.");
    } finally {
      setRecLoading(false);
    }
  };

  useEffect(() => {
    fetchPortfolio();
  }, [id, navigate]);

  useEffect(() => {
    fetchRecommendations();
  }, [id]);

  const openSellModal = (holding) => {
    setSelectedHolding(holding);
    setSellQuantity(holding.quantity);
    setSellError('');
    setShowSellModal(true);
  };

  const handleSell = async (e) => {
    e.preventDefault();
    if (parseFloat(sellQuantity) > parseFloat(selectedHolding.quantity)) {
        setSellError("Cannot sell more than you hold.");
        return;
    }
    
    try {
        await api.post('/portfolio/transactions/', {
            portfolio: portfolio.id,
            symbol: selectedHolding.symbol,
            action: 'SELL',
            quantity: sellQuantity
        });
        setShowSellModal(false);
        fetchPortfolio(); // Refresh data
    } catch (err) {
        setSellError(err?.response?.data?.error || "Transaction failed");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary-500"></div>
      </div>
    );
  }

  if (!portfolio) return null;

  const handleAddRecommendation = async (stock) => {
    try {
      await api.post('/portfolio/transactions/', {
        portfolio: portfolio.id,
        symbol: stock.symbol,
        action: 'BUY',
        quantity: 1
      });
      fetchPortfolio();
      fetchRecommendations();
    } catch (err) {}
  };

  return (
    <div className="px-4 py-8 max-w-7xl mx-auto space-y-10 pb-20 bg-main-bg text-main-text">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-[10px] font-bold opacity-50 uppercase tracking-widest mb-4">
            <Link to="/portfolios" className="hover:text-main-text transition-colors flex items-center gap-1"><ArrowLeft className="w-3 h-3"/> Portfolios</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-main-text">{portfolio.name}</span>
        </div>

        {/* Header Summary */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 glass-panel p-8">
            <div className="flex items-center gap-6">
                <div className="w-16 h-16 rounded-3xl bg-primary-500/10 border border-primary-500/20 flex items-center justify-center text-primary-500">
                    <Briefcase className="w-8 h-8" />
                </div>
                <div>
                    <h1 className="text-3xl font-bold text-main-text tracking-tight">{portfolio.name}</h1>
                    <p className="opacity-50 mt-1 font-medium italic max-w-md">{portfolio.description || 'No description provided.'}</p>
                </div>
            </div>
            <div className="flex gap-10">
                <div>
                    <p className="text-[10px] font-bold opacity-50 uppercase tracking-widest mb-1">Total Value</p>
                    <p className="text-3xl font-bold text-main-text tracking-tighter">₹{parseFloat(portfolio.total_value).toLocaleString('en-IN', {maximumFractionDigits: 2})}</p>
                </div>
                <div>
                    <p className="text-[10px] font-bold opacity-50 uppercase tracking-widest mb-1">Total P&L</p>
                    <div className="flex items-center gap-2">
                        <p className={`text-3xl font-bold tracking-tighter ${portfolio.profit_loss >= 0 ? 'text-success' : 'text-danger'}`}>
                            {portfolio.profit_loss >= 0 ? '+' : ''}₹{parseFloat(portfolio.profit_loss).toLocaleString('en-IN', {maximumFractionDigits: 2})}
                        </p>
                    </div>
                </div>
            </div>
        </header>

        <div className="grid lg:grid-cols-3 gap-10">
            {/* Holdings List */}
            <div className="lg:col-span-2 space-y-6">
                <h3 className="text-xl font-bold flex items-center gap-2"><Activity className="w-5 h-5 text-accent-gold" /> Current Holdings</h3>
                
                {portfolio.holdings.length === 0 ? (
                    <div className="glass-panel p-16 text-center">
                        <p className="text-main-text opacity-50 mb-4">This portfolio is currently empty.</p>
                        <Link to="/" className="btn-primary inline-flex">Explore Market</Link>
                    </div>
                ) : (
                    <div className="glass-panel overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-white/5 border-b border-glass-border">
                                    <tr>
                                        <th className="p-4 text-[10px] font-bold opacity-50 uppercase tracking-widest">Asset</th>
                                        <th className="p-4 text-[10px] font-bold opacity-50 uppercase tracking-widest">Quantity</th>
                                        <th className="p-4 text-[10px] font-bold opacity-50 uppercase tracking-widest">Avg Price</th>
                                        <th className="p-4 text-[10px] font-bold opacity-50 uppercase tracking-widest">Current</th>
                                        <th className="p-4 text-[10px] font-bold opacity-50 uppercase tracking-widest">Total Value</th>
                                        <th className="p-4 text-[10px] font-bold opacity-50 uppercase tracking-widest">P&L</th>
                                        <th className="p-4 text-[10px] font-bold opacity-50 uppercase tracking-widest text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {portfolio.holdings.map((h, idx) => (
                                        <tr key={idx} className="border-b border-glass-border hover:bg-white/5 transition-colors">
                                            <td className="p-4">
                                                <Link to={`/stock/${h.symbol}`} className="font-bold text-main-text hover:text-primary-500 transition-colors">
                                                    {h.symbol}
                                                </Link>
                                                <p className="text-[10px] opacity-50 truncate max-w-[120px]">{h.name}</p>
                                            </td>
                                            <td className="p-4 font-bold">{parseFloat(h.quantity).toFixed(2)}</td>
                                            <td className="p-4 opacity-70">₹{parseFloat(h.average_buy_price).toLocaleString('en-IN', {maximumFractionDigits: 2})}</td>
                                            <td className="p-4 font-bold">₹{parseFloat(h.current_price).toLocaleString('en-IN', {maximumFractionDigits: 2})}</td>
                                            <td className="p-4 font-bold text-primary-500">₹{parseFloat(h.total_value).toLocaleString('en-IN', {maximumFractionDigits: 2})}</td>
                                            <td className={`p-4 font-bold ${h.profit_loss >= 0 ? 'text-success' : 'text-danger'}`}>
                                                {h.profit_loss >= 0 ? '+' : ''}₹{parseFloat(h.profit_loss).toLocaleString('en-IN', {maximumFractionDigits: 2})}
                                            </td>
                                            <td className="p-4 text-right">
                                                <button onClick={() => openSellModal(h)} className="px-4 py-1.5 rounded bg-danger/10 text-danger text-xs font-bold hover:bg-danger/20 transition-all">Sell</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>

            {/* Recent Transactions Sidebar */}
            <div className="space-y-6">
                <h3 className="text-xl font-bold flex items-center gap-2"><Clock className="w-5 h-5 text-accent-gold" /> Transactions</h3>
                <div className="glass-panel p-6 max-h-[600px] overflow-y-auto space-y-4">
                    {(!portfolio.transactions || portfolio.transactions.length === 0) ? (
                        <p className="text-sm opacity-50 text-center py-10">No recent transactions.</p>
                    ) : (
                        portfolio.transactions.map((t, idx) => (
                            <div key={idx} className="flex justify-between items-center p-3 rounded-xl bg-white/5 border border-glass-border">
                                <div>
                                    <p className="text-sm font-bold flex items-center gap-2">
                                        <span className={`px-1.5 py-0.5 rounded text-[10px] ${t.action === 'BUY' ? 'bg-success/20 text-success' : 'bg-danger/20 text-danger'}`}>{t.action}</span>
                                        {t.symbol_ticker}
                                    </p>
                                    <p className="text-[10px] opacity-50 mt-1">{new Date(t.time).toLocaleDateString()} at {new Date(t.time).toLocaleTimeString()}</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-sm">{parseFloat(t.quantity).toFixed(2)} units</p>
                                    <p className="text-[10px] opacity-50">@ ₹{parseFloat(t.price).toLocaleString('en-IN', {maximumFractionDigits:2})}</p>
                                </div>
                            </div>
                        ))
                    )}
                </div>
                <div className="glass-panel p-6 space-y-4">
                    <h3 className="text-lg font-bold flex items-center gap-2"><ArrowUpRight className="w-5 h-5 text-accent-gold" /> Recommendations</h3>
                    {recLoading ? (
                        <div className="text-sm opacity-50 text-center py-6">Loading recommendations...</div>
                    ) : recError ? (
                        <div className="text-sm text-danger text-center py-4">{recError}</div>
                    ) : recommendations.length === 0 ? (
                        <div className="text-sm opacity-50 text-center py-6">No recommendations available.</div>
                    ) : (
                        <div className="space-y-3">
                            {recommendations.map((r) => (
                                <div key={r.id} className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-glass-border">
                                    <div>
                                        <p className="text-sm font-bold">{r.symbol}</p>
                                        <p className="text-[10px] opacity-50">{r.name}</p>
                                    </div>
                                    <button onClick={() => handleAddRecommendation(r)} className="px-3 py-1.5 rounded bg-primary-500/10 text-primary-500 text-xs font-bold hover:bg-primary-500/20 transition-all">
                                        Add
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>

        {/* Sell Modal */}
        <AnimatePresence>
        {showSellModal && selectedHolding && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="glass-panel w-full max-w-sm p-8 shadow-2xl relative border-danger/20"
            >
              <div className="flex items-center gap-3 mb-6 text-danger">
                  <div className="p-2 bg-danger/10 rounded-xl"><AlertTriangle className="w-6 h-6" /></div>
                  <h3 className="text-xl font-bold">Sell {selectedHolding.symbol}</h3>
              </div>
              
              <div className="p-4 bg-white/5 rounded-xl border border-glass-border flex justify-between items-center mb-6">
                 <div>
                     <p className="text-[10px] font-bold opacity-50 uppercase tracking-widest">Available to Sell</p>
                     <p className="font-bold">{parseFloat(selectedHolding.quantity).toFixed(3)} units</p>
                 </div>
                 <div className="text-right">
                     <p className="text-[10px] font-bold opacity-50 uppercase tracking-widest">Current Price</p>
                     <p className="font-bold text-success">₹{parseFloat(selectedHolding.current_price).toLocaleString()}</p>
                 </div>
              </div>

              <form onSubmit={handleSell} className="space-y-6">
                <div>
                  <label className="text-[10px] font-bold opacity-50 uppercase tracking-widest ml-1 mb-2 block">Quantity to Sell</label>
                  <input 
                    type="number" required min="0.001" step="0.001" max={selectedHolding.quantity}
                    className="glass-input w-full p-3 font-mono text-xl" 
                    value={sellQuantity} onChange={(e) => setSellQuantity(e.target.value)}
                  />
                  {sellError && <p className="text-danger text-xs mt-2 font-bold">{sellError}</p>}
                </div>
                
                <div className="flex gap-4 pt-2">
                  <button type="button" onClick={() => setShowSellModal(false)} className="flex-1 py-3 border border-glass-border rounded-xl text-sm font-bold opacity-60 hover:opacity-100 hover:bg-white/5 transition-all">Cancel</button>
                  <button type="submit" className="flex-1 py-3 bg-danger text-white rounded-xl font-bold text-sm shadow-lg shadow-danger/20 hover:bg-red-600 transition-colors">
                    Execute Sell
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PortfolioDetailPage;
