// src/routes/LandingPage.tsx
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import InitAuth from '../components/auth/InitAuth';
import { useAuth } from '../context/AuthProvider';
import Box from '@mui/material/Box';

const LandingPage: React.FC = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user) {
      navigate('/work');
    }
  }, [user, loading, navigate])

  if (loading) {
    return <Box>Loading...</Box>;
  }

  return (
    <Box>
      <InitAuth/>
    </Box>
  );
};

export default LandingPage;
