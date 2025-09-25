import { useEffect, useState } from 'react';
import { http } from '../http/httpClient';

type QrResponse = {
  status: 'qr' | 'ready' | 'connecting' | 'error';
  qrCode?: string; // pode ser raw ou data url conforme backend
};

export function WhatsAppConnectPage() {
  const [status, setStatus] = useState<QrResponse['status']>('connecting');
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let interval: number | null = null;

    const fetchQr = async () => {
      try {
        const res = await http.get('/v1/whatsapp/qr');
        const data = res.data as QrResponse;
        setStatus(data.status);
        if (data.status === 'qr') {
          // Se já vier em data URL, usa direto; caso contrário, assume PNG base64
          if (data.qrCode && data.qrCode.startsWith('data:image')) {
            setQrDataUrl(data.qrCode);
          } else if (data.qrCode) {
            setQrDataUrl(`data:image/png;base64,${data.qrCode}`);
          }
        } else if (data.status === 'ready') {
          setQrDataUrl(null);
          if (interval) {
            window.clearInterval(interval);
            interval = null;
          }
        }
      } catch (e: any) {
        setError(e?.response?.data?.message ?? 'Falha ao obter QR code');
        setStatus('error');
      }
    };

    void fetchQr();
    // polling leve até conectado
    interval = window.setInterval(fetchQr, 4000);

    return () => {
      if (interval) window.clearInterval(interval);
    };
  }, []);

  return (
    <div className="mx-auto max-w-lg p-6">
      <h1 className="text-2xl font-semibold mb-4">Conexão com WhatsApp</h1>

      {status === 'connecting' && (
        <p className="text-gray-700">Iniciando cliente...</p>
      )}

      {status === 'qr' && (
        <div>
          <p className="mb-2 text-gray-700">Aguardando leitura do QR code...</p>
          {qrDataUrl && (
            <img
              src={qrDataUrl}
              alt="QR code do WhatsApp"
              className="border rounded w-64 h-64 object-contain"
            />
          )}
        </div>
      )}

      {status === 'ready' && (
        <div className="text-green-700">Conectado com sucesso!</div>
      )}

      {status === 'error' && (
        <div className="text-red-700">{error ?? 'Erro desconhecido'}</div>
      )}
    </div>
  );
}
