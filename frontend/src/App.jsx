import { Navigate, Route, Routes } from "react-router-dom";

import TopBar from "./components/TopBar";
import DashboardPage from "./pages/DashboardPage";
import LoginPage from "./pages/LoginPage";
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
  const isAuthenticated = Boolean(localStorage.getItem("access_token"));

  return (
    <div className="app-shell">
      <TopBar isAuthenticated={isAuthenticated} />
      <Routes>
        <Route path="/" element={<MarketHomePage />} />
        <Route path="/login" element={<LoginPage />} />
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
      </Routes>
    </div>
  );
}
