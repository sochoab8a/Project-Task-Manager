import axios from 'axios';
import { getToken, refreshToken, clearToken } from './authService';

const instance = axios.create({
  baseURL: 'http://127.0.0.1:8000/api',
});

let isRefreshing = false;

instance.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

instance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return Promise.reject(error);
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const newToken = await refreshToken();
        axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
        originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
        isRefreshing = false;
        return instance(originalRequest);
      } catch (refreshError) {
        clearToken();
        window.location.href = '/auth/login'; // Redirigir a la página de login
        isRefreshing = false;
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default instance;