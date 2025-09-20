import { Route, Routes, Link, Navigate } from 'react-router-dom';
import { LoginPage } from './pages/Login';
import { RegisterPage } from './pages/Register';
import { useAuthStore } from './store/auth.store';

function PrivateRoute({ children }: { children: JSX.Element }) {
  const { isAuthenticated } = useAuthStore();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return children;
}

export function App() {
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
        </ul>
      </nav>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/" element={<PrivateRoute><div className="p-6">Dashboard</div></PrivateRoute>} />
      </Routes>
      {/* END: routes */}
    </div>
  );
}

export default App;
