import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../stylesheets/navbar.css";
import "../stylesheets/Login.css";
import "../stylesheets/Footer.css";
// import "../stylesheets/popup.css";
import { FiLogIn } from "react-icons/fi";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";
  const [formData, setFormData] = useState({ email: "", password: "" });
  // const [showResetModal, setShowResetModal] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await login(formData);
      if (res?.success) {
        toast.success(res.message || "Logged in successfully!", {
          position: "top-right",
          autoClose: 2500,
          theme: "colored",
        });
        setTimeout(() => navigate(from, { replace: true }), 2700);
      } else {
        toast.error(res?.message || "Invalid credentials. Try again.", {
          position: "top-right",
          autoClose: 3000,
          theme: "colored",
        });
      }
    } catch (err) {
      toast.error("Something went wrong. Please try again.", {
        position: "top-right",
        autoClose: 3000,
        theme: "colored",
      });
    }
  };

  return (
    <>
      <Navbar />
      <div className="full-page">
        {/* Left Side */}
        <div className="left-side">
          <div className="left-content">
            <h1>Welcome Back 👋</h1>
            <p>
              {" "}
              Log in to continue verifying videos and ensuring{" "}
              <span className="highlight">digital trust</span> with cutting-edge
              AI.
            </p>
          </div>
        </div>
        {/* Right Side */}
        <div className="right-side">
          <div className="login-card">
            <h2>Login</h2>
            <p className="login-sub">Access your account securely</p>
            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <label className="form-label" htmlFor="email">
                  {" "}
                  Email{" "}
                </label>
                <input
                  id="email"
                  className="form-input"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  placeholder="you@example.com"
                  required
                />
              </div>
              <div className="form-row">
                <label className="form-label" htmlFor="password">
                  {" "}
                  Password{" "}
                </label>
                <input
                  id="password"
                  className="form-input"
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  placeholder="Enter your password"
                  required
                />
              </div>

              {/* Forgot Password Link */}
              <div style={{ textAlign: "right", marginBottom: "15px" }}>
                <Link to="/forgot-password" className="help-link">
                  {" "}
                  Forgot password?{" "}
                </Link>
              </div>
              <button className="btn" type="submit">
                <span className="btn-icon">
                  <FiLogIn />
                </span>
                <span>Login</span>
              </button>
            </form>

            <p className="small" style={{ marginTop: 14 }}>
              {" "}
              Don't have an account?{" "}
              <Link className="help-link" to="/register">
                {" "}
                Register{" "}
              </Link>
            </p>
          </div>
        </div>
      </div>
      <Footer />
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnHover
        theme="colored"
      />
    </>
  );
}
