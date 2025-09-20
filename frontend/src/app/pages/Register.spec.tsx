import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import axios from 'axios';
import { createAuthStore } from '../store/auth.store';
import { RegisterPage } from './Register';

vi.mock('axios', () => ({
  default: {
    post: vi.fn(),
    interceptors: { request: { use: vi.fn() }, response: { use: vi.fn() } },
  },
}));

describe('RegisterPage', () => {
  beforeEach(() => {
    localStorage.clear();
    createAuthStore();
  });

  it('deve cadastrar e autenticar', async () => {
    (axios.post as any)
      .mockResolvedValueOnce({ data: { id: '1', email: 'new@b.com' } })
      .mockResolvedValueOnce({ data: { token: 'tok', user: { id: '1', email: 'new@b.com' } } });

    render(
      <BrowserRouter>
        <RegisterPage />
      </BrowserRouter>,
    );

    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'new@b.com' } });
    fireEvent.change(screen.getByLabelText(/senha/i), { target: { value: '123456' } });
    fireEvent.click(screen.getByRole('button', { name: /criar conta/i }));

    await waitFor(() => expect(localStorage.getItem('auth_token')).toBe('tok'));
  });
});


