import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';

const BOT_USERNAME = import.meta.env.VITE_TELEGRAM_BOT_USERNAME || 'Quantstockportfoli_bot';
const TELEGRAM_BOT_URL = `https://t.me/${BOT_USERNAME}?start=register`;
const TELEGRAM_APP_URL = `tg://resolve?domain=${BOT_USERNAME}&start=register`;
const TELEGRAM_WEB_URL = `https://web.telegram.org/k/#?tgaddr=tg%3A%2F%2Fresolve%3Fdomain%3D${BOT_USERNAME}%26start%3Dregister`;

const RegisterPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ 
    username: '', 
    email: '', 
    password: '',
    telegram_id: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [registered, setRegistered] = useState(false);
  const [hasTelegram, setHasTelegram] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await api.post('register', formData);
      setHasTelegram(!!formData.telegram_id);
      setRegistered(true);
    } catch (err) {
      if (err.response && err.response.data) {
        const messages = Object.values(err.response.data).flat().join('. ');
        setError(messages || 'Registration failed');
      } else {
        setError('Network error');
      }
    } finally {
      setLoading(false);
    }
  };

  // ────── SUCCESS SCREEN ──────
  if (registered) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-finance-bg relative overflow-hidden py-12 px-4">
        {/* Glow orbs */}
        <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-finance-success/10 blur-[100px] rounded-full pointer-events-none"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-finance-primary/10 blur-[100px] rounded-full pointer-events-none"></div>

        <div className="w-full max-w-md card-panel p-8 bg-finance-card/90 backdrop-blur-xl relative z-10 text-center animate-fadeIn">
          {/* Success checkmark */}
          <div className="mx-auto mb-5 w-16 h-16 rounded-full bg-gradient-to-br from-finance-success to-teal-400 flex items-center justify-center shadow-lg">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <h2 className="text-3xl font-bold text-white mb-2">Account Created!</h2>
          <p className="text-finance-muted text-sm mb-8">Welcome to the professional stock portfolio platform.</p>

          {/* Telegram connect section */}
          {hasTelegram && (
            <div className="mb-6 p-4 rounded-xl border border-finance-primary/30 bg-finance-primary/10">
              <div className="flex items-center gap-2 mb-2 justify-center">
                {/* Telegram SVG icon */}
                <svg className="w-5 h-5 text-[#29a9eb]" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.248-1.97 9.289c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12l-6.871 4.326-2.962-.924c-.643-.204-.657-.643.136-.953l11.57-4.461c.537-.194 1.006.131.833.932z"/>
                </svg>
                <span className="text-finance-primary font-semibold text-sm">One last step!</span>
              </div>
              <p className="text-finance-muted text-xs mb-4">
                To receive OTPs via Telegram, you must open the bot and press <strong className="text-white">Start</strong> once. This allows the bot to send you messages.
              </p>

              {/* QR Code Section */}
              <div className="flex flex-col items-center mb-6 p-4 rounded-xl bg-white/5 border border-white/10">
                <div className="bg-white p-2 rounded-lg mb-2 shadow-inner">
                  <img 
                    src={`https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(TELEGRAM_BOT_URL)}&size=160x160`} 
                    alt="Telegram Bot QR Code" 
                    className="w-40 h-40"
                  />
                </div>
                <p className="text-[10px] text-finance-muted uppercase tracking-widest font-bold">Scan to open on mobile</p>
              </div>

              <div className="flex flex-col gap-3">
                <a
                  href={TELEGRAM_BOT_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-3.5 px-4 rounded-xl font-bold text-white shadow-lg transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                  style={{ background: 'linear-gradient(90deg, #29a9eb, #1a8fcf)' }}
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.248-1.97 9.289c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12l-6.871 4.326-2.962-.924c-.643-.204-.657-.643.136-.953l11.57-4.461c.537-.194 1.006.131.833.932z"/>
                  </svg>
                  Connect on Telegram
                </a>
                
                <div className="flex flex-col gap-2 pt-1">
                  <a
                    href={TELEGRAM_WEB_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-finance-primary hover:text-white text-[11px] uppercase tracking-wider font-bold transition-colors text-center"
                  >
                    Open in Telegram Web
                  </a>
                  <a
                    href={TELEGRAM_APP_URL}
                    className="text-finance-muted hover:text-white text-[10px] uppercase tracking-wider font-bold transition-colors text-center"
                  >
                    Open in Telegram App
                  </a>
                  <p className="text-[9px] text-finance-muted/50 italic text-center mt-1">Both options will trigger the "/start" command</p>
                </div>
              </div>
            </div>
          )}

          {!hasTelegram && (
            <div className="mb-6 p-4 rounded-xl border border-yellow-500/30 bg-yellow-500/10 text-left">
              <p className="text-yellow-400 text-xs">
                <strong>Tip:</strong> You didn't add a Telegram username! You can add it in your profile settings to receive OTPs via Telegram.
              </p>
            </div>
          )}

          <button
            onClick={() => navigate('/login')}
            className="w-full btn-primary py-3 text-lg font-semibold"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  // ────── REGISTER FORM ──────
  return (
    <div className="min-h-screen flex items-center justify-center bg-finance-bg relative overflow-hidden py-12 px-4 sm:px-6 lg:px-8">
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-finance-primary/10 blur-[100px] rounded-full point-events-none"></div>
      
      <div className="w-full max-w-md card-panel p-8 bg-finance-card/90 backdrop-blur-xl relative z-10">
        <div className="text-center mb-8">
          <div className="mx-auto w-12 h-12 rounded bg-gradient-to-br from-finance-primary to-finance-success flex items-center justify-center mb-4">
            <span className="text-white text-2xl font-bold">S</span>
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">Create Account</h2>
          <p className="text-finance-muted text-sm">Join the professional stock portfolio platform</p>
        </div>

        <form onSubmit={handleRegister} className="space-y-4">
          {error && <div className="p-3 rounded bg-finance-danger/20 border border-finance-danger/50 text-finance-danger text-sm">{error}</div>}
          
          <div>
            <label className="block text-sm font-medium text-finance-muted mb-1.5">Username</label>
            <input 
              type="text" 
              name="username"
              className="input-field py-2"
              placeholder="johndoe"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-finance-muted mb-1.5">Email Address</label>
            <input 
              type="email" 
              name="email"
              className="input-field py-2"
              placeholder="john@example.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-finance-muted mb-1.5">Password</label>
            <input 
              type="password" 
              name="password"
              className="input-field py-2"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-finance-muted mb-1.5">
              Telegram Username <span className="text-finance-primary/60 font-normal">(Optional — for OTP notifications)</span>
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-finance-muted font-semibold">@</span>
              <input 
                type="text" 
                name="telegram_id"
                className="input-field py-2 pl-7"
                placeholder="yourusername"
                value={formData.telegram_id}
                onChange={handleChange}
              />
            </div>
            <p className="text-xs text-finance-muted mt-1">Used to send OTP reset codes via Telegram.</p>
          </div>
          
          <button type="submit" disabled={loading} className="w-full btn-primary py-3 mt-6 text-lg font-semibold disabled:opacity-50">
            {loading ? 'Creating...' : 'Register'}
          </button>
        </form>
        
        <p className="mt-8 text-center text-sm text-finance-muted">
          Already have an account? <Link to="/login" className="text-finance-primary font-medium hover:text-white transition-colors">Sign in here</Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
