import { useState } from "react";

import api from "../api/client";

export default function DashboardPage() {
  const [profile, setProfile] = useState(null);
  const [responseText, setResponseText] = useState("");

  const [mpin, setMpin] = useState("");
  const [otpUsername, setOtpUsername] = useState("");
  const [otpCode, setOtpCode] = useState("");

  const [tradePayload, setTradePayload] = useState({
    portfolio_id: "",
    stock_id: "",
    side: "BUY",
    quantity: "",
    price: "",
    mpin: "",
  });

  const runCall = async (fn) => {
    try {
      const result = await fn();
      setResponseText(JSON.stringify(result.data, null, 2));
    } catch (err) {
      setResponseText(JSON.stringify(err.response?.data || { detail: "Request failed" }, null, 2));
    }
  };

  return (
    <main className="dashboard-grid">
      <section className="card">
        <h2>Account Operations</h2>
        <div className="row">
          <button
            onClick={() =>
              runCall(async () => {
                const res = await api.get("/auth/profile/");
                setProfile(res.data);
                return res;
              })
            }
          >
            Load Profile
          </button>
        </div>
        <div className="row">
          <input value={mpin} onChange={(e) => setMpin(e.target.value)} placeholder="4-6 digit MPIN" />
          <button onClick={() => runCall(() => api.post("/auth/mpin/set/", { mpin }))}>Set MPIN</button>
          <button onClick={() => runCall(() => api.post("/auth/mpin/verify/", { mpin }))}>Verify MPIN</button>
        </div>
        <div className="row">
          <input
            value={otpUsername}
            onChange={(e) => setOtpUsername(e.target.value)}
            placeholder="telegram username"
          />
          <button onClick={() => runCall(() => api.post("/auth/otp/request/", { telegram_username: otpUsername }))}>
            Request OTP
          </button>
        </div>
        <div className="row">
          <input value={otpCode} onChange={(e) => setOtpCode(e.target.value)} placeholder="OTP code" />
          <button
            onClick={() =>
              runCall(() =>
                api.post("/auth/otp/verify/", {
                  telegram_username: otpUsername,
                  otp_code: otpCode,
                })
              )
            }
          >
            Verify OTP
          </button>
        </div>
      </section>

      <section className="card">
        <h2>Trading</h2>
        <div className="form-grid">
          <input
            placeholder="Portfolio ID"
            value={tradePayload.portfolio_id}
            onChange={(e) => setTradePayload({ ...tradePayload, portfolio_id: e.target.value })}
          />
          <input
            placeholder="Stock ID"
            value={tradePayload.stock_id}
            onChange={(e) => setTradePayload({ ...tradePayload, stock_id: e.target.value })}
          />
          <select
            value={tradePayload.side}
            onChange={(e) => setTradePayload({ ...tradePayload, side: e.target.value })}
          >
            <option value="BUY">BUY</option>
            <option value="SELL">SELL</option>
          </select>
          <input
            placeholder="Quantity"
            value={tradePayload.quantity}
            onChange={(e) => setTradePayload({ ...tradePayload, quantity: e.target.value })}
          />
          <input
            placeholder="Price"
            value={tradePayload.price}
            onChange={(e) => setTradePayload({ ...tradePayload, price: e.target.value })}
          />
          <input
            placeholder="MPIN"
            value={tradePayload.mpin}
            onChange={(e) => setTradePayload({ ...tradePayload, mpin: e.target.value })}
          />
          <button
            onClick={() =>
              runCall(() =>
                api.post("/trading/execute/", {
                  ...tradePayload,
                  portfolio_id: Number(tradePayload.portfolio_id),
                  stock_id: Number(tradePayload.stock_id),
                })
              )
            }
          >
            Execute Trade
          </button>
        </div>
      </section>

      <section className="card">
        <h2>ML Ops</h2>
        <div className="row">
          <button
            onClick={() => runCall(() => api.post("/ml/cluster/run/", { symbols: ["AAPL", "MSFT", "GOOGL"], n_clusters: 2 }))}
          >
            Run Clustering
          </button>
          <button
            onClick={() => runCall(() => api.post("/ml/prediction/run/", { symbol: "AAPL", model_type: "linear_regression" }))}
          >
            Run Linear Prediction
          </button>
          <button onClick={() => runCall(() => api.get("/admin/health/"))}>Admin Health</button>
        </div>
      </section>

      <section className="card terminal">
        <h2>API Output</h2>
        <pre>{responseText || "No response yet."}</pre>
        {profile ? <p className="muted">Signed in as {profile.email}</p> : null}
      </section>
    </main>
  );
}
