import { useEffect, useMemo, useState } from "react";

import api from "../api/client";

export default function TradePage() {
  const [portfolios, setPortfolios] = useState([]);
  const [stocks, setStocks] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    portfolio_id: "",
    stock_id: "",
    side: "BUY",
    quantity: "1",
    price: "",
  });

  const [mpinOpen, setMpinOpen] = useState(false);
  const [mpin, setMpin] = useState("");

  const selectedStock = useMemo(() => {
    return stocks.find((item) => String(item.id) === String(form.stock_id));
  }, [stocks, form.stock_id]);

  const loadData = async () => {
    setLoading(true);
    setError("");
    try {
      const [portfolioResponse, stockResponse, transactionResponse] = await Promise.all([
        api.get("/portfolio/portfolios/"),
        api.get("/stocks/stocks/"),
        api.get("/trading/transactions/"),
      ]);

      setPortfolios(portfolioResponse.data || []);
      setStocks(stockResponse.data || []);
      setTransactions(transactionResponse.data || []);
    } catch (err) {
      setError(err.response?.data?.detail || "Unable to load trade resources.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (selectedStock && !form.price) {
      setForm((prev) => ({ ...prev, price: "1" }));
    }
  }, [selectedStock, form.price]);

  const openMpinStep = (event) => {
    event.preventDefault();
    setMessage("");
    setError("");
    setMpin("");

    if (!form.portfolio_id || !form.stock_id || !form.quantity || !form.price) {
      setError("Portfolio, stock, quantity, and price are required.");
      return;
    }

    setMpinOpen(true);
  };

  const submitTrade = async (event) => {
    event.preventDefault();
    setMessage("");
    setError("");

    try {
      await api.post("/trading/execute/", {
        portfolio_id: Number(form.portfolio_id),
        stock_id: Number(form.stock_id),
        side: form.side,
        quantity: form.quantity,
        price: form.price,
        mpin,
      });

      setMessage("Trade executed successfully.");
      setMpinOpen(false);
      setMpin("");
      loadData();
    } catch (err) {
      setError(err.response?.data?.detail || "Trade execution failed.");
    }
  };

  return (
    <main className="dashboard-grid">
      <section className="card">
        <h2>Trade Ticket</h2>
        <form className="stack" onSubmit={openMpinStep}>
          <label htmlFor="trade-portfolio">Portfolio</label>
          <select
            id="trade-portfolio"
            value={form.portfolio_id}
            onChange={(event) => setForm((prev) => ({ ...prev, portfolio_id: event.target.value }))}
          >
            <option value="">Select portfolio</option>
            {portfolios.map((item) => (
              <option key={item.id} value={item.id}>{item.name}</option>
            ))}
          </select>

          <label htmlFor="trade-stock">Stock</label>
          <select
            id="trade-stock"
            value={form.stock_id}
            onChange={(event) => setForm((prev) => ({ ...prev, stock_id: event.target.value }))}
          >
            <option value="">Select stock</option>
            {stocks.map((item) => (
              <option key={item.id} value={item.id}>{item.symbol} - {item.name}</option>
            ))}
          </select>

          <label htmlFor="trade-side">Side</label>
          <select
            id="trade-side"
            value={form.side}
            onChange={(event) => setForm((prev) => ({ ...prev, side: event.target.value }))}
          >
            <option value="BUY">BUY</option>
            <option value="SELL">SELL</option>
          </select>

          <label htmlFor="trade-quantity">Quantity</label>
          <input
            id="trade-quantity"
            value={form.quantity}
            onChange={(event) => setForm((prev) => ({ ...prev, quantity: event.target.value }))}
          />

          <label htmlFor="trade-price">Price (INR)</label>
          <input
            id="trade-price"
            value={form.price}
            onChange={(event) => setForm((prev) => ({ ...prev, price: event.target.value }))}
          />

          <button type="submit">Continue to MPIN</button>
        </form>
        {message ? <p>{message}</p> : null}
        {error ? <p className="error">{error}</p> : null}
      </section>

      <section className="card table-card">
        <h2>Recent Transactions</h2>
        {loading ? <p>Loading...</p> : null}
        <table className="stock-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Portfolio</th>
              <th>Stock</th>
              <th>Side</th>
              <th>Qty</th>
              <th>Price</th>
              <th>When</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((item) => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.portfolio}</td>
                <td>{item.stock}</td>
                <td>{item.side}</td>
                <td>{item.quantity}</td>
                <td>INR {item.price}</td>
                <td>{new Date(item.created_at).toLocaleString()}</td>
              </tr>
            ))}
            {!transactions.length ? (
              <tr>
                <td colSpan={7} className="muted">No transactions available.</td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </section>

      {mpinOpen ? (
        <section className="modal-backdrop" role="dialog" aria-modal="true">
          <form className="card modal-card" onSubmit={submitTrade}>
            <h3>Confirm With MPIN</h3>
            <p className="muted">Enter your MPIN to authorize this transaction.</p>
            <input
              type="password"
              value={mpin}
              onChange={(event) => setMpin(event.target.value)}
              placeholder="4-6 digit MPIN"
              required
            />
            <div className="row">
              <button type="submit">Execute Trade</button>
              <button type="button" className="ghost dark" onClick={() => setMpinOpen(false)}>Cancel</button>
            </div>
          </form>
        </section>
      ) : null}
    </main>
  );
}
