import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export function ProtectedRoute({ children, redirectTo = '/admin/login' }) {
  const { session, loading } = useAuth();

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

  if (!session) {
    return <Navigate to={redirectTo} replace />;
  }

  return children;
}
