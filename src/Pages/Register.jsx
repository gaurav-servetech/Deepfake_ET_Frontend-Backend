import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import CommonForm from "../components/ComonForm/CommonForm";
import "../stylesheets/register.css"

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  // msg will be either null or an object: { type: 'success'|'error', text: '...' }
  const [formData, setFormData] = useState({ userName: "", email: "", password: "" });
  const [msg, setMsg] = useState(null);

  const fields = [
    { name: "userName", label: "User name" },
    { name: "email", label: "Email", type: "email" },
    { name: "password", label: "Password", type: "password" }
  ];

  const submit = async (e) => {
    e.preventDefault();
    setMsg(null);

    const res = await register(formData); // res from API: { success: boolean, message: string }
    if (res?.success) {
      setMsg({ type: "success", text: res.message || "Registered successfully" });
      setTimeout(() => navigate("/login"), 700);
    } else {
      setMsg({ type: "error", text: res?.message || "Registration failed" });
    }
  };

  return (
    <div className="center-box">
      <div className="login-card">
        <h2>Login</h2>
        <p className="login-sub">Welcome back — sign in to continue</p>
  
        {msg && <div className="msg-error">{msg}</div>}
  
        <form onSubmit={submit}>
          <div className="form-row">
            <label className="form-label" htmlFor="email">UserName</label>
            <input id="userName" className="form-input" type="userName" name="userName"
              value={formData.userName} onChange={(e)=>setFormData({...formData, userName: e.target.value})}
              placeholder="you@example.com" />
          </div>
  
          <div className="form-row">
            <label className="form-label" htmlFor="password">Email</label>
            <input id="email" className="form-input" type="email" name="email"
              value={formData.email} onChange={(e)=>setFormData({...formData, email: e.target.value})}
              placeholder="Enter your password" />
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
          <p className="small">Don't have an account? <Link className="help-link" to="/login">Login</Link></p>
        </div>
      </div>
    </div>
  );
}
