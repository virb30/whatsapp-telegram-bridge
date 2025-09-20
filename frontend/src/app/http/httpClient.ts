import axios from 'axios';
import { useAuthStore } from '../store/auth.store';

export const http = axios.create({});

http.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token ?? localStorage.getItem('auth_token');
  if (token) {
    config.headers = config.headers ?? {};
    (config.headers as any)['Authorization'] = `Bearer ${token}`;
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


