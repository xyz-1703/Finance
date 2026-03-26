import React from 'react';
import { useNavigate, Link } from 'react-router-dom';

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white font-sans text-[#44475b]">
      {/* Header / Navbar */}
      <header className="w-full h-[72px] bg-white flex items-center justify-between px-6 md:px-12 sticky top-0 z-50 shadow-sm border-b border-[#e2e8f0]">
        <div className="flex items-center gap-10">
          <Link to="/" className="flex items-center gap-2 text-2xl font-black text-[#1e293b] tracking-tight hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#00d09c] to-[#00b889] flex items-center justify-center shadow-md">
              <span className="text-white text-lg font-bold">S</span>
            </div>
            QuantVista
          </Link>
          
          {/* Subtle Search Bar mimic */}
          <div className="hidden md:flex items-center bg-[#f7f9fa] border border-[#e2e8f0] rounded-xl px-4 py-2 w-[400px] focus-within:bg-white focus-within:border-[#00d09c] focus-within:shadow-sm focus-within:ring-1 focus-within:ring-[#00d09c] transition-all">
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
          <Link to="/login" className="text-[#44475b] hover:text-[#00d09c] font-semibold text-[15px] transition-colors">
            Login/Register
          </Link>
          <button 
            onClick={() => navigate('/login')}
            className="hidden sm:block bg-[#00d09c] hover:bg-[#00b889] text-white px-6 py-2.5 rounded-xl font-bold text-[15px] shadow-lg shadow-[#00d09c]/20 hover:-translate-y-0.5 hover:shadow-[#00d09c]/30 transition-all duration-300"
          >
            Get Started
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="w-full flex flex-col md:flex-row items-center max-w-[1200px] mx-auto pt-16 md:pt-32 px-6 md:px-12">
        {/* Left Side Content */}
        <div className="flex-1 text-center md:text-left z-10 md:pr-12">
          <h1 className="text-[44px] sm:text-[56px] md:text-[68px] font-black text-[#1e293b] leading-[1.1] tracking-[-0.04em] mb-6">
            All things finance,<br className="hidden md:block"/> right here.
          </h1>
          <p className="text-lg md:text-xl text-[#44475b] leading-relaxed mb-10 max-w-xl mx-auto md:mx-0">
            Built for a growing generation. Invest, track, and automate your portfolios with advanced machine learning strategies, entirely for free.
          </p>
          <div className="flex items-center justify-center md:justify-start gap-4">
            <button 
              onClick={() => navigate('/login')}
              className="bg-[#00d09c] hover:bg-[#00b889] text-white px-8 py-4 rounded-xl font-bold text-lg shadow-[0_8px_20px_rgba(0,208,156,0.3)] hover:-translate-y-1 transition-all duration-300 transform active:scale-95"
            >
              Start Investing
            </button>
          </div>
        </div>

        {/* Right Side Illustration / Showcase Grid */}
        <div className="flex-1 w-full mt-16 md:mt-0 relative">
          {/* Decorative blurred blob */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-[#00d09c] blur-[100px] rounded-full opacity-10 pointer-events-none"></div>
          
          <div className="relative grid grid-cols-2 gap-4 translate-x-4 md:translate-x-0">
            <div className="bg-white rounded-[24px] p-6 shadow-[0_20px_40px_rgba(0,0,0,0.06)] border border-[#e2e8f0]/40 transform -rotate-2 hover:rotate-0 hover:-translate-y-2 transition-all duration-500">
              <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-500 mb-4">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>
              </div>
              <h3 className="text-xl font-bold text-[#1e293b] mb-1">Live Tracking</h3>
              <p className="text-sm text-[#8b94a5]">Monitor your global assets in real time with high frequency.</p>
            </div>
            
            <div className="bg-white rounded-[24px] p-6 shadow-[0_20px_40px_rgba(0,0,0,0.06)] border border-[#e2e8f0]/40 mt-8 transform rotate-2 hover:rotate-0 hover:-translate-y-2 transition-all duration-500">
              <div className="w-12 h-12 rounded-full bg-[#00d09c]/10 flex items-center justify-center text-[#00d09c] mb-4">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19V6l12-3v13M9 19c-1.105 0-2-.895-2-2V6c0-1.105.895-2 2-2h12c1.105 0 2 .895 2 2v13c0 1.105-.895 2-2 2H9zm0 0c-1.105 0-2-.895-2-2H2l2-6M4 4h4v4H4V4z"></path></svg>
              </div>
              <h3 className="text-xl font-bold text-[#1e293b] mb-1">ML Portfolios</h3>
              <p className="text-sm text-[#8b94a5]">Auto-cluster your investments and manage risk exposure securely.</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
