// src/context/AuthProvider.tsx
import React, { createContext, useState, useEffect, useCallback, useContext, ReactNode } from 'react';
import api from '../api/default';
import { jwtDecode } from 'jwt-decode';
import { verifyAccessToken, verifyRefreshToken, verifyIdToken } from "../services/auth.service";

interface IAuthContext {
  user: IUser | null;
  loading: boolean;
  login: (accessToken: string, idToken: string) => void;
  logout: () => void;
}

export interface IUser {
  sub?: string,
  role: number;
  email?: string;
}

const AuthContext = createContext<IAuthContext | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<IUser | null>(null);
  const [loading, setLoading] = useState(true);

  console.log("AuthProvider user information: ", user);

  const initAuth = useCallback(async () => {
    setLoading(true);

    let currentUser = await verifyAccessToken();
    if (!currentUser) {
      currentUser = await verifyRefreshToken();
      setUser(currentUser);
      setLoading(false);
      return;
    } else {
      const idUser = await verifyIdToken();
      if (idUser) {
        setUser({ ...currentUser, ...idUser });
      } else {
        setUser(currentUser);
      }
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    initAuth().catch(console.error);
  }, [initAuth]);

  const login = (accessToken: string, idToken: string) => {
    sessionStorage.setItem('access_token', accessToken);
    sessionStorage.setItem('id_token', idToken);
    const decodedToken = jwtDecode<IUser>(idToken);
    setUser(decodedToken);
    console.log("AuthProvider login set user: ", decodedToken);
  };

  const logout = () => {
    setUser(null);
    delete api.defaults.headers.common['Authorization'];
    sessionStorage.removeItem('access_token');
    sessionStorage.removeItem('id_token');
    document.cookie = "refresh_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
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
