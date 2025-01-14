import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

const PrivateRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();

  // Jika belum login, redirect ke halaman login
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  // Jika sudah login, tampilkan halaman yang diminta
  return children;
};

export default PrivateRoute;
