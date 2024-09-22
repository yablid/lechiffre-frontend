// src/components/auth/LoginForm.tsx
import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import api from '../../api/default';
import {Box, Button, FormControl, InputLabel, TextField, Typography} from '@mui/material';
import * as path from "node:path";

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    // Client-side validation
    if (!email || !password) {
      setErrorMessage('Please enter a username (email) and password.');
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
      const payload = { email, password, auth_request_id: authRequestId };
      console.log("Login form -> auth/login. requestId:", payload.auth_request_id);

      const response = await api.post(`/auth/login`, payload);
      const redirectUrl = new URL(response.data.redirectUrl)
      const redirectPath = redirectUrl.pathname + redirectUrl.search;
      navigate(`${redirectPath}`)
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
          <InputLabel sx={{ color: 'lightblue' }}>Username (Email)</InputLabel>
          <TextField
            className="bg-white"
            variant="outlined"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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