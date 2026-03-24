import { Navigate, Route, Routes, useLocation } from "react-router-dom";

import TopBar from "./components/TopBar";
import DashboardPage from "./pages/DashboardPage";
import LoginPage from "./pages/LoginPage";
import MarketHomePage from "./pages/market/MarketHomePage";
import StockInsightsPage from "./pages/market/StockInsightsPage";
import HomePage from "./pages/HomePage";
import RegisterPage from "./pages/RegisterPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import VerifyOtpPage from "./pages/VerifyOtpPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";

import PortfolioDetailsPage from "./pages/PortfolioDetailsPage";

function RequireAuth({ children }) {
  const token = localStorage.getItem("access_token");
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

export default function App() {
  const isAuthenticated = Boolean(localStorage.getItem("access_token"));
  const location = useLocation();
  const isAuthPage = ['/', '/login', '/register', '/forgot-password', '/verify-otp', '/reset-password'].includes(location.pathname);

  return (
    <div className={isAuthPage ? "w-full min-h-screen bg-finance-bg text-finance-text" : "app-shell bg-finance-bg min-h-screen text-finance-text"}>
      {!isAuthPage && <TopBar isAuthenticated={isAuthenticated} />}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/market-home" element={<MarketHomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/verify-otp" element={<VerifyOtpPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
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
          path="/portfolio/:id"
          element={
            <RequireAuth>
              <PortfolioDetailsPage />
            </RequireAuth>
          }
        />
      </Routes>
    </div>
  );
}
