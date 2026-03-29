import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import ProtectedRoute from './components/common/ProtectedRoute';
import Chatbot from './components/common/Chatbot';

import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import HomePage from './pages/HomePage';
import DashboardPage from './pages/DashboardPage';
import PortfolioPage from './pages/PortfolioPage';
import PortfolioDetailPage from './pages/PortfolioDetailPage';
import StockDetailPage from './pages/StockDetailPage';
import AnalysisPage from './pages/AnalysisPage';
import QualityPage from './pages/QualityPage';
import SettingsPage from './pages/SettingsPage';

const App = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <div className="min-h-screen bg-main-bg text-main-text flex flex-col font-sans transition-colors duration-300">
            <Navbar />
            <main className="flex-grow w-full">
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                <Route path="/stock/:symbol" element={<StockDetailPage />} />
                <Route path="/analysis" element={<AnalysisPage />} />
                <Route path="/quality" element={<QualityPage />} />
                
                {/* Protected Routes */}
                <Route path="/dashboard" element={
                  <ProtectedRoute>
                    <DashboardPage />
                  </ProtectedRoute>
                } />
                <Route path="/profile" element={
                  <ProtectedRoute>
                    <SettingsPage />
                  </ProtectedRoute>
                } />
                <Route path="/portfolios" element={
                  <ProtectedRoute>
                    <PortfolioPage />
                  </ProtectedRoute>
                } />
                <Route path="/portfolios/:id" element={
                  <ProtectedRoute>
                    <PortfolioDetailPage />
                  </ProtectedRoute>
                } />
              </Routes>
            </main>
            
            <Chatbot />
            <Footer />
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
