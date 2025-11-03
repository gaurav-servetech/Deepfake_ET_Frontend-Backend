import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link, useLocation } from "react-router-dom";
import CommonForm from "../components/ComonForm/CommonForm";
import "../stylesheets/Login.css";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [msg, setMsg] = useState("");

  const fields = [
    { name: "email", label: "Email", type: "email" },
    { name: "password", label: "Password", type: "password" },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await login(formData);
    if (res.success) {
      navigate(from, { replace: true });
    } else {
      setMsg(res.message || "Login failed");
    }
  };

  return (
    <div className="center-box">
      <div className="login-card">
        <h2>Login</h2>
        <p className="login-sub">Welcome back — sign in to continue</p>
  
        {msg && <div className="msg-error">{msg}</div>}
  
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <label className="form-label" htmlFor="email">Email</label>
            <input id="email" className="form-input" type="email" name="email"
              value={formData.email} onChange={(e)=>setFormData({...formData, email: e.target.value})}
              placeholder="you@example.com" />
          </div>
  
          <div className="form-row">
            <label className="form-label" htmlFor="password">Password</label>
            <input id="password" className="form-input" type="password" name="password"
              value={formData.password} onChange={(e)=>setFormData({...formData, password: e.target.value})}
              placeholder="Enter your password" />
          </div>
  
          <button className="btn" type="submit">Login</button>
        </form>
  
        <div className="form-footer" style={{marginTop: 14}}>
          <p className="small">Don't have an account? <Link className="help-link" to="/register">Register</Link></p>
        </div>
      </div>
    </div>
  );
  
}
