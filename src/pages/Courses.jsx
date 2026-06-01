import { useEffect, useState } from 'react';
import { MessageCircle } from 'lucide-react';
import { CourseCard } from '../components/courses/CourseCard';
import { getCourses } from '../services/coursesService';

const WHATSAPP_URL = 'https://wa.me/51989019135?text=Hola,%20quisiera%20información%20sobre%20los%20próximos%20cursos.';

export function Courses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('todos');

  useEffect(() => {
    getCourses().then(data => {
      setCourses(data);
      setLoading(false);
    });
  }, []);

  const upcoming = courses.filter(c => c.status === 'por_realizar');
  const completed = courses.filter(c => c.status === 'realizado');

  const displayed = filter === 'todos'
    ? courses
    : filter === 'proximos'
    ? upcoming
    : completed;

  return (
    <>
      {/* Page header */}
      <section className="bg-brand-dark text-white py-14 lg:py-20">
        <div className="container-site">
          <p className="text-primary text-sm font-semibold uppercase tracking-wider mb-2">Oferta académica</p>
          <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">Cursos y Programas</h1>
          <p className="text-white/80 text-lg max-w-2xl">
            Formación especializada en Medicina del Dolor para profesionales de la salud. Cursos presenciales, virtuales e híbridos con expertos de alto nivel.
          </p>
        </div>
      </section>

      {/* Filter tabs */}
      <section className="bg-white border-b border-brand-gray sticky top-[4rem] md:top-[7.5rem] z-10">
        <div className="container-site">
          <div className="flex gap-1 py-3">
            {[
              { key: 'todos', label: `Todos (${courses.length})` },
              { key: 'proximos', label: `Próximos (${upcoming.length})` },
              { key: 'realizados', label: `Realizados (${completed.length})` },
            ].map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setFilter(key)}
                className={`px-4 py-2 text-sm font-medium rounded-sm transition-colors ${
                  filter === key
                    ? 'bg-primary text-white'
                    : 'text-brand-text hover:bg-brand-lightgray'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 lg:py-16">
        <div className="container-site">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map(n => (
                <div key={n} className="card h-72 animate-pulse bg-brand-lightgray" />
              ))}
            </div>
          ) : displayed.length === 0 ? (
            <div className="text-center py-16 text-brand-midgray">
              <p className="text-lg font-medium">No hay cursos en esta categoría por el momento.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayed.map(course => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 bg-brand-lightgray">
        <div className="container-site text-center">
          <h3 className="text-2xl font-bold text-brand-dark mb-3">¿Tienes dudas sobre algún programa?</h3>
          <p className="text-brand-text mb-6">Escríbenos directamente y un asesor te brindará información detallada.</p>
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-brand-whatsapp text-white font-semibold px-7 py-3.5 rounded-sm hover:bg-green-600 transition-colors duration-200"
          >
            <MessageCircle size={18} />
            Consultar por WhatsApp
          </a>
        </div>
      </section>
    </>
  );
}
