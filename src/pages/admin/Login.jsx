import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { GraduationCap, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';

export function Login() {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState('');

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();

  const onSubmit = async ({ email, password }) => {
    setAuthError('');
    const { data, error } = await signIn(email, password);
    if (error) {
      const msg = error.message?.toLowerCase() ?? '';
      if (msg.includes('email not confirmed')) {
        setAuthError('Debes confirmar tu correo electrónico antes de iniciar sesión. Revisa tu bandeja de entrada.');
      } else {
        setAuthError('Correo o contraseña incorrectos. Verifica tus credenciales.');
      }
      return;
    }

    // Verificar que el usuario tiene rol admin antes de redirigir
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('role')
      .eq('id', data.user.id)
      .single();

    if (profile?.role !== 'admin') {
      await signIn('', ''); // forzar logout limpiando estado
      await supabase.auth.signOut();
      setAuthError('Acceso denegado. Esta sección es solo para administradores.');
      return;
    }

    navigate('/admin/dashboard');
  };

  return (
    <div className="min-h-screen bg-brand-lightgray flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-sm bg-primary mb-4">
            <GraduationCap size={28} className="text-white" />
          </div>
          <h1 className="text-xl font-bold text-brand-dark">Panel Administrativo</h1>
          <p className="text-brand-text text-sm mt-1">Dra. Luz Sotelo Health Academy</p>
        </div>

        {/* Card */}
        <div className="bg-white card p-8">
          <h2 className="text-base font-semibold text-brand-dark mb-6">Iniciar sesión</h2>

          {authError && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-sm text-sm">
              {authError}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-brand-dark mb-1.5">
                Correo electrónico
              </label>
              <input
                type="email"
                autoComplete="email"
                placeholder="admin@ejemplo.com"
                className={`w-full border rounded-sm px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition ${errors.email ? 'border-red-400' : 'border-brand-gray'}`}
                {...register('email', { required: 'El correo es obligatorio' })}
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-brand-dark mb-1.5">
                Contraseña
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  className={`w-full border rounded-sm px-4 py-2.5 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition ${errors.password ? 'border-red-400' : 'border-brand-gray'}`}
                  {...register('password', { required: 'La contraseña es obligatoria' })}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-midgray hover:text-brand-dark transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-primary text-white font-semibold py-3 rounded-sm hover:bg-primary-dark disabled:opacity-60 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center gap-2 mt-6"
            >
              {isSubmitting && (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              )}
              {isSubmitting ? 'Ingresando...' : 'Ingresar'}
            </button>
          </form>
        </div>

        <p className="text-center text-brand-midgray text-xs mt-6">
          Acceso restringido solo para administradores
        </p>
      </div>
    </div>
  );
}
