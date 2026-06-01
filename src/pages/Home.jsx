import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle, Users, Award, BookOpen, MessageCircle } from 'lucide-react';
import { FacebookIcon, InstagramIcon, LinkedinIcon, TikTokIcon } from '../components/ui/SocialIcons';
import draSoteloImg from '../assets/Dra-Luz-Sotelo-768x768.jpg';
import { CourseCard } from '../components/courses/CourseCard';
import { TestimonialCard } from '../components/testimonials/TestimonialCard';
import { getCourses } from '../services/coursesService';
import { TESTIMONIALS_DATA } from '../data/courses';

const WHATSAPP_URL = 'https://wa.me/51989019135?text=Hola,%20me%20interesa%20información%20sobre%20los%20cursos%20de%20la%20Academia.';

const STATS = [
  { icon: Users, value: '500+', label: 'Profesionales formados' },
  { icon: BookOpen, value: '20+', label: 'Cursos y talleres' },
  { icon: Award, value: '10+', label: 'Años de experiencia' },
];

const PILLARS = [
  'Docentes especialistas de reconocida trayectoria nacional e internacional',
  'Contenido clínico actualizado y aplicado a la práctica real',
  'Metodología presencial, virtual e híbrida',
  'Certificación de participación para cada programa',
  'Red de profesionales especializados en Medicina del Dolor',
];

const SOCIAL_LINKS = [
  { icon: FacebookIcon, href: 'https://www.facebook.com/draluzsotelohealthacademy', label: 'Facebook', color: 'hover:bg-blue-600' },
  { icon: InstagramIcon, href: 'https://www.instagram.com/draluzsotelohealthacademy/', label: 'Instagram', color: 'hover:bg-pink-600' },
  { icon: LinkedinIcon, href: 'https://www.linkedin.com/in/luz-sotelo-valenzuela-50220b366/', label: 'LinkedIn', color: 'hover:bg-blue-700' },
];

