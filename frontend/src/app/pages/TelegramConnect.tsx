import { FormEvent, useEffect, useState } from 'react';
import { useAuthStore } from '../store/auth.store';
import { useNavigate } from 'react-router-dom';
import { useSSE } from '../hooks/useSSE';
import { QRCodeSVG } from 'qrcode.react';
import { http } from '../http/httpClient';

interface QrResponse {
  status: 'qr' | 'ready' | 'error' | 'connecting' | 'password';
  hint?: string;
  qrCode?: string;
  sessionId?: string;
}

export function TelegramConnectPage() {
  const [status, setStatus] = useState<QrResponse['status']>('connecting');
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const [password, setPassword] = useState('');
  const { user, token } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user?.id) {
      navigate('/login');
    }
  }, [user?.id, navigate]);

  const { data, error } = useSSE<QrResponse>(`http://localhost:3000/api/v1/telegram/connect/${user?.id}`, ['telegram.status']);

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

  const handleSubmitPassword = async (e: FormEvent) => {
    e.preventDefault();
    if (!data?.sessionId) return;
    if (password) {
      await http.post(`/v1/telegram/submit-password`, {
        password,
        sessionId: data?.sessionId,
      });
    }
  };

  return (
    <div className="mx-auto max-w-lg p-6">
      <h1 className="text-2xl font-semibold mb-4">Conexão com Telegram</h1>

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

      {status === 'password' && (
          <form onSubmit={handleSubmitPassword}>
            <div>
              <p className="mb-2 text-gray-700">Senha 2FA do Telegram</p>
              <input type="password" className="w-full p-2 border border-gray-300 rounded-md" onChange={(e) => setPassword(e.target.value)}/>
              <p className="text-gray-700">{data?.hint}</p>
            </div>
            <button className="w-full rounded bg-black text-white p-2 disabled:opacity-50" type="submit">Enviar</button>
          </form>
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


