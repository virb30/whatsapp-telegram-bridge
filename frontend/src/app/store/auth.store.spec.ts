import { describe, it, expect, beforeEach, vi } from 'vitest';
import axios from 'axios';
import { createAuthStore, useAuthStore } from './auth.store';

vi.mock('axios', () => {
  const instance = {
    post: vi.fn(),
    get: vi.fn(),
    interceptors: {
      request: { use: vi.fn() },
      response: { use: vi.fn() },
    },
  } as any;
  return {
    default: Object.assign(() => instance, {
      create: vi.fn(() => instance),
      post: vi.fn(),
      get: vi.fn(),
      interceptors: {
        request: { use: vi.fn() },
        response: { use: vi.fn() },
      },
    }),
  };
});

describe('auth.store', () => {
  beforeEach(async () => {
    vi.clearAllMocks();
    // Limpa localStorage antes de cada teste
    localStorage.clear();
    // Reinicia a store
    createAuthStore();
  });

  it('deve iniciar desautenticado', () => {
    const state = useAuthStore.getState();
    expect(state.isAuthenticated).toBe(false);
    expect(state.token).toBeNull();
  });

  it('deve realizar login com sucesso e persistir o token', async () => {
    const token = 'jwt.token.mock';
    (axios as any).create().post.mockResolvedValueOnce({
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
    (axios as any).create().post.mockRejectedValueOnce({
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
    (axios as any).create().post
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


