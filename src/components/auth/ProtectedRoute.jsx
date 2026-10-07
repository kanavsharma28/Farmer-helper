import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function ProtectedRoute({ allowedRoles, children }) {
  const { user, isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (allowedRoles && allowedRoles.length > 0) {
    const isAllowed = allowedRoles.includes(user.role);
    if (!isAllowed) {
      // User is authenticated but does not have permission for this role-specific route
      if (user.role === 'admin') {
        return <Navigate to="/admin/dashboard" replace />;
      }
      // Normal users attempting to access admin routes or unauthorized routes
      return <Navigate to="/dashboard" replace />;
    }
  }

  return children;
}
