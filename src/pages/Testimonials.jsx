import { TestimonialCard } from '../components/testimonials/TestimonialCard';
import { TESTIMONIALS_DATA } from '../data/courses';
import { MessageCircle } from 'lucide-react';

const WHATSAPP_URL = 'https://wa.me/51989019135?text=Hola,%20quisiera%20más%20información%20sobre%20los%20cursos.';

export function Testimonials() {
  return (
    <>
      {/* Hero */}
      <section className="bg-brand-dark text-white py-14 lg:py-20">
        <div className="container-site">
          <p className="text-primary text-sm font-semibold uppercase tracking-wider mb-2">Experiencias reales</p>
          <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">Testimonios</h1>
          <p className="text-white/80 text-lg max-w-2xl">
            Lo que dicen los profesionales que ya se formaron con nosotros.
          </p>
        </div>
      </section>

      <section className="py-16 lg:py-20">
        <div className="container-site">
          <div className="text-center mb-10">
            <p className="text-xs text-brand-midgray mb-2">[Testimonios pendientes de validación y ampliación — en construcción]</p>
            <p className="text-brand-text max-w-xl mx-auto text-sm">
              Estos testimonios representan la experiencia de profesionales que participaron en nuestros programas. Próximamente incorporaremos más experiencias verificadas.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {TESTIMONIALS_DATA.map(t => (
              <TestimonialCard key={t.id} testimonial={t} />
            ))}
          </div>

          {/* CTA to leave testimonial */}
          <div className="mt-16 text-center bg-brand-lightgray rounded-sm p-10">
            <h3 className="text-2xl font-bold text-brand-dark mb-3">¿Participaste en uno de nuestros programas?</h3>
            <p className="text-brand-text mb-6 max-w-lg mx-auto">
              Tu experiencia puede ayudar a otros profesionales de la salud a tomar la decisión de capacitarse. Escríbenos y comparte tu testimonio.
            </p>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-brand-whatsapp text-white font-semibold px-7 py-3.5 rounded-sm hover:bg-green-600 transition-colors duration-200"
            >
              <MessageCircle size={18} />
              Comparte tu experiencia
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
