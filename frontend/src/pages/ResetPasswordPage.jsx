import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import api from '../api/client';

const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || '';
  const telegramUsername = location.state?.telegram_username || '';
  const code = location.state?.code || '';
  
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if ((!email && !telegramUsername) || !code) {
      setError("Session expired. Please restart the password reset process.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    setError('');
    setLoading(true);
    try {
      await api.post('/auth/password/reset/', { 
        email, 
        telegram_username: telegramUsername, 
        otp_code: code, 
        new_password: newPassword 
      });
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-finance-bg relative overflow-hidden py-12 px-4 sm:px-6 lg:px-8">
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-finance-success/10 blur-[150px] rounded-full point-events-none"></div>
      
      <div className="w-full max-w-md card-panel p-8 bg-finance-card/90 backdrop-blur-xl relative z-10">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-white mb-2">Create New Password</h2>
          <p className="text-finance-muted text-sm">Secure your account with a new password</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {error && <div className="p-3 rounded bg-finance-danger/20 border border-finance-danger/50 text-finance-danger text-sm">{error}</div>}
          
          <div>
            <label className="block text-sm font-medium text-finance-muted mb-1.5">New Password</label>
            <input 
              type="password" 
              className="input-field py-3"
              placeholder="••••••••"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-finance-muted mb-1.5">Confirm Password</label>
            <input 
              type="password" 
              className="input-field py-3"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          
          <button type="submit" disabled={loading} className="w-full btn-primary py-3 text-lg font-semibold shadow-lg disabled:opacity-50 mt-2">
            {loading ? 'Updating...' : 'Set New Password'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
