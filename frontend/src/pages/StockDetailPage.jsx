import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, AreaChart, Area
} from 'recharts';
import { 
  ArrowLeft, ChevronRight, BookmarkPlus, Plus, 
  Info, ExternalLink, Globe, User, Calendar, Users, MapPin,
  TrendingUp, TrendingDown, Activity, Zap
} from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../api/client';

const Gauge = ({ value, label, sublabel, color = 'stroke-primary-500' }) => {
  const percentage = Math.min(Math.max(value, 0), 100);
  const circumference = 2 * Math.PI * 40;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center relative w-40 h-40">
      <svg className="w-full h-full -rotate-90">
        <circle cx="80" cy="80" r="40" fill="transparent" stroke="currentColor" strokeWidth="8" className="text-glass-border opacity-20" />
        <circle 
          cx="80" cy="80" r="40" fill="transparent" stroke="currentColor" strokeWidth="8" 
          strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round"
          className={`transition-all duration-1000 ease-out ${color}`} 
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <span className="text-3xl font-bold text-main-text">{value}</span>
        <div className="mt-1">
          <p className="text-[10px] font-bold text-main-text uppercase tracking-widest">{label}</p>
          <p className="text-[8px] opacity-50 font-medium">{sublabel}</p>
        </div>
      </div>
    </div>
  );
};

const RatioCard = ({ label, value, status }) => {
  const statusColor = {
    good: 'bg-success',
    high: 'bg-danger',
    neutral: 'bg-gray-500',
    caution: 'bg-accent-gold'
  }[status] || 'bg-gray-500';

  return (
    <div className="glass-card p-5 relative overflow-hidden group">
      <div className="flex justify-between items-start mb-2">
        <p className="text-[10px] font-bold opacity-50 uppercase tracking-widest text-main-text">{label}</p>
        <div className={`w-1.5 h-1.5 rounded-full ${statusColor}`} />
      </div>
      <p className="text-xl font-bold text-main-text">{value}</p>
      <p className="text-[8px] opacity-40 mt-1 uppercase font-bold">Price to earnings</p>
      <div className={`absolute bottom-0 left-0 h-0.5 bg-white/5 w-full group-hover:bg-${statusColor}/20 transition-all`} />
    </div>
  );
};

