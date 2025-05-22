import React from "react";
import { Link } from "react-router-dom";
import logo from "../assets/img/logo.png";

const Navbar = () => (
  <div id="nav-container">
    <div id="nav">
      {/* Logo and Tagline */}
      <Link to="/" className="nav-logo-container">
        <img src={logo} className="navbar-logo" alt="Elevate Trust Logo" />
        <p className="tagline">ElevateTrust in digital content</p>
      </Link>

      {/* API Button */}
      <div className="documentation-button">
        <Link to="/documentation" className="documentation-container">
          <button className="documentation-button">API</button>
        </Link>
      </div>
    </div>
    <hr className="nav-line" />
  </div>
);

export default Navbar;