export function Home() {
  const [upcomingCourses, setUpcomingCourses] = useState([]);

  useEffect(() => {
    getCourses().then(all => {
      setUpcomingCourses(all.filter(c => c.status === 'por_realizar').slice(0, 3));
    });
  }, []);

  return (
    <>
      {/* HERO */}
      <section className="bg-brand-dark text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-dark via-brand-dark to-primary/20 pointer-events-none" />
        <div className="container-site relative py-20 lg:py-28">
          <div className="max-w-3xl">
            <div className="inline-block bg-primary/20 border border-primary/40 text-primary text-xs font-semibold px-3 py-1 rounded-full mb-6 uppercase tracking-wider">
              Formación Médica Especializada
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6 text-white">
              Formación de Excelencia en{' '}
              <span className="text-primary">Medicina del Dolor</span>
            </h1>
            <p className="text-white/80 text-lg sm:text-xl leading-relaxed mb-10 max-w-2xl">
              Cursos, talleres y ponencias con expertos de alto nivel para profesionales de la salud que buscan ampliar su competencia clínica en el manejo del dolor y cuidados paliativos.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/cursos"
                className="inline-flex items-center justify-center gap-2 bg-primary text-white font-semibold px-7 py-3.5 rounded-sm hover:bg-primary-dark transition-colors duration-200"
              >
                Ver próximos cursos
                <ArrowRight size={18} />
              </Link>
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 border-2 border-white/30 text-white font-semibold px-7 py-3.5 rounded-sm hover:bg-white/10 transition-colors duration-200"
              >
                <MessageCircle size={18} />
                Escríbenos por WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="bg-primary">
        <div className="container-site py-8">
          <div className="grid grid-cols-3 gap-4 text-white text-center">
            {STATS.map(({ icon: Icon, value, label }) => (
              <div key={label} className="flex flex-col items-center gap-1">
                <Icon size={22} className="opacity-80 mb-1" />
                <span className="text-2xl sm:text-3xl font-bold">{value}</span>
                <span className="text-white/80 text-xs sm:text-sm">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* UPCOMING COURSES PREVIEW */}
      {upcomingCourses.length > 0 && (
        <section className="py-16 lg:py-20">
          <div className="container-site">
            <div className="text-center mb-10">
              <p className="text-primary text-sm font-semibold uppercase tracking-wider mb-2">Calendario académico</p>
              <h2 className="section-title">Próximos Programas</h2>
              <div className="section-divider mx-auto" />
              <p className="section-subtitle">Amplía tu especialización con nuestros programas de formación</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcomingCourses.map(course => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
            <div className="text-center mt-10">
              <Link
                to="/cursos"
                className="inline-flex items-center gap-2 text-primary font-semibold hover:gap-3 transition-all duration-200"
              >
                Ver todos los programas
                <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ABOUT PREVIEW */}
      <section className="py-16 lg:py-20 bg-brand-lightgray">
        <div className="container-site">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Photo */}
            <div className="relative">
              <div className="rounded-sm aspect-[4/5] max-w-sm mx-auto lg:mx-0 overflow-hidden shadow-card-hover">
                <img
                  src={draSoteloImg}
                  alt="Dra. Luz Sotelo Valenzuela — Especialista en Medicina del Dolor"
                  className="w-full h-full object-cover object-top"
                  loading="lazy"
                />
              </div>
              <div className="absolute -bottom-4 -right-4 lg:-right-6 bg-primary text-white p-4 rounded-sm shadow-lg max-w-[180px]">
                <p className="font-bold text-2xl leading-none">10+</p>
                <p className="text-white/90 text-xs mt-1">Años de experiencia clínica</p>
              </div>
            </div>

            {/* Content */}
            <div>
              <p className="text-primary text-sm font-semibold uppercase tracking-wider mb-2">Nuestra Academia</p>
              <h2 className="section-title mb-4">Liderada por una Especialista de Referencia</h2>
              <div className="section-divider" />
              <p className="text-brand-text leading-relaxed mb-4">
                La <strong className="text-brand-dark">Dra. Luz Sotelo Valenzuela</strong> es médico anestesióloga con especialización en Medicina del Dolor y Cuidados Paliativos.
                {/* [PENDIENTE: validar cargo actual y hospital] */}
                Con amplia experiencia en el manejo multidisciplinario del dolor, lidera programas de formación dirigidos a profesionales de la salud comprometidos con la excelencia clínica.
              </p>
              <p className="text-brand-text leading-relaxed mb-6">
                La Health Academy nace con el propósito de elevar el estándar en la formación especializada en dolor, acercando a los profesionales de salud a los conocimientos y herramientas más actualizados del campo.
              </p>

              <ul className="space-y-2 mb-8">
                {PILLARS.map(p => (
                  <li key={p} className="flex items-start gap-2 text-brand-text text-sm">
                    <CheckCircle size={16} className="text-primary flex-shrink-0 mt-0.5" />
                    {p}
                  </li>
                ))}
              </ul>

              <Link
                to="/nosotros"
                className="inline-flex items-center gap-2 bg-primary text-white font-semibold px-6 py-3 rounded-sm hover:bg-primary-dark transition-colors duration-200"
              >
                Conocer más
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS PREVIEW */}
      <section className="py-16 lg:py-20">
        <div className="container-site">
          <div className="text-center mb-10">
            <p className="text-primary text-sm font-semibold uppercase tracking-wider mb-2">Lo que dicen nuestros alumnos</p>
            <h2 className="section-title">Testimonios</h2>
            <div className="section-divider mx-auto" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {TESTIMONIALS_DATA.map(t => (
              <TestimonialCard key={t.id} testimonial={t} />
            ))}
          </div>
          <div className="text-center mt-10">
            <Link
              to="/testimonios"
              className="inline-flex items-center gap-2 text-primary font-semibold hover:gap-3 transition-all duration-200"
            >
              Ver todos los testimonios
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* SOCIAL SECTION */}
      <section className="py-16 bg-brand-lightgray">
        <div className="container-site">
          <div className="text-center mb-10">
            <p className="text-primary text-sm font-semibold uppercase tracking-wider mb-2">Comunidad digital</p>
            <h2 className="section-title">Síguenos en Redes Sociales</h2>
            <div className="section-divider mx-auto" />
            <p className="section-subtitle">Mantente actualizado con contenido especializado en Medicina del Dolor</p>
          </div>
          <div className="flex flex-wrap justify-center gap-4">
            {SOCIAL_LINKS.map(({ icon: Icon, href, label, color }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center gap-3 bg-white border border-brand-gray px-6 py-4 rounded-sm shadow-card font-semibold text-brand-dark text-sm hover:text-white ${color} transition-all duration-200 hover:border-transparent hover:shadow-card-hover`}
              >
                <Icon size={20} />
                {label}
              </a>
            ))}
            <a
              href="https://www.tiktok.com/@healthacademy.edu"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 bg-white border border-brand-gray px-6 py-4 rounded-sm shadow-card font-semibold text-brand-dark text-sm hover:text-white hover:bg-black transition-all duration-200 hover:border-transparent hover:shadow-card-hover"
            >
              <TikTokIcon size={20} />
              TikTok
            </a>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-16 bg-primary text-white">
        <div className="container-site text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-white">¿Listo para avanzar en tu especialidad?</h2>
          <p className="text-white/85 text-lg mb-8 max-w-xl mx-auto">
            Contáctanos hoy y recibe información detallada sobre nuestros próximos programas de formación.
          </p>
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-white text-primary font-bold px-8 py-4 rounded-sm hover:bg-brand-lightgray transition-colors duration-200 text-lg"
          >
            <MessageCircle size={22} />
            Reserva tu cupo por WhatsApp
          </a>
        </div>
      </section>
    </>
  );
}
