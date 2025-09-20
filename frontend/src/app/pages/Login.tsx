import { FormEvent, useMemo, useState } from 'react';
import { useAuthStore } from '../store/auth.store';
import { Link } from 'react-router-dom';

export function LoginPage() {
  const { login, loading, error } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [touched, setTouched] = useState(false);

  const isEmailValid = useMemo(() => /.+@.+\..+/.test(email), [email]);
  const isPasswordValid = useMemo(() => password.length >= 6, [password]);
  const isFormValid = isEmailValid && isPasswordValid;

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setTouched(true);
    if (!email || !password) return;
    await login({ email, password });
  };

  return (
    <div className="mx-auto max-w-md p-6">
      <h1 className="text-2xl font-semibold mb-4">Login</h1>
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full rounded border p-2"
          />
          {touched && !isEmailValid && (
            <p className="text-xs text-red-600 mt-1">Informe um e-mail válido.</p>
          )}
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium">Senha</label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full rounded border p-2 pr-20"
            />
            <button
              type="button"
              onClick={() => setShowPassword((s) => !s)}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-sm text-gray-700"
            >
              {showPassword ? 'Esconder' : 'Mostrar'}
            </button>
          </div>
          {touched && !isPasswordValid && (
            <p className="text-xs text-red-600 mt-1">A senha deve ter ao menos 6 caracteres.</p>
          )}
        </div>
        {error && <div role="alert" className="text-red-600 text-sm">{error}</div>}
        <button
          type="submit"
          disabled={loading || !email || !password}
          className="w-full rounded bg-black text-white p-2 disabled:opacity-50"
        >
          {loading ? 'Entrando...' : 'Entrar'}
        </button>
        <div className="text-sm text-gray-700">
          Não tem conta?{' '}
          <Link to="/register" className="underline">Criar conta</Link>
        </div>
      </form>
    </div>
  );
}


