import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthProvider';

interface ProtectedRouteProps {
  requiredRole: number;
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ requiredRole, children }) => {
  const { user, loading } = useAuth();

  if (!user) {
    return <Navigate to={`/`} />;
  }
  if (loading) {
    return <div>Loading...</div>; // or a spinner
  }
  if (user.role > requiredRole) {
    return <Navigate to="/unauthorized" />;
  }
  return children;
};

export default ProtectedRoute;
