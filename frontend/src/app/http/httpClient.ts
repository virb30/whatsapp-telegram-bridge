import axios, { type InternalAxiosRequestConfig } from 'axios';
import { useAuthStore } from '../store/auth.store';

const baseURL =
  (typeof import.meta !== 'undefined' &&
    (import.meta as any).env?.VITE_API_URL) ||
  '/';
export const http = axios.create({ baseURL });

http.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token =
    useAuthStore.getState().token ?? localStorage.getItem('auth_token');
  if (token) {
    if (!config.headers) {
      // Axios garante headers, mas deixamos defensivo
      (config as any).headers = {};
    }
    const headersAny = config.headers as any;
    if (typeof headersAny.set === 'function') {
      headersAny.set('Authorization', `Bearer ${token}`);
    } else {
      (config.headers as Record<string, string>)['Authorization'] =
        `Bearer ${token}`;
    }
  }
  return config;
});

http.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error?.response?.status === 401) {
      useAuthStore.getState().logout();
    }
    return Promise.reject(error);
  },
);
