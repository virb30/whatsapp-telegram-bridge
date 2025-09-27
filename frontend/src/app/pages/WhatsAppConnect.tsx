import { useEffect, useState } from 'react';
import { useSSE } from '../hooks/useSSE';
import { QRCodeSVG } from 'qrcode.react';

type QrResponse = {
  status: 'qr' | 'ready' | 'error' | 'connecting';
  qrCode?: string; // pode ser raw ou data url conforme backend
};

export function WhatsAppConnectPage() {
  const [status, setStatus] = useState<QrResponse['status']>('connecting');
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);

  const { data, error, loading } = useSSE<QrResponse>("http://localhost:3000/api/v1/whatsapp/status");

  
  useEffect(() => {
    if (data?.qrCode) {
      setQrDataUrl(data.qrCode);
    } else {
      setQrDataUrl(null);
    }
    setStatus(data?.status ?? 'connecting');
  }, [data]);

  // useEffect(() => {
  //   let interval: number | null = null;

  //   const fetchQr = async () => {
  //     try {
  //       const res = await http.get('/v1/whatsapp/qr');
  //       const data = res.data as QrResponse;
  //       setStatus(data.status);
  //       console.log(data);
  //       if (data.status === 'qr') {
  //         // Se já vier em data URL, usa direto; caso contrário, assume PNG base64
  //         if (data.qrCode && data.qrCode.startsWith('data:image')) {
  //           setQrDataUrl(data.qrCode);
  //         } else if (data.qrCode) {
  //           setQrDataUrl(`data:image/png;base64,${data.qrCode}`);
  //         }
  //       } else if (data.status === 'ready') {
  //         setQrDataUrl(null);
  //         if (interval) {
  //           window.clearInterval(interval);
  //           interval = null;
  //         }
  //       }
  //     } catch (e: any) {
  //       setError(e?.response?.data?.message ?? 'Falha ao obter QR code');
  //       setStatus('error');
  //     }
  //   };

  //   void fetchQr();
  //   // polling leve até conectado
  //   interval = window.setInterval(fetchQr, 4000);

  //   return () => {
  //     if (interval) window.clearInterval(interval);
  //   };
  // }, []);

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
