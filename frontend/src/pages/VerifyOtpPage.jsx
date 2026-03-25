import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import api from '../api/client';

const VerifyOtpPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || '';
  const telegramUsername = location.state?.telegram_username || '';
  
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email && !telegramUsername) {
      setError("No identifier found. Please restart the forgot password process.");
      return;
    }
    setError('');
    setLoading(true);
    try {
      await api.post('/auth/otp/verify/', { 
        email, 
        telegram_username: telegramUsername, 
        otp_code: code 
      });
      navigate('/reset-password', { state: { email, telegram_username: telegramUsername, code } });
    } catch (err) {
      setError(err.response?.data?.detail || 'Invalid or expired OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-finance-bg relative overflow-hidden py-12 px-4 sm:px-6 lg:px-8">
      <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/10 blur-[150px] rounded-full point-events-none"></div>
      
      <div className="w-full max-w-md card-panel p-8 bg-finance-card/90 backdrop-blur-xl relative z-10">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-white mb-2">Verify OTP</h2>
          <p className="text-finance-muted text-sm">We sent a 6-digit code to your email or Telegram</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && <div className="p-3 rounded bg-finance-danger/20 border border-finance-danger/50 text-finance-danger text-sm">{error}</div>}
          
          <div>
            <label className="block text-sm font-medium text-finance-muted mb-1.5 text-center">Enter Code</label>
            <input 
              type="text" 
              maxLength="6"
              className="input-field py-4 text-3xl text-center font-mono tracking-[0.5em]"
              placeholder="000000"
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
              required
            />
          </div>
          
          <button type="submit" disabled={loading} className="w-full btn-primary py-3 text-lg font-semibold shadow-lg disabled:opacity-50">
            {loading ? 'Verifying...' : 'Verify Code'}
          </button>
        </form>
        
        <div className="mt-8 text-center text-sm">
          <Link to="/forgot-password" className="text-finance-primary font-medium hover:text-white transition-colors">Didn't receive code?</Link>
        </div>
      </div>
    </div>
  );
};

export default VerifyOtpPage;
