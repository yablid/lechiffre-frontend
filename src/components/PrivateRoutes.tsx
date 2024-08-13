// src/components/PrivateRoutes.tsx
import React, { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthProvider';
import api from '../api/default';

const PrivateRoutes: React.FC = () => {
  const { user, logout, refreshToken } = useAuth();
  const [isTokenValid, setIsTokenValid] = useState<boolean | null>(null);

  useEffect(() => {
    const validateAccessToken = async () => {
      console.log("Private route validating access token...")
      const token = sessionStorage.getItem('access_token');
      if (!token) {
        setIsTokenValid(false);
        return;
      }

      try {
        const response = await api.get(`/access-token`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (response.status === 200 && response.data.valid) {
          setIsTokenValid(true);
        } else {
          setIsTokenValid(false);
        }
      } catch (error) {
        console.error('Token validation error:', error);
        setIsTokenValid(false);
      }
    };

    const handleTokenValidation = async () => {
      await validateAccessToken();
      if (isTokenValid === false) {
        try {
          await refreshToken();
          setIsTokenValid(true);
        } catch (error) {
          logout();
          setIsTokenValid(false);
        }
      }
    };

    if (user) {
      handleTokenValidation().catch(console.error);
    } else {
      setIsTokenValid(false);
    }
  }, [user, refreshToken, logout, isTokenValid]);

  if (isTokenValid === null) {
    return <div>Loading...</div>; // or a spinner
  }

  return isTokenValid ? <Outlet /> : <Navigate to="/" />;
};

export default PrivateRoutes;
