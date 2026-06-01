import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { LayoutDashboard, BookOpen, LogOut, Menu, X, GraduationCap } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { setDemoSession } from '../routes/ProtectedRoute';

const NAV_ITEMS = [
  { to: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/admin/cursos', icon: BookOpen, label: 'Cursos' },
];

export function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { signOut, session } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    setDemoSession(false);
    await signOut();
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-brand-lightgray flex">
      {/* Sidebar overlay (mobile) */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 h-full w-64 bg-brand-dark z-40 transform transition-transform duration-300 lg:translate-x-0 lg:relative lg:flex-shrink-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-white/10">
            <div className="flex items-center gap-2">
              <GraduationCap size={24} className="text-primary" />
              <div>
                <p className="text-white font-bold text-sm leading-none">Health Academy</p>
                <p className="text-brand-midgray text-xs mt-0.5">Panel Administrativo</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1">
            {NAV_ITEMS.map(({ to, icon: Icon, label }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-2.5 rounded-sm text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-primary text-white'
                      : 'text-brand-midgray hover:bg-white/5 hover:text-white'
                  }`
                }
              >
                <Icon size={18} />
                {label}
              </NavLink>
            ))}
          </nav>

          {/* User + logout */}
          <div className="p-4 border-t border-white/10">
            {session?.user && (
              <p className="text-brand-midgray text-xs mb-3 truncate px-1">{session.user.email}</p>
            )}
            <button
              onClick={handleSignOut}
              className="flex items-center gap-3 px-4 py-2.5 rounded-sm text-sm font-medium text-brand-midgray hover:bg-white/5 hover:text-white transition-colors w-full"
            >
              <LogOut size={18} />
              Cerrar sesión
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Admin header */}
        <header className="bg-white border-b border-brand-gray px-4 lg:px-8 py-4 flex items-center justify-between sticky top-0 z-20">
          <button
            className="lg:hidden p-2 text-brand-dark hover:text-primary transition-colors"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label="Abrir menú"
          >
            {sidebarOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
          <h1 className="font-semibold text-brand-dark text-base lg:text-lg">Panel de Administración</h1>
          <div className="w-9 lg:hidden" />
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 lg:p-8 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
