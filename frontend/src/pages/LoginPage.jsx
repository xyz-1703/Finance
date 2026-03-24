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
