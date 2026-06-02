import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { GraduationCap, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export function IntranetLogin() {
  const [tab, setTab] = useState('login'); // 'login' | 'register'
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm();

  const handleLogin = async ({ email, password }) => {
    setAuthError('');
    const { error } = await signIn(email, password);
    if (error) {
      setAuthError('Correo o contraseña incorrectos.');
    } else {
      navigate('/intranet/dashboard');
    }
  };

  const handleRegister = async ({ full_name, email, password }) => {
    setAuthError('');
    const { supabase } = await import('../../lib/supabase');
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name, role: 'student' } },
    });
    if (error) {
      setAuthError(error.message);
    } else {
      setSuccessMsg('✓ Cuenta creada. Revisa tu correo para confirmar o inicia sesión directamente.');
      setTab('login');
      reset();
    }
  };

  return (
    <div className="min-h-screen bg-brand-lightgray flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-sm bg-brand-dark mb-4">
            <GraduationCap size={28} className="text-primary" />
          </div>
          <h1 className="text-xl font-bold text-brand-dark">Intranet Académica</h1>
          <p className="text-brand-text text-sm mt-1">Dra. Luz Sotelo Health Academy</p>
        </div>

        <div className="bg-white card p-8">
          {/* Tabs */}
          <div className="flex border-b border-brand-gray mb-6">
            {[['login', 'Iniciar sesión'], ['register', 'Registrarse']].map(([key, label]) => (
              <button
                key={key}
                onClick={() => { setTab(key); setAuthError(''); setSuccessMsg(''); }}
                className={`flex-1 pb-3 text-sm font-semibold transition-colors border-b-2 -mb-px ${
                  tab === key ? 'border-primary text-primary' : 'border-transparent text-brand-midgray hover:text-brand-dark'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {authError && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-sm text-sm">{authError}</div>
          )}
          {successMsg && (
            <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-sm text-sm">{successMsg}</div>
          )}

          {/* LOGIN */}
          {tab === 'login' && (
            <form onSubmit={handleSubmit(handleLogin)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-brand-dark mb-1.5">Correo electrónico</label>
                <input
                  type="email"
                  autoComplete="email"
                  placeholder="tu@correo.com"
                  className={`w-full border rounded-sm px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition ${errors.email ? 'border-red-400' : 'border-brand-gray'}`}
                  {...register('email', { required: 'Requerido' })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-brand-dark mb-1.5">Contraseña</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    placeholder="••••••••"
                    className={`w-full border rounded-sm px-4 py-2.5 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition ${errors.password ? 'border-red-400' : 'border-brand-gray'}`}
                    {...register('password', { required: 'Requerido' })}
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-midgray hover:text-brand-dark">
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
              <button type="submit" disabled={isSubmitting}
                className="w-full bg-primary text-white font-semibold py-3 rounded-sm hover:bg-primary-dark disabled:opacity-60 transition-colors flex items-center justify-center gap-2 mt-2">
                {isSubmitting && <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
                {isSubmitting ? 'Ingresando...' : 'Ingresar'}
              </button>
            </form>
          )}

          {/* REGISTER */}
          {tab === 'register' && (
            <form onSubmit={handleSubmit(handleRegister)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-brand-dark mb-1.5">Nombre completo</label>
                <input
                  type="text"
                  placeholder="Dr. Juan García"
                  className={`w-full border rounded-sm px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition ${errors.full_name ? 'border-red-400' : 'border-brand-gray'}`}
                  {...register('full_name', { required: 'Requerido' })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-brand-dark mb-1.5">Correo electrónico</label>
                <input
                  type="email"
                  placeholder="tu@correo.com"
                  className={`w-full border rounded-sm px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition ${errors.email ? 'border-red-400' : 'border-brand-gray'}`}
                  {...register('email', { required: 'Requerido', pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Email inválido' } })}
                />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-brand-dark mb-1.5">Contraseña</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Mínimo 6 caracteres"
                    className={`w-full border rounded-sm px-4 py-2.5 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition ${errors.password ? 'border-red-400' : 'border-brand-gray'}`}
                    {...register('password', { required: 'Requerido', minLength: { value: 6, message: 'Mínimo 6 caracteres' } })}
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-midgray hover:text-brand-dark">
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
              </div>
              <button type="submit" disabled={isSubmitting}
                className="w-full bg-primary text-white font-semibold py-3 rounded-sm hover:bg-primary-dark disabled:opacity-60 transition-colors flex items-center justify-center gap-2 mt-2">
                {isSubmitting && <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
                {isSubmitting ? 'Registrando...' : 'Crear cuenta'}
              </button>
              <p className="text-brand-midgray text-xs text-center">
                Al registrarte podrás acceder a los cursos que el administrador te asigne.
              </p>
            </form>
          )}
        </div>

        <div className="text-center mt-6">
          <Link to="/" className="text-brand-midgray text-xs hover:text-primary transition-colors">
            ← Volver al sitio principal
          </Link>
        </div>
      </div>
    </div>
  );
}
