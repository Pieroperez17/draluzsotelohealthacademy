import { Calendar, Monitor, MapPin, MessageCircle } from 'lucide-react';
import { Badge } from '../ui/Badge';

const WHATSAPP_BASE = 'https://wa.me/51989019135?text=Hola,%20me%20interesa%20información%20sobre%20el%20curso%3A%20';

function formatDate(dateStr) {
  if (!dateStr) return 'Por confirmar';
  return new Date(dateStr).toLocaleDateString('es-PE', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

function ModalityIcon({ modality }) {
  const isVirtual = modality?.toLowerCase().includes('virtual');
  return isVirtual ? <Monitor size={14} /> : <MapPin size={14} />;
}

export function CourseCard({ course }) {
  const isCompleted = course.status === 'realizado';
  const whatsappUrl = `${WHATSAPP_BASE}${encodeURIComponent(course.title)}`;

  return (
    <article className="card flex flex-col overflow-hidden group">
      {/* Image / Placeholder */}
      <div className="relative h-44 bg-brand-lightgray flex items-center justify-center overflow-hidden">
        {course.image_url ? (
          <img
            src={course.image_url}
            alt={course.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        ) : (
          <div className="flex flex-col items-center gap-2 text-brand-midgray">
            <div className="w-14 h-14 rounded-full bg-brand-gray flex items-center justify-center">
              <span className="text-2xl font-bold text-primary/30">
                {course.title.charAt(0)}
              </span>
            </div>
            <span className="text-xs">Imagen del curso</span>
          </div>
        )}
        {/* Status ribbon */}
        <div className="absolute top-3 left-3">
          <Badge variant={course.status}>
            {isCompleted ? 'Realizado' : 'Próximo'}
          </Badge>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        <h3 className="font-semibold text-brand-dark text-base leading-snug mb-2 group-hover:text-primary transition-colors">
          {course.title}
        </h3>
        <p className="text-brand-text text-sm leading-relaxed mb-4 flex-1">
          {course.short_description}
        </p>

        {/* Meta */}
        <div className="flex flex-wrap gap-3 text-xs text-brand-text mb-4 border-t border-brand-gray pt-3">
          <span className="flex items-center gap-1">
            <Calendar size={12} className="text-primary" />
            {formatDate(course.course_date)}
          </span>
          <span className="flex items-center gap-1">
            <ModalityIcon modality={course.modality} />
            {course.modality}
          </span>
        </div>

        {/* CTA */}
        {!isCompleted ? (
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 bg-primary text-white text-sm font-semibold py-2.5 rounded-sm hover:bg-primary-dark transition-colors duration-200"
          >
            <MessageCircle size={15} />
            Solicitar información
          </a>
        ) : (
          <div className="flex items-center justify-center py-2.5 text-sm text-brand-midgray border border-brand-gray rounded-sm">
            Curso concluido
          </div>
        )}
      </div>
    </article>
  );
}
