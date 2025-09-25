import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { vi, beforeEach, describe, it, expect } from 'vitest';
import { useAuthStore } from '../store/auth.store';
import { http } from '../http/httpClient';
import { BridgesPage } from './Bridges';

vi.mock('../http/httpClient', () => {
  return {
    http: {
      get: vi.fn(),
      post: vi.fn(),
      delete: vi.fn(),
    },
  };
});

describe('BridgesPage', () => {
  beforeEach(() => {
    useAuthStore.setState({
      ...useAuthStore.getState(),
      isAuthenticated: true,
      token: 'test-token',
    });
    (http as any).get.mockReset();
    (http as any).post.mockReset();
    (http as any).delete.mockReset();
  });

  it('lista pontes existentes ao carregar', async () => {
    (http as any).get.mockResolvedValueOnce({
      data: {
        items: [
          { id: 'b1', whatsappGroupId: 'wa-1', telegramGroupId: 'tg-1' },
          { id: 'b2', whatsappGroupId: 'wa-2', telegramGroupId: 'tg-2' },
        ],
      },
    });

    render(
      <MemoryRouter initialEntries={[{ pathname: '/bridges' }]}>
        <Routes>
          <Route path="/bridges" element={<BridgesPage />} />
        </Routes>
      </MemoryRouter>,
    );

    expect(await screen.findByText('wa-1 → tg-1')).toBeTruthy();
    expect(await screen.findByText('wa-2 → tg-2')).toBeTruthy();
    await waitFor(() => {
      expect(http.get).toHaveBeenCalledWith('/api/v1/bridges');
    });
  });

  it('cria uma nova ponte e atualiza a lista', async () => {
    (http as any).get.mockResolvedValueOnce({ data: { items: [] } });
    (http as any).post.mockResolvedValueOnce({ data: { id: 'b3' } });
    (http as any).get.mockResolvedValueOnce({
      data: { items: [{ id: 'b3', whatsappGroupId: 'wa-3', telegramGroupId: 'tg-3' }] },
    });

    render(
      <MemoryRouter initialEntries={[{ pathname: '/bridges' }]}>
        <Routes>
          <Route path="/bridges" element={<BridgesPage />} />
        </Routes>
      </MemoryRouter>,
    );

    await userEvent.type(screen.getByLabelText(/grupo whatsapp/i), 'wa-3');
    await userEvent.type(screen.getByLabelText(/grupo telegram/i), 'tg-3');
    await userEvent.click(screen.getByRole('button', { name: /adicionar/i }));

    await waitFor(() => {
      expect(http.post).toHaveBeenCalledWith('/api/v1/bridges', {
        whatsappGroupId: 'wa-3',
        telegramGroupId: 'tg-3',
      });
    });

    expect(await screen.findByText('wa-3 → tg-3')).toBeTruthy();
  });

  it('deleta uma ponte e remove da lista', async () => {
    (http as any).get.mockResolvedValueOnce({
      data: {
        items: [
          { id: 'b1', whatsappGroupId: 'wa-1', telegramGroupId: 'tg-1' },
        ],
      },
    });

    (http as any).delete.mockResolvedValueOnce({ status: 204 });

    render(
      <MemoryRouter initialEntries={[{ pathname: '/bridges' }]}>
        <Routes>
          <Route path="/bridges" element={<BridgesPage />} />
        </Routes>
      </MemoryRouter>,
    );

    const deleteBtn = await screen.findByRole('button', { name: /remover wa-1 → tg-1/i });
    await userEvent.click(deleteBtn);

    await waitFor(() => {
      expect(http.delete).toHaveBeenCalledWith('/api/v1/bridges/b1');
    });

    // Após deleção, a lista deve atualizar para vazia
    expect(screen.queryByText('wa-1 → tg-1')).toBeNull();
  });
});
