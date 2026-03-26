import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/client';

export default function LoginPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const response = await api.post('/auth/token/', {
        email: formData.username, 
        username: formData.username, 
        password: formData.password
      });
      
      localStorage.setItem('access_token', response.data.access);
      if (response.data.refresh) {
          localStorage.setItem('refresh_token', response.data.refresh);
      }
      if (response.data.user) {
          localStorage.setItem('current_user', JSON.stringify(response.data.user));
      }

      window.dispatchEvent(new Event("auth-changed"));
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.detail || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f7f9fa] flex flex-col font-sans" style={{ color: "var(--groww-text)" }}>
      {/* Groww-style minimal top nav */}
      <nav className="w-full h-[72px] bg-white border-b border-[#e2e8f0] flex items-center px-8 sm:px-12 sticky top-0 z-10 shadow-sm">
        <Link to="/" className="flex items-center gap-2 text-2xl font-black text-[#1e293b] tracking-tight hover:opacity-80 transition-opacity">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#00d09c] to-[#00b889] flex items-center justify-center shadow-md">
            <span className="text-white text-lg font-bold">S</span>
          </div>
          QuantVista
        </Link>
      </nav>

      {/* Main Login Area */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-8">
        <div className="w-full max-w-[420px] bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-[#e2e8f0]/40 p-8 sm:p-10">
          
          <h1 className="text-2xl sm:text-[28px] font-bold text-[#1e293b] mb-2 tracking-tight">Welcome back</h1>
          <p className="text-[15px] mb-8" style={{ color: "var(--groww-text)" }}>
            Please enter your login details to access your dashboard.
          </p>

          <form onSubmit={handleLogin} className="space-y-6">
            {error && (
              <div className="p-4 rounded-xl bg-red-50 text-red-600 text-sm border border-red-100 font-medium">
                {error}
              </div>
            )}
            
            <div className="space-y-1.5">
              <label className="block text-[13px] font-semibold text-[#44475b] uppercase tracking-wide">
                Username or Email
              </label>
              <input 
                type="text" 
                name="username"
                className="w-full bg-white border border-[#e2e8f0] rounded-xl px-4 py-3.5 text-[#1e293b] placeholder-[#8b94a5] focus:outline-none focus:border-[#00d09c] focus:ring-1 focus:ring-[#00d09c] shadow-sm transition-all"
                placeholder="Ex: user@example.com"
                value={formData.username}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="block text-[13px] font-semibold text-[#44475b] uppercase tracking-wide">
                  Password
                </label>
                <Link to="/forgot-password" className="text-sm font-semibold text-[#00d09c] hover:text-[#00b889] transition-colors">
                  Forgot?
                </Link>
              </div>
              <input 
                type="password" 
                name="password"
                className="w-full bg-white border border-[#e2e8f0] rounded-xl px-4 py-3.5 text-[#1e293b] placeholder-[#8b94a5] focus:outline-none focus:border-[#00d09c] focus:ring-1 focus:ring-[#00d09c] shadow-sm transition-all text-lg tracking-[0.2em]"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
            
            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-[#00d09c] hover:bg-[#00b889] text-white py-4 mt-2 rounded-xl text-lg font-bold shadow-lg shadow-[#00d09c]/20 hover:shadow-xl hover:shadow-[#00d09c]/30 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none transition-all duration-300"
            >
              {loading ? 'Authenticating...' : 'Secure Login'}
            </button>
          </form>
          
          <div className="mt-8 text-center border-t border-[#e2e8f0] pt-6">
            <p className="text-[15px]" style={{ color: "var(--groww-text)" }}>
              Don't have an account?{' '}
              <Link to="/register" className="font-bold text-[#00d09c] hover:text-[#00b889] transition-colors">
                Register here
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
