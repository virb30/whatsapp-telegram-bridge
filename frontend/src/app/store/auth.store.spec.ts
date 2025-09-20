import { describe, it, expect, beforeEach, vi } from 'vitest';
import axios from 'axios';

vi.mock('axios', () => {
  return {
    default: {
      post: vi.fn(),
      get: vi.fn(),
      interceptors: {
        request: { use: vi.fn() },
        response: { use: vi.fn() },
      },
    },
  };
});

// Importação atrasada para garantir que o mock de axios esteja ativo
let createAuthStore: typeof import('./auth.store').createAuthStore;
let useAuthStore: typeof import('./auth.store').useAuthStore;

describe('auth.store', () => {
  beforeEach(async () => {
    vi.clearAllMocks();
    // Limpa localStorage antes de cada teste
    localStorage.clear();
    // Força recarregar o módulo para resetar o estado da store
    vi.resetModules();
    ({ createAuthStore, useAuthStore } = await import('./auth.store'));
    createAuthStore();
  });

  it('deve iniciar desautenticado', () => {
    const state = useAuthStore.getState();
    expect(state.isAuthenticated).toBe(false);
    expect(state.token).toBeNull();
  });

  it('deve realizar login com sucesso e persistir o token', async () => {
    const token = 'jwt.token.mock';
    (axios.post as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      data: { token, user: { id: 'u1', email: 'test@example.com' } },
    });

    const { login } = useAuthStore.getState();
    await login({ email: 'test@example.com', password: 'secret' });

    const state = useAuthStore.getState();
    expect(state.isAuthenticated).toBe(true);
    expect(state.token).toBe(token);
    expect(localStorage.getItem('auth_token')).toBe(token);
    expect(state.error).toBeNull();
  });

  it('deve falhar login e expor mensagem de erro', async () => {
    (axios.post as unknown as ReturnType<typeof vi.fn>).mockRejectedValueOnce({
      response: { data: { message: 'Credenciais inválidas' } },
    });

    const { login } = useAuthStore.getState();
    await login({ email: 'bad@example.com', password: 'wrong' });

    const state = useAuthStore.getState();
    expect(state.isAuthenticated).toBe(false);
    expect(state.token).toBeNull();
    expect(state.error).toBe('Credenciais inválidas');
  });

  it('deve realizar cadastro e autenticar automaticamente', async () => {
    const token = 'jwt.token.created';
    (axios.post as unknown as ReturnType<typeof vi.fn>)
      .mockResolvedValueOnce({ data: { id: 'u2', email: 'new@example.com' } }) // /users
      .mockResolvedValueOnce({
        data: { token, user: { id: 'u2', email: 'new@example.com' } }, // /auth/login
      });

    const { register } = useAuthStore.getState();
    await register({ email: 'new@example.com', password: 'secret' });

    const state = useAuthStore.getState();
    expect(state.isAuthenticated).toBe(true);
    expect(state.token).toBe(token);
    expect(localStorage.getItem('auth_token')).toBe(token);
  });

  it('deve efetuar logout limpando estado e storage', () => {
    useAuthStore.setState({ isAuthenticated: true, token: 'tok', user: { id: 'u', email: 'e' } as any });
    const { logout } = useAuthStore.getState();
    logout();
    const state = useAuthStore.getState();
    expect(state.isAuthenticated).toBe(false);
    expect(state.token).toBeNull();
    expect(localStorage.getItem('auth_token')).toBeNull();
  });
});


