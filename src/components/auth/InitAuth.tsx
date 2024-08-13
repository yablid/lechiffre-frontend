// src/components/auth/InitAuth.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import api from '../../api/default';
import { generateCodeVerifier, generateCodeChallenge } from "../../utils/pkce";
import { Button, Box } from '@mui/material';

const CLIENT_ID = import.meta.env.VITE_CLIENT_ID;

const InitAuth: React.FC = () => {
  const [ isAuthenticating, setIsAuthenticating ] = useState(false);
  const navigate = useNavigate();

  const initiatePKCE = async () => {
    console.log("Initiating PKCE authorization flow...");
    const codeVerifier = generateCodeVerifier();
    const codeChallenge = await generateCodeChallenge(codeVerifier);

    sessionStorage.setItem('code_verifier', codeVerifier);

    const clientId = CLIENT_ID || '1';
    const redirectUri = `${URL}/tokens`;

    // to verify later when auth_code is sent back
    const state = uuidv4();
    sessionStorage.setItem('oauth_state', state);

    // Construct the authorization URL
    const authUrl = `/auth/authorize`
      + `?client_id=${clientId}`
      + `&redirect_uri=${encodeURIComponent(redirectUri)}`
      + `&code_challenge=${codeChallenge}`
      + `&code_challenge_method=S256`
      + `&oauth_state=${state}`;

    const response = await api.get(authUrl);
    const redirectUrl = response.data.redirectUrl;
    navigate(`${redirectUrl}`);
  }

  const handleLoginClick = async () => {
    try {
      await initiatePKCE();
    } catch(error) {
      console.error('Error initializing PKCE authorization:', error);
      setIsAuthenticating(false);
    }
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        bgcolor: 'background.default',
        padding: '2rem',
      }}
    >
      <Button onClick={handleLoginClick}>Login</Button>
      {isAuthenticating && <p>Authenticating...</p>}
    </Box>
  );
};

export default InitAuth;
