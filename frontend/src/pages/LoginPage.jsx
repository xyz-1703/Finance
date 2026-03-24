import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';

const LoginPage = () => {
    // A standalone login page for routing here if not on the home page
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ username: '', password: '' });
    const [error, setError] = useState('');
  
    const handleChange = (e) => {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    };
  
    const handleLogin = async (e) => {
      e.preventDefault();
      setError('');
      try {
        const response = await api.post('login', {
          email: formData.username,
          username: formData.username,
          password: formData.password
        });
        localStorage.setItem('access_token', response.data.access);
        if (response.data.refresh) {
            localStorage.setItem('refresh_token', response.data.refresh);
        }
        navigate('/dashboard');
      } catch (err) {
        setError(err.response?.data?.detail || 'Invalid credentials');
      }
    };
  
    return (
      <div className="min-h-screen flex items-center justify-center bg-finance-bg relative overflow-hidden py-12 px-4 sm:px-6 lg:px-8">
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-finance-success/10 blur-[100px] rounded-full point-events-none"></div>
        
        <div className="w-full max-w-md card-panel p-8 bg-finance-card/90 backdrop-blur-xl relative z-10">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-2">Welcome Back</h2>
            <p className="text-finance-muted text-sm">Sign in to your portfolio</p>
          </div>
  
          <form onSubmit={handleLogin} className="space-y-5">
            {error && <div className="p-3 rounded bg-finance-danger/20 border border-finance-danger/50 text-finance-danger text-sm">{error}</div>}
            
            <div>
              <label className="block text-sm font-medium text-finance-muted mb-1.5">Username or Email</label>
              <input 
                type="text" 
                name="username"
                className="input-field"
                placeholder="Enter username"
                value={formData.username}
                onChange={handleChange}
                required
              />
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-sm font-medium text-finance-muted">Password</label>
                <Link to="/forgot-password" className="text-sm text-finance-primary hover:text-white transition-colors">Forgot password?</Link>
              </div>
              <input 
                type="password" 
                name="password"
                className="input-field"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
            
            <button type="submit" className="w-full btn-primary py-3 mt-4 text-lg font-semibold">Sign In</button>
          </form>
          
          <p className="mt-8 text-center text-sm text-finance-muted">
            Don't have an account? <Link to="/register" className="text-finance-primary font-medium hover:text-white transition-colors">Create an account</Link>
          </p>
        </div>
      </div>
    );
  };
  
  export default LoginPage;
