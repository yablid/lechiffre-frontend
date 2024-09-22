// src/routes/Work.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthProvider';

import Button from '@mui/material/Button';

const Work: React.FC = () => {

  const navigate = useNavigate();
  const { user } = useAuth();

  if (!user) {
    return <div>loading...</div>;
  }
  // const email = user?.email || '';

  return (
    <div style={{
          padding: '20px',
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-start',
          alignItems: 'flex-start'
    }}>
      <Button onClick={() => navigate('/work/new-project')}
            style={{marginTop: '20px', padding: '10px 20px', cursor: 'pointer'}}>
        Create New Project
      </Button>
      <p>do work stuff here</p>
    </div>
  );
}

export default Work;