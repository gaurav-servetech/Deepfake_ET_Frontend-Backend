// src/components/Navbar.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import logo from "../assets/img/logo.png";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const { user, isAuthenticated, isLoading, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Show simple placeholder while auth state resolves to avoid flicker
  // You can change this to a spinner or keep null if you prefer no layout shift.
  const authRight = () => {
    if (isLoading) {
      return <div className="nav-auth-placeholder">...</div>;
    }

    if (!isAuthenticated) {
      // Not logged in -> show Login / Register
      return (
        <div className="nav-auth">
          <Link to="/login" className="nav-link auth-link">Login</Link>
          <Link to="/register" className="nav-link auth-link register">Register</Link>
        </div>
      );
    }

    // Logged in -> show username and Logout
    return (
      <div className="nav-auth">
        <span className="nav-username">{user?.userName || user?.email}</span>
        <button
          onClick={logout}
          className="nav-logout-btn"
          aria-label="Logout"
        >
          Logout
        </button>
      </div>
    );
  };

  return (
    <div id="nav-container" className={scrolled ? "scrolled" : ""}>
      <div id="nav">
        {/* Logo and Tagline */}
        <Link to="/" className="nav-logo-container">
          <img src={logo} className="navbar-logo" alt="Elevate Trust Logo" />
          <p className="tagline">ElevateTrust in digital content</p>
        </Link>

        <nav className="nav-links">
          <Link to="/" className="nav-link">Home</Link>

          {/* Upload/Verify link visible only to normal users */}
          {user?.role === "user" && (
            <Link to="/upload" className="nav-link">Verify Video</Link>
          )}

          {/* Admins get admin dashboard link instead */}
          {user?.role === "admin" && (
            <Link to="/admin" className="nav-link">Admin</Link>
          )}

          <Link to="/documentation" className="nav-link">View Documentation</Link>
        </nav>

        {/* Right side: conditional auth UI */}
        <div className="nav-right">
          {authRight()}
        </div>
      </div>
      <hr className="nav-line" />
    </div>
  );
};

export default Navbar;
