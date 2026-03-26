import React from 'react';
import { useNavigate, Link } from 'react-router-dom';

export default function HomePage() {
  const navigate = useNavigate();

  const marketData = [
    { name: 'NIFTY 50', value: '22,453.30', change: '+0.15%' },
    { name: 'SENSEX', value: '73,953.31', change: '+0.12%' },
    { name: 'BANKNIFTY', value: '47,286.90', change: '-0.32%' },
    { name: 'FINNIFTY', value: '20,892.15', change: '-0.10%' },
  ];

  return (
    <div className="min-h-screen bg-[#ffffff] font-sans text-[#44475b] overflow-x-hidden">
      {/* 1. Header / Navbar */}
      <header className="w-full h-[72px] bg-white flex items-center justify-between px-6 md:px-12 sticky top-0 z-50 shadow-sm border-b border-[#e2e8f0]">
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-2 text-2xl font-black text-[#1e293b] tracking-tight hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#00d09c] to-[#00b889] flex items-center justify-center shadow-md">
              <span className="text-white text-lg font-bold">Q</span>
            </div>
            QuantVista
          </Link>
          
          <div className="hidden md:flex gap-6 items-center">
            <Link to="/market-home" className="text-[#44475b] hover:text-[#00d09c] font-bold text-[15px] transition-colors">
              Stocks
            </Link>
            <Link to="/ml" className="text-[#44475b] hover:text-[#00d09c] font-bold text-[15px] transition-colors">
              AI & ML
            </Link>
            <Link to="/dashboard" className="text-[#44475b] hover:text-[#00d09c] font-bold text-[15px] transition-colors">
              Portfolios
            </Link>
          </div>
          
          {/* Subtle Search Bar mimic */}
          <div className="hidden lg:flex items-center bg-[#f7f9fa] border border-[#e2e8f0] rounded-xl px-4 py-2 w-[400px] focus-within:bg-white focus-within:border-[#00d09c] focus-within:shadow-sm focus-within:ring-1 focus-within:ring-[#00d09c] transition-all">
            <svg className="w-5 h-5 text-[#8b94a5] mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
            <input 
              type="text" 
              placeholder="What are you looking for today?" 
              className="bg-transparent border-none outline-none w-full text-sm text-[#1e293b] placeholder-[#8b94a5]"
            />
          </div>
        </div>

        <div className="flex items-center gap-4 md:gap-6">
          <button 
            onClick={() => navigate('/login')}
            className="hidden sm:block bg-[#00d09c] hover:bg-[#00b889] text-white px-6 py-2.5 rounded-xl font-bold text-[15px] shadow-sm transition-all duration-300"
          >
            Login/Register
          </button>
        </div>
      </header>

      {/* 2. Market Strip */}
      <div className="w-full bg-white border-b border-[#e2e8f0] py-4 overflow-x-auto whitespace-nowrap hide-scrollbar flex items-center justify-center gap-8 px-6 hidden sm:flex">
        {marketData.map((data, idx) => (
          <div key={idx} className="flex flex-col items-center min-w-max">
            <span className="text-[11px] font-bold text-[#8b94a5] uppercase tracking-wider">{data.name}</span>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-[#1e293b]">{data.value}</span>
              <span className={`text-xs font-bold ${data.change.startsWith('+') ? 'text-[#00d09c]' : 'text-rose-500'}`}>
                {data.change}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* 3. Hero Section */}
      <main className="w-full max-w-[1200px] mx-auto pt-16 md:pt-24 px-6 md:px-12 flex flex-col items-center">
        <h1 className="text-[44px] sm:text-[56px] md:text-[64px] font-black text-[#1e293b] text-center leading-[1.1] tracking-[-0.04em] mb-8">
          QuantVista
        </h1>
        
        <button 
          onClick={() => navigate('/login')}
          className="bg-[#00d09c] hover:bg-[#00b889] text-white px-8 py-4 rounded-xl font-bold text-lg shadow-[0_8px_20px_rgba(0,208,156,0.3)] hover:-translate-y-1 transition-all duration-300 transform active:scale-95 mb-16"
        >
          Get Started
        </button>

        <div className="w-full max-w-[900px] mx-auto flex justify-center items-center relative mb-24 min-h-[400px]">
           {/* Fallback to CSS geometric shapes if image fails, otherwise image */}
           <img 
              src="/images/hero_illustration.png" 
              alt="Isometric Financial Illustration" 
              className="w-full h-auto drop-shadow-2xl z-10"
              onError={(e) => {
                 e.target.style.display = 'none';
                 e.target.nextSibling.style.display = 'flex';
              }}
           />
           {/* Fallback Graphic */}
           <div className="hidden absolute inset-0 items-center justify-center bg-transparent z-0">
              <div className="relative w-[600px] h-[400px]">
                <div className="absolute bottom-10 left-10 w-64 h-48 bg-white border-2 border-[#e2e8f0] rounded-2xl shadow-xl transform skew-x-12 -rotate-12"></div>
                <div className="absolute bottom-20 right-20 w-48 h-64 bg-[#f7f9fa] border border-[#e2e8f0] rounded-2xl shadow-lg transform -skew-x-12 rotate-12"></div>
                <div className="absolute top-10 left-1/3 w-32 h-32 bg-emerald-500/10 border border-emerald-500/30 rounded-full shadow-sm"></div>
                <div className="absolute top-1/2 left-1/2 w-40 h-40 bg-blue-500/5 border border-blue-500/20 rounded-xl transform rotate-45"></div>
              </div>
           </div>
        </div>

        {/* 4. Fingertips Grid */}
        <div className="w-full pb-24 text-center">
            <h2 className="text-3xl font-black text-[#1e293b] tracking-tight mb-12">
              India's stock market at your fingertips
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-[1000px] mx-auto text-left">
              
              {/* Card 1: Stocks (Tall) */}
              <div 
                onClick={() => navigate('/market-home')}
                className="bg-white rounded-3xl p-8 border border-[#e2e8f0]/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] transition-all duration-300 cursor-pointer lg:row-span-2 group flex flex-col justify-between min-h-[400px]"
              >
                 <div>
                    <h3 className="text-xl font-bold text-[#1e293b] mb-2 text-center group-hover:text-[#00d09c] transition-colors">Stocks</h3>
                 </div>
                 <div className="w-full flex-1 flex flex-col items-center justify-end">
                    <div className="w-[80%] h-[300px] bg-gradient-to-t from-emerald-50 to-white border border-[#e2e8f0] rounded-t-2xl relative overflow-hidden flex flex-col items-center p-6">
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                           <span className="text-blue-600 font-bold text-xs">RE</span>
                        </div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Reliance Energy</span>
                        <span className="text-2xl font-black text-slate-800">₹732.32</span>
                        {/* Mock Chart SVG */}
                        <svg className="absolute bottom-0 left-0 w-full h-1/2 text-emerald-500 opacity-20" viewBox="0 0 100 50" preserveAspectRatio="none">
                           <path d="M0,50 L0,40 L10,35 L20,45 L30,20 L40,30 L50,10 L60,25 L70,5 L80,15 L90,0 L100,20 L100,50 Z" fill="currentColor"></path>
                        </svg>
                        <svg className="absolute bottom-0 left-0 w-full h-1/2 text-emerald-500" viewBox="0 0 100 50" preserveAspectRatio="none">
                           <path d="M0,40 L10,35 L20,45 L30,20 L40,30 L50,10 L60,25 L70,5 L80,15 L90,0 L100,20" fill="none" stroke="currentColor" strokeWidth="2"></path>
                        </svg>
                    </div>
                 </div>
              </div>

              {/* Card 2: AI & ML */}
              <div 
                 onClick={() => navigate('/ml')}
                 className="bg-white rounded-3xl p-8 border border-[#e2e8f0]/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] transition-all duration-300 cursor-pointer lg:col-span-2 group flex flex-col h-[220px]"
              >
                 <h3 className="text-xl font-bold text-[#1e293b] mb-2 text-center group-hover:text-[#00d09c] transition-colors">AI Predictions</h3>
                 <p className="text-[#8b94a5] text-sm text-center mb-6">Cutting-edge models & forecasting algorithms</p>
                 <div className="flex-1 flex items-center justify-center gap-6">
                    <div className="w-16 h-16 bg-[#e0f7fa] rounded-2xl border border-[#b2ebf2] flex items-center justify-center shadow-sm">
                       <svg className="w-8 h-8 text-[#00bcd4]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                    </div>
                    <div className="w-16 h-16 bg-[#e8f5e9] rounded-2xl border border-[#c8e6c9] flex items-center justify-center shadow-sm">
                       <svg className="w-8 h-8 text-[#4caf50]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
                    </div>
                    <div className="w-16 h-16 bg-[#fff3e0] rounded-2xl border border-[#ffe0b2] flex items-center justify-center shadow-sm">
                       <svg className="w-8 h-8 text-[#ff9800]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                    </div>
                 </div>
              </div>

              {/* Card 3: Portfolios */}
              <div 
                 onClick={() => navigate('/dashboard')}
                 className="bg-white rounded-3xl p-8 border border-[#e2e8f0]/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] transition-all duration-300 cursor-pointer lg:col-span-2 group min-h-[260px] relative overflow-hidden"
              >
                  <h3 className="text-xl font-bold text-[#1e293b] mb-2 text-center group-hover:text-[#00d09c] transition-colors">Portfolios</h3>
                  <div className="absolute bottom-[-10px] left-1/2 -translate-x-1/2 w-[80%] h-[180px] bg-slate-50 border border-[#e2e8f0] rounded-t-2xl shadow-md p-4">
                     {/* Mock Portfolio UI Inside */}
                     <div className="flex justify-between items-center border-b border-[#e2e8f0] pb-2 mb-2">
                         <span className="text-[10px] font-bold text-slate-400 uppercase">Growth Fund</span>
                         <span className="text-xs font-bold text-emerald-500">+12.4%</span>
                     </div>
                     <div className="flex justify-between items-center border-b border-[#e2e8f0] pb-2 mb-2">
                         <span className="text-[10px] font-bold text-slate-400 uppercase">Retirement Setup</span>
                         <span className="text-xs font-bold text-emerald-500">+8.1%</span>
                     </div>
                     <div className="flex justify-between items-center">
                         <span className="text-[10px] font-bold text-slate-400 uppercase">Tech Index</span>
                         <span className="text-xs font-bold text-rose-500">-2.3%</span>
                     </div>
                  </div>
              </div>
            </div>
        </div>

        {/* 5. SIP / Automate Section */}
        <div className="w-full pb-32 text-center mt-12 bg-pattern overflow-hidden relative">
            <h2 className="text-3xl font-black text-[#1e293b] tracking-tight mb-4">
              Build wealth, Algorithm by Algorithm
            </h2>
            <p className="text-slate-500 text-lg mb-8">Invest in Quantitative Portfolios with precision.</p>
            <button 
              onClick={() => navigate('/login')}
              className="bg-white border border-[#e2e8f0] hover:border-[#00d09c] hover:text-[#00d09c] text-[#1e293b] px-8 py-3 rounded-xl font-bold shadow-sm hover:shadow-md transition-all duration-300"
            >
              Learn automated investing
            </button>

            {/* Faint Grid Background mimic */}
            <div className="absolute inset-0 z-[-1] opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)', backgroundSize: '40px 40px'}}></div>
        </div>

        {/* 6. Education / Language Section */}
        <div className="w-full pb-24 border-t border-[#e2e8f0] pt-24 overflow-hidden">
            <h2 className="text-3xl font-black text-[#1e293b] tracking-tight mb-12 text-center lg:text-left lg:px-12">
              Finance simplified, for your logic.
            </h2>
            
            {/* Horizontal Scroll */}
            <div className="flex overflow-x-auto gap-6 pb-8 hide-scrollbar px-6 lg:px-12">
               {[
                 { title: "Market Insights", color: "from-blue-900 to-slate-900" },
                 { title: "Advanced Quant", color: "from-emerald-900 to-slate-900" },
                 { title: "Risk Paradigms", color: "from-indigo-900 to-slate-900" },
                 { title: "Model Reviews", color: "from-rose-900 to-slate-900" },
                 { title: "Trading Logic", color: "from-amber-900 to-slate-900" },
               ].map((item, idx) => (
                  <div key={idx} className={`min-w-[280px] h-[360px] rounded-[2rem] bg-gradient-to-br ${item.color} p-8 flex flex-col justify-end relative overflow-hidden group hover:shadow-xl transition-all cursor-pointer transform hover:-translate-y-2`}>
                     <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-all"></div>
                     <h3 className="text-white text-2xl font-black relative z-10">{item.title}</h3>
                  </div>
               ))}
            </div>
        </div>
      </main>

      {/* 7. Footer */}
      <footer className="w-full bg-[#151a22] pt-16 pb-8 px-6 md:px-12 text-slate-300 font-sans">
         <div className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 border-b border-white/10 pb-12">
            <div className="space-y-4">
                <div className="flex items-center gap-2 text-2xl font-black text-white tracking-tight mb-6">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#00d09c] to-[#00b889] flex items-center justify-center">
                    <span className="text-white text-lg font-bold">Q</span>
                  </div>
                  QuantVista
                </div>
                <p className="text-sm text-slate-400">Vaishnavi Tech Park, South Tower<br/>Sarjapur Main Road, Bengaluru, 560103</p>
                <div className="flex items-center gap-4 pt-4">
                   <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center cursor-pointer hover:bg-[#00d09c] hover:text-white transition-colors">in</div>
                   <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center cursor-pointer hover:bg-[#00d09c] hover:text-white transition-colors">X</div>
                   <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center cursor-pointer hover:bg-[#00d09c] hover:text-white transition-colors">▶</div>
                </div>
            </div>

            <div className="space-y-4">
               <h4 className="text-white font-bold mb-6 text-sm">PRODUCTS</h4>
               <ul className="space-y-3 text-sm text-slate-400">
                  <li className="hover:text-white cursor-pointer transition-colors">Stocks</li>
                  <li className="hover:text-white cursor-pointer transition-colors">Mutual Funds</li>
                  <li className="hover:text-white cursor-pointer transition-colors">Trade Desk</li>
                  <li className="hover:text-white cursor-pointer transition-colors">AI Models</li>
               </ul>
            </div>

            <div className="space-y-4">
               <h4 className="text-white font-bold mb-6 text-sm">QUANTVISTA</h4>
               <ul className="space-y-3 text-sm text-slate-400">
                  <li className="hover:text-white cursor-pointer transition-colors">About Us</li>
                  <li className="hover:text-white cursor-pointer transition-colors">Pricing</li>
                  <li className="hover:text-white cursor-pointer transition-colors">Blog</li>
                  <li className="hover:text-white cursor-pointer transition-colors">Careers</li>
               </ul>
            </div>

            <div className="space-y-4">
               <h4 className="text-white font-bold mb-6 text-sm">QUICK LINKS</h4>
               <ul className="space-y-3 text-sm text-slate-400">
                  <li className="hover:text-white cursor-pointer transition-colors">Help & Support</li>
                  <li className="hover:text-white cursor-pointer transition-colors">Trust & Safety</li>
                  <li className="hover:text-white cursor-pointer transition-colors">Investor Relations</li>
               </ul>
            </div>
         </div>

         <div className="max-w-[1200px] mx-auto pt-8 text-xs text-slate-500 leading-relaxed space-y-4">
            <p>QuantVista is a technology platform, not a registered broker-dealer or investment advisor. All investments involve risk, and the past performance of a security or financial product does not guarantee future results or returns. Keep in mind that while diversification may help spread risk, it does not assure a profit or protect against loss. There is always the potential of losing money when you invest in securities or other financial products. Investors should consider their investment objectives and risks carefully before investing.</p>
            <div className="flex justify-between items-center pt-8 border-t border-white/10">
               <span>&copy; {new Date().getFullYear()} QuantVista. All rights reserved.</span>
               <div className="flex gap-4">
                 <span className="hover:text-white cursor-pointer">Terms</span>
                 <span className="hover:text-white cursor-pointer">Privacy</span>
                 <span className="hover:text-white cursor-pointer">Security</span>
               </div>
            </div>
         </div>
      </footer>
    </div>
  );
}
