import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthProvider';

const PrivateRoutes: React.FC = () => {
  const { user, loading } = useAuth();

  console.log("Protected route. User information: ", user);

  if (loading) {
    return <div>Loading...</div>; // or a spinner
  }

  return user ? <Outlet /> : <Navigate to="/" />;
};

export default PrivateRoutes;
