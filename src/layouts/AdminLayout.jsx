import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { LayoutDashboard, BookOpen, LogOut, Menu, X, GraduationCap, Users, Quote, Settings } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const NAV_ITEMS = [
  { to: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/admin/cursos', icon: BookOpen, label: 'Cursos' },
  { to: '/admin/estudiantes', icon: Users, label: 'Estudiantes' },
  { to: '/admin/testimonios', icon: Quote, label: 'Testimonios' },
  { to: '/admin/configuracion', icon: Settings, label: 'Configuración' },
];

export function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { signOut, session } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-brand-lightgray">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Admin header — full width, sticky */}
      <header className="bg-white border-b border-brand-gray px-4 lg:px-8 py-4 flex items-center justify-between sticky top-0 z-20">
        <div className="flex items-center gap-3">
          <button
            className="lg:hidden p-2 text-brand-dark hover:text-primary transition-colors"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label="Abrir menú"
          >
            {sidebarOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
          <div className="flex items-center gap-2">
            <GraduationCap size={20} className="text-primary" />
            <span className="font-bold text-brand-dark text-sm hidden sm:block">Health Academy</span>
          </div>
        </div>
        <h1 className="font-semibold text-brand-dark text-base">Panel de Administración</h1>
        <div className="w-24 flex justify-end">
          {session?.user && (
            <span className="text-brand-midgray text-xs truncate max-w-[120px] hidden md:block">
              {session.user.email}
            </span>
          )}
        </div>
      </header>

      {/* Body: sidebar + content */}
      <div className="flex">
        {/* Sidebar */}
        <aside className={`
          fixed top-0 left-0 h-screen w-64 bg-brand-dark z-40 transform transition-transform duration-300 pt-[65px]
          lg:sticky lg:top-[65px] lg:h-[calc(100vh-65px)] lg:translate-x-0 lg:flex-shrink-0 lg:w-56 xl:w-64
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}>
          <div className="flex flex-col h-full py-4">
            <nav className="flex-1 px-3 space-y-1">
              <p className="text-brand-midgray text-xs uppercase tracking-wider px-3 mb-3 font-semibold">Menú</p>
              {NAV_ITEMS.map(({ to, icon: Icon, label }) => (
                <NavLink
                  key={to}
                  to={to}
                  onClick={() => setSidebarOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-sm text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-primary text-white'
                        : 'text-brand-midgray hover:bg-white/5 hover:text-white'
                    }`
                  }
                >
                  <Icon size={17} />
                  {label}
                </NavLink>
              ))}
            </nav>

            <div className="px-3 mt-4 border-t border-white/10 pt-4">
              <button
                onClick={handleSignOut}
                className="flex items-center gap-3 px-3 py-2.5 rounded-sm text-sm font-medium text-brand-midgray hover:bg-white/5 hover:text-white transition-colors w-full"
              >
                <LogOut size={17} />
                Cerrar sesión
              </button>
            </div>
          </div>
        </aside>

        {/* Page content */}
        <main className="flex-1 p-4 lg:p-8 min-w-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
