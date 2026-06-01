import { CheckCircle, GraduationCap, Award, BookOpen, Stethoscope, Globe, Users } from 'lucide-react';
import draSoteloImg from '../assets/Dra-Luz-Sotelo-768x768.jpg';

const EDUCATION = [
  {
    period: '2020 – 2022',
    institution: 'Universidad de Salamanca (USAL) — España',
    degree: 'Máster en Tratamiento del Dolor en la Práctica Clínica',
    note: 'Reconocido por SUNEDU Perú: R.J. N° 01541-2024-SUNEDU-DS-DIGRAT-URGT (07/03/2024)',
  },
  {
    period: '2018',
    institution: 'Fundación Dolor — Buenos Aires, Argentina',
    degree: 'Fellowship de Medicina del Dolor',
    note: 'Certificate of Training WFSA CLASA',
  },
  {
    period: '2013 – 2016',
    institution: 'Universidad Peruana Cayetano Heredia — Lima, Perú',
    degree: 'Especialidad en Anestesiología',
    note: '',
  },
  {
    period: '2006 – 2012',
    institution: 'Universidad San Pedro — Chimbote, Ancash, Perú',
    degree: 'Médico Cirujano',
    note: '',
  },
  {
    period: '2015',
    institution: 'Instituto de Alta Capacitación y Especialización Profesional — Perú',
    degree: 'Diploma de Auditoría Médica',
    note: '',
  },
  {
    period: '2014',
    institution: 'Universidad Nacional José Faustino Sánchez Carrión',
    degree: 'Diploma en Salud Ocupacional',
    note: '',
  },
  {
    period: '2013',
    institution: 'Universidad Nacional de Trujillo — Perú',
    degree: 'Diploma en Salud Ocupacional',
    note: '',
  },
];

const EXPERIENCE = [
  {
    period: '2024 – actualidad',
    role: 'Directora Académica — Health Academy',
    place: 'Perú',
    current: true,
  },
  {
    period: '2022 – actualidad',
    role: 'Coordinadora del Capítulo de Medicina del Dolor',
    place: 'Sociedad Peruana de Anestesia, Analgesia y Reanimación',
    current: true,
  },
  {
    period: '2020 – actualidad',
    role: 'Coordinadora de la Unidad de Terapia del Dolor y Cuidados Paliativos',
    place: 'Hospital Nacional Edgardo Rebagliati Martins — Lima, Perú',
    current: true,
  },
  {
    period: '2021 – actualidad',
    role: 'Speaker — Grunenthal Perú S.A.',
    place: 'Perú',
    current: true,
  },
  {
    period: '2022 – 2023',
    role: 'Docente / Tutora Clínica',
    place: 'Universidad Norbert Wiener — Lima, Perú',
    current: false,
  },
  {
    period: '2023',
    role: 'Vocal — Sociedad Peruana de Cuidados Paliativos',
    place: 'Lima, Perú',
    current: false,
  },
  {
    period: 'Pasado',
    role: 'Coordinadora de la Unidad de Intervencionismo en Dolor Oncológico',
    place: 'Instituto Nacional de Enfermedades Neoplásicas — Lima, Perú',
    current: false,
  },
];

const PUBLICATIONS = [
  {
    icon: BookOpen,
    title: 'Técnicas Intervencionistas en Dolor — Primera Edición',
    detail: 'Coautora del libro. 2025.',
  },
  {
    icon: BookOpen,
    title: 'Tratamiento tópico vs sistémico para el alivio del Dolor Neuropático',
    detail: 'Coautora del artículo científico. 2023.',
  },
];

const MEMBERSHIPS = [
  'Miembro Titular Activo — Sociedad Peruana de Anestesia, Analgesia y Reanimación (2016 a la fecha)',
  'Certificate of Membership — Asociación Internacional para el Estudio del Dolor (IASP). 2020',
];

const SPECIALTIES = [
  'Anestesiología',
  'Medicina del Dolor',
  'Cuidados Paliativos',
  'Intervencionismo en Dolor',
  'Dolor Oncológico',
  'Dolor Neuropático',
];

const VALUES = [
  ['Expertos de alto nivel', 'Docentes con trayectoria clínica y académica probada en Medicina del Dolor nacional e internacional.'],
  ['Contenido aplicado', 'Programas diseñados para ser directamente aplicables en la práctica clínica diaria del profesional de salud.'],
  ['Comunidad profesional', 'Acceso a una red de profesionales especializados en dolor a nivel nacional e internacional.'],
  ['Certificación válida', 'Certificados de participación emitidos para cada programa académico completado.'],
  ['Modalidad flexible', 'Opciones presenciales, virtuales e híbridas para adaptarse a tu agenda y ubicación.'],
  ['Actualización constante', 'Programas alineados con los últimos avances en medicina del dolor y cuidados paliativos.'],
];

