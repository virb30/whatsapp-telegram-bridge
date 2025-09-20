import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import axios from 'axios';
import { createAuthStore } from '../store/auth.store';
import { LoginPage } from './Login';

vi.mock('axios', () => ({
  default: {
    post: vi.fn(),
    interceptors: { request: { use: vi.fn() }, response: { use: vi.fn() } },
  },
}));

describe('LoginPage', () => {
  beforeEach(() => {
    localStorage.clear();
    createAuthStore();
  });

  it('deve permitir login com credenciais válidas e redirecionar', async () => {
    (axios.post as any).mockResolvedValueOnce({ data: { token: 'tok', user: { id: '1', email: 'a@b.com' } } });
    render(
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>,
    );

    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'a@b.com' } });
    fireEvent.change(screen.getByLabelText(/senha/i), { target: { value: '123456' } });
    fireEvent.click(screen.getByRole('button', { name: /entrar/i }));

    await waitFor(() => {
      expect(localStorage.getItem('auth_token')).toBe('tok');
    });
  });

  it('deve exibir erro quando credenciais inválidas', async () => {
    (axios.post as any).mockRejectedValueOnce({ response: { data: { message: 'Credenciais inválidas' } } });
    render(
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>,
    );
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'bad@b.com' } });
    fireEvent.change(screen.getByLabelText(/senha/i), { target: { value: 'wrong' } });
    fireEvent.click(screen.getByRole('button', { name: /entrar/i }));

    expect(await screen.findByText(/credenciais inválidas/i)).toBeTruthy();
  });
});


