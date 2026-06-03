import { createContext, useContext, useEffect, useState } from 'react';
import { supabase, isSupabaseReady } from '../lib/supabase';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [role, setRole] = useState(null);      // 'admin' | 'student' | null
  const [loading, setLoading] = useState(true);

  // Carga el rol del usuario desde user_profiles
  const fetchRole = async (userId) => {
    if (!userId || !isSupabaseReady) { setRole(null); return; }
    try {
      const { data } = await supabase
        .from('user_profiles')
        .select('role')
        .eq('id', userId)
        .single();
      setRole(data?.role ?? 'student');
    } catch {
      setRole('student');
    }
  };

  useEffect(() => {
    if (!isSupabaseReady) {
      setLoading(false);
      return;
    }

    let mounted = true;

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!mounted) return;
      setSession(session);
      fetchRole(session?.user?.id).finally(() => {
        if (mounted) setLoading(false);
      });
    });

    // IMPORTANTE: NO usar async/await con llamadas a Supabase directamente dentro
    // de este callback. supabase-js ejecuta este callback mientras mantiene un lock
    // de autenticación interno; cualquier query (supabase.from / getSession) intentaría
    // readquirir el mismo lock → deadlock → la app se cuelga al iniciar sesión.
    // Por eso diferimos fetchRole con setTimeout(0), fuera del contexto del lock.
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!mounted) return;
      setSession(session);
      setTimeout(() => {
        if (mounted) fetchRole(session?.user?.id);
      }, 0);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email, password) => {
    if (!isSupabaseReady) return { error: { message: 'Supabase no configurado' } };
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    return { data, error };
  };

  const signOut = async () => {
    if (!isSupabaseReady) return;
    setRole(null);
    await supabase.auth.signOut();
  };

  const isAdmin = role === 'admin';

  return (
    <AuthContext.Provider value={{ session, loading, role, isAdmin, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
