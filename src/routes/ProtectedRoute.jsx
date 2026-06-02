import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Spinner = () => (
  <div className="min-h-screen flex items-center justify-center bg-brand-lightgray">
    <div className="flex flex-col items-center gap-3">
      <span className="w-8 h-8 border-4 border-brand-gray border-t-primary rounded-full animate-spin" />
      <p className="text-brand-text text-sm">Verificando sesión...</p>
    </div>
  </div>
);

/** Ruta protegida para el PANEL ADMIN — solo role='admin' */
export function AdminRoute({ children }) {
  const { session, loading, isAdmin } = useAuth();

  if (loading) return <Spinner />;

  // No autenticado → login admin
  if (!session) return <Navigate to="/admin/login" replace />;

  // Autenticado pero NO es admin → redirigir a intranet
  if (!isAdmin) return <Navigate to="/intranet/dashboard" replace />;

  return children;
}

/** Ruta protegida para la INTRANET — cualquier usuario autenticado */
export function StudentRoute({ children }) {
  const { session, loading } = useAuth();

  if (loading) return <Spinner />;

  if (!session) return <Navigate to="/intranet/login" replace />;

  return children;
}

/** Ruta genérica (compatibilidad) */
export function ProtectedRoute({ children, redirectTo = '/admin/login' }) {
  const { session, loading } = useAuth();

  if (loading) return <Spinner />;

  if (!session) return <Navigate to={redirectTo} replace />;

  return children;
}
