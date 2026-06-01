import { useEffect, useState } from 'react';
import { TestimonialCard } from '../components/testimonials/TestimonialCard';
import { getTestimonials } from '../services/testimonialsService';
import { MessageCircle } from 'lucide-react';

const WHATSAPP_URL = 'https://wa.me/51989019135?text=Hola,%20quisiera%20más%20información%20sobre%20los%20cursos.';

export function Testimonials() {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getTestimonials().then(data => {
      setTestimonials(data);
      setLoading(false);
    });
  }, []);

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
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {[1, 2, 3, 4].map(n => (
                <div key={n} className="card h-48 animate-pulse bg-brand-lightgray" />
              ))}
            </div>
          ) : testimonials.length === 0 ? (
            <p className="text-center text-brand-midgray py-16">No hay testimonios disponibles por el momento.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {testimonials.map(t => (
                <TestimonialCard key={t.id} testimonial={t} />
              ))}
            </div>
          )}

          {/* CTA */}
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
