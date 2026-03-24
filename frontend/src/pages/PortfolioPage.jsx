import { useEffect, useState } from "react";

import api from "../api/client";

export default function PortfolioPage() {
  const [portfolios, setPortfolios] = useState([]);
  const [holdings, setHoldings] = useState([]);
  const [stocks, setStocks] = useState([]);
  const [name, setName] = useState("");
  const [selectedPortfolio, setSelectedPortfolio] = useState("");
  const [selectedStock, setSelectedStock] = useState("");
  const [quantity, setQuantity] = useState("1");
  const [averageBuyPrice, setAverageBuyPrice] = useState("0");
  const [clusterCount, setClusterCount] = useState("3");
  const [clusterResults, setClusterResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const loadData = async () => {
    setLoading(true);
    setError("");
    try {
      const [portfolioResponse, holdingsResponse, stockResponse] = await Promise.all([
        api.get("/portfolio/portfolios/"),
        api.get("/portfolio/holdings/"),
        api.get("/insights/stocks/"),
      ]);
      setPortfolios(portfolioResponse.data || []);
      setHoldings(holdingsResponse.data || []);
      setStocks(stockResponse.data || []);
      if (!selectedPortfolio && portfolioResponse.data?.length) {
        setSelectedPortfolio(String(portfolioResponse.data[0].id));
      }
    } catch (err) {
      setError(err.response?.data?.detail || "Unable to load portfolio data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const createPortfolio = async (event) => {
    event.preventDefault();
    setMessage("");
    setError("");
    if (!name.trim()) {
      setError("Portfolio name is required.");
      return;
    }

    try {
      await api.post("/portfolio/portfolios/", { name: name.trim() });
      setMessage("Portfolio created.");
      setName("");
      loadData();
    } catch (err) {
      setError(err.response?.data?.detail || "Unable to create portfolio.");
    }
  };

  const addHolding = async (event) => {
    event.preventDefault();
    setMessage("");
    setError("");
    if (!selectedPortfolio || !selectedStock) {
      setError("Select a portfolio and stock.");
      return;
    }

    try {
      const stockInfo = stocks.find((item) => String(item.symbol) === String(selectedStock));
      await api.post("/portfolio/holdings/", {
        portfolio: Number(selectedPortfolio),
        stock_symbol_input: selectedStock,
        stock_name_input: stockInfo?.name || selectedStock,
        stock_sector_input: stockInfo?.sector || "Unknown",
        quantity,
        average_buy_price: averageBuyPrice,
      });
      setMessage("Stock added to portfolio.");
      setSelectedStock("");
      loadData();
    } catch (err) {
      setError(err.response?.data?.detail || "Unable to add stock.");
    }
  };

  const removeHolding = async (holdingId) => {
    setMessage("");
    setError("");
    try {
      await api.delete(`/portfolio/holdings/${holdingId}/`);
      setMessage("Stock removed from portfolio.");
      loadData();
    } catch (err) {
      setError(err.response?.data?.detail || "Unable to remove stock.");
    }
  };

  const runClustering = async () => {
    setMessage("");
    setError("");
    if (!selectedPortfolio) {
      setError("Select a portfolio to run clustering.");
      return;
    }
    try {
      const response = await api.post("/ml/portfolio/cluster/run/", {
        portfolio_id: Number(selectedPortfolio),
        n_clusters: Number(clusterCount),
      });
      setClusterResults(response.data || []);
      setMessage("Clustering completed.");
    } catch (err) {
      setError(err.response?.data?.detail || "Clustering failed.");
    }
  };

  const filteredHoldings = holdings.filter(
    (item) => String(item.portfolio) === String(selectedPortfolio)
  );

  return (
    <main className="dashboard-grid">
      <section className="card">
        <h2>Your Portfolios</h2>
        <form onSubmit={createPortfolio} className="stack">
          <label htmlFor="portfolio-name">New Portfolio Name</label>
          <input
            id="portfolio-name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Long Term, Swing, ETFs..."
          />
          <button type="submit">Create Portfolio</button>
        </form>
        {message ? <p>{message}</p> : null}
        {error ? <p className="error">{error}</p> : null}
      </section>

      <section className="card">
        <h2>Manage Holdings</h2>
        <form onSubmit={addHolding} className="stack">
          <label htmlFor="portfolio-select">Portfolio</label>
          <select
            id="portfolio-select"
            value={selectedPortfolio}
            onChange={(event) => setSelectedPortfolio(event.target.value)}
          >
            <option value="">Select portfolio</option>
            {portfolios.map((item) => (
              <option key={item.id} value={item.id}>{item.name}</option>
            ))}
          </select>
          <label htmlFor="stock-select">Stock</label>
          <select
            id="stock-select"
            value={selectedStock}
            onChange={(event) => setSelectedStock(event.target.value)}
          >
            <option value="">Select stock</option>
            {stocks.map((item) => (
              <option key={item.symbol} value={item.symbol}>{item.symbol} - {item.name}</option>
            ))}
          </select>
          <label htmlFor="holding-quantity">Quantity</label>
          <input
            id="holding-quantity"
            value={quantity}
            onChange={(event) => setQuantity(event.target.value)}
          />
          <label htmlFor="holding-price">Average buy price</label>
          <input
            id="holding-price"
            value={averageBuyPrice}
            onChange={(event) => setAverageBuyPrice(event.target.value)}
          />
          <button type="submit">Add Stock</button>
        </form>
      </section>

      <section className="card table-card">
        <h2>Portfolio List</h2>
        {loading ? <p>Loading...</p> : null}
        <table className="stock-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Created</th>
            </tr>
          </thead>
          <tbody>
            {portfolios.map((item) => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.name}</td>
                <td>{new Date(item.created_at).toLocaleString()}</td>
              </tr>
            ))}
            {!portfolios.length ? (
              <tr>
                <td colSpan={3} className="muted">No portfolios found.</td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </section>

      <section className="card table-card portfolio-holdings">
        <h2>Holdings</h2>
        <table className="stock-table">
          <thead>
            <tr>
              <th>Portfolio</th>
              <th>Stock</th>
              <th>Qty</th>
              <th>Avg Buy</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredHoldings.map((item) => (
              <tr key={item.id}>
                <td>{item.portfolio}</td>
                <td>{item.stock_symbol} {item.stock_name ? `- ${item.stock_name}` : ""}</td>
                <td>{item.quantity}</td>
                <td>INR {item.average_buy_price}</td>
                <td>
                  <button className="ghost dark" onClick={() => removeHolding(item.id)}>Remove</button>
                </td>
              </tr>
            ))}
            {!filteredHoldings.length ? (
              <tr>
                <td colSpan={5} className="muted">No holdings found.</td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </section>

      <section className="card table-card portfolio-holdings">
        <h2>Portfolio Clustering (KMeans)</h2>
        <div className="row">
          <input
            type="number"
            min="2"
            max="12"
            value={clusterCount}
            onChange={(event) => setClusterCount(event.target.value)}
            placeholder="Clusters"
          />
          <button onClick={runClustering}>Run Clustering</button>
        </div>
        <table className="stock-table">
          <thead>
            <tr>
              <th>Stock</th>
              <th>Cluster</th>
              <th>PE</th>
              <th>ROE</th>
              <th>Market Cap</th>
            </tr>
          </thead>
          <tbody>
            {clusterResults.map((item) => (
              <tr key={item.id}>
                <td>{item.stock_symbol} {item.stock_name ? `- ${item.stock_name}` : ""}</td>
                <td>{item.cluster_label}</td>
                <td>{item.feature_vector?.pe ?? "-"}</td>
                <td>{item.feature_vector?.roe ?? "-"}</td>
                <td>{item.feature_vector?.market_cap ?? "-"}</td>
              </tr>
            ))}
            {!clusterResults.length ? (
              <tr>
                <td colSpan={5} className="muted">Run clustering to view results.</td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </section>
    </main>
  );
}
