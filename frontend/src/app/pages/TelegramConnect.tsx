import { FormEvent, useState } from 'react';
import { http } from '../http/httpClient';

type ConnectResponse = { status: 'code_requested' };
type SignInResponse =
  | { status: 'ready' }
  | { status: 'invalid_code' }
  | { status: 'invalid_2fa_password' };

export function TelegramConnectPage() {
  const [step, setStep] = useState<'phone' | 'code' | 'ready'>('phone');
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmitPhone = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!phone) return;
    setLoading(true);
    try {
      const res = await http.post('/api/v1/telegram/connect', { phone });
      const data = res.data as ConnectResponse;
      if (data.status === 'code_requested') {
        setStep('code');
      }
    } catch (err: any) {
      const msg = err?.response?.data?.message ?? 'Falha ao solicitar código';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const onSubmitCode = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!phone || !code) return;
    setLoading(true);
    try {
      const res = await http.post('/api/v1/telegram/signin', {
        phone,
        code,
        password: password || undefined,
      });
      const data = res.data as SignInResponse;
      if (data.status === 'ready') {
        setStep('ready');
      } else if (data.status === 'invalid_code') {
        setError('Código inválido.');
      } else if (data.status === 'invalid_2fa_password') {
        setError('Senha 2FA incorreta.');
      }
    } catch (err: any) {
      const msg = err?.response?.data?.message ?? 'Falha ao entrar no Telegram';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-md p-6">
      <h1 className="text-2xl font-semibold mb-4">Conexão com Telegram</h1>

      {step === 'phone' && (
        <form onSubmit={onSubmitPhone} className="space-y-4">
          <div>
            <label htmlFor="phone" className="block text-sm font-medium">Telefone</label>
            <input
              id="phone"
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="mt-1 w-full rounded border p-2"
            />
          </div>
          {error && <div role="alert" className="text-red-600 text-sm">{error}</div>}
          <button
            type="submit"
            disabled={loading || !phone}
            className="w-full rounded bg-black text-white p-2 disabled:opacity-50"
          >
            {loading ? 'Enviando...' : 'Continuar'}
          </button>
        </form>
      )}

      {step === 'code' && (
        <form onSubmit={onSubmitCode} className="space-y-4">
          <div>
            <label htmlFor="code" className="block text-sm font-medium">Código</label>
            <input
              id="code"
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="mt-1 w-full rounded border p-2"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium">Senha 2FA</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full rounded border p-2"
            />
          </div>
          {error && <div role="alert" className="text-red-600 text-sm">{error}</div>}
          <button
            type="submit"
            disabled={loading || !code}
            className="w-full rounded bg-black text-white p-2 disabled:opacity-50"
          >
            {loading ? 'Entrando...' : 'Entrar no Telegram'}
          </button>
        </form>
      )}

      {step === 'ready' && (
        <div className="text-green-700">Conectado ao Telegram com sucesso!</div>
      )}
    </div>
  );
}


