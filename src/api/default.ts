// src/api/axios.ts
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

api.interceptors.request.use(
  (config) => {
    const apiKey = import.meta.env.VITE_API_KEY;
    if (apiKey) {
      config.headers['x-api-key'] = apiKey;
    }

    const accessToken = sessionStorage.getItem('access_token');
    if (accessToken) {
      config.headers['Authorization'] = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => {
    // Handle the request error here
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      error.response?.data?.message === 'AccessTokenExpired'
    ) {
      try {

        const { data } = await axios.post(
          `${import.meta.env.VITE_API_URL}/auth/refresh-token`,
          {},
          { withCredentials: true }
        );
        sessionStorage.setItem('access_token', data.accessToken);
        originalRequest.headers['Authorization'] = `Bearer ${data.accessToken}`;
        return api(originalRequest); // Retry with new token
      } catch (refreshError) {
        console.error('Failed to refresh token:', refreshError);
        window.location.href = '/'; // Or handle this more gracefully
      }
    }
    // If it's not an access token expiration issue, just reject the promise with the error
    return Promise.reject(error);
  }
);

export default api;
