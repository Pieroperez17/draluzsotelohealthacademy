import { Outlet, Link, useNavigate } from 'react-router-dom';
import { GraduationCap, LogOut, LayoutDashboard } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export function IntranetLayout() {
  const { session, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/intranet/login');
  };

  return (
    <div className="min-h-screen bg-brand-lightgray flex flex-col">
      {/* Header intranet */}
      <header className="bg-brand-dark text-white sticky top-0 z-20 shadow-nav">
        <div className="container-site flex items-center justify-between h-14">
          <Link to="/intranet/dashboard" className="flex items-center gap-2">
            <GraduationCap size={20} className="text-primary" />
            <span className="font-bold text-sm tracking-wide">Intranet — Health Academy</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link to="/intranet/dashboard" className="flex items-center gap-1.5 text-white/70 hover:text-white text-sm transition-colors">
              <LayoutDashboard size={15} />
              <span className="hidden sm:inline">Mis cursos</span>
            </Link>
            {session?.user && (
              <span className="text-white/50 text-xs hidden md:block truncate max-w-[140px]">
                {session.user.email}
              </span>
            )}
            <button
              onClick={handleSignOut}
              className="flex items-center gap-1.5 text-white/70 hover:text-white text-sm transition-colors"
            >
              <LogOut size={15} />
              <span className="hidden sm:inline">Salir</span>
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="bg-brand-dark text-white/40 text-xs text-center py-3">
        © {new Date().getFullYear()} Dra. Luz Sotelo Health Academy — Portal Intranet
      </footer>
    </div>
  );
}
