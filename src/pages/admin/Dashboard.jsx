import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Eye, Clock, CheckCircle, ArrowRight } from 'lucide-react';
import { getCourses } from '../../services/coursesService';
import { useAuth } from '../../contexts/AuthContext';

export function Dashboard() {
  const { session } = useAuth();
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    getCourses({ visibleOnly: false }).then(setCourses);
  }, []);

  const visible = courses.filter(c => c.is_visible).length;
  const upcoming = courses.filter(c => c.status === 'por_realizar').length;
  const completed = courses.filter(c => c.status === 'realizado').length;

  const STATS = [
    { icon: BookOpen, label: 'Total cursos', value: courses.length, color: 'text-primary', bg: 'bg-red-50' },
    { icon: Eye, label: 'Visibles', value: visible, color: 'text-blue-600', bg: 'bg-blue-50' },
    { icon: Clock, label: 'Próximos', value: upcoming, color: 'text-amber-600', bg: 'bg-amber-50' },
    { icon: CheckCircle, label: 'Realizados', value: completed, color: 'text-green-600', bg: 'bg-green-50' },
  ];

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-brand-dark">Dashboard</h2>
        {session?.user && (
          <p className="text-brand-text text-sm mt-1">Bienvenido, {session.user.email}</p>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {STATS.map(({ icon: Icon, label, value, color, bg }) => (
          <div key={label} className="bg-white card p-5 flex items-center gap-4">
            <div className={`w-10 h-10 rounded-sm ${bg} flex items-center justify-center flex-shrink-0`}>
              <Icon size={20} className={color} />
            </div>
            <div>
              <p className="text-2xl font-bold text-brand-dark">{value}</p>
              <p className="text-brand-text text-xs">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white card p-6">
          <h3 className="font-semibold text-brand-dark mb-4">Acciones rápidas</h3>
          <div className="space-y-2">
            <Link
              to="/admin/cursos"
              className="flex items-center justify-between px-4 py-3 bg-brand-lightgray rounded-sm hover:bg-red-50 hover:text-primary transition-colors text-sm font-medium text-brand-dark group"
            >
              <span className="flex items-center gap-2">
                <BookOpen size={16} />
                Gestionar cursos
              </span>
              <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>
            <Link
              to="/admin/cursos?new=1"
              className="flex items-center justify-between px-4 py-3 bg-primary text-white rounded-sm hover:bg-primary-dark transition-colors text-sm font-medium group"
            >
              <span>+ Agregar nuevo curso</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>

        <div className="bg-white card p-6">
          <h3 className="font-semibold text-brand-dark mb-4">Próximos cursos</h3>
          {courses.filter(c => c.status === 'por_realizar').length === 0 ? (
            <p className="text-brand-midgray text-sm">No hay cursos próximos configurados.</p>
          ) : (
            <ul className="space-y-2">
              {courses.filter(c => c.status === 'por_realizar').slice(0, 4).map(c => (
                <li key={c.id} className="flex items-center gap-2 text-sm text-brand-text border-b border-brand-gray pb-2 last:border-0 last:pb-0">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                  <span className="flex-1 truncate">{c.title}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