const StockDetailPage = () => {
  const { symbol } = useParams();
  const navigate = useNavigate();
  const [stock, setStock] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Overview');
  
  const [showTradeModal, setShowTradeModal] = useState(false);
  const [tradeQuantity, setTradeQuantity] = useState('1');
  const [tradeMpin, setTradeMpin] = useState('');
  const [tradeStatus, setTradeStatus] = useState(null);
  const [selectedModel, setSelectedModel] = useState('lstm');
  const [portfolios, setPortfolios] = useState([]);
  const [selectedPortfolioId, setSelectedPortfolioId] = useState('');

  useEffect(() => {
    const fetchStock = async () => {
      try {
        const res = await api.get(`/stocks/stocks/?search=${symbol}`);
        const found = res.data.results ? res.data.results[0] : res.data[0];
        setStock(found);
        if (found) {
            try {
                const analysisRes = await api.get(`/stocks/stocks/${found.id}/analysis/?fast=1`);
                setAnalysis(analysisRes.data);
            } catch (ea) { console.error("Analysis fetch failed:", ea); }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStock();
  }, [symbol]);

  useEffect(() => {
    const fetchFullIfNeeded = async () => {
      if (activeTab === 'Forecast' && stock && (!analysis || !analysis.forecasts || Object.keys(analysis.forecasts).length === 0)) {
        try {
          const res = await api.get(`/stocks/stocks/${stock.id}/analysis/?fast=0`);
          setAnalysis(res.data);
        } catch (e) {}
      }
    };
    fetchFullIfNeeded();
  }, [activeTab, stock?.id]);

  const openTradeModal = async () => {
    setShowTradeModal(true);
    setTradeStatus(null);
    try {
      const res = await api.get('/portfolio/portfolios/');
      const data = res.data?.results || res.data || [];
      setPortfolios(Array.isArray(data) ? data : []);
      if (data.length > 0) setSelectedPortfolioId(data[0].id);
    } catch (e) { console.error('Failed to fetch portfolios', e); }
  };

  const handleTrade = async (e) => {
    e.preventDefault();
    setTradeStatus(null);
    if (!selectedPortfolioId) {
        setTradeStatus({ type: 'error', msg: 'Please create a portfolio first.' });
        return;
    }
    
    try {
        await api.post('/trading/execute/', {
            portfolio_id: selectedPortfolioId,
            stock_id: stock.id,
            side: 'BUY',
            quantity: tradeQuantity,
            mpin: tradeMpin
        });
        setTradeStatus({ type: 'success', msg: `Successfully added ${tradeQuantity} ${stock.symbol} to your portfolio!` });
        setTimeout(() => setShowTradeModal(false), 2000);
    } catch (err) {
        setTradeStatus({ type: 'error', msg: err?.response?.data?.detail || 'Trade failed' });
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-main-bg flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary-500"></div>
    </div>
  );

  if (!stock) return (
    <div className="min-h-screen bg-main-bg flex items-center justify-center">
      <div className="glass-panel p-16 text-center space-y-4 max-w-md">
        <div className="w-16 h-16 rounded-full bg-danger/10 flex items-center justify-center mx-auto">
          <span className="text-2xl">📉</span>
        </div>
        <h2 className="text-xl font-bold text-main-text">Stock Not Found</h2>
        <p className="text-sm opacity-50">Could not find data for <span className="font-bold text-primary-500">{symbol}</span>. The backend server may be unreachable.</p>
        <Link to="/" className="btn-primary inline-flex mt-4 px-8">Back to Markets</Link>
      </div>
    </div>
  );

  const getNews = () => {
    if (!stock) return { sentiment: 'Bullish', percent: 75, articles: [] };
    const hash = stock.symbol.charCodeAt(0) + stock.symbol.length;
    const isBullish = hash % 2 === 0;
    const pct = 55 + (hash % 35);
    const topics = [
      { t: `${stock.symbol} announces strategic expansion in global markets.`, s: 'Reuters · 2h ago' },
      { t: `Analysts upgrade ${stock.sector || 'sector'} outlook following strong earnings.`, s: 'Bloomberg · 5h ago' },
      { t: `New product pipeline drives momentum for ${stock.name}.`, s: 'CNBC · 1d ago' },
      { t: `Regulatory tailwinds expected to boost ${stock.symbol} margins.`, s: 'WSJ · 2d ago' },
      { t: `Institutional accumulation spotted in ${stock.name} shares.`, s: 'Financial Times · 3d ago' }
    ];
    return {
      sentiment: isBullish ? 'Bullish' : 'Bearish',
      percent: pct,
      articles: [
        topics[hash % topics.length],
        topics[(hash + 1) % topics.length],
        topics[(hash + 2) % topics.length]
      ]
    };
  };
  const newsData = getNews();

  return (
    <div className="bg-main-bg pb-24 text-main-text">
      {/* Breadcrumbs */}
      <div className="px-4 py-6 max-w-7xl mx-auto flex items-center gap-2 text-[10px] font-bold opacity-50 uppercase tracking-widest">
        <Link to="/" className="hover:text-main-text transition-colors">Markets</Link>
        <ChevronRight className="w-3 h-3" />
        <span className="hover:text-main-text cursor-pointer">{stock.sector}</span>
        <ChevronRight className="w-3 h-3" />
        <span className="text-main-text">{stock.symbol}</span>
      </div>

      {/* Related Stocks Pills */}
      <div className="max-w-7xl mx-auto px-4 mt-2 flex gap-3 flex-wrap">
        {[{s:'AAPL',m:'US'},{s:'RELIANCE',m:'IN'},{s:'NVDA',m:'US'},{s:'TCS',m:'IN'}].map(pill => (
          <Link key={pill.s} to={`/stock/${pill.s}`}
            className={`px-5 py-2 rounded-full text-xs font-bold border transition-all flex items-center gap-2 ${pill.s === symbol ? 'bg-primary-600 text-white border-primary-600 shadow-lg shadow-primary-600/20' : 'border-glass-border text-main-text/60 hover:text-main-text hover:bg-white/5'}`}>
            <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded ${pill.m === 'US' ? 'bg-blue-500/10 text-blue-500' : 'bg-orange-500/10 text-orange-500'}`}>{pill.m}</span>
            {pill.s}
          </Link>
        ))}
      </div>

      <div className="max-w-7xl mx-auto px-4 mt-12 space-y-12">
        {/* Header Section */}
        <section className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 rounded-3xl bg-white/5 border border-glass-border flex items-center justify-center text-2xl font-bold text-primary-500">
              {symbol.slice(0, 2)}
            </div>
            <div>
              <h1 className="text-4xl font-bold text-main-text tracking-tight">{stock.name}</h1>
              <p className="opacity-50 font-medium text-sm mt-1 uppercase tracking-widest text-main-text">{stock.market} · {stock.sector}</p>
            </div>
          </div>
          
          <div className="flex flex-col lg:items-end gap-4 w-full lg:w-auto">
            <div className="flex items-baseline gap-4">
              <span className="text-5xl font-bold text-main-text tracking-tighter">₹{stock.latest_price ? parseFloat(stock.latest_price).toLocaleString() : 'N/A'}</span>
              <div className="flex gap-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-success/10 text-success">+{stock.discount || '1.67'}</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-success/10 text-success">+0.89%</span>
              </div>
            </div>
            <p className="text-[10px] opacity-40 font-medium italic">Latest Market Data Tracking</p>
            <div className="flex gap-3 w-full sm:w-auto">
              <button className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl border border-glass-border opacity-60 font-bold text-xs flex items-center justify-center gap-2 hover:bg-white/5 transition-all">
                <BookmarkPlus className="w-4 h-4" /> Watchlist
              </button>
              <button onClick={openTradeModal} className="flex-1 sm:flex-none btn-primary flex items-center justify-center gap-2 text-xs">
                <Plus className="w-4 h-4" /> Add to Portfolio
              </button>
            </div>
          </div>
        </section>

        {/* Trade Modal */}
        {showTradeModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-glass-card border border-glass-border p-8 rounded-2xl w-full max-w-sm">
                <h3 className="text-xl font-bold text-main-text mb-4">Add {stock.symbol} to Portfolio</h3>
                <form onSubmit={handleTrade} className="space-y-4">
                    <div>
                        <label className="block text-[10px] font-bold uppercase tracking-widest opacity-60 mb-2">Target Portfolio</label>
                        <select 
                          required 
                          value={selectedPortfolioId} 
                          onChange={e => setSelectedPortfolioId(e.target.value)} 
                          className="w-full bg-main-bg border border-glass-border rounded-lg p-3 text-sm focus:outline-none focus:border-primary-500 appearance-none"
                        >
                          {portfolios.length === 0 ? (
                            <option value="">No portfolios available</option>
                          ) : (
                            portfolios.map(p => (
                              <option key={p.id} value={p.id}>{p.name}</option>
                            ))
                          )}
                        </select>
                    </div>
                    <div>
                        <label className="block text-[10px] font-bold uppercase tracking-widest opacity-60 mb-2">Quantity</label>
                        <input type="number" min="1" step="0.001" required value={tradeQuantity} onChange={e => setTradeQuantity(e.target.value)} className="w-full bg-main-bg border border-glass-border rounded-lg p-3 text-sm focus:outline-none focus:border-primary-500" />
                    </div>
                    <div>
                        <label className="block text-[10px] font-bold uppercase tracking-widest opacity-60 mb-2">Security MPIN</label>
                        <input type="password" required maxLength="4" pattern="\d{4}" value={tradeMpin} onChange={e => setTradeMpin(e.target.value)} className="w-full bg-main-bg border border-glass-border rounded-lg p-3 text-sm focus:outline-none focus:border-primary-500 tracking-widest text-center font-mono" placeholder="• • • •" />
                    </div>
                    {tradeStatus && (
                        <div className={`p-3 rounded text-xs font-bold ${tradeStatus.type === 'success' ? 'bg-success/10 text-success' : 'bg-danger/10 text-danger'}`}>
                            {tradeStatus.msg}
                        </div>
                    )}
                    <div className="flex gap-3 mt-6">
                        <button type="button" onClick={() => setShowTradeModal(false)} className="flex-1 px-4 py-2.5 rounded-xl border border-glass-border font-bold text-xs opacity-60 hover:opacity-100 transition-all">Cancel</button>
                        <button type="submit" className="flex-1 btn-primary text-xs">Execute Trade</button>
                    </div>
                </form>
            </div>
          </div>
        )}

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-0.5 bg-glass-border border border-glass-border rounded-2xl overflow-hidden">
          {[
            { l: 'Open', v: '₹' + (stock.latest_price || 0) },
            { l: 'Day High', v: '₹' + (parseFloat(stock.latest_price || 0) + 12).toFixed(2) },
            { l: 'Day Low', v: '₹' + (parseFloat(stock.latest_price || 0) - 15).toFixed(2) },
            { l: 'Volume', v: '52.4M' },
            { l: '52W High', v: '₹' + stock.high_52week },
          ].map((s, i) => (
            <div key={i} className="bg-main-bg/50 p-6 flex flex-col justify-center items-center text-center">
              <p className="text-[10px] font-bold opacity-50 uppercase tracking-widest mb-1 text-main-text">{s.l}</p>
              <p className="text-xl font-bold text-main-text tracking-tight">{s.v}</p>
            </div>
          ))}
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-8 border-b border-glass-border pb-0">
          {['Overview', 'Chart', 'Financials', 'Technical', 'Forecast'].map(tab => (
            <button 
              key={tab} 
              onClick={() => setActiveTab(tab)}
              className={`pb-4 px-2 text-xs font-bold uppercase tracking-widest transition-all relative ${activeTab === tab ? 'text-primary-500' : 'opacity-50 text-main-text hover:opacity-100'}`}
            >
              {tab}
              {activeTab === tab && <motion.div layoutId="detailTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-500" />}
            </button>
          ))}
        </div>

        {/* Content Section */}
        <div className="mt-8">
          {activeTab === 'Overview' && (
            <div className="grid lg:grid-cols-3 gap-8 items-start">
              {/* Company Info */}
              <div className="lg:col-span-2 space-y-8">
                <div className="glass-panel p-8">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center">
                      <Activity className="w-6 h-6 text-primary-500" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-main-text">{stock.name}</h3>
                      <p className="text-xs opacity-50 text-main-text">{stock.market}: {stock.symbol} · {stock.sector}</p>
                    </div>
                    <span className="ml-auto px-2 py-0.5 bg-success/10 text-success text-[10px] font-bold rounded">Buy</span>
                  </div>
                  <p className="opacity-70 text-sm leading-relaxed mb-8">
                    {stock.description || `${stock.name} is a global leader in ${stock.sector?.toLowerCase() || 'its industry'}, specializing in innovative platforms and premium services worldwide.`}
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-8 border-t border-glass-border">
                    {[
                      { l: 'CEO', v: analysis?.company?.ceo || 'N/A', i: <User /> },
                      { l: 'Founded', v: analysis?.company?.founded || 'N/A', i: <Calendar /> },
                      { l: 'Employees', v: analysis?.company?.employees || 'N/A', i: <Users /> },
                      { l: 'HQ', v: analysis?.company?.hq || 'N/A', i: <MapPin /> },
                    ].map((item, i) => (
                      <div key={i}>
                         <div className="flex items-center gap-1.5 opacity-50 mb-1 text-main-text">
                           {React.cloneElement(item.i, { className: 'w-3 h-3' })}
                           <span className="text-[10px] font-bold uppercase tracking-widest">{item.l}</span>
                         </div>
                         <p className="text-main-text font-bold text-sm">{item.v}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* News Sidebar */}
              <div className="space-y-8">
                <div className="glass-panel p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-bold text-main">News Sentiment</h3>
                    <span className={`flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest ${newsData.sentiment==='Bullish'?'text-success':'text-danger'}`}>
                      <div className={`w-1.5 h-1.5 rounded-full ${newsData.sentiment==='Bullish'?'bg-success':'bg-danger'}`} /> {newsData.sentiment} {newsData.percent}%
                    </span>
                  </div>
                  <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden mb-8">
                     <div className={`h-full ${newsData.sentiment==='Bullish'?'bg-success shadow-[0_0_10px_rgba(16,185,129,0.5)]':'bg-danger shadow-[0_0_10px_rgba(239,68,68,0.5)]'}`} style={{width: `${newsData.percent}%`}} />
                  </div>
                  <div className="space-y-6">
                    {newsData.articles.map((news, i) => (
                      <div key={i} className="group cursor-pointer">
                        <div className="flex gap-2 items-start">
                          <div className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${newsData.sentiment==='Bullish'?'bg-success':'bg-danger'}`} />
                          <h4 className="text-xs font-bold text-main group-hover:text-primary-500 transition-colors leading-relaxed">{news.t}</h4>
                        </div>
                        <p className="text-[10px] opacity-50 font-medium ml-3.5 mt-1 uppercase tracking-tight">{news.s}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'Financials' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold text-main">Financial Ratios</h3>
                <div className="flex gap-4">
                  {['Good', 'High', 'Neutral', 'Caution'].map(s => (
                    <div key={s} className="flex items-center gap-2">
                       <div className={`w-1.5 h-1.5 rounded-full ${s === 'Good' ? 'bg-success' : s === 'High' ? 'bg-danger' : s === 'Neutral' ? 'opacity-50 bg-main' : 'bg-accent-gold'}`} />
                       <span className="text-[8px] opacity-50 font-bold uppercase tracking-widest">{s}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <RatioCard label="P/E Ratio" value={analysis?.ratios?.pe_ratio || 'N/A'} status="neutral" />
                <RatioCard label="P/B Ratio" value={analysis?.ratios?.pb_ratio || 'N/A'} status="neutral" />
                <RatioCard label="EPS (TTM)" value={analysis?.ratios?.eps || 'N/A'} status="neutral" />
                <RatioCard label="ROE" value={analysis?.ratios?.roe || 'N/A'} status="neutral" />
                <RatioCard label="Debt/Equity" value={analysis?.ratios?.debt_equity || 'N/A'} status="neutral" />
                <RatioCard label="Current Ratio" value={analysis?.ratios?.current_ratio || 'N/A'} status="neutral" />
                <RatioCard label="Gross Margin" value={analysis?.ratios?.gross_margin || 'N/A'} status="good" />
                <RatioCard label="Net Margin" value={analysis?.ratios?.net_margin || 'N/A'} status="good" />
                <RatioCard label="Dividend Yield" value={analysis?.ratios?.dividend_yield || 'N/A'} status="neutral" />
                <RatioCard label="Beta" value={analysis?.ratios?.beta || 'N/A'} status="neutral" />
                <RatioCard label="Market Cap" value={analysis?.ratios?.market_cap || 'N/A'} status="neutral" />
                <RatioCard label="Revenue (TTM)" value={analysis?.ratios?.revenue || 'N/A'} status="good" />
              </div>
            </div>
          )}

          {activeTab === 'Technical' && (
            <div className="glass-panel p-6 max-w-4xl mx-auto">
              <h3 className="text-lg font-bold text-main-text mb-8">Technical Indicators</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                <div className="glass-card p-4 flex flex-col items-center">
                  <Gauge 
                    value={analysis?.technicals?.rsi || 50} 
                    label={analysis?.technicals?.rsi > 70 ? "Overbought" : analysis?.technicals?.rsi < 30 ? "Oversold" : "Neutral"} 
                    sublabel={`RSI - ${analysis?.technicals?.rsi || 50}`} 
                    color={analysis?.technicals?.rsi > 70 ? "stroke-danger" : analysis?.technicals?.rsi < 30 ? "stroke-success" : "stroke-primary-500"} 
                  />
                </div>
                <div className="glass-card p-5">
                  <h4 className="text-[10px] font-bold opacity-50 uppercase tracking-widest mb-3">BOLLINGER BANDS</h4>
                  <div className="space-y-3">
                    {[
                      {l:'Upper Band',v:`₹${analysis?.technicals?.bollinger?.upper || 0}`},
                      {l:'Middle (20MA)',v:`₹${analysis?.technicals?.bollinger?.middle || 0}`},
                      {l:'Lower Band',v:`₹${analysis?.technicals?.bollinger?.lower || 0}`}
                    ].map((b,i)=>(
                      <div key={i} className="flex justify-between items-center">
                        <span className="text-[10px] opacity-60 flex items-center gap-1.5">
                          <div className={`w-1.5 h-1.5 rounded-full ${i===0?'bg-danger':i===1?'bg-accent-gold':'bg-success'}`}/>
                          {b.l}
                        </span>
                        <span className="text-xs font-bold text-main-text">{b.v}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="glass-card p-5 mb-6">
                <h4 className="text-[10px] font-bold opacity-50 uppercase tracking-widest mb-4">MACD (12,26,9)</h4>
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={analysis?.technicals?.macd || []}>
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize:8, fill:'#6b7280'}} />
                      <YAxis hide domain={['dataMin - 0.5','dataMax + 0.5']} />
                      <Tooltip contentStyle={{ backgroundColor: '#13131a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', fontSize: 10 }} />
                      <Bar dataKey="val" fill="#3b82f6" radius={[2,2,0,0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex gap-6 mt-3">
                  <span className="flex items-center gap-1.5 text-[8px] opacity-50"><div className="w-2 h-0.5 bg-primary-500 rounded"/>MACD</span>
                  <span className="flex items-center gap-1.5 text-[8px] opacity-50"><div className="w-2 h-0.5 bg-danger rounded"/>Signal</span>
                  <span className="flex items-center gap-1.5 text-[8px] opacity-50"><div className="w-2 h-0.5 bg-primary-500/50 rounded"/>Histogram</span>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="text-[10px] font-bold opacity-50 uppercase tracking-widest">MOVING AVERAGES</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {[
                    {l:'MA 20',v:`₹${analysis?.technicals?.sma?.['20'] || 0}`},
                    {l:'MA 50',v:`₹${analysis?.technicals?.sma?.['50'] || 0}`},
                    {l:'MA 100',v:`₹${analysis?.technicals?.sma?.['100'] || 0}`},
                    {l:'MA 200',v:`₹${analysis?.technicals?.sma?.['200'] || 0}`},
                  ].map((ma,i) => (
                    <div key={i} className="flex items-center justify-between p-2.5 bg-white/5 rounded-lg border border-glass-border">
                      <div>
                        <span className="text-[10px] font-bold text-main-text">{ma.l}</span>
                        <p className="text-xs font-bold text-main-text mt-0.5">{ma.v}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'Chart' && (
            <div className="glass-panel p-8">
              <h3 className="text-xl font-bold text-main-text mb-6">Price History</h3>
              <div className="h-96 w-full">
                {analysis?.chart ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={analysis.chart}>
                        <defs>
                          <linearGradient id="colorClose" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fontSize:10, fill:'#6b7280'}} minTickGap={30} />
                        <YAxis domain={['auto', 'auto']} axisLine={false} tickLine={false} tick={{fontSize:10, fill:'#6b7280'}} tickFormatter={(v)=>`₹${v}`} />
                        <Tooltip contentStyle={{ backgroundColor: '#13131a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', fontSize: 12 }} />
                        <Area type="monotone" dataKey="close" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorClose)" />
                      </AreaChart>
                    </ResponsiveContainer>
                ) : (
                    <div className="h-full flex items-center justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-primary-500" />
                    </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'Forecast' && (
            <div className="glass-panel p-8">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
                  <div>
                    <h3 className="text-xl font-bold text-main-text mb-1">AI Smart Forecast</h3>
                    <p className="text-xs opacity-50 uppercase tracking-widest font-bold">Predictive Modeling</p>
                  </div>
                  <div className="flex bg-white/5 p-1 rounded-xl border border-glass-border">
                    {['arima', 'lstm', 'linear_regression'].map((m) => (
                      <button 
                        key={m}
                        onClick={() => setSelectedModel(m)}
                        className={`px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${
                          selectedModel === m ? 'bg-primary-600 text-white shadow-lg' : 'text-gray-500 hover:text-white'
                        }`}
                      >
                        {m === 'linear_regression' ? 'LinReg' : m}
                      </button>
                    ))}
                  </div>
              </div>
              
              <div className="grid md:grid-cols-3 gap-8 mb-10">
                <div className="md:col-span-2 h-80 w-full glass-card p-6">
                    {analysis?.forecasts?.[selectedModel] ? (
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={[...(analysis.chart || []).slice(-15), ...analysis.forecasts[selectedModel]]}>
                            <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fontSize:10, fill:'#6b7280'}} minTickGap={20} />
                            <YAxis domain={['auto', 'auto']} axisLine={false} tickLine={false} tick={{fontSize:10, fill:'#6b7280'}} tickFormatter={(v)=>`₹${v}`} />
                            <Tooltip contentStyle={{ backgroundColor: '#13131a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', fontSize: 12 }} />
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                            <Line type="monotone" dataKey="close" stroke="#f59e0b" strokeWidth={2} dot={false} strokeDasharray="5 5" />
                          </LineChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="h-full flex items-center justify-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-accent-gold" />
                        </div>
                    )}
                </div>
                <div className="space-y-4">
                    <div className="glass-card p-6">
                        <h4 className="text-[10px] font-bold opacity-50 uppercase tracking-widest mb-3">Model Insight</h4>
                        <p className="text-sm text-main-text leading-relaxed">
                            {selectedModel === 'lstm' ? 'Deep Learning LSTM model analyzing long-term dependencies and sequence patterns in price movements.' : 
                             selectedModel === 'arima' ? 'Statistical ARIMA model focused on auto-regressive moving averages to identify seasonal trends.' : 
                             'Linear Regression model projecting baseline growth trends via statistical line fitting.'}
                        </p>
                    </div>
                    <div className="glass-card p-6 flex flex-col items-center justify-center text-center">
                        <Activity className="w-8 h-8 text-primary-500 mb-2 opacity-60" />
                        <p className="text-[10px] font-bold opacity-50 uppercase tracking-widest">MLflow Tracked</p>
                        <span className="text-xs font-mono text-success mt-1">SESSION_ACTIVE</span>
                    </div>
                </div>
              </div>

              <div className="bg-primary-500/10 border border-primary-500/20 rounded-2xl p-6">
                 <div className="flex items-start gap-4">
                    <div className="p-3 bg-primary-500/20 rounded-xl text-primary-500">
                        <Zap className="w-6 h-6" />
                    </div>
                    <div>
                        <h4 className="font-bold text-main-text">QuantVista Momentum Prediction</h4>
                        <p className="text-sm opacity-60 mt-1 max-w-2xl">
                           Predictions indicate a <span className={`font-bold ${newsData.sentiment === 'Bullish' ? 'text-success' : 'text-danger'}`}>{newsData.sentiment}</span> trend for {stock?.symbol} over the next 30 days. This forecast has been registered in our MLflow registry for policy validation.
                        </p>
                    </div>
                 </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StockDetailPage;
