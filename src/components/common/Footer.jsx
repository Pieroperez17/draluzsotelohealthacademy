import { Link } from 'react-router-dom';
import { Phone, Mail } from 'lucide-react';
import { FacebookIcon, InstagramIcon, LinkedinIcon, TikTokIcon } from '../ui/SocialIcons';

const SOCIAL_LINKS = [
  { icon: FacebookIcon, href: 'https://www.facebook.com/draluzsotelohealthacademy', label: 'Facebook' },
  { icon: InstagramIcon, href: 'https://www.instagram.com/draluzsotelohealthacademy/', label: 'Instagram' },
  { icon: LinkedinIcon, href: 'https://www.linkedin.com/in/luz-sotelo-valenzuela-50220b366/', label: 'LinkedIn' },
];

const NAV_LINKS = [
  { to: '/', label: 'Inicio' },
  { to: '/cursos', label: 'Cursos' },
  { to: '/nosotros', label: 'Nosotros' },
  { to: '/testimonios', label: 'Testimonios' },
  { to: '/contacto', label: 'Contacto' },
];

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-brand-dark text-white">
      <div className="container-site py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="mb-4">
              <span className="block text-primary font-bold text-lg tracking-wide uppercase">Dra. Luz Sotelo</span>
              <span className="block text-white font-semibold text-base tracking-widest uppercase opacity-90">Health Academy</span>
            </div>
            <p className="text-brand-midgray text-sm leading-relaxed max-w-xs">
              Formación de excelencia en Medicina del Dolor para profesionales de la salud comprometidos con brindar la mejor atención a sus pacientes.
            </p>
            <div className="flex gap-3 mt-6">
              {SOCIAL_LINKS.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-9 h-9 rounded-sm bg-white/10 flex items-center justify-center hover:bg-primary transition-colors duration-200"
                >
                  <Icon size={16} />
                </a>
              ))}
              <a
                href="https://www.tiktok.com/@healthacademy.edu"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="TikTok"
                className="w-9 h-9 rounded-sm bg-white/10 flex items-center justify-center hover:bg-primary transition-colors duration-200"
              >
                <TikTokIcon size={16} />
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">Navegación</h4>
            <ul className="space-y-2">
              {NAV_LINKS.map(({ to, label }) => (
                <li key={to}>
                  <Link
                    to={to}
                    className="text-brand-midgray text-sm hover:text-white transition-colors duration-200"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">Contacto</h4>
            <ul className="space-y-3">
              <li>
                <a
                  href="https://wa.me/51989019135?text=Hola,%20me%20interesa%20información%20sobre%20los%20cursos."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-brand-midgray text-sm hover:text-white transition-colors"
                >
                  <Phone size={14} className="text-brand-whatsapp flex-shrink-0" />
                  +51 989 019 135
                </a>
              </li>
              <li>
                <a
                  href="mailto:contacto@draluzsotelohealthacademy.com"
                  className="flex items-center gap-2 text-brand-midgray text-sm hover:text-white transition-colors"
                >
                  <Mail size={14} className="text-primary flex-shrink-0" />
                  {/* [PENDIENTE: confirmar correo oficial] */}
                  contacto@healthacademy.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-12 pt-6 flex flex-col sm:flex-row justify-between items-center gap-3 text-brand-midgray text-xs">
          <p>© {year} Dra. Luz Sotelo Health Academy. Todos los derechos reservados.</p>
          <p>Lima, Perú</p>
        </div>
      </div>
    </footer>
  );
}
