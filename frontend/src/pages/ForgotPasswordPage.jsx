import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/client';
import { KeyRound, Send, AlertCircle, ShieldCheck } from 'lucide-react';

const ForgotPasswordPage = () => {
  const [step, setStep] = useState(1); // 1: Request OTP, 2: Verify & Reset
  const [telegramUsername, setTelegramUsername] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRequestOTP = async (e) => {
    e.preventDefault();
    try {
      setError('');
      setMessage('');
      setLoading(true);
      const res = await api.post('/auth/forgot-password/', { telegram_username: telegramUsername });
      setMessage(res.data.detail || 'OTP sent to your Telegram!');
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to send OTP. Check your username.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    try {
      setError('');
      setLoading(true);
      await api.post('/auth/reset-password/', {
        telegram_username: telegramUsername,
        otp,
        new_password: newPassword
      });
      setMessage('Password reset successful!');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to reset password. Invalid OTP?');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center relative">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary-600/20 rounded-full blur-[100px] pointer-events-none"></div>
      
      <div className="glass-panel w-full max-w-md p-8 relative z-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-accent-cyan shadow-lg shadow-primary-500/20 mb-4">
            <KeyRound className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white">Reset Password</h2>
          <p className="text-gray-400 mt-2">
            {step === 1 ? "Enter your linked Telegram username" : "Enter the OTP sent to your Telegram"}
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-lg bg-danger/10 border border-danger/20 flex items-center gap-3 text-danger">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p className="text-sm">{error}</p>
          </div>
        )}

        {message && (
          <div className="mb-6 p-4 rounded-lg bg-success/10 border border-success/20 flex items-center gap-3 text-success">
            <ShieldCheck className="w-5 h-5 flex-shrink-0" />
            <p className="text-sm">{message}</p>
          </div>
        )}

        {step === 1 ? (
          <form onSubmit={handleRequestOTP} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Telegram Username</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                  @
                </div>
                <input
                  type="text"
                  required
                  className="glass-input pl-10"
                  placeholder="username"
                  value={telegramUsername}
                  onChange={(e) => setTelegramUsername(e.target.value.replace('@', ''))}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full btn-primary py-2.5 flex justify-center items-center gap-2 ${loading ? 'opacity-75 cursor-not-allowed' : ''}`}
            >
              {loading ? 'Sending...' : <><Send className="w-4 h-4" /> Send OTP</>}
            </button>
          </form>
        ) : (
          <form onSubmit={handleResetPassword} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">6-Digit OTP</label>
              <input
                type="text"
                required
                maxLength="6"
                className="glass-input text-center tracking-widest text-xl font-mono"
                placeholder="------"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">New Password</label>
              <input
                type="password"
                required
                minLength="8"
                className="glass-input"
                placeholder="••••••••"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full btn-primary py-2.5 flex justify-center items-center ${loading ? 'opacity-75 cursor-not-allowed' : ''}`}
            >
              {loading ? 'Resetting...' : 'Reset Password'}
            </button>
          </form>
        )}

        <p className="mt-8 text-center text-sm text-gray-400">
          Remember your password?{' '}
          <Link to="/login" className="font-medium text-primary-400 hover:text-primary-300 transition-colors">
            Back to Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
