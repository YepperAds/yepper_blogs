// ProtectedRoute.js - New component to guard admin routes
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, needsSetup, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>; // Or your loading component
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin-login" replace />;
  }

  if (needsSetup) {
    return <Navigate to="/admin-setup-credentials" replace />;
  }

  return children;
};

export default ProtectedRoute;