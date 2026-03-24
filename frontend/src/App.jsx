import { useEffect, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";

import TopBar from "./components/TopBar";
import DashboardPage from "./pages/DashboardPage";
import LoginPage from "./pages/LoginPage";
import PortfolioPage from "./pages/PortfolioPage";
import SettingsPage from "./pages/SettingsPage";
import TradePage from "./pages/TradePage";
import MarketHomePage from "./pages/market/MarketHomePage";
import StockInsightsPage from "./pages/market/StockInsightsPage";

function RequireAuth({ children }) {
  const token = localStorage.getItem("access_token");
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(Boolean(localStorage.getItem("access_token")));

  useEffect(() => {
    const syncAuth = () => {
      setIsAuthenticated(Boolean(localStorage.getItem("access_token")));
    };

    window.addEventListener("storage", syncAuth);
    window.addEventListener("auth-changed", syncAuth);
    return () => {
      window.removeEventListener("storage", syncAuth);
      window.removeEventListener("auth-changed", syncAuth);
    };
  }, []);

  return (
    <div className="app-shell">
      <TopBar isAuthenticated={isAuthenticated} />
      <Routes>
        <Route path="/" element={<MarketHomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<LoginPage mode="register" />} />
        <Route
          path="/market"
          element={<Navigate to="/" replace />}
        />
        <Route
          path="/market/:symbol"
          element={<StockInsightsPage />}
        />
        <Route
          path="/dashboard"
          element={
            <RequireAuth>
              <DashboardPage />
            </RequireAuth>
          }
        />
        <Route
          path="/portfolio"
          element={
            <RequireAuth>
              <PortfolioPage />
            </RequireAuth>
          }
        />
        <Route
          path="/trade"
          element={
            <RequireAuth>
              <TradePage />
            </RequireAuth>
          }
        />
        <Route
          path="/settings"
          element={
            <RequireAuth>
              <SettingsPage />
            </RequireAuth>
          }
        />
      </Routes>
    </div>
  );
}
