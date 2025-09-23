import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter, MemoryRouter, Route, Routes } from 'react-router-dom';
import { vi } from 'vitest';
import { useAuthStore } from '../store/auth.store';
import { http } from '../http/httpClient';
import { WhatsAppConnectPage } from './WhatsAppConnect';

vi.mock('../http/httpClient', () => {
  return {
    http: {
      get: vi.fn(),
    },
  };
});

describe('WhatsAppConnectPage', () => {
  beforeEach(() => {
    useAuthStore.setState({
      ...useAuthStore.getState(),
      isAuthenticated: true,
      token: 'test-token',
    });
  });

  it('exibe estado inicial e busca QR code', async () => {
    (http.get as any).mockResolvedValueOnce({
      data: { status: 'qr', qrCode: 'data:image/png;base64,AAA' },
    });

    render(
      <MemoryRouter initialEntries={[{ pathname: '/whatsapp/connect' }]}>
        <Routes>
          <Route path="/whatsapp/connect" element={<WhatsAppConnectPage />} />
        </Routes>
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(http.get).toHaveBeenCalledWith('/whatsapp/qr');
    });

    const waitingText = await screen.findByText(
      /aguardando leitura do qr code/i,
    );
    expect(Boolean(waitingText)).toBe(true);

    const img = await screen.findByAltText(/qr code do whatsapp/i);
    expect(Boolean(img)).toBe(true);
  });

  it('mostra "Conectado" quando status ready', async () => {
    (http.get as any).mockResolvedValueOnce({ data: { status: 'ready' } });

    render(
      <BrowserRouter>
        <WhatsAppConnectPage />
      </BrowserRouter>,
    );

    const ok = await screen.findByText(/conectado com sucesso/i);
    expect(Boolean(ok)).toBe(true);
  });
});
