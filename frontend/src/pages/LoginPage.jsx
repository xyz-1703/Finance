<<<<<<< HEAD
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
=======
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../api/client";

export default function LoginPage({ mode = "login" }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [error, setError] = useState("");
  const [forgotOpen, setForgotOpen] = useState(false);
  const [forgotUsername, setForgotUsername] = useState("");
  const [forgotOtp, setForgotOtp] = useState("");
  const [forgotPassword, setForgotPassword] = useState("");
  const [forgotMessage, setForgotMessage] = useState("");
  const [forgotLoading, setForgotLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const isRegister = mode === "register";

  const endpoint = useMemo(() => {
    return isRegister ? "/auth/register/" : "/auth/token/";
  }, [isRegister]);
  const handleLogin = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      const payload = isRegister
        ? { email, password, first_name: firstName, last_name: lastName }
        : { email, password };
      const response = await api.post(endpoint, payload);
      localStorage.setItem("access_token", response.data.access);
      if (response.data.refresh) {
        localStorage.setItem("refresh_token", response.data.refresh);
      }
      localStorage.setItem("current_user", JSON.stringify(response.data.user || null));
      window.dispatchEvent(new Event("auth-changed"));
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.detail || (isRegister ? "Registration failed." : "JWT login failed."));
    } finally {
      setLoading(false);
    }
  };

  const requestPasswordOtp = async () => {
    setForgotLoading(true);
    setForgotMessage("");
    setError("");
    try {
      const response = await api.post("/auth/password/otp/request/", {
        telegram_username: forgotUsername,
      });
      setForgotMessage(response.data.detail || "OTP sent successfully.");
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to send OTP.");
    } finally {
      setForgotLoading(false);
    }
  };

  const resetPassword = async (event) => {
    event.preventDefault();
    setForgotLoading(true);
    setForgotMessage("");
    setError("");
    try {
      const response = await api.post("/auth/password/reset/", {
        telegram_username: forgotUsername,
        otp_code: forgotOtp,
        new_password: forgotPassword,
      });
      setForgotMessage(response.data.detail || "Password reset successfully.");
      setForgotOtp("");
      setForgotPassword("");
      setForgotOpen(false);
    } catch (err) {
      setError(err.response?.data?.detail || "Password reset failed.");
    } finally {
      setForgotLoading(false);
    }
  };

  return (
    <main className="layout">
      <section className="card hero">
        <p className="kicker">Secure Access</p>
        <h1>{isRegister ? "Create your account" : "Sign in with email and password"}</h1>
        <p>
          This platform uses JWT sessions, Telegram OTP recovery, and MPIN verification for trading.
        </p>
      </section>
      <section className="card form-card">
        <h2>{isRegister ? "Register" : "JWT Login"}</h2>
        <form onSubmit={handleLogin}>
          {isRegister ? (
            <>
              <label htmlFor="first-name">First name</label>
              <input
                id="first-name"
                type="text"
                value={firstName}
                onChange={(event) => setFirstName(event.target.value)}
                placeholder="Optional"
              />
              <label htmlFor="last-name">Last name</label>
              <input
                id="last-name"
                type="text"
                value={lastName}
                onChange={(event) => setLastName(event.target.value)}
                placeholder="Optional"
              />
            </>
          ) : null}
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="Enter your account email"
            required
          />
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Enter your password"
            required
          />
          {error ? <p className="error">{error}</p> : null}
          <button type="submit" disabled={loading}>
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>
        {!isRegister ? (
          <div className="forgot-wrap">
            <button
              type="button"
              className="link-button"
              onClick={() => setForgotOpen((prev) => !prev)}
            >
              {forgotOpen ? "Hide forgot password" : "Forgot password?"}
            </button>
            {forgotOpen ? (
              <form className="stack" onSubmit={resetPassword}>
                <label htmlFor="forgot-telegram">Telegram username</label>
                <input
                  id="forgot-telegram"
                  value={forgotUsername}
                  onChange={(event) => setForgotUsername(event.target.value)}
                  placeholder="username or @username"
                  required
                />
                <button type="button" onClick={requestPasswordOtp} disabled={forgotLoading}>
                  {forgotLoading ? "Sending OTP..." : "Send OTP"}
                </button>
                <label htmlFor="forgot-otp">OTP code</label>
                <input
                  id="forgot-otp"
                  value={forgotOtp}
                  onChange={(event) => setForgotOtp(event.target.value)}
                  placeholder="Enter OTP"
                  required
                />
                <label htmlFor="forgot-password">New password</label>
                <input
                  id="forgot-password"
                  type="password"
                  value={forgotPassword}
                  onChange={(event) => setForgotPassword(event.target.value)}
                  placeholder="Set a new password"
                  required
                />
                <button type="submit" disabled={forgotLoading}>
                  {forgotLoading ? "Resetting..." : "Reset password"}
                </button>
                {forgotMessage ? <p className="muted">{forgotMessage}</p> : null}
              </form>
            ) : null}
          </div>
        ) : null}
      </section>
    </main>
  );
}
>>>>>>> f676874015cfdcfa865c247090c40e9cf22a2aba
