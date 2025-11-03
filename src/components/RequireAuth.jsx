// src/components/RequireAuth.jsx
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function RequireAuth({ children, allowedRoles = ['user','admin'] }) {
  const { isAuthenticated, isLoading, user } = useAuth();
  const location = useLocation();

  if (isLoading) return null; // spinner if you want

  // Not logged in -> go to login
  if (!isAuthenticated) return <Navigate to="/login" replace state={{ from: location }} />;

  // Blocked user -> redirect to blocked page
  if (user?.isBlocked) {
    return <Navigate to="/blocked" replace state={{ blockedUntil: user.blockedUntil }} />;
  }

  // Role allowed?
  if (!allowedRoles.includes(user?.role)) {
    if (user?.role === 'admin') return <Navigate to="/admin" replace />;
    return <Navigate to="/upload" replace />;
  }

  return <>{children}</>;
}
