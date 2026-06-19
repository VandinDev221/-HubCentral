import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { MainLayout } from './components/layout';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Dashboard } from './pages/Dashboard';
import { Clients } from './pages/Clients';
import { Products } from './pages/Products';
import { Subscriptions } from './pages/Subscriptions';
import { Invoices } from './pages/Invoices';

function AppLayout() {
  const location = useLocation();
  return (
    <MainLayout currentPath={location.pathname}>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/clientes" element={<Clients />} />
        <Route path="/produtos" element={<Products />} />
        <Route path="/assinaturas" element={<Subscriptions />} />
        <Route path="/faturas" element={<Invoices />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </MainLayout>
  );
}

function App() {
  const { token } = useAuth();

  if (!token) {
    return (
      <div style={{ flex: 1, minHeight: 0, overflow: 'auto', display: 'flex', flexDirection: 'column' }}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </div>
    );
  }

  return <AppLayout />;
}

export default function AppWithProviders() {
  return (
    <AuthProvider>
      <App />
    </AuthProvider>
  );
}
