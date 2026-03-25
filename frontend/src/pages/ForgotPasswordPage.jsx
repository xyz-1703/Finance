import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/client';

const ForgotPasswordPage = () => {
  const navigate = useNavigate();
  const [identifier, setIdentifier] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!identifier) return;

    setError('');
    setLoading(true);
    
    // Email contains @ in the middle (e.g. user@gmail.com)
    // Telegram usernames START with @ (e.g. @xyz1797)
    const isEmail = identifier.includes('@') && !identifier.startsWith('@');
    const payload = isEmail ? { email: identifier } : { telegram_username: identifier.replace(/^@/, '') };

    try {
      await api.post('/auth/password/otp/request/', payload);
      // Pass the payload state to verify-otp page
      navigate('/verify-otp', { state: payload });
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to send OTP. Ensure your identifier is registered.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-finance-bg text-finance-text flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-finance-primary/20 rounded-full blur-3xl pointer-events-none"></div>
      
      <div className="w-full max-w-md card-panel p-8 bg-finance-card/90 backdrop-blur-xl relative z-10">
          <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-white mb-2">Reset Password</h2>
          <p className="text-finance-muted text-sm">Enter your Email or Telegram Username to receive an OTP</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {error && <div className="p-3 bg-red-500/10 border border-red-500/20 rounded text-red-400 text-sm text-center">{error}</div>}
          
          <div>
            <label className="block text-sm font-medium text-finance-muted mb-1.5">Email Address or Telegram Username</label>
            <input 
              type="text" 
              className="input-field py-3 text-lg"
              placeholder="hello@example.com or @username"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              required
            />
          </div>
          
          <button type="submit" disabled={loading} className="w-full btn-primary py-3 text-lg font-semibold shadow-lg disabled:opacity-50">
            {loading ? 'Sending...' : 'Send OTP'}
          </button>
        </form>

        <div className="mt-8 text-center">
          <Link to="/login" className="text-finance-muted hover:text-white transition-colors text-sm">
            &larr; Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
