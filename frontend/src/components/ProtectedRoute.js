import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = ({ children, requireAuth = true, allowedRoles = [] }) => {
  const { isAuthenticated, user } = useAuth();

  // If authentication is not required, render children
  if (!requireAuth) {
    return children;
  }

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // If specific roles are required, check if user has the required role
  if (allowedRoles.length > 0 && user && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  // If all checks pass, render children
  return children;
};

export default ProtectedRoute; 