import { create } from 'zustand';
import { http } from '../http/httpClient';

export type AuthUser = {
  id: string;
  email: string;
};

export type AuthState = {
  isAuthenticated: boolean;
  token: string | null;
  user: AuthUser | null;
  loading: boolean;
  error: string | null;
  login: (payload: { email: string; password: string }) => Promise<void>;
  register: (payload: { email: string; password: string }) => Promise<void>;
  logout: () => void;
  hydrateFromStorage: () => void;
  hydrateUser: () => Promise<void>;
};

export const useAuthStore = create<AuthState>((set, get) => {
  const initialToken =
    typeof localStorage !== 'undefined'
      ? localStorage.getItem('auth_token')
      : null;

  return {
    isAuthenticated: Boolean(initialToken),
    token: initialToken,
    user: null,
    loading: false,
    error: null,
    async login({ email, password }) {
      set({ loading: true, error: null });
      try {
        const res = await http.post('/auth/login', { email, password });
        const { token, user } = res.data as { token: string; user: AuthUser };
        localStorage.setItem('auth_token', token);
        set({
          isAuthenticated: true,
          token,
          user,
          loading: false,
          error: null,
        });
      } catch (err: any) {
        const message = err?.response?.data?.message ?? 'Falha ao autenticar';
        set({
          loading: false,
          error: message,
          isAuthenticated: false,
          token: null,
          user: null,
        });
      }
    },
    async register({ email, password }) {
      set({ loading: true, error: null });
      try {
        await http.post('/users', { email, password });
        await get().login({ email, password });
      } catch (err: any) {
        const message = err?.response?.data?.message ?? 'Falha ao cadastrar';
        set({ loading: false, error: message });
      }
    },
    logout() {
      localStorage.removeItem('auth_token');
      set({ isAuthenticated: false, token: null, user: null });
    },
    hydrateFromStorage() {
      const token =
        typeof localStorage !== 'undefined'
          ? localStorage.getItem('auth_token')
          : null;
      set({ isAuthenticated: Boolean(token), token });
    },
    async hydrateUser() {
      const token =
        typeof localStorage !== 'undefined'
          ? localStorage.getItem('auth_token')
          : null;
      if (!token) {
        set({ isAuthenticated: false, token: null, user: null });
        return;
      }
      set({ isAuthenticated: true, token, loading: true, error: null });
      try {
        const res = await http.get('/auth/me');
        const me = res.data as AuthUser;
        set({ user: me, loading: false });
      } catch (err: any) {
        // Se o /me falhar, manter autenticado apenas com token e deixar user nulo
        set({ loading: false });
      }
    },
  };
});

export const createAuthStore = () => useAuthStore.getState();
