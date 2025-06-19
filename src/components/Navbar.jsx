import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import logo from "../assets/img/logo.png";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
          <Link to="/upload" className="nav-link">Verify Video</Link>
          <Link to="/documentation" className="nav-link">View Documentation</Link>
        </nav>
      </div>
      <hr className="nav-line" />
    </div>
  );
};

export default Navbar;
