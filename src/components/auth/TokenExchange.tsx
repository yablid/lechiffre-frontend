import React, { useEffect, useState } from 'react';
import api from '../../api/default';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthProvider';

const TokenExchange: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const exchangeToken = async () => {

      console.log("TokenExchange exchanging tokens...")
      // Extract the authorization code from the URL
      const urlParams = new URLSearchParams(window.location.search);
      const oauth_state = urlParams.get('oauth_state');
      const original_oauth_state = sessionStorage.get('oauth_state');
      if (oauth_state !== original_oauth_state) {
        throw new Error('Invalid state parameter.');
      }
      console.log("Oauth state matches, continuing...")

      const authorizationCode = urlParams.get('code');
      const codeVerifier = sessionStorage.getItem('code_verifier');

      if (!authorizationCode || !codeVerifier) {
        throw new Error('Missing authorization code or code verifier.');
      }

      try {
        const response = await api.post<{accessToken: string, idToken: string}>(
      `/auth/exchange-tokens`,
      {
            code: authorizationCode,
            code_verifier: codeVerifier,
          }
        );

        // Store tokens and user info in context
        login(response.data.accessToken, response.data.idToken);
        navigate('/work'); // Redirect to the protected page after successful token exchange
      } catch (error) {
        console.error('Error exchanging tokens:', error);
        navigate('/');
      } finally {
        setLoading(false);
      }
    };

    exchangeToken().catch(console.error);
  }, [navigate, login]);

  return (
    <div>
      {loading ? <p>Authenticating...</p> : null}
    </div>
  );
};

export default TokenExchange;
