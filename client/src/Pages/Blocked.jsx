// src/Pages/Blocked.jsx
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function Blocked() {
  const location = useLocation();
  const navigate = useNavigate();

  // Prefer state from navigation; fallback to some generic text
  const message = location.state?.message || "Your account has been blocked.";
  const blockedUntil = location.state?.blockedUntil || null;

  return (
    <div style={{ minHeight: "70vh", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", padding: 20 }}>
      <h2 style={{ color: "#ef4444" }}>Account blocked</h2>
      <p style={{ maxWidth: 680, textAlign: "center" }}>{message}</p>
      {blockedUntil ? <p>Blocked until: <strong>{new Date(blockedUntil).toLocaleString()}</strong></p> : <p>This block is indefinite.</p>}
      <div style={{ marginTop: 12, display: "flex", gap: 12 }}>
        <button onClick={() => navigate("/login")} style={{ padding: "8px 12px", background: "#3b82f6", color: "#fff", border: "none", borderRadius: 8 }}>Back to Login</button>
        <button onClick={() => navigate("/")} style={{ padding: "8px 12px", background: "#3b82f6", color: "#fff", border: "none", borderRadius: 8 }}>Back to Home</button>
      </div>
    </div>
  );
}
