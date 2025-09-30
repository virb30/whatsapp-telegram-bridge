import { useEffect, useState } from 'react';
import { useSSE } from '../hooks/useSSE';
import { QRCodeSVG } from 'qrcode.react';
import { useAuthStore } from '../store/auth.store';
import { useNavigate } from 'react-router-dom';

type QrResponse = {
  status: 'qr' | 'ready' | 'error' | 'connecting';
  qrCode?: string; // pode ser raw ou data url conforme backend
};

export function WhatsAppConnectPage() {
  const [status, setStatus] = useState<QrResponse['status']>('connecting');
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const { user } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user?.id) {
      navigate('/login');
    }
  }, [user?.id, navigate]);

  const { data, error } = useSSE<QrResponse>(`http://localhost:3000/api/v1/whatsapp/status/${user?.id}`, ['whatsapp.status']);

  useEffect(() => {
    if (data?.qrCode) {
      setQrDataUrl(data.qrCode);
    } else {
      setQrDataUrl(null);
    }
    setStatus(data?.status ?? 'connecting');
  }, [data]);

  if (error) {
    return <div>Error: {JSON.stringify(error)}</div>;
  }

  return (
    <div className="mx-auto max-w-lg p-6">
      <h1 className="text-2xl font-semibold mb-4">Conexão com WhatsApp</h1>

      {status === 'connecting' && (
        <p className="text-gray-700">Iniciando cliente...</p>
      )}

      {status === 'qr' && (
        qrDataUrl
        ? (<div>
            <p className="mb-2 text-gray-700">Aguardando leitura do QR code...</p>
            {qrDataUrl && (
              <QRCodeSVG value={qrDataUrl} size={256} level='H'/>
            )}
          </div>) 
        : (<p className="mb-2 text-gray-700">Erro ao gerar QR code...</p>)
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
