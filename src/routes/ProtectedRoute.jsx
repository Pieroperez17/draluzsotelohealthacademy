import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { isSupabaseReady } from '../lib/supabase';

// En modo demo, guardamos el acceso en sessionStorage
const DEMO_SESSION_KEY = 'demo_admin_session';

export function isDemoSessionActive() {
  return !isSupabaseReady && sessionStorage.getItem(DEMO_SESSION_KEY) === 'true';
}

export function setDemoSession(value) {
  if (value) {
    sessionStorage.setItem(DEMO_SESSION_KEY, 'true');
  } else {
    sessionStorage.removeItem(DEMO_SESSION_KEY);
  }
}

export function ProtectedRoute({ children }) {
  const { session, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-lightgray">
        <div className="flex flex-col items-center gap-3">
          <span className="w-8 h-8 border-4 border-brand-gray border-t-primary rounded-full animate-spin" />
          <p className="text-brand-text text-sm">Verificando sesión...</p>
        </div>
      </div>
    );
  }

  // Permitir acceso si hay sesión real o sesión demo activa
  if (!session && !isDemoSessionActive()) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return children;
}
