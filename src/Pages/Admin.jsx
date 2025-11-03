// src/Pages/Admin.jsx
import React from "react";
import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import AdminPanel from "../components/AdminPanel";
import "../stylesheets/admin.css"; // <-- import the new CSS file (create it)

export default function Admin() {
  const { user, logout, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div style={{ minHeight: "50vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        Loading...
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;

  if (user.role !== "admin") {
    return (
      <div style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center", color: "red" }}>
        Access Denied: You do not have permission to view this page.
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Navbar />

      {/* spacer equals navbar height so content sits below the fixed header */}
      <div className="admin-nav-spacer" />

      {/* Main admin panel UI (not inside the spacer) */}
      <AdminPanel />
    </div>
  );
}
