import { Route, Routes, Link, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { LoginPage } from './pages/Login';
import { RegisterPage } from './pages/Register';
import { useAuthStore } from './store/auth.store';
import { WhatsAppConnectPage } from './pages/WhatsAppConnect';
import { TelegramConnectPage } from './pages/TelegramConnect';
import { BridgesPage } from './pages/Bridges';

function PrivateRoute({ children }: { children: JSX.Element }) {
  const { isAuthenticated } = useAuthStore();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return children;
}

export function App() {
  const { hydrateFromStorage, hydrateUser } = useAuthStore();
  useEffect(() => {
    hydrateFromStorage();
    // tentar obter dados do usuário caso exista token
    void hydrateUser();
  }, []);
  return (
    <div>
      {/* START: routes */}
      <nav className="p-4 border-b">
        <ul className="flex gap-4">
          <li>
            <Link to="/login">Login</Link>
          </li>
          <li>
            <Link to="/register">Cadastro</Link>
          </li>
          <li>
            <Link to="/whatsapp/connect">WhatsApp</Link>
          </li>
          <li>
            <Link to="/telegram/connect">Telegram</Link>
          </li>
          <li>
            <Link to="/bridges">Pontes</Link>
          </li>
        </ul>
      </nav>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/" element={<PrivateRoute><div className="p-6">Dashboard</div></PrivateRoute>} />
        <Route path="/whatsapp/connect" element={<PrivateRoute><WhatsAppConnectPage /></PrivateRoute>} />
        <Route path="/telegram/connect" element={<PrivateRoute><TelegramConnectPage /></PrivateRoute>} />
        <Route path="/bridges" element={<PrivateRoute><BridgesPage /></PrivateRoute>} />
      </Routes>
      {/* END: routes */}
    </div>
  );
}

export default App;
