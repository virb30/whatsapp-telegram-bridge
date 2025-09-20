import { createStore } from 'zustand/vanilla';
import { create } from 'zustand';
import axios from 'axios';

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
};

export const createAuthStore = () => {
  const initialToken = typeof localStorage !== 'undefined' ? localStorage.getItem('auth_token') : null;

  const vanilla = createStore<AuthState>((set, get) => ({
    isAuthenticated: Boolean(initialToken),
    token: initialToken,
    user: null,
    loading: false,
    error: null,
    async login({ email, password }) {
      set({ loading: true, error: null });
      try {
        const res = await axios.post('/api/v1/auth/login', { email, password });
        const { token, user } = res.data as { token: string; user: AuthUser };
        localStorage.setItem('auth_token', token);
        set({ isAuthenticated: true, token, user, loading: false, error: null });
      } catch (err: any) {
        const message = err?.response?.data?.message ?? 'Falha ao autenticar';
        set({ loading: false, error: message, isAuthenticated: false, token: null, user: null });
      }
    },
    async register({ email, password }) {
      set({ loading: true, error: null });
      try {
        await axios.post('/api/v1/users', { email, password });
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
      const token = typeof localStorage !== 'undefined' ? localStorage.getItem('auth_token') : null;
      set({ isAuthenticated: Boolean(token), token });
    },
  }));

  // Sincroniza o hook existente sem reatribuir a referência exportada
  useAuthStore.setState(vanilla.getState());
  vanilla.subscribe((state) => {
    useAuthStore.setState(state);
  });
  return vanilla;
};

export const useAuthStore = create<AuthState>(() => ({
  isAuthenticated: false,
  token: null,
  user: null,
  loading: false,
  error: null,
  login: async () => {},
  register: async () => {},
  logout: () => {},
  hydrateFromStorage: () => {},
}));


