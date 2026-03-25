import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import api from "../../api/client";

export default function StockInsightsPage() {
  const { symbol } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchDetail = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await api.get(`/insights/stocks/${symbol}/`);
        setData(response.data);
      } catch (err) {
        setError(err.response?.data?.detail || "Unable to load stock insights.");
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [symbol]);

  if (loading) return <main className="card">Loading analytics...</main>;
  if (error) return <main className="card error">{error}</main>;
  if (!data) return null;



  const isInr = (data.currency || "").toUpperCase() === "INR";
  const priceFormatter = (value) => {
    const num = Number(value || 0);
    if (isInr) return `\u20B9${num.toLocaleString("en-IN", { maximumFractionDigits: 2 })}`;
    return `${(data.currency || "").toUpperCase()} ${num.toLocaleString("en-US", { maximumFractionDigits: 2 })}`;
  };

  const volumeFormatter = (value) => Number(value || 0).toLocaleString("en-IN");

  const trendTooltipFormatter = (value, name) => {
    if (name === "close" || name === "open") {
      return [priceFormatter(value), name.toUpperCase()];
    }
    return [value, name];
  };

  const volumeTooltipFormatter = (value, name) => [volumeFormatter(value), String(name).toUpperCase()];


  return (
    <main className="insight-shell">
      <section className="card insight-head">
        <button className="ghost dark" onClick={() => navigate("/market")}>Back to Screener</button>
        <h1>{data.name}</h1>
        <p>{data.symbol} | {data.sector} | {data.currency}</p>
      </section>

      <section className="stats-grid">

        <article className="card"><h3>Market Price</h3><p>INR {data.market_price}</p></article>

        <article className="card"><h3>Market Price</h3><p>{priceFormatter(data.market_price)}</p></article>

        <article className="card"><h3>P/E Ratio</h3><p>{data.fundamentals.pe_ratio}</p></article>
        <article className="card"><h3>ROE</h3><p>{data.fundamentals.roe}</p></article>
        <article className="card"><h3>6M Return</h3><p>{data.statistics.six_month_return_pct}%</p></article>
        <article className="card"><h3>Volatility</h3><p>{data.statistics.annualized_volatility_pct}%</p></article>
        <article className="card"><h3>RSI (14)</h3><p>{data.statistics.rsi_14}</p></article>
      </section>

      <section className="card">
        <h2>Trend Chart</h2>
        <div className="chart-wrap">
          <ResponsiveContainer width="100%" height={360}>
            <LineChart data={data.trend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" minTickGap={28} />

              <YAxis />
              <Tooltip />

              <YAxis tickFormatter={priceFormatter} />
              <Tooltip formatter={trendTooltipFormatter} />

              <Legend />
              <Line type="monotone" dataKey="close" stroke="#00a77f" dot={false} strokeWidth={2} />
              <Line type="monotone" dataKey="open" stroke="#335d8c" dot={false} strokeWidth={1.5} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className="card">
        <h2>Volume Profile</h2>
        <div className="chart-wrap">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={data.trend.slice(-40)}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" minTickGap={22} />

              <YAxis />
              <Tooltip />

              <YAxis tickFormatter={volumeFormatter} />
              <Tooltip formatter={volumeTooltipFormatter} />

              <Bar dataKey="volume" fill="#4a7eb8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className="card sentiment-card">
        <h2>Sentiment (FinBERT)</h2>
        <p>
          Overall sentiment: <strong>{data.sentiment.label.toUpperCase()}</strong> (score: {data.sentiment.score})
        </p>
        <h3>News Headlines</h3>
        <ul>
          {data.headlines.map((headline) => (
            <li key={headline}>{headline}</li>
          ))}
        </ul>
      </section>
    </main>
  );
}
