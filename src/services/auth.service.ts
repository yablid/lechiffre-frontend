// src/services/auth.service.ts

import api from '../api/default';
import {jwtDecode} from 'jwt-decode';
import { IUser } from '../context/AuthProvider';

export const verifyAccessToken = async (): Promise<IUser | null> => {
  const accessToken = sessionStorage.getItem('access_token');
  try {
    const response = await api.get<IUser>('/auth/access-token', {
      headers: { Authorization: `Bearer ${accessToken}` },
      withCredentials: true,
    });
    return response.data;
  } catch {
    return null;
  }
};

export const verifyRefreshToken = async (): Promise<IUser | null> => {
  try {
    const response = await api.post<{ accessToken: string; idToken: string }>(
      `/auth/refresh-token`,
      null,
      { withCredentials: true }
    );
    sessionStorage.setItem('access_token', response.data.accessToken);
    sessionStorage.setItem('id_token', response.data.idToken);

    // Decode both tokens
    const accessTokenData = jwtDecode<IUser>(response.data.accessToken);
    const idTokenData = jwtDecode<IUser>(response.data.idToken);
    return {
      sub: accessTokenData.sub,
      role: accessTokenData.role,
      email: idTokenData.email,
    };
  } catch {
    return null;
  }
};

export const verifyIdToken = async (): Promise<IUser | null> => {
  const idToken = sessionStorage.getItem('id_token');
  if (idToken) {
    return jwtDecode<IUser>(idToken);
  } else {
    try {
      const response = await api.get<{ idToken: string }>('/auth/identify');
      if (response.data && response.data.idToken) {
        sessionStorage.setItem('id_token', response.data.idToken);
        return jwtDecode<IUser>(response.data.idToken);
      }
    } catch {
      return null;
    }
  }
  return null;
};
