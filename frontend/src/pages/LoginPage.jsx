import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LogIn, Key, Mail, AlertCircle } from 'lucide-react';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/dashboard";

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError('');
      setLoading(true);
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      setError('Failed to log in. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center relative bg-main-bg text-main-text">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary-600/20 rounded-full blur-[100px] pointer-events-none opacity-50"></div>
      
      <div className="glass-panel w-full max-w-md p-10 relative z-10 shadow-glass-strong">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 shadow-lg shadow-primary-500/20 mb-6">
            <LogIn className="w-7 h-7 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-main-text tracking-tight">Welcome Back</h2>
          <p className="opacity-50 mt-2 font-medium">Access your QuantVista edge</p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-danger/10 border border-danger/20 flex items-center gap-3 text-danger">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p className="text-xs font-bold uppercase tracking-wider">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="block text-[10px] font-bold text-main-text opacity-50 uppercase tracking-widest ml-1">Email Address</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 opacity-40" />
              </div>
              <input
                type="email" required className="glass-input pl-12" placeholder="you@example.com"
                value={email} onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-[10px] font-bold text-main-text opacity-50 uppercase tracking-widest ml-1">Secure Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Key className="h-5 w-5 opacity-40" />
              </div>
              <input
                type="password" required className="glass-input pl-12" placeholder="••••••••"
                value={password} onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="flex justify-end mt-2">
              <Link to="/forgot-password" shaking="true" className="text-[10px] font-bold text-primary-500 hover:underline uppercase tracking-widest">
                Forgot password?
              </Link>
            </div>
          </div>

          <button
            type="submit" disabled={loading}
            className="w-full btn-primary py-4 flex justify-center items-center gap-3 font-bold uppercase tracking-widest text-xs"
          >
            {loading ? <span className="animate-spin text-xl">⏳</span> : 'Sign In'}
          </button>
        </form>

        <p className="mt-10 text-center text-xs opacity-50 font-medium tracking-wide">
          Don't have an account?{' '}
          <Link to="/register" className="font-bold text-primary-500 hover:underline">
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
