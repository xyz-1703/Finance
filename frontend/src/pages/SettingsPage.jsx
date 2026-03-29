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
      setMessage("MPIN configured successfully.");
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
      setMessage("Recovery OTP sent to your Telegram.");
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
      setMessage("OTP verified. You may now reset your MPIN.");
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
    <main className="app-shell animate-fade-in pb-24 mt-10">
      
      <header className="mb-12 relative z-10">
        <div className="flex items-center gap-3 mb-4">
          <span className="badge badge-primary">Configuration</span>
          <span className="text-finance-primary text-xs font-mono uppercase tracking-widest font-black">
            System & Security
          </span>
        </div>
        <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tighter text-white">Security Settings</h1>
        <p className="text-finance-muted font-bold text-lg leading-relaxed max-w-3xl uppercase tracking-widest text-[11px]">
          Manage your operational credentials, multi-factor authentication, and Telegram bot integration.
        </p>
      </header>

      {message && (
        <div className="glass-card mb-8 p-6 border-finance-success/30 bg-finance-success/5 animate-slide-up">
          <div className="flex items-center gap-4 text-finance-success font-black text-sm uppercase tracking-widest">
            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-finance-success/20">
               <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
            </span>
            {message}
          </div>
        </div>
      )}
      
      {error && (
        <div className="glass-card mb-8 p-6 border-finance-danger/30 bg-finance-danger/5 animate-shake">
          <div className="flex items-center gap-4 text-finance-danger font-black text-sm uppercase tracking-widest">
            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-finance-danger/20">
               <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
            </span>
            {error}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 relative z-10">
        
        {/* Profile Status */}
        <section className="glass-card p-8 border-finance-primary/20 bg-[#0c1017]/50 h-fit">
          <h2 className="text-lg font-black text-white mb-6 flex items-center gap-3 uppercase tracking-widest">
            <svg className="h-5 w-5 text-finance-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            Identity Overview
          </h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-4 rounded-xl bg-white/5 border border-white/10">
              <span className="text-[10px] text-finance-muted font-bold uppercase tracking-[0.2em]">Email Coordinates</span>
              <span className="text-sm font-black text-white">{profile?.email || "Unknown"}</span>
            </div>
            <div className="flex justify-between items-center p-4 rounded-xl bg-white/5 border border-white/10">
              <span className="text-[10px] text-finance-muted font-bold uppercase tracking-[0.2em]">Telegram Status</span>
              <span className={`text-xs font-black px-2 py-1 rounded uppercase tracking-widest border ${profile?.telegram_connected ? 'bg-finance-primary/10 text-finance-primary border-finance-primary/30' : 'bg-white/5 text-finance-muted border-white/10'}`}>
                 {profile?.telegram_connected ? `@${profile.telegram_username}` : "Unlinked"}
              </span>
            </div>
            <div className="flex justify-between items-center p-4 rounded-xl bg-white/5 border border-white/10">
              <span className="text-[10px] text-finance-muted font-bold uppercase tracking-[0.2em]">Security MPIN</span>
              <span className={`text-xs font-black px-2 py-1 rounded uppercase tracking-widest border ${profile?.has_mpin ? 'bg-finance-success/10 text-finance-success border-finance-success/30' : 'bg-finance-danger/10 text-finance-danger border-finance-danger/30'}`}>
                 {profile?.has_mpin ? "Active" : "Not Configured"}
              </span>
            </div>
          </div>
        </section>

        {/* MPIN Configuration */}
        <section className="glass-card p-8 bg-white/[0.02]">
          <h2 className="text-lg font-black text-white mb-6 flex items-center gap-3 uppercase tracking-widest">
            <svg className="h-5 w-5 text-finance-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            MPIN Initialization
          </h2>
          <form className="space-y-6" onSubmit={handleSetMpin}>
            <div className="p-4 rounded-xl border border-finance-primary/20 bg-finance-primary/5 text-xs text-finance-muted font-bold leading-relaxed mb-6">
              Establish a 4-to-6 digit MPIN for authorizing high-frequency market executions.
            </div>
            <div>
              <label className="block text-[10px] font-bold text-finance-muted uppercase tracking-[0.2em] mb-2" htmlFor="set-mpin">New Authorization Code</label>
              <input
                id="set-mpin"
                type="password"
                className="input-field text-xl tracking-[1em] font-mono"
                value={setMpinValue}
                onChange={(event) => setSetMpinValue(event.target.value)}
                placeholder="••••"
                maxLength={6}
                required
              />
            </div>
            <button type="submit" className="w-full btn-primary py-4">Deploy MPIN</button>
          </form>
        </section>

        {/* Telegram Integration */}
        <section className="glass-card p-8 bg-white/[0.02]">
          <h2 className="text-lg font-black text-white mb-6 flex items-center gap-3 uppercase tracking-widest">
            <svg className="h-5 w-5 text-[#29a9eb]" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.248-1.97 9.289c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12l-6.871 4.326-2.962-.924c-.643-.204-.657-.643.136-.953l11.57-4.461c.537-.194 1.006.131.833.932z"/></svg>
            Telegram Uplink
          </h2>
          <div className="space-y-6">
            <button 
              onClick={handleRequestLinkCode} 
              className="w-full py-4 rounded-xl font-black uppercase tracking-widest text-xs transition-all border border-[#29a9eb]/50 text-[#29a9eb] hover:bg-[#29a9eb]/10"
            >
              Generate Protocol Code
            </button>
            
            <div className="pt-2">
              <label className="block text-[10px] font-bold text-finance-muted uppercase tracking-[0.2em] mb-2" htmlFor="link-code">Verification Token</label>
              <input
                id="link-code"
                className="input-field font-mono text-center tracking-widest font-black uppercase"
                value={linkCode}
                onChange={(event) => setLinkCode(event.target.value)}
                placeholder="XXXXX"
              />
            </div>
            
            <button onClick={handleVerifyLinkCode} className="w-full py-4 rounded-xl font-black uppercase tracking-widest text-xs transition-all shadow-lg bg-finance-primary text-white hover:bg-finance-primary/80">
               Confirm Uplink
            </button>

            {botUsername && (
               <div className="p-4 rounded-xl border border-white/10 bg-white/5 mt-4 space-y-3 test-center">
                  <p className="text-[10px] font-bold text-finance-muted uppercase tracking-[0.2em] text-center">Open bot and send code</p>
                  <a 
                    href={botDeepLink} 
                    target="_blank" 
                    rel="noreferrer"
                    className="block w-full py-3 rounded-lg bg-[#29a9eb]/20 text-[#29a9eb] font-bold text-center border border-[#29a9eb]/30 hover:bg-[#29a9eb]/30 transition-colors"
                  >
                     @{botUsername}
                  </a>
               </div>
            )}
          </div>
        </section>

        {/* Recovery / Reset MPIN */}
        <section className="glass-card p-8 border-finance-gold/30 bg-finance-gold/5">
          <h2 className="text-lg font-black text-finance-gold mb-6 flex items-center gap-3 uppercase tracking-widest border-b border-finance-gold/20 pb-4">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
            </svg>
            Authentication Recovery overrides
          </h2>
          <form className="space-y-6" onSubmit={handleResetMpin}>
            <div>
              <label className="block text-[10px] font-bold text-finance-gold/80 uppercase tracking-[0.2em] mb-2" htmlFor="recovery-user">Target Telegram Identity</label>
              <input
                id="recovery-user"
                className="input-field border-finance-gold/30 focus:border-finance-gold focus:ring-finance-gold/20"
                value={recovery.telegram_username}
                onChange={(event) => setRecovery((prev) => ({ ...prev, telegram_username: event.target.value }))}
                placeholder="@username"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button 
                type="button" 
                onClick={handleRequestRecoveryOtp}
                className="py-3 rounded-xl border border-finance-gold/50 text-finance-gold font-black text-[10px] uppercase tracking-widest hover:bg-finance-gold/10 transition-colors"
              >
                Transmit OTP
              </button>
              <button 
                type="button" 
                onClick={handleVerifyRecoveryOtp}
                className="py-3 rounded-xl bg-finance-gold/20 border border-finance-gold/40 text-finance-gold font-black text-[10px] uppercase tracking-widest hover:bg-finance-gold/30 transition-colors"
              >
                Verify Payload
              </button>
            </div>

            <div>
               <label className="block text-[10px] font-bold text-finance-gold/80 uppercase tracking-[0.2em] mb-2" htmlFor="recovery-otp">Decrypted OTP Code</label>
               <input
                 id="recovery-otp"
                 className="input-field border-finance-gold/30 focus:border-finance-gold font-mono tracking-widest text-center"
                 value={recovery.otp_code}
                 onChange={(event) => setRecovery((prev) => ({ ...prev, otp_code: event.target.value }))}
                 required
               />
            </div>

            <div className="pt-2 border-t border-finance-gold/20">
               <label className="block text-[10px] font-bold text-finance-gold/80 uppercase tracking-[0.2em] mb-2 mt-4" htmlFor="recovery-mpin">Replacement MPIN</label>
               <input
                 id="recovery-mpin"
                 type="password"
                 className="input-field border-finance-gold/30 focus:border-finance-gold font-mono tracking-[1em]"
                 value={recovery.mpin}
                 onChange={(event) => setRecovery((prev) => ({ ...prev, mpin: event.target.value }))}
                 maxLength={6}
                 required
               />
            </div>

            <button type="submit" className="w-full py-4 rounded-xl font-black uppercase tracking-widest text-[11px] transition-all bg-finance-gold text-black hover:bg-white shadow-[0_0_15px_rgba(212,168,67,0.3)]">
               Execute Override
            </button>
          </form>
        </section>

      </div>
    </main>
  );
}
