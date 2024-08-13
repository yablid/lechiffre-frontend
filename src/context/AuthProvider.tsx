// src/context/AuthProvider.tsx
import React, { createContext, useState, useEffect, useCallback, useContext, ReactNode } from 'react';
import api from '../api/default';
import { jwtDecode } from 'jwt-decode';

interface IAuthContext {
  user: IUser | null;
  loading: boolean;
  validateTokens: () => Promise<boolean>;
  login: (accessToken: string, idToken: string) => void;
  logout: () => void;
  refreshToken: () => Promise<boolean>;
}

export interface IUser {
  sub: string,
  username: string;
}

const AuthContext = createContext<IAuthContext | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<IUser | null>(null);
  const [loading, setLoading] = useState(true);

  const verifyAccessToken = async (): Promise<boolean> => {
    console.log("AuthProvider verifying access token...");

    const accessToken = sessionStorage.getItem('access_token');
    if (!accessToken) return false;

    try {
      const response = await api.get<{ valid: boolean }>(
        '/auth/access-token',
        {
          headers: {Authorization: `Bearer ${accessToken}`},
          withCredentials: true
        }
      );
      console.log("AuthProvider received response: ", response.data);
      return response.data.valid;
    } catch (error) {
      console.error('AuthProvider: access token invalid:', error);
      return false;
    }
  };

  const identify = async (): Promise<boolean> => {
    const idToken = sessionStorage.getItem('id_token');
    if (idToken) {
      console.log("idToken found, setting user data in context.")
      try {
        const decoded = jwtDecode<IUser>(idToken);
        setUser({
          sub: decoded.sub,
          username: decoded.username,
        });
        return true;
      } catch (error) {
        console.error('Invalid id_token:', error);
        return false;
      }
    }

    try {
      console.log("No idToken found, calling api.")
      const idResponse = await api.get<{ idToken: string }>('/auth/identify');
      if (idResponse.data && idResponse.data.idToken) {
        sessionStorage.setItem('id_token', idResponse.data.idToken);
        const decoded = jwtDecode<IUser>(idResponse.data.idToken);
        setUser({
          sub: decoded.sub,
          username: decoded.username,
        });
        return true;
      } else {
        console.error('Unable to identify user');
        return false;
      }
    } catch (error) {
      console.error('Unable to identify user', error);
      return false;
    }
  };

  const refreshToken = async (): Promise<boolean> => {
    try {
      const response = await api.post<{ accessToken: string, idToken: string }>(
        `/auth/refresh-token`,
        null,
        { withCredentials: true }
      );

      console.log("AuthProvider refreshToken received data: ", response.data);
      sessionStorage.setItem('access_token', response.data.accessToken);
      sessionStorage.setItem('id_token', response.data.idToken);

      const decodedToken = jwtDecode<IUser>(response.data.idToken);
      const user: IUser = {
        sub: decodedToken.sub,
        username: decodedToken.username,
      };
      setUser(user);
      return true;
    } catch {
      console.error('Invalid, expired, or missing refresh token');
      setUser(null);
      return false;
    }
  };

  const validateTokens = useCallback(async (): Promise<boolean> => {
    console.log("AuthProvider checking for credentials...")
    if (await verifyAccessToken()) {
      console.log("Valid access token.")
      if (await identify()) {
        console.log("Identified user.")
        setLoading(false);
        return true;
      }
    }
    console.log("No valid access token. Checking refresh token.")
    if (await refreshToken()) {
      console.log("Valid refreshToken found.")
      setLoading(false);
      return true;
    }
    console.log("No valid refresh token.")
    setLoading(false);
    return false;
  }, []);

  useEffect(() => {
    const auth = async () => {
      const authorized = await validateTokens();
      if (authorized) {
        window.location.href  = '.work';
      }
    }
    auth().catch(console.error);
  }, [validateTokens]);

  const login = (accessToken: string, idToken: string) => {
    sessionStorage.setItem('access_token', accessToken);
    sessionStorage.setItem('id_token', idToken);
    console.log("AuthProvider login set access and id tokens");

    const decodedToken = jwtDecode<IUser>(idToken);
    const user: IUser = {
      sub: decodedToken.sub,
      username: decodedToken.username,
    };
    setUser(user);
    console.log("AuthProvider login set user: ", user);
  };

  const logout = () => {
    setUser(null);
    delete api.defaults.headers.common['Authorization'];
    sessionStorage.removeItem('access_token');
    sessionStorage.removeItem('id_token');
    document.cookie = "refresh_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  };

  return (
    <AuthContext.Provider value={{ user, loading, validateTokens, login, logout, refreshToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
