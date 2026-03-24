import { Link, useNavigate } from "react-router-dom";

export default function TopBar({ isAuthenticated }) {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    navigate("/");
  };

  return (
    <header className="topbar">
      <div className="brand">QuantVista</div>
      <nav>
        <Link to="/">Home</Link>
        {!isAuthenticated ? <Link to="/login">Login</Link> : null}
        <Link to="/dashboard">Ops</Link>
      </nav>
      {isAuthenticated ? (
        <button className="ghost" onClick={logout}>
          Logout
        </button>
      ) : null}
    </header>
  );
}
