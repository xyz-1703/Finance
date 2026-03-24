import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import api from "../../api/client";

export default function MarketHomePage() {
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [sector, setSector] = useState("All");

  const loadStocks = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await api.get("/insights/stocks/");
      setStocks(response.data || []);
    } catch (err) {
      setError(err.response?.data?.detail || "Unable to load Indian stocks.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStocks();
  }, []);

  const sectors = useMemo(() => {
    const all = new Set(stocks.map((item) => item.sector || "Unknown"));
    return ["All", ...Array.from(all).sort()];
  }, [stocks]);

  const filteredStocks = useMemo(() => {
    return stocks.filter((item) => {
      const matchQuery = `${item.symbol} ${item.name}`.toLowerCase().includes(query.toLowerCase());
      const matchSector = sector === "All" || item.sector === sector;
      return matchQuery && matchSector;
    });
  }, [query, sector, stocks]);

  const executeTrade = async (symbol, side) => {
    const quantity = window.prompt(`Enter quantity for ${side} (${symbol})`, "1");
    if (!quantity) return;
    const mpin = window.prompt("Enter MPIN");
    if (!mpin) return;

    try {
      await api.post("/insights/trade/", { symbol, side, quantity, mpin });
      window.alert(`${side} order placed for ${symbol}`);
    } catch (err) {
      window.alert(err.response?.data?.detail || "Order failed.");
    }
  };

  return (
    <main className="market-shell">
      <section className="market-head card">
        <div>
          <p className="kicker">Indian equities only</p>
          <h1>NSE Screener</h1>
          <p>Live watchlist powered by yfinance. Click a stock for trend, statistics, and FinBERT sentiment.</p>
        </div>
        <div className="market-actions">
          <input
            type="text"
            placeholder="Search symbol or company"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button onClick={loadStocks} disabled={loading}>{loading ? "Refreshing..." : "Refresh"}</button>
        </div>
      </section>

      <section className="card chip-row">
        {sectors.map((item) => (
          <button
            key={item}
            className={item === sector ? "chip active" : "chip"}
            onClick={() => setSector(item)}
          >
            {item}
          </button>
        ))}
      </section>

      <section className="card table-card">
        {error ? <p className="error">{error}</p> : null}
        <table className="stock-table">
          <thead>
            <tr>
              <th>Company</th>
              <th>Symbol</th>
              <th>Market Price</th>
              <th>1D Change</th>
              <th>Volume</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredStocks.map((item) => (
              <tr key={item.symbol}>
                <td>
                  <Link to={`/market/${item.symbol}`}>{item.name}</Link>
                  <div className="muted">{item.sector}</div>
                </td>
                <td>{item.symbol}</td>
                <td>INR {item.market_price}</td>
                <td className={item.day_change >= 0 ? "up" : "down"}>
                  {item.day_change >= 0 ? "+" : ""}{item.day_change} ({item.day_change_pct}%)
                </td>
                <td>{item.volume.toLocaleString()}</td>
                <td>
                  <div className="row">
                    <button className="buy" onClick={() => executeTrade(item.symbol, "BUY")}>Buy</button>
                    <button className="sell" onClick={() => executeTrade(item.symbol, "SELL")}>Sell</button>
                  </div>
                </td>
              </tr>
            ))}
            {!filteredStocks.length ? (
              <tr>
                <td colSpan={6} className="muted">No stocks loaded yet. Click refresh.</td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </section>
    </main>
  );
}