export function About() {
  return (
    <>
      {/* Hero */}
      <section className="bg-brand-dark text-white py-14 lg:py-20">
        <div className="container-site">
          <p className="text-primary text-sm font-semibold uppercase tracking-wider mb-2">La Academia</p>
          <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">Nosotros</h1>
          <p className="text-white/80 text-lg max-w-2xl">
            Conoce la historia, misión y el perfil profesional detrás de la Dra. Luz Sotelo Health Academy.
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 lg:py-20">
        <div className="container-site">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="card p-8 border-t-4 border-primary">
              <GraduationCap size={32} className="text-primary mb-4" />
              <h2 className="text-xl font-bold text-brand-dark mb-3">Misión</h2>
              <p className="text-brand-text leading-relaxed">
                Brindar formación de excelencia en Medicina del Dolor a profesionales de la salud, a través de programas académicos rigurosos, actualizados y liderados por expertos de trayectoria nacional e internacional, con el propósito de elevar la calidad del cuidado clínico ofrecido a los pacientes con dolor.
              </p>
            </div>
            <div className="card p-8 border-t-4 border-primary">
              <Award size={32} className="text-primary mb-4" />
              <h2 className="text-xl font-bold text-brand-dark mb-3">Visión</h2>
              <p className="text-brand-text leading-relaxed">
                Ser la academia de referencia en Latinoamérica para la formación especializada en Medicina del Dolor y Cuidados Paliativos, contribuyendo al desarrollo de una red de profesionales competentes y comprometidos con la atención integral del paciente.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Doctor Profile */}
      <section className="py-16 lg:py-20 bg-brand-lightgray">
        <div className="container-site">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-start">

            {/* Photo + credentials */}
            <div className="lg:col-span-2">
              <div className="rounded-sm overflow-hidden shadow-card-hover max-w-xs mx-auto lg:mx-0 aspect-square">
                <img
                  src={draSoteloImg}
                  alt="Dra. Luz Sotelo Valenzuela — Médico Anestesióloga Especialista en Dolor y Cuidados Paliativos"
                  className="w-full h-full object-cover object-top"
                  loading="lazy"
                />
              </div>
              {/* Credential card */}
              <div className="mt-6 bg-white card p-5 space-y-3">
                {[
                  ['CMP', '61312'],
                  ['RNE', '29942'],
                  ['Especialidad', 'Anestesiología'],
                  ['Subespecialidad', 'Dolor y Cuidados Paliativos'],
                  ['País', 'Lima, Perú'],
                ].map(([label, value]) => (
                  <div key={label} className="flex justify-between items-baseline border-b border-brand-gray pb-2 last:border-0 last:pb-0">
                    <span className="text-xs text-brand-midgray uppercase tracking-wide">{label}</span>
                    <span className="text-sm font-semibold text-brand-dark text-right">{value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Bio */}
            <div className="lg:col-span-3">
              <p className="text-primary text-sm font-semibold uppercase tracking-wider mb-2">Directora Académica</p>
              <h2 className="text-3xl font-bold text-brand-dark mb-1">Dra. Luz Sotelo Valenzuela</h2>
              <p className="text-primary font-medium text-base mb-4">Médico Anestesióloga Especialista en Dolor y Cuidados Paliativos</p>
              <div className="w-12 h-0.5 bg-primary mb-6" />

              <div className="space-y-4 text-brand-text leading-relaxed mb-8">
                <p>
                  Médico Anestesióloga con Fellowship (especialista) en Medicina del Dolor y Cuidados Paliativos. Ponente Nacional e Internacional, Coautora de Libros y Publicaciones, y Docente universitaria con amplia trayectoria clínica y académica.
                </p>
                <p>
                  Actualmente se desempeña como <strong className="text-brand-dark">Coordinadora de la Unidad de Terapia del Dolor y Cuidados Paliativos del Hospital Nacional Edgardo Rebagliati Martins</strong> (Lima, Perú), uno de los centros de referencia más importantes del país.
                </p>
                <p>
                  Cuenta con formación de posgrado en la <strong className="text-brand-dark">Universidad de Salamanca (España)</strong>, Fellowship en la <strong className="text-brand-dark">Fundación Dolor de Buenos Aires (Argentina)</strong> y especialización en Anestesiología en la <strong className="text-brand-dark">Universidad Peruana Cayetano Heredia</strong>.
                </p>
                <p>
                  Como <strong className="text-brand-dark">Directora Académica de Health Academy</strong> desde 2024, lidera programas de formación especializada en Medicina del Dolor dirigidos a profesionales de la salud que buscan elevar su competencia clínica.
                </p>
              </div>

              {/* Specialties */}
              <h3 className="font-semibold text-brand-dark mb-3 flex items-center gap-2">
                <Stethoscope size={17} className="text-primary" />
                Áreas de especialización
              </h3>
              <div className="flex flex-wrap gap-2 mb-8">
                {SPECIALTIES.map(s => (
                  <span key={s} className="bg-white border border-brand-gray text-brand-text text-sm px-3 py-1 rounded-full">
                    {s}
                  </span>
                ))}
              </div>

              {/* Languages */}
              <div className="flex items-center gap-2 text-brand-text text-sm">
                <Globe size={16} className="text-primary flex-shrink-0" />
                <span><strong className="text-brand-dark">Idiomas:</strong> Español (nativo) · Inglés (intermedio)</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Experience Timeline */}
      <section className="py-16 lg:py-20">
        <div className="container-site">
          <div className="text-center mb-12">
            <p className="text-primary text-sm font-semibold uppercase tracking-wider mb-2">Recorrido profesional</p>
            <h2 className="section-title">Experiencia Laboral</h2>
            <div className="section-divider mx-auto" />
          </div>

          <div className="max-w-3xl mx-auto space-y-4">
            {EXPERIENCE.map(({ period, role, place, current }) => (
              <div key={role} className="bg-white card p-5 flex gap-4 items-start">
                <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${current ? 'bg-primary' : 'bg-brand-midgray'}`} />
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className="text-xs font-semibold text-primary uppercase tracking-wide">{period}</span>
                    {current && (
                      <span className="bg-red-50 text-primary text-xs font-semibold px-2 py-0.5 rounded-full border border-red-100">
                        Actual
                      </span>
                    )}
                  </div>
                  <p className="font-semibold text-brand-dark text-sm leading-snug">{role}</p>
                  <p className="text-brand-text text-xs mt-0.5">{place}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Education */}
      <section className="py-16 lg:py-20 bg-brand-lightgray">
        <div className="container-site">
          <div className="text-center mb-12">
            <p className="text-primary text-sm font-semibold uppercase tracking-wider mb-2">Formación académica</p>
            <h2 className="section-title">Educación</h2>
            <div className="section-divider mx-auto" />
          </div>

          <div className="max-w-3xl mx-auto">
            <div className="relative">
              <div className="absolute left-[7.5rem] top-0 bottom-0 w-px bg-brand-gray hidden sm:block" />
              <div className="space-y-6">
                {EDUCATION.map(({ period, institution, degree, note }) => (
                  <div key={degree} className="flex flex-col sm:flex-row gap-3 sm:gap-6">
                    <div className="sm:w-28 flex-shrink-0 sm:text-right">
                      <span className="text-xs font-bold text-primary leading-tight">{period}</span>
                    </div>
                    <div className="relative sm:pl-8">
                      <div className="absolute left-0 top-1.5 w-3 h-3 rounded-full bg-primary border-2 border-white shadow-sm hidden sm:block" />
                      <p className="font-semibold text-brand-dark text-sm leading-snug">{degree}</p>
                      <p className="text-brand-text text-xs mt-0.5">{institution}</p>
                      {note && <p className="text-brand-midgray text-xs mt-1 italic">{note}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Publications & Memberships */}
      <section className="py-16 lg:py-20">
        <div className="container-site">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

            {/* Publications */}
            <div>
              <p className="text-primary text-sm font-semibold uppercase tracking-wider mb-2">Producción científica</p>
              <h2 className="text-2xl font-bold text-brand-dark mb-2">Publicaciones</h2>
              <div className="w-10 h-0.5 bg-primary mb-6" />
              <div className="space-y-4">
                {PUBLICATIONS.map(({ icon: Icon, title, detail }) => (
                  <div key={title} className="card p-5 flex gap-4">
                    <div className="w-10 h-10 rounded-sm bg-red-50 flex items-center justify-center flex-shrink-0">
                      <Icon size={18} className="text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold text-brand-dark text-sm leading-snug">{title}</p>
                      <p className="text-brand-midgray text-xs mt-1">{detail}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Memberships */}
            <div>
              <p className="text-primary text-sm font-semibold uppercase tracking-wider mb-2">Afiliaciones</p>
              <h2 className="text-2xl font-bold text-brand-dark mb-2">Membresías y Sociedades</h2>
              <div className="w-10 h-0.5 bg-primary mb-6" />
              <div className="space-y-3">
                {MEMBERSHIPS.map(m => (
                  <div key={m} className="card p-5 flex gap-3 items-start">
                    <Users size={16} className="text-primary flex-shrink-0 mt-0.5" />
                    <p className="text-brand-text text-sm leading-relaxed">{m}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values / Why us */}
      <section className="py-16 bg-brand-lightgray">
        <div className="container-site">
          <div className="text-center mb-10">
            <h2 className="section-title">¿Por qué formarse con nosotros?</h2>
            <div className="section-divider mx-auto" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {VALUES.map(([title, desc]) => (
              <div key={title} className="bg-white card p-6">
                <CheckCircle size={20} className="text-primary mb-3" />
                <h3 className="font-semibold text-brand-dark text-base mb-2">{title}</h3>
                <p className="text-brand-text text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
