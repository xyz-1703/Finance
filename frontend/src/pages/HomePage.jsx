import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';

const HomePage = () => {
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
      // If we use email for login as per config, let's map username to email or just send it
      // The simplejwt TokenObtainPairView expects username and password. For email-based login, username field is the email.
      const response = await api.post('login', {
        email: formData.username, // Sending to email field or username field depending on backend
        username: formData.username, 
        password: formData.password
      });
      localStorage.setItem('access_token', response.data.access);
      if (response.data.refresh) {
          localStorage.setItem('refresh_token', response.data.refresh);
      }
      navigate('/dashboard'); // Or wherever it leads
    } catch (err) {
      setError(err.response?.data?.detail || 'Invalid credentials');
    }
  };

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden bg-finance-bg">
      {/* Decorative background gradients */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-finance-primary/20 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-finance-success/10 blur-[120px] rounded-full"></div>
      </div>

      {/* Navbar */}
      <nav className="w-full px-8 py-6 flex justify-between items-center z-10 border-b border-finance-border/50 bg-finance-bg/50 backdrop-blur-md">
        <div className="flex items-center gap-2 text-2xl font-bold text-white tracking-tight">
          <div className="w-8 h-8 rounded bg-gradient-to-br from-finance-primary to-finance-success flex items-center justify-center">
            <span className="text-white text-lg">S</span>
          </div>
          Stock Portfolio
        </div>
        <div className="flex gap-4">
          <Link to="/" className="text-finance-text hover:text-white font-medium px-4 py-2 transition-colors">Login</Link>
          <Link to="/register" className="btn-primary">Register</Link>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:flex-row w-full max-w-7xl mx-auto px-8 z-10 my-8">
        {/* Left Side: Description & Features */}
        <div className="flex-1 flex flex-col justify-center pr-0 lg:pr-12 mb-12 lg:mb-0">
          <h1 className="text-5xl lg:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-finance-muted mb-6 leading-tight">
            Manage your<br/>stock portfolio
          </h1>
          <p className="text-xl text-finance-muted mb-10 max-w-xl leading-relaxed">
            The ultimate professional dashboard for modern investors. Monitor the markets, execute strategies, and stay ahead with real-time insights.
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="card-panel p-5 bg-finance-card/80 backdrop-blur-sm border-finance-border/50 hover:border-finance-primary/50 transition-colors">
              <div className="w-10 h-10 rounded-lg bg-finance-primary/20 text-finance-primary flex items-center justify-center mb-4 text-xl font-bold">↑</div>
              <h3 className="text-lg font-semibold text-white mb-2">Track performance</h3>
              <p className="text-sm text-finance-muted">Monitor your assets with real-time candlestick charts and dynamic P&L tracking.</p>
            </div>
            
            <div className="card-panel p-5 bg-finance-card/80 backdrop-blur-sm border-finance-border/50 hover:border-finance-primary/50 transition-colors">
              <div className="w-10 h-10 rounded-lg bg-finance-success/20 text-finance-success flex items-center justify-center mb-4 text-xl font-bold">~</div>
              <h3 className="text-lg font-semibold text-white mb-2">Forecast prices</h3>
              <p className="text-sm text-finance-muted">Leverage historical data patterns to predict upcoming market movements.</p>
            </div>

            <div className="card-panel p-5 bg-finance-card/80 backdrop-blur-sm border-finance-border/50 hover:border-finance-primary/50 transition-colors sm:col-span-2">
              <div className="w-10 h-10 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center mb-4 text-xl font-bold">✧</div>
              <h3 className="text-lg font-semibold text-white mb-2">AI powered recommendations</h3>
              <p className="text-sm text-finance-muted">Get smart actionable insights backed by advanced machine learning models trained on millions of data points.</p>
            </div>
          </div>
        </div>

        {/* Right Side: Login Form */}
        <div className="w-full lg:w-[450px] flex items-center justify-center">
          <div className="w-full card-panel p-8 bg-finance-card/90 backdrop-blur-xl relative overflow-hidden">
            {/* Soft top border glow */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-finance-primary to-finance-success"></div>
            
            <h2 className="text-2xl font-bold text-white mb-2">Welcome Back</h2>
            <p className="text-finance-muted mb-8 text-sm">Sign in to access your dashboard</p>
            
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
              
              <button type="submit" className="w-full btn-primary py-3 mt-4 text-lg font-semibold shadow-lg shadow-finance-primary/30">
                Sign In
              </button>
            </form>
            
            <p className="mt-8 text-center text-sm text-finance-muted">
              Don't have an account? <Link to="/register" className="text-finance-primary font-medium hover:text-white transition-colors">Create an account</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
