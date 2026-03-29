import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Trash2, Lock, Unlock, Eye, BarChart2, ShieldCheck, PieChart, ChevronRight, Edit3 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../api/client';
import { useAuth } from '../contexts/AuthContext';

const PortfolioPage = () => {
  const { user } = useAuth();
  const [portfolios, setPortfolios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showMpinModal, setShowMpinModal] = useState(false);
  const [mpinInput, setMpinInput] = useState('');
  const [unlockedMpin, setUnlockedMpin] = useState('');
  const [mpinError, setMpinError] = useState('');
  
  const [newPortName, setNewPortName] = useState('');
  const [newPortDesc, setNewPortDesc] = useState('');

  const [editingPortfolio, setEditingPortfolio] = useState(null);
  const [editPortName, setEditPortName] = useState('');
  const [editPortDesc, setEditPortDesc] = useState('');

  const fetchPortfolios = async () => {
    try {
      const res = await api.get('/portfolio/portfolios/');
      // DRF may return a paginated response { count, next, previous, results }
      const data = res.data?.results || res.data || [];
      setPortfolios(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to load portfolios:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPortfolios();
  }, []);

  const handleMpinSubmit = async (e) => {
    e.preventDefault();
    try {
      setMpinError('');
      await api.post('/auth/mpin/verify/', { mpin: mpinInput });
      setUnlockedMpin(mpinInput);
      setShowMpinModal(false);
      setMpinInput('');
    } catch (error) {
      setMpinError('Invalid MPIN. Please try again.');
    }
  };

  const createPortfolio = async (e) => {
    e.preventDefault();
    if (user.has_mpin && !unlockedMpin) {
      setShowMpinModal(true);
      return;
    }
    
    try {
      await api.post('/portfolio/portfolios/', {
        name: newPortName,
        description: newPortDesc,
        mpin: unlockedMpin
      });
      setNewPortName('');
      setNewPortDesc('');
      fetchPortfolios();
    } catch (error) {
      console.error("Creation failed", error);
    }
  };

  const deletePortfolio = async (id) => {
    if (user.has_mpin && !unlockedMpin) {
      setShowMpinModal(true);
      return;
    }
    
    try {
      await api.delete(`/portfolio/portfolios/${id}/`, { data: { mpin: unlockedMpin } });
      fetchPortfolios();
    } catch (error) {
      console.error("Deletion failed", error);
    }
  };

  const openEditModal = (port) => {
    if (user.has_mpin && !unlockedMpin) {
      setShowMpinModal(true);
      return;
    }
    setEditingPortfolio(port);
    setEditPortName(port.name);
    setEditPortDesc(port.description || '');
  };

  const updatePortfolio = async (e) => {
    e.preventDefault();
    if (!editingPortfolio) return;
    try {
      await api.patch(`/portfolio/portfolios/${editingPortfolio.id}/`, {
        name: editPortName,
        description: editPortDesc,
        mpin: unlockedMpin
      });
      setEditingPortfolio(null);
      fetchPortfolios();
    } catch (error) {
      console.error("Update failed", error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary-500"></div>
      </div>
    );
  }

  const isLocked = user.has_mpin && !unlockedMpin;

  return (
    <div className="px-4 py-8 max-w-7xl mx-auto space-y-10 pb-20 bg-main-bg text-main-text">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl font-bold text-main-text tracking-tight flex items-center gap-4">
            Investment <span className="text-accent-gold font-serif italic">Baskets</span>
            {user.has_mpin && (
              <span className={`px-3 py-1 text-[10px] uppercase tracking-widest rounded-full font-bold flex items-center gap-1.5 border ${isLocked ? 'bg-danger/5 text-danger border-danger/20' : 'bg-success/5 text-success border-success/20'}`}>
                {isLocked ? <><Lock className="w-3 h-3" /> Secure Lock</> : <><ShieldCheck className="w-3 h-3" /> Authenticated</>}
              </span>
            )}
          </h1>
          <p className="opacity-50 mt-2 font-medium">Manage and organize your long-term wealth portfolios</p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 relative items-start">
        <div className="lg:col-span-2 space-y-6 min-h-[400px]">
          <AnimatePresence mode="popLayout">
            {portfolios.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                className="glass-panel p-20 text-center flex flex-col items-center justify-center"
              >
                 <div className="w-20 h-20 rounded-3xl bg-white/5 flex items-center justify-center mb-6 border border-glass-border">
                   <PieChart className="w-10 h-10 opacity-20" />
                 </div>
                 <h3 className="text-xl font-bold text-main mb-2">No Baskets Found</h3>
                 <p className="opacity-50 max-w-xs mx-auto">Start your investment journey by creating your first portfolio basket today.</p>
              </motion.div>
            ) : (
              portfolios.map((port, idx) => (
                <motion.div 
                  key={port.id} 
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }}
                  className="glass-panel p-8 relative group overflow-hidden"
                >
                  <div className="flex justify-between items-start mb-8 relative z-10">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-2xl font-bold text-main group-hover:text-primary-500 transition-colors uppercase tracking-tight">{port.name}</h3>
                        {port.is_default && (
                          <span className="badge bg-accent-gold/10 text-accent-gold text-[8px]">TEMPLATE</span>
                        )}
                      </div>
                      <p className="text-sm opacity-50 mt-1 font-medium italic">{port.description || 'No description provided'}</p>
                    </div>
                    {!port.is_default && (
                      <div className="flex items-center gap-3">
                        <Link to={`/portfolios/${port.id}`} className="w-10 h-10 rounded-xl bg-white/5 border border-glass-border flex items-center justify-center text-primary-500 hover:bg-white/10 transition-all">
                          <Eye className="w-4 h-4" />
                        </Link>
                        <button onClick={() => openEditModal(port)} className="w-10 h-10 rounded-xl bg-accent-gold/5 border border-accent-gold/10 flex items-center justify-center text-accent-gold hover:bg-accent-gold/10 transition-all">
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button onClick={() => deletePortfolio(port.id)} className="w-10 h-10 rounded-xl bg-danger/5 border border-danger/10 flex items-center justify-center text-danger hover:bg-danger/10 transition-all">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                    {port.is_default && (
                      <Link to={`/portfolios/${port.id}`} className="w-10 h-10 rounded-xl bg-white/5 border border-glass-border flex items-center justify-center text-primary-500 hover:bg-white/10 transition-all">
                        <Eye className="w-4 h-4" />
                      </Link>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-0.5 bg-glass-border border border-glass-border rounded-2xl overflow-hidden relative z-10">
                    <div className="bg-main-bg/50 p-6">
                      <p className="text-[10px] font-bold opacity-50 uppercase tracking-widest mb-1 text-main-text">Total Value</p>
                      <p className="text-xl font-bold text-main-text">₹{port.total_value.toLocaleString('en-IN')}</p>
                    </div>
                    <div className="bg-main-bg/50 p-6">
                      <p className="text-[10px] font-bold opacity-50 uppercase tracking-widest mb-1 text-main-text">Assets</p>
                      <p className="text-xl font-bold text-main-text">{port.holdings.length}</p>
                    </div>
                    <div className="bg-main-bg/50 p-6">
                      <p className="text-[10px] font-bold opacity-50 uppercase tracking-widest mb-1 text-main-text">Net P&L</p>
                      <p className={`text-xl font-bold ${port.profit_loss >= 0 ? 'text-success' : 'text-danger'}`}>
                        {port.profit_loss >= 0 ? '+' : ''}₹{port.profit_loss.toLocaleString('en-IN')}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>

        <aside className="lg:sticky lg:top-24">
          <div className="glass-panel p-8 relative overflow-hidden">
            <h2 className="text-xl font-bold text-main-text mb-8 flex items-center gap-3">
              <Plus className="w-5 h-5 text-accent-gold" /> Create Basket
            </h2>
            <form onSubmit={createPortfolio} className="space-y-6 relative z-10">
              <div className="space-y-2">
                <label className="text-[10px] font-bold opacity-50 uppercase tracking-widest ml-1">Basket Name</label>
                <input 
                  type="text" required className="glass-input" placeholder="e.g. Retirement 2045"
                  value={newPortName} onChange={(e) => setNewPortName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold opacity-50 uppercase tracking-widest ml-1">Investment Goal</label>
                <textarea 
                  className="glass-input min-h-[120px] resize-none py-4" placeholder="Briefly describe your strategy..."
                  value={newPortDesc} onChange={(e) => setNewPortDesc(e.target.value)}
                />
              </div>
              <button type="submit" className="w-full btn-primary py-3.5 flex justify-center items-center gap-3 font-bold text-sm">
                Initialize Basket <ChevronRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        </aside>

        {isLocked && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="absolute inset-0 z-20 backdrop-blur-md bg-main-bg/40 rounded-3xl flex items-center justify-center border border-glass-border"
          >
            <div className="text-center p-10 max-w-sm">
              <div className="w-20 h-20 rounded-3xl bg-main-bg border border-glass-border flex items-center justify-center mx-auto mb-8 shadow-glass-strong">
                <Lock className="w-10 h-10 opacity-40" />
              </div>
              <h3 className="text-2xl font-bold text-main-text mb-3">Portfolio Encrypted</h3>
              <p className="opacity-50 text-sm leading-relaxed mb-10 text-main-text">Enter your secure MPIN to decrypt and access your investment portfolios.</p>
              <button onClick={() => setShowMpinModal(true)} className="btn-primary px-10">
                Enter MPIN
              </button>
            </div>
          </motion.div>
        )}
      </div>

      <AnimatePresence>
        {showMpinModal && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-main-bg/80 backdrop-blur-md"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="glass-panel w-full max-w-sm p-10 shadow-2xl"
            >
              <h3 className="text-3xl font-bold text-main-text text-center mb-2 tracking-tight">Security Check</h3>
              <p className="opacity-50 text-center text-sm mb-10 text-main-text">Enter your 4-6 digit MPIN to continue</p>
              
              {mpinError && <p className="text-danger text-xs font-bold text-center mb-6 uppercase tracking-wider">{mpinError}</p>}
              
              <form onSubmit={handleMpinSubmit}>
                <input 
                  type="password" maxLength="6" autoFocus
                  className="w-full bg-white/5 border border-glass-border rounded-2xl px-4 py-5 text-center text-4xl tracking-widest font-mono text-main-text focus:outline-none focus:border-primary-500/50 mb-10"
                  value={mpinInput} onChange={(e) => setMpinInput(e.target.value.replace(/\D/g, ''))}
                  placeholder="••••"
                />
                <div className="flex gap-4">
                  <button type="button" onClick={() => setShowMpinModal(false)} className="flex-1 py-3 text-sm font-bold opacity-50 hover:text-main transition-colors">Cancel</button>
                  <button type="submit" disabled={mpinInput.length < 4} className="flex-1 btn-primary disabled:opacity-30 disabled:cursor-not-allowed">Unlock</button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {editingPortfolio && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-main-bg/80 backdrop-blur-md"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="glass-panel w-full max-w-md p-8 shadow-2xl relative"
            >
              <h3 className="text-2xl font-bold text-main-text mb-6">Edit Basket</h3>
              <form onSubmit={updatePortfolio} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold opacity-50 uppercase tracking-widest ml-1">Basket Name</label>
                  <input 
                    type="text" required className="glass-input" 
                    value={editPortName} onChange={(e) => setEditPortName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold opacity-50 uppercase tracking-widest ml-1">Investment Goal (Description)</label>
                  <textarea 
                    className="glass-input min-h-[120px] resize-none py-4" 
                    value={editPortDesc} onChange={(e) => setEditPortDesc(e.target.value)}
                  />
                </div>
                <div className="flex gap-4 pt-2">
                  <button type="button" onClick={() => setEditingPortfolio(null)} className="flex-1 py-3.5 border border-glass-border rounded-xl text-sm font-bold opacity-60 hover:opacity-100 hover:bg-white/5 transition-all">Cancel</button>
                  <button type="submit" className="flex-1 btn-primary py-3.5 flex justify-center items-center gap-2 font-bold text-sm">
                    Save Changes <ChevronRight className="w-4 h-4" />
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

export default PortfolioPage;
