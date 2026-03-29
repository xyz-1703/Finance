import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Search, Filter, TrendingUp, TrendingDown, ArrowRight, 
  BarChart3, Shield, Zap, Globe, Cpu, Clock, 
  ExternalLink
} from 'lucide-react';
import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import api from '../api/client';

const HomePage = () => {
  const navigate = useNavigate();
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('All');
  const [mlModel, setMlModel] = useState('LSTM');

  const tabs = ['All', 'India', 'US', 'Crypto', 'AI', 'Bank', 'EV', 'Tech', 'SaaS', 'Food', 'Semi', 'Solar', 'Power'];

  useEffect(() => {
    const fetchStocks = async () => {
      try {
        const res = await api.get('/stocks/stocks/');
        const results = res.data.results || res.data;
        setStocks(results);
      } catch (err) {
        console.error("Failed to fetch stocks:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStocks();
  }, []);

  const filteredStocks = stocks.filter(s => {
    const matchesSearch = s.symbol.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          s.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    let matchesTab = true;
    if (activeTab === 'India') {
      matchesTab = s.market?.includes('NSE') || s.market?.includes('BSE');
    } else if (activeTab === 'US') {
      matchesTab = s.market?.includes('NASDAQ') || s.market?.includes('NYSE');
    } else if (activeTab === 'Crypto') {
      matchesTab = s.market?.includes('CRYPTO');
    } else if (activeTab !== 'All') {
      // Basic sector/name filtering for other tabs
      matchesTab = s.sector?.toLowerCase().includes(activeTab.toLowerCase()) || 
                   s.name?.toLowerCase().includes(activeTab.toLowerCase());
    }
    
    return matchesSearch && matchesTab;
  });

  const chartDataLSTM = [
    { name: '10:00', value: 3400 },
    { name: '11:00', value: 3600 },
    { name: '12:00', value: 3200 },
    { name: '13:00', value: 3800 },
    { name: '14:00', value: 4100 },
    { name: '15:00', value: 4300 },
    { name: '16:00', value: 4500 },
  ];

  const chartDataXGB = [
    { name: '10:00', value: 3300 },
    { name: '11:00', value: 3450 },
    { name: '12:00', value: 3400 },
    { name: '13:00', value: 3700 },
    { name: '14:00', value: 3950 },
    { name: '15:00', value: 4400 },
    { name: '16:00', value: 4650 },
  ];

  const activeChartData = mlModel === 'LSTM' ? chartDataLSTM : chartDataXGB;

  return (
    <div className="flex flex-col bg-main-bg text-main-text">
      {/* Stocks List Section */}
      <section className="bg-main-bg/50 py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-6">
            <div>
              <h2 className="text-4xl font-bold text-main-text mb-2">
                400 stocks, <span className="font-serif italic text-accent-gold">two markets</span>
              </h2>
            </div>
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input 
                type="text" 
                placeholder="Search ticker, name..."
                className="glass-input"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-2 overflow-x-auto pb-4 mb-8 no-scrollbar scroll-smooth">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-2 rounded-lg text-sm font-semibold transition-all whitespace-nowrap ${
                  activeTab === tab 
                    ? 'bg-primary-600 text-white shadow-lg shadow-primary-600/20' 
                    : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="glass-panel overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/5 text-[10px] uppercase tracking-widest text-gray-500">
                  <th className="px-8 py-6">Ticker</th>
                  <th className="px-8 py-6">Name</th>
                  <th className="px-8 py-6">Market</th>
                  <th className="px-8 py-6">Price</th>
                  <th className="px-8 py-6">24H Change</th>
                  <th className="px-8 py-6">Volume</th>
                  <th className="px-8 py-6 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {loading ? (
                  Array(5).fill(0).map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td colSpan={7} className="px-8 py-6 h-20 bg-white/5" />
                    </tr>
                  ))
                ) : filteredStocks.slice(0, 10).map((stock) => (
                  <tr key={stock.id} className="hover:bg-white/5 transition-colors group cursor-pointer" onClick={() => navigate(`/stock/${stock.symbol}`)}>
                    <td className="px-8 py-6 font-bold text-white text-lg">{stock.symbol}</td>
                    <td className="px-8 py-6 text-gray-400">{stock.name}</td>
                    <td className="px-8 py-6">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        stock.market.includes('NSE') ? 'bg-orange-500/10 text-orange-500 border border-orange-500/20' : 
                        stock.market.includes('CRYPTO') ? 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20' : 
                        'bg-blue-500/10 text-blue-500 border border-blue-500/20'
                      }`}>
                        {stock.market}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-white font-semibold">₹{stock.latest_price ? parseFloat(stock.latest_price).toLocaleString() : 'N/A'}</td>
                    <td className="px-8 py-6">
                      <span className={`flex items-center gap-1 font-bold ${parseFloat(stock.discount || 0) >= 0 ? 'text-success' : 'text-danger'}`}>
                        {parseFloat(stock.discount || 0) >= 0 ? '+' : ''}{stock.discount || 0}%
                      </span>
                    </td>
                    <td className="px-8 py-6 text-gray-500">12.4M</td>
                    <td className="px-8 py-6 text-right">
                      <Link to={`/stock/${stock.symbol}`} className="text-primary-500 font-bold hover:underline">View Detail</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ML Predict Section */}
      <section className="py-24 px-4 bg-main-bg">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-main-text mb-12">
            ML models that <span className="text-accent-gold italic font-serif">predict the move</span>
          </h2>
          <div className="grid md:grid-cols-3 gap-12 items-center">
            <div className="md:col-span-2 glass-panel p-8 h-[400px]">
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h3 className="text-xl font-bold text-white">{mlModel} Architecture</h3>
                  <p className="text-gray-500 text-sm italic">Confidence level: {mlModel === 'LSTM' ? '84%' : '81%'}</p>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => setMlModel('LSTM')}
                    className={`px-3 py-1 rounded text-xs font-bold transition-colors ${mlModel === 'LSTM' ? 'bg-primary-600 text-white' : 'bg-white/5 text-gray-500 hover:bg-white/10'}`}>
                    LSTM
                  </button>
                  <button 
                    onClick={() => setMlModel('XGBoost')}
                    className={`px-3 py-1 rounded text-xs font-bold transition-colors ${mlModel === 'XGBoost' ? 'bg-primary-600 text-white' : 'bg-white/5 text-gray-500 hover:bg-white/10'}`}>
                    XGBoost
                  </button>
                </div>
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={activeChartData}>
                    <defs>
                      <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <Area type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
                    <XAxis dataKey="name" hide />
                    <YAxis hide domain={['dataMin - 500', 'dataMax + 500']} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#13131a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                      itemStyle={{ color: '#fff' }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="space-y-8">
              <div className="glass-card p-6">
                <h4 className="text-white font-bold mb-2">{mlModel}</h4>
                <p className="text-gray-500 text-sm">
                  {mlModel === 'LSTM' 
                    ? 'Sequence models optimized for AAPL and NSE Bluechip temporal patterns.' 
                    : 'Tree-based ensemble evaluating 150+ intraday volatility features.'}
                </p>
              </div>
              <div className="flex justify-center flex-col items-center">
                <div className="w-24 h-24 rounded-full border-4 border-primary-500 flex items-center justify-center mb-4">
                  <span className="text-2xl font-bold text-white">{mlModel === 'LSTM' ? '84.2%' : '81.7%'}</span>
                </div>
                <p className="text-white font-bold">Model Accuracy</p>
              </div>
              <button className="w-full btn-primary">Start Deep Sentiment Analysis</button>
            </div>
          </div>
        </div>
      </section>

      {/* Risk Clusters Section */}
      <section className="py-24 px-4 bg-main-bg/50">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-20 items-center">
            <div>
              <h2 className="text-4xl font-bold text-main-text mb-6">
                K-Means clusters <br />
                <span className="text-accent-gold italic font-serif">your risk</span>
              </h2>
              <p className="text-gray-400 mb-8">
                Get distance to center points across your portfolio assets. Know exactly where your risk concentrations lay at a glance.
              </p>
              <div className="space-y-4">
                {['Low Risk', 'Medium Risk', 'High Risk'].map((risk, i) => (
                  <div key={risk} className="glass-panel p-4 flex justify-between items-center group cursor-pointer hover:bg-white/5">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${i === 0 ? 'bg-success' : i === 1 ? 'bg-accent-gold' : 'bg-danger'}`} />
                      <span className="text-white font-semibold">{risk}</span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-gray-500 group-hover:text-white transition-colors" />
                  </div>
                ))}
              </div>
            </div>
            <div className="glass-panel p-8 aspect-square relative flex items-center justify-center">
              {/* Mock Scatter Plot */}
              <div className="grid grid-cols-4 grid-rows-4 w-full h-full opacity-30">
                {Array(16).fill(0).map((_, i) => (
                  <div key={i} className="border-t border-l border-white/5" />
                ))}
              </div>
              <motion.div 
                className="absolute inset-0 p-12 overflow-hidden"
              >
                {[
                  { x: '20%', y: '70%', c: 'bg-success' },
                  { x: '24%', y: '68%', c: 'bg-success' },
                  { x: '18%', y: '74%', c: 'bg-success' },
                  { x: '40%', y: '50%', c: 'bg-accent-gold' },
                  { x: '45%', y: '48%', c: 'bg-accent-gold' },
                  { x: '38%', y: '55%', c: 'bg-accent-gold' },
                  { x: '70%', y: '20%', c: 'bg-danger' },
                  { x: '75%', y: '25%', c: 'bg-danger' },
                ].map((dot, i) => (
                  <motion.div 
                    key={i}
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    transition={{ delay: i * 0.05 }}
                    style={{ left: dot.x, top: dot.y }}
                    className={`absolute w-4 h-4 rounded-full ${dot.c} blur-[2px]`}
                  />
                ))}
              </motion.div>
              <div className="absolute flex flex-col items-center">
                <Shield className="w-12 h-12 text-primary-500 mb-4 opacity-50" />
                <p className="text-gray-500 font-semibold tracking-widest text-xs uppercase">Portfolio Risk Grid</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 px-4 bg-main-bg">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-muted-text uppercase tracking-[0.2em] text-xs font-bold mb-4">A Growth Platform</h2>
            <h3 className="text-4xl font-bold text-main-text">Built for the <span className="text-accent-gold font-serif italic">serious investor</span></h3>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: 'AI Driven', icon: <Cpu />, desc: 'Real-time stock news sentiment and prediction models.' },
              { title: 'API Integration', icon: <Globe />, desc: 'Connect with any broker and pull real-time portfolio data.' },
              { title: 'Technical Signals', icon: <BarChart3 />, desc: 'Advanced indicators like RSI, MACD, and Bollinger Bands.' },
              { title: 'Risk Control', icon: <Shield />, desc: 'K-Means clustering and sector concentration alerts.' },
              { title: 'High Speed', icon: <Zap />, desc: 'Ultra low latency data streaming from global markets.' },
              { title: 'Smart Reports', icon: <Clock />, desc: 'Automated daily research briefs tailored to you.' },
            ].map((feature, i) => (
              <div key={i} className="glass-card p-10 hover:border-white/10 group">
                <div className="w-12 h-12 rounded-xl bg-primary-500/10 text-primary-500 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  {React.cloneElement(feature.icon, { className: 'w-6 h-6' })}
                </div>
                <h4 className="text-xl font-bold text-white mb-2">{feature.title}</h4>
                <p className="text-gray-500 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="relative rounded-3xl overflow-hidden p-16 text-center">
            <div className="absolute inset-0 bg-gradient-to-br from-[#1d4ed8] to-[#1e1b4b]" />
            <div className="relative z-10">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Start your edge today</h2>
              <p className="text-blue-100/70 text-lg mb-10 max-w-2xl mx-auto">
                Join thousands of institutional-grade traders using QuantVista for clinical precision in Indian and US markets.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link to="/register" className="btn-gold">Open Free Account</Link>
                <button className="btn-outline border-white/20 hover:bg-white/10">Explore Demo</button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
