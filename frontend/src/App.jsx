import { useEffect, useState } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";

import TopBar from "./components/TopBar";
import DashboardPage from "./pages/DashboardPage";

import MarketHomePage from "./pages/market/MarketHomePage";
import StockInsightsPage from "./pages/market/StockInsightsPage";

import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import VerifyOtpPage from "./pages/VerifyOtpPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";

import PortfolioDetailsPage from "./pages/PortfolioDetailsPage";
import AutomatedPortfolioPage from "./pages/AutomatedPortfolioPage";

import PortfolioPage from "./pages/PortfolioPage";
import SettingsPage from "./pages/SettingsPage";
import TradePage from "./pages/TradePage";
import MLPage from "./pages/MLPage";


function RequireAuth({ children }) {
  const token = localStorage.getItem("access_token");
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    Boolean(localStorage.getItem("access_token"))
  );

  const location = useLocation();

  const isAuthPage = [
    "/",
    "/login",
    "/register",
    "/forgot-password",
    "/verify-otp",
    "/reset-password",
  ].includes(location.pathname);

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
    <div className="app-shell bg-finance-bg min-h-screen text-finance-text">
      {!isAuthPage && <TopBar isAuthenticated={isAuthenticated} />}

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />

        <Route path="/market-home" element={<MarketHomePage />} />
        <Route path="/market/:symbol" element={<StockInsightsPage />} />

        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/verify-otp" element={<VerifyOtpPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />

        <Route
          path="/dashboard"
          element={
            <RequireAuth>
              <DashboardPage />
            </RequireAuth>
          }
        />

        <Route
          path="/portfolio/:id"
          element={
            <RequireAuth>
              <PortfolioDetailsPage />
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
          path="/automated"
          element={
            <RequireAuth>
              <AutomatedPortfolioPage />
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
        <Route
          path="/ml"
          element={
            <RequireAuth>
              <MLPage />
            </RequireAuth>
          }
        />
      </Routes>
    </div>
  );
}