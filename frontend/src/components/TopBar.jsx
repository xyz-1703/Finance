import { Link, useNavigate } from "react-router-dom";

import api from "../api/client";

export default function TopBar({ isAuthenticated }) {
  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem("current_user") || "null");
  const userInitial = currentUser?.email ? currentUser.email[0].toUpperCase() : "U";

  const logout = async () => {
    const refresh = localStorage.getItem("refresh_token");
    if (refresh) {
      try {
        await api.post("/auth/logout/", { refresh });
      } catch {
        // Ignore logout errors; client cleanup still applies.
      }
    }
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("current_user");
    window.dispatchEvent(new Event("auth-changed"));
    navigate("/");
  };

  return (
    <header className="topbar">
      <Link to="/" className="brand">QuantVista</Link>
      <nav>
        <Link to="/">Home</Link>
        {isAuthenticated ? <Link to="/dashboard">Dashboard</Link> : null}
        {isAuthenticated ? <Link to="/portfolio">Portfolio</Link> : null}
        {isAuthenticated ? <Link to="/trade">Trade</Link> : null}
        {isAuthenticated ? <Link to="/settings">Settings</Link> : null}
        {!isAuthenticated ? <Link to="/login">Login</Link> : null}
        {!isAuthenticated ? <Link to="/register">Register</Link> : null}
      </nav>
      {isAuthenticated ? (
        <div className="profile-actions">
          <button className="profile-chip" onClick={() => navigate("/settings")} aria-label="Profile settings">
            {userInitial}
          </button>
          <button className="ghost" onClick={logout}>
            Logout
          </button>
        </div>
      ) : null}
    </header>
  );
}
