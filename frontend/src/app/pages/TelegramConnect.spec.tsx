import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { vi } from 'vitest';
import { useAuthStore } from '../store/auth.store';
import { http } from '../http/httpClient';
import { TelegramConnectPage } from './TelegramConnect';

vi.mock('../http/httpClient', () => {
  return {
    http: {
      post: vi.fn(),
    },
  };
});

describe('TelegramConnectPage', () => {
  beforeEach(() => {
    useAuthStore.setState({
      ...useAuthStore.getState(),
      isAuthenticated: true,
      token: 'test-token',
    });
    (http.post as any).mockReset();
  });

  it('exibe formulário de telefone e avança para código após sucesso', async () => {
    (http.post as any)
      .mockResolvedValueOnce({ data: { status: 'code_requested' } });

    render(
      <MemoryRouter initialEntries={[{ pathname: '/telegram/connect' }] }>
        <Routes>
          <Route path="/telegram/connect" element={<TelegramConnectPage />} />
        </Routes>
      </MemoryRouter>,
    );

    const phoneInput = await screen.findByLabelText(/telefone/i);
    await userEvent.type(phoneInput, '+5511999999999');

    const continuarBtn = await screen.findByRole('button', { name: /continuar/i });
    await userEvent.click(continuarBtn);

    await waitFor(() => {
      expect(http.post).toHaveBeenCalledWith('/api/v1/telegram/connect', {
        phone: '+5511999999999',
      });
    });

    const codeInput = await screen.findByLabelText(/código/i);
    expect(Boolean(codeInput)).toBe(true);
  });

  it('envia código (com senha opcional) e mostra sucesso quando pronto', async () => {
    (http.post as any)
      .mockResolvedValueOnce({ data: { status: 'code_requested' } }) // connect
      .mockResolvedValueOnce({ data: { status: 'ready' } }); // signin

    render(
      <MemoryRouter initialEntries={[{ pathname: '/telegram/connect' }] }>
        <Routes>
          <Route path="/telegram/connect" element={<TelegramConnectPage />} />
        </Routes>
      </MemoryRouter>,
    );

    await userEvent.type(await screen.findByLabelText(/telefone/i), '+5511888888888');
    await userEvent.click(await screen.findByRole('button', { name: /continuar/i }));

    await userEvent.type(await screen.findByLabelText(/código/i), '12345');
    // senha é opcional - não preencher aqui
    await userEvent.click(await screen.findByRole('button', { name: /entrar no telegram/i }));

    await waitFor(() => {
      expect(http.post).toHaveBeenNthCalledWith(2, '/api/v1/telegram/signin', {
        phone: '+5511888888888',
        code: '12345',
        password: undefined,
      });
    });

    const ok = await screen.findByText(/conectado ao telegram com sucesso/i);
    expect(Boolean(ok)).toBe(true);
  });

  it('exibe erro quando código é inválido', async () => {
    (http.post as any)
      .mockResolvedValueOnce({ data: { status: 'code_requested' } })
      .mockResolvedValueOnce({ data: { status: 'invalid_code' } });

    render(
      <MemoryRouter initialEntries={[{ pathname: '/telegram/connect' }] }>
        <Routes>
          <Route path="/telegram/connect" element={<TelegramConnectPage />} />
        </Routes>
      </MemoryRouter>,
    );

    await userEvent.type(await screen.findByLabelText(/telefone/i), '+5511777777777');
    await userEvent.click(await screen.findByRole('button', { name: /continuar/i }));

    await userEvent.type(await screen.findByLabelText(/código/i), '00000');
    await userEvent.click(await screen.findByRole('button', { name: /entrar no telegram/i }));

    const err = await screen.findByRole('alert');
    expect(err.textContent?.toLowerCase()).toMatch(/código inválido/);
  });

  it('exibe erro quando senha 2FA é incorreta e permite tentar novamente', async () => {
    (http.post as any)
      .mockResolvedValueOnce({ data: { status: 'code_requested' } })
      .mockResolvedValueOnce({ data: { status: 'invalid_2fa_password' } })
      .mockResolvedValueOnce({ data: { status: 'ready' } });

    render(
      <MemoryRouter initialEntries={[{ pathname: '/telegram/connect' }] }>
        <Routes>
          <Route path="/telegram/connect" element={<TelegramConnectPage />} />
        </Routes>
      </MemoryRouter>,
    );

    await userEvent.type(await screen.findByLabelText(/telefone/i), '+5511666666666');
    await userEvent.click(await screen.findByRole('button', { name: /continuar/i }));

    await userEvent.type(await screen.findByLabelText(/código/i), '22222');
    await userEvent.type(await screen.findByLabelText(/senha 2fa/i), 'minha-2fa');
    await userEvent.click(await screen.findByRole('button', { name: /entrar no telegram/i }));

    const err = await screen.findByRole('alert');
    expect(err.textContent?.toLowerCase()).toMatch(/senha 2fa incorreta/);

    // tentar novamente com mesma tela
    await userEvent.click(await screen.findByRole('button', { name: /entrar no telegram/i }));

    const ok = await screen.findByText(/conectado ao telegram com sucesso/i);
    expect(Boolean(ok)).toBe(true);
  });

  it('exibe mensagem de erro de API quando falha conectar telefone', async () => {
    (http.post as any)
      .mockRejectedValueOnce({ response: { data: { message: 'Falha ao solicitar código' } } });

    render(
      <MemoryRouter initialEntries={[{ pathname: '/telegram/connect' }] }>
        <Routes>
          <Route path="/telegram/connect" element={<TelegramConnectPage />} />
        </Routes>
      </MemoryRouter>,
    );

    await userEvent.type(await screen.findByLabelText(/telefone/i), '+5511555555555');
    await userEvent.click(await screen.findByRole('button', { name: /continuar/i }));

    const err = await screen.findByRole('alert');
    expect(err.textContent).toMatch('Falha ao solicitar código');
  });
});


