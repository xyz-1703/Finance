import { Navigate, Route, Routes } from "react-router-dom";

import TopBar from "./components/TopBar";
import DashboardPage from "./pages/DashboardPage";
import LoginPage from "./pages/LoginPage";

function RequireAuth({ children }) {
  const token = localStorage.getItem("access_token");
  if (!token) {
    return <Navigate to="/" replace />;
  }
  return children;
}

export default function App() {
  const isAuthenticated = Boolean(localStorage.getItem("access_token"));

  return (
    <div className="app-shell">
      <TopBar isAuthenticated={isAuthenticated} />
      <Routes>
        <Route path="/" element={<LoginPage />} />
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
