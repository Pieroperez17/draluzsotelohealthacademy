import { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Menu, X, Phone } from 'lucide-react';

const NAV_LINKS = [
  { to: '/', label: 'Inicio' },
  { to: '/cursos', label: 'Cursos' },
  { to: '/nosotros', label: 'Nosotros' },
  { to: '/testimonios', label: 'Testimonios' },
  { to: '/contacto', label: 'Contacto' },
];

const WHATSAPP_NUMBER = '51989019135';
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=Hola,%20me%20interesa%20información%20sobre%20los%20cursos%20de%20la%20Academia.`;

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [location]);

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 bg-white transition-shadow duration-300 ${scrolled ? 'shadow-nav' : 'border-b border-brand-gray'}`}>
      {/* Top bar */}
      <div className="bg-primary text-white text-xs py-1.5 hidden md:block">
        <div className="container-site flex justify-between items-center">
          <span className="opacity-90">Formación de Excelencia en Medicina del Dolor</span>
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 hover:opacity-80 transition-opacity"
          >
            <Phone size={12} />
            +51 989 019 135
          </a>
        </div>
      </div>

      {/* Main nav */}
      <div className="container-site">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex flex-col leading-tight">
            <span className="text-primary font-bold text-sm sm:text-base tracking-wide uppercase">Dra. Luz Sotelo</span>
            <span className="text-brand-dark font-semibold text-xs sm:text-sm tracking-widest uppercase">Health Academy</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {NAV_LINKS.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                className={({ isActive }) =>
                  `px-4 py-2 text-sm font-medium transition-colors duration-200 rounded-sm ${
                    isActive
                      ? 'text-primary border-b-2 border-primary'
                      : 'text-brand-dark hover:text-primary'
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
          </nav>

          {/* CTA + hamburger */}
          <div className="flex items-center gap-3">
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-2 bg-primary text-white text-sm font-semibold px-4 py-2 rounded-sm hover:bg-primary-dark transition-colors duration-200"
            >
              Inscríbete
            </a>
            <button
              className="lg:hidden p-2 text-brand-dark hover:text-primary transition-colors"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Abrir menú"
            >
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="lg:hidden border-t border-brand-gray bg-white shadow-nav">
          <nav className="container-site py-4 flex flex-col gap-1">
            {NAV_LINKS.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                className={({ isActive }) =>
                  `px-4 py-3 text-sm font-medium rounded-sm transition-colors ${
                    isActive ? 'bg-red-50 text-primary' : 'text-brand-dark hover:bg-brand-lightgray'
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 bg-primary text-white text-sm font-semibold px-4 py-3 rounded-sm text-center hover:bg-primary-dark transition-colors"
            >
              Inscríbete ahora
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
