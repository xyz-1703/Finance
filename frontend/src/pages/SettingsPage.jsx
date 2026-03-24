import { useEffect, useState } from "react";

import api from "../api/client";

export default function SettingsPage() {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [linkCode, setLinkCode] = useState("");
  const [botUsername, setBotUsername] = useState("");
  const [botDeepLink, setBotDeepLink] = useState("");

  const [setMpinValue, setSetMpinValue] = useState("");
  const [recovery, setRecovery] = useState({
    telegram_username: "",
    otp_code: "",
    mpin: "",
  });

  const refreshProfile = async () => {
    try {
      const response = await api.get("/auth/profile/");
      setProfile(response.data);
      localStorage.setItem("current_user", JSON.stringify(response.data));
    } catch (err) {
      setError(err.response?.data?.detail || "Unable to load profile.");
    }
  };

  useEffect(() => {
    refreshProfile();
  }, []);

  const handleRequestLinkCode = async () => {
    setMessage("");
    setError("");
    try {
      const response = await api.post("/auth/telegram/link/code/");
      setLinkCode(response.data.verification_code || "");
      setBotUsername(response.data.bot_username || "");
      setBotDeepLink(response.data.bot_deep_link || "");
      setMessage(response.data.detail || "Telegram link code generated.");
    } catch (err) {
      setBotUsername("");
      setBotDeepLink("");
      setError(err.response?.data?.detail || "Unable to generate Telegram link code.");
    }
  };

  const handleVerifyLinkCode = async () => {
    setMessage("");
    setError("");
    try {
      await api.post("/auth/telegram/link/verify/", { link_code: linkCode.trim().toUpperCase() });
      setMessage("Telegram linked successfully.");
      refreshProfile();
    } catch (err) {
      setError(err.response?.data?.detail || "Telegram verification failed.");
    }
  };

  const handleSetMpin = async (event) => {
    event.preventDefault();
    setMessage("");
    setError("");
    try {
      await api.post("/auth/mpin/set/", { mpin: setMpinValue });
      setMessage("MPIN configured.");
      setSetMpinValue("");
      refreshProfile();
    } catch (err) {
      setError(err.response?.data?.detail || "Unable to configure MPIN.");
    }
  };

  const handleRequestRecoveryOtp = async () => {
    setMessage("");
    setError("");
    try {
      await api.post("/auth/otp/request/", { telegram_username: recovery.telegram_username });
      setMessage("Recovery OTP sent to Telegram.");
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to send recovery OTP.");
    }
  };

  const handleVerifyRecoveryOtp = async () => {
    setMessage("");
    setError("");
    try {
      await api.post("/auth/otp/verify/", {
        telegram_username: recovery.telegram_username,
        otp_code: recovery.otp_code,
      });
      setMessage("OTP verified. You can reset MPIN now.");
    } catch (err) {
      setError(err.response?.data?.detail || "OTP verification failed.");
    }
  };

  const handleResetMpin = async (event) => {
    event.preventDefault();
    setMessage("");
    setError("");
    try {
      await api.post("/auth/mpin/reset/", {
        telegram_username: recovery.telegram_username,
        otp_code: recovery.otp_code,
        mpin: recovery.mpin,
      });
      setMessage("MPIN reset successfully.");
      setRecovery((prev) => ({ ...prev, otp_code: "", mpin: "" }));
      refreshProfile();
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to reset MPIN.");
    }
  };

  return (
    <main className="dashboard-grid">
      <section className="card">
        <h2>Profile Security</h2>
        <div className="stack">
          <p><strong>Email:</strong> {profile?.email || "-"}</p>
          <p><strong>Telegram:</strong> {profile?.telegram_connected ? `@${profile.telegram_username}` : "Not linked"}</p>
          <p><strong>MPIN:</strong> {profile?.has_mpin ? "Configured" : "Not configured"}</p>
        </div>
      </section>

      <section className="card">
        <h2>Telegram Linking</h2>
        <div className="stack">
          <button onClick={handleRequestLinkCode}>Generate Link Code</button>
          <label htmlFor="link-code">Verification Code</label>
          <input
            id="link-code"
            value={linkCode}
            onChange={(event) => setLinkCode(event.target.value)}
            placeholder="Paste or edit the code"
          />
          <button onClick={handleVerifyLinkCode}>Verify Telegram Link</button>
          <p className="muted">Send this code as a message to your configured Telegram bot, then verify here.</p>
          {botUsername ? <p className="muted"><strong>Bot:</strong> @{botUsername}</p> : null}
          {botDeepLink ? <a href={botDeepLink} target="_blank" rel="noreferrer">Open bot with this code</a> : null}
        </div>
      </section>

      <section className="card">
        <h2>Set MPIN</h2>
        <form className="stack" onSubmit={handleSetMpin}>
          <label htmlFor="set-mpin">New MPIN</label>
          <input
            id="set-mpin"
            type="password"
            value={setMpinValue}
            onChange={(event) => setSetMpinValue(event.target.value)}
            placeholder="4-6 digits"
            required
          />
          <button type="submit">Set MPIN</button>
        </form>
      </section>

      <section className="card">
        <h2>Recover / Reset MPIN</h2>
        <form className="stack" onSubmit={handleResetMpin}>
          <label htmlFor="recovery-user">Telegram Username</label>
          <input
            id="recovery-user"
            value={recovery.telegram_username}
            onChange={(event) => setRecovery((prev) => ({ ...prev, telegram_username: event.target.value }))}
            placeholder="username or @username"
            required
          />

          <div className="row">
            <button type="button" onClick={handleRequestRecoveryOtp}>Send OTP</button>
            <button type="button" onClick={handleVerifyRecoveryOtp}>Verify OTP</button>
          </div>

          <label htmlFor="recovery-otp">OTP Code</label>
          <input
            id="recovery-otp"
            value={recovery.otp_code}
            onChange={(event) => setRecovery((prev) => ({ ...prev, otp_code: event.target.value }))}
            required
          />

          <label htmlFor="recovery-mpin">New MPIN</label>
          <input
            id="recovery-mpin"
            type="password"
            value={recovery.mpin}
            onChange={(event) => setRecovery((prev) => ({ ...prev, mpin: event.target.value }))}
            required
          />

          <button type="submit">Reset MPIN With OTP</button>
        </form>
      </section>

      {message ? <section className="card"><p>{message}</p></section> : null}
      {error ? <section className="card"><p className="error">{error}</p></section> : null}
    </main>
  );
}
