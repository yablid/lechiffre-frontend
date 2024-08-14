// src/components/auth/InitAuth.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import api from '../../api/default';
import { generateCodeVerifier, generateCodeChallenge } from "../../utils/pkce";
import { Button, Box } from '@mui/material';

const CLIENT_ID = import.meta.env.VITE_CLIENT_ID
const ALLOWED_REDIRECT_URLS = import.meta.env.VITE_ALLOWED_REDIRECT_URLS

const InitAuth: React.FC = () => {
  const [ isAuthenticating, setIsAuthenticating ] = useState(false);
  const navigate = useNavigate();

  const initiatePKCE = async () => {
    console.log("Initiating PKCE authorization flow...");
    const codeVerifier = generateCodeVerifier();
    const codeChallenge = await generateCodeChallenge(codeVerifier);

    sessionStorage.setItem('code_verifier', codeVerifier);

    const clientId = CLIENT_ID || '1';
    const URL = window.location.origin;
    const redirectUrl = `${URL}/tokens`;

    // verify url
    const allowedRedirectUrls = ALLOWED_REDIRECT_URLS.split(',');
    if (!allowedRedirectUrls.includes(redirectUrl)) {
      throw new Error('Invalid redirect URL');
    }

    // to verify later when auth_code is sent back
    const state = uuidv4();
    sessionStorage.setItem('oauth_state', state);
    console.log("Setting oauth_state: ", state);
    const authUrl = `/auth/authorize`
      + `?client_id=${clientId}`
      + `&redirect_url=${encodeURIComponent(redirectUrl)}`
      + `&code_challenge=${codeChallenge}`
      + `&code_challenge_method=S256`
      + `&oauth_state=${state}`;

    console.log(`InitAuth redirectUrl: ${encodeURIComponent(redirectUrl)}`);

    const response = await api.get(authUrl);
    const redirectPath = response.data.redirectPath;
    navigate(`${redirectPath}`);
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
