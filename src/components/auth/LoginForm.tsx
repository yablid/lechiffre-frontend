// src/components/auth/LoginForm.tsx
import React, { useState } from 'react';
import api from '../../api/default';
import { TextField, Typography, Button, FormControl, InputLabel, Box } from '@mui/material';

const LoginForm: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    // Client-side validation
    if (!username || !password) {
      setErrorMessage('Please enter a username and password.');
      return;
    }

    // Extract the auth_request_id from the URL
    const urlParams = new URLSearchParams(window.location.search);
    const authRequestId = urlParams.get('auth_request_id');

    if (!authRequestId) {
      throw new Error('Authorization request ID not found in URL.');
    }

    try {
      // Send the username, password, and auth_request_id to the backend
      const payload = { username, password, auth_request_id: authRequestId };
      console.log("Sending request to auth/login. Username and requestId:", payload.auth_request_id);
      await api.post(`/auth/login`, payload);
    } catch (error) {
      console.error('Error logging in: ', error);
      setErrorMessage('Invalid username or password.');
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '2rem',
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{ maxWidth: '400px', width: '60%' }}
      >
        <FormControl fullWidth variant="outlined" sx={{ marginBottom: '1rem' }}>
          <InputLabel sx={{ color: 'lightblue' }}>Username</InputLabel>
          <TextField
            className="bg-white"
            variant="outlined"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            fullWidth
            margin="normal"
          />
        </FormControl>
        <FormControl fullWidth variant="outlined" sx={{ marginBottom: '1.5rem' }}>
          <InputLabel sx={{ color: 'lightblue' }}>Password</InputLabel>
          <TextField
            className="bg-white"
            variant="outlined"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
            margin="normal"
          />
        </FormControl>
        {errorMessage && (
          <Typography color="error" sx={{ marginBottom: '1rem' }}>
            {errorMessage}
          </Typography>
        )}
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <Button variant="contained" color="primary" type="submit">Submit</Button>
        </Box>
      </form>
    </Box>
  );
};

export default LoginForm;