import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/client';
import { UserPlus, Mail, Key, User, AlertCircle, ChevronRight } from 'lucide-react';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    first_name: '',
    last_name: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      return setError('Passwords do not match');
    }

    try {
      setError('');
      setLoading(true);
      await api.post('/auth/register/', {
        email: formData.email,
        username: formData.username || formData.email,
        first_name: formData.first_name,
        last_name: formData.last_name,
        password: formData.password
      });
      navigate('/login', { state: { message: 'Registration successful! Please login.' } });
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to create an account.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center relative py-12 bg-main-bg text-main-text">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-accent-purple/20 rounded-full blur-[100px] pointer-events-none opacity-50"></div>
      
      <div className="glass-panel w-full max-w-xl p-10 relative z-10 shadow-glass-strong">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-accent-purple to-primary-700 shadow-lg shadow-accent-purple/20 mb-6">
            <UserPlus className="w-7 h-7 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-main-text tracking-tight">Create an Account</h2>
          <p className="opacity-50 mt-2 font-medium">Join QuantVista to manage your portfolios</p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-danger/10 border border-danger/20 flex items-center gap-3 text-danger">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p className="text-xs font-bold uppercase tracking-wider">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-[10px] font-bold text-main-text opacity-50 uppercase tracking-widest ml-1">First Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <User className="h-5 w-5 opacity-40" />
                </div>
                <input
                  type="text" name="first_name" className="glass-input pl-12" placeholder="John"
                  value={formData.first_name} onChange={handleChange}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="block text-[10px] font-bold text-main-text opacity-50 uppercase tracking-widest ml-1">Last Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <User className="h-5 w-5 opacity-40" />
                </div>
                <input
                  type="text" name="last_name" className="glass-input pl-12" placeholder="Doe"
                  value={formData.last_name} onChange={handleChange}
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-[10px] font-bold text-main-text opacity-50 uppercase tracking-widest ml-1">Email Address</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 opacity-40" />
              </div>
              <input
                type="email" name="email" required className="glass-input pl-12" placeholder="you@example.com"
                value={formData.email} onChange={handleChange}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-[10px] font-bold text-main-text opacity-50 uppercase tracking-widest ml-1">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Key className="h-5 w-5 opacity-40" />
                </div>
                <input
                  type="password" name="password" required minLength="8" className="glass-input pl-12" placeholder="••••••••"
                  value={formData.password} onChange={handleChange}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="block text-[10px] font-bold text-main-text opacity-50 uppercase tracking-widest ml-1">Confirm Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Key className="h-5 w-5 opacity-40" />
                </div>
                <input
                  type="password" name="confirmPassword" required minLength="8" className="glass-input pl-12" placeholder="••••••••"
                  value={formData.confirmPassword} onChange={handleChange}
                />
              </div>
            </div>
          </div>

          <button
            type="submit" disabled={loading}
            className="w-full btn-primary py-4 flex justify-center items-center gap-3 font-bold uppercase tracking-widest text-xs mt-4"
          >
            {loading ? <span className="animate-spin text-xl">⏳</span> : <><UserPlus className="w-4 h-4" /> Sign Up</>}
          </button>
        </form>

        <p className="mt-10 text-center text-xs opacity-50 font-medium tracking-wide">
          Already have an account?{' '}
          <Link to="/login" className="font-bold text-primary-500 hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
