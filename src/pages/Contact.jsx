import { useForm } from 'react-hook-form';
import { Phone, Mail, MessageCircle } from 'lucide-react';
import { FacebookIcon, InstagramIcon, LinkedinIcon, TikTokIcon } from '../components/ui/SocialIcons';

const WHATSAPP_URL = 'https://wa.me/51989019135?text=Hola,%20quisiera%20más%20información%20sobre%20los%20cursos%20de%20la%20Academia.';

const SOCIAL_LINKS = [
  { icon: FacebookIcon, href: 'https://www.facebook.com/draluzsotelohealthacademy', label: 'Facebook' },
  { icon: InstagramIcon, href: 'https://www.instagram.com/draluzsotelohealthacademy/', label: 'Instagram' },
  { icon: LinkedinIcon, href: 'https://www.linkedin.com/in/luz-sotelo-valenzuela-50220b366/', label: 'LinkedIn' },
];

export function Contact() {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting, isSubmitSuccessful } } = useForm();

  const onSubmit = (data) => {
    const lines = [
      `*Nuevo mensaje desde el sitio web*`,
      ``,
      `*Nombre:* ${data.name}`,
      `*Correo:* ${data.email}`,
      data.profession ? `*Profesión:* ${data.profession}` : null,
      `*Asunto:* ${data.subject}`,
      ``,
      `*Mensaje:*`,
      data.message,
    ]
      .filter(l => l !== null)
      .join('\n');

    const whatsappUrl = `https://wa.me/51989019135?text=${encodeURIComponent(lines)}`;
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    reset();
  };

  return (
    <>
      {/* Hero */}
      <section className="bg-brand-dark text-white py-14 lg:py-20">
        <div className="container-site">
          <p className="text-primary text-sm font-semibold uppercase tracking-wider mb-2">Estamos para ayudarte</p>
          <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">Contacto</h1>
          <p className="text-white/80 text-lg max-w-2xl">
            Escríbenos por WhatsApp o completa el formulario y te responderemos a la brevedad.
          </p>
        </div>
      </section>

      <section className="py-16 lg:py-20">
        <div className="container-site">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
            {/* Contact info */}
            <div className="lg:col-span-2 space-y-8">
              {/* WhatsApp CTA */}
              <div>
                <h2 className="text-xl font-bold text-brand-dark mb-4">Contáctanos directo</h2>
                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 bg-brand-whatsapp text-white font-semibold px-6 py-4 rounded-sm hover:bg-green-600 transition-colors duration-200 w-full sm:w-auto"
                >
                  <MessageCircle size={22} />
                  <div>
                    <p className="text-sm font-bold">Escríbenos por WhatsApp</p>
                    <p className="text-white/80 text-xs">+51 989 019 135</p>
                  </div>
                </a>
              </div>

              {/* Contact details */}
              <div>
                <h3 className="font-semibold text-brand-dark mb-3">Información de contacto</h3>
                <ul className="space-y-3">
                  <li>
                    <a
                      href="tel:+51989019135"
                      className="flex items-center gap-3 text-brand-text hover:text-primary transition-colors text-sm"
                    >
                      <span className="w-8 h-8 rounded-sm bg-brand-lightgray flex items-center justify-center flex-shrink-0">
                        <Phone size={15} className="text-primary" />
                      </span>
                      +51 989 019 135
                    </a>
                  </li>
                  <li>
                    <a
                      href="mailto:contacto@healthacademy.com"
                      className="flex items-center gap-3 text-brand-text hover:text-primary transition-colors text-sm"
                    >
                      <span className="w-8 h-8 rounded-sm bg-brand-lightgray flex items-center justify-center flex-shrink-0">
                        <Mail size={15} className="text-primary" />
                      </span>
                      {/* [PENDIENTE: correo oficial a confirmar] */}
                      contacto@healthacademy.com
                    </a>
                  </li>
                </ul>
              </div>

              {/* Social */}
              <div>
                <h3 className="font-semibold text-brand-dark mb-3">Redes sociales</h3>
                <div className="flex gap-3">
                  {SOCIAL_LINKS.map(({ icon: Icon, href, label }) => (
                    <a
                      key={label}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={label}
                      className="w-10 h-10 rounded-sm bg-brand-lightgray border border-brand-gray flex items-center justify-center text-brand-text hover:bg-primary hover:text-white hover:border-primary transition-all duration-200"
                    >
                      <Icon size={18} />
                    </a>
                  ))}
                  <a
                    href="https://www.tiktok.com/@healthacademy.edu"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="TikTok"
                    className="w-10 h-10 rounded-sm bg-brand-lightgray border border-brand-gray flex items-center justify-center text-brand-text hover:bg-black hover:text-white hover:border-black transition-all duration-200"
                  >
                    <TikTokIcon size={18} />
                  </a>
                </div>
              </div>

              {/* Hours [PENDIENTE] */}
              <div className="card p-5 bg-brand-lightgray">
                <h3 className="font-semibold text-brand-dark mb-3 text-sm">Horario de atención</h3>
                <div className="space-y-1 text-brand-text text-sm">
                  <div className="flex justify-between">
                    <span>Lun – Dom</span>
                    <span className="font-medium">7:00 – 22:00</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Form */}
            <div className="lg:col-span-3">
              <div className="card p-8">
                <h2 className="text-xl font-bold text-brand-dark mb-6">Envíanos un mensaje</h2>

                {isSubmitSuccessful && (
                  <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-sm text-sm">
                    ✓ Se abrió WhatsApp con tu mensaje listo para enviar.
                  </div>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-brand-dark mb-1.5">
                        Nombre completo <span className="text-primary">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="Dr. Juan García"
                        className={`w-full border rounded-sm px-4 py-2.5 text-sm text-brand-dark placeholder:text-brand-midgray focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition ${errors.name ? 'border-red-400' : 'border-brand-gray'}`}
                        {...register('name', { required: 'Este campo es obligatorio' })}
                      />
                      {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-brand-dark mb-1.5">
                        Correo electrónico <span className="text-primary">*</span>
                      </label>
                      <input
                        type="email"
                        placeholder="correo@ejemplo.com"
                        className={`w-full border rounded-sm px-4 py-2.5 text-sm text-brand-dark placeholder:text-brand-midgray focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition ${errors.email ? 'border-red-400' : 'border-brand-gray'}`}
                        {...register('email', {
                          required: 'El correo es obligatorio',
                          pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Correo inválido' },
                        })}
                      />
                      {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-brand-dark mb-1.5">Profesión</label>
                    <input
                      type="text"
                      placeholder="Médico, Enfermero, Psicólogo..."
                      className="w-full border border-brand-gray rounded-sm px-4 py-2.5 text-sm text-brand-dark placeholder:text-brand-midgray focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
                      {...register('profession')}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-brand-dark mb-1.5">
                      Asunto <span className="text-primary">*</span>
                    </label>
                    <select
                      className={`w-full border rounded-sm px-4 py-2.5 text-sm text-brand-dark focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition ${errors.subject ? 'border-red-400' : 'border-brand-gray'}`}
                      {...register('subject', { required: 'Selecciona un asunto' })}
                    >
                      <option value="">Selecciona una opción</option>
                      <option>Información sobre próximos cursos</option>
                      <option>Inscripción a un programa</option>
                      <option>Consulta sobre contenido académico</option>
                      <option>Alianzas institucionales</option>
                      <option>Otro</option>
                    </select>
                    {errors.subject && <p className="text-red-500 text-xs mt-1">{errors.subject.message}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-brand-dark mb-1.5">
                      Mensaje <span className="text-primary">*</span>
                    </label>
                    <textarea
                      rows={5}
                      placeholder="Escribe tu consulta aquí..."
                      className={`w-full border rounded-sm px-4 py-2.5 text-sm text-brand-dark placeholder:text-brand-midgray focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition resize-none ${errors.message ? 'border-red-400' : 'border-brand-gray'}`}
                      {...register('message', { required: 'Por favor escribe tu mensaje', minLength: { value: 10, message: 'El mensaje es muy corto' } })}
                    />
                    {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message.message}</p>}
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex items-center justify-center gap-2 w-full bg-brand-whatsapp text-white font-semibold py-3 rounded-sm hover:bg-green-600 disabled:opacity-60 disabled:cursor-not-allowed transition-colors duration-200"
                  >
                    <MessageCircle size={18} />
                    Enviar por WhatsApp
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
