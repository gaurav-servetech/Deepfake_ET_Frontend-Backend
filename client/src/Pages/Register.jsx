import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../stylesheets/register.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    userName: "",
    email: "",
    password: "",
  });

  const submit = async (e) => {
    e.preventDefault();

    try {
      const res = await register(formData);

      if (res?.success) {
        toast.success(res.message || "Registered successfully!", {
          position: "top-right",
          autoClose: 2500,
          theme: "colored",
        });
        setTimeout(() => navigate("/login"), 2700);
      } else {
        toast.error(res?.message || "Registration failed!", {
          position: "top-right",
          autoClose: 3000,
          theme: "colored",
        });
      }
    } catch (err) {
      toast.error("Something went wrong! Please try again.", {
        position: "top-right",
        autoClose: 3000,
        theme: "colored",
      });
    }
  };

  return (
    <>
      <Navbar />
      <div className="register-wrapper">
        {/* Left Section */}
        <div className="register-left">
          <div className="register-intro">
            <h1>Join Us Today 🚀</h1>
            <p>
              Create your account and explore a world of smart AI tools and
              secure verification systems — designed for modern creators and
              developers.
            </p>
          </div>
        </div>

        {/* Right Section */}
        <div className="register-right">
          <div className="register-card">
            <h2>Create an Account</h2>
            <p className="register-sub">It’s quick and easy to get started.</p>

            <form onSubmit={submit}>
              <div className="form-row">
                <label className="form-label" htmlFor="userName">
                  Username
                </label>
                <input
                  id="userName"
                  className="form-input"
                  type="text"
                  name="userName"
                  value={formData.userName}
                  onChange={(e) =>
                    setFormData({ ...formData, userName: e.target.value })
                  }
                  placeholder="Enter your username"
                  required
                />
              </div>

              <div className="form-row">
                <label className="form-label" htmlFor="email">
                  Email
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
                  Password
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

              <button className="btn-primary" type="submit">
                Register
              </button>
            </form>

            <div className="form-footer">
              <p>
                Already have an account?{" "}
                <Link to="/login">Login here</Link>
              </p>
            </div>
          </div>
        </div>
      </div>

      <Footer />

      {/* Toastify Container */}
      <ToastContainer
        position="bottom-right"
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
