import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Calendar, Monitor, MapPin, MessageCircle, ArrowRight } from 'lucide-react';
import { getMyEnrolledCourses } from '../../services/enrollmentService';
import { useAuth } from '../../contexts/AuthContext';

function formatDate(d) {
  if (!d) return 'Por confirmar';
  return new Date(d).toLocaleDateString('es-PE', { year: 'numeric', month: 'long', day: 'numeric' });
}

export function IntranetDashboard() {
  const { session } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyEnrolledCourses()
      .then(setCourses)
      .finally(() => setLoading(false));
  }, []);

  const name = session?.user?.user_metadata?.full_name || session?.user?.email || 'Alumno';

  return (
    <div className="container-site py-10">
      {/* Welcome */}
      <div className="mb-8">
        <p className="text-primary text-sm font-semibold uppercase tracking-wider mb-1">Bienvenido/a</p>
        <h1 className="text-3xl font-bold text-brand-dark">{name}</h1>
        <p className="text-brand-text mt-1">Aquí encontrarás todos los cursos a los que tienes acceso.</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2].map(n => <div key={n} className="card h-48 animate-pulse bg-brand-gray" />)}
        </div>
      ) : courses.length === 0 ? (
        <div className="text-center py-20 bg-white card">
          <BookOpen size={40} className="text-brand-midgray mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-brand-dark mb-2">Aún no tienes cursos asignados</h3>
          <p className="text-brand-text text-sm max-w-sm mx-auto mb-6">
            Una vez que el administrador te inscriba a un curso, aparecerá aquí con todos sus recursos y el chat del grupo.
          </p>
          <a
            href="https://wa.me/51989019135?text=Hola,%20me%20registré%20en%20la%20intranet%20y%20quisiera%20información%20sobre%20la%20inscripción%20a%20un%20curso."
            target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-brand-whatsapp text-white font-semibold px-6 py-3 rounded-sm hover:bg-green-600 transition-colors"
          >
            <MessageCircle size={18} />
            Consultar inscripción por WhatsApp
          </a>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map(course => (
            <Link
              key={course.id}
              to={`/intranet/curso/${course.id}`}
              className="card group flex flex-col overflow-hidden hover:shadow-card-hover transition-shadow"
            >
              {/* Color header */}
              <div className="h-2 bg-primary" />
              <div className="p-5 flex flex-col flex-1">
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="w-10 h-10 rounded-sm bg-red-50 flex items-center justify-center flex-shrink-0">
                    <BookOpen size={18} className="text-primary" />
                  </div>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${course.status === 'por_realizar' ? 'bg-blue-50 text-blue-700' : 'bg-green-50 text-green-700'}`}>
                    {course.status === 'por_realizar' ? 'En curso' : 'Finalizado'}
                  </span>
                </div>
                <h3 className="font-semibold text-brand-dark text-base leading-snug mb-2 group-hover:text-primary transition-colors flex-1">
                  {course.title}
                </h3>
                <p className="text-brand-text text-sm line-clamp-2 mb-4">{course.short_description}</p>
                <div className="flex flex-wrap gap-3 text-xs text-brand-midgray border-t border-brand-gray pt-3">
                  <span className="flex items-center gap-1"><Calendar size={12} />{formatDate(course.course_date)}</span>
                  <span className="flex items-center gap-1">
                    {course.modality?.includes('Virtual') ? <Monitor size={12} /> : <MapPin size={12} />}
                    {course.modality}
                  </span>
                </div>
                <div className="mt-3 flex items-center text-primary text-xs font-semibold gap-1 group-hover:gap-2 transition-all">
                  Acceder al curso <ArrowRight size={13} />
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
