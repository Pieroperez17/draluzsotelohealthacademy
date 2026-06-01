# Dra. Luz Sotelo Health Academy

Sitio web institucional y comercial para la **Dra. Luz Sotelo Health Academy** — Formación de Excelencia en Medicina del Dolor.

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white) ![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white) ![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38BDF8?logo=tailwindcss&logoColor=white) ![Supabase](https://img.shields.io/badge/Supabase-ready-3ECF8E?logo=supabase&logoColor=white)

---

## Stack Tecnológico

| Herramienta | Versión | Propósito |
|---|---|---|
| React | 19 | UI framework |
| Vite | 8 | Build tool |
| Tailwind CSS | 3 | Estilos |
| React Router DOM | 7 | Rutas SPA |
| React Hook Form | 7 | Formularios validados |
| Supabase JS | 2 | Auth + Base de datos |
| Lucide React | 1 | Íconos |

---

## Estructura del Proyecto

```
src/
├── assets/               # Imágenes y recursos estáticos
├── components/
│   ├── common/           # Header, Footer, WhatsAppButton
│   ├── courses/          # CourseCard
│   ├── testimonials/     # TestimonialCard
│   └── ui/               # Button, Badge, SocialIcons
├── contexts/             # AuthContext (Supabase Auth)
├── data/                 # Datos mock (cursos, testimonios)
├── layouts/              # PublicLayout, AdminLayout
├── pages/
│   ├── Home.jsx
│   ├── Courses.jsx
│   ├── About.jsx
│   ├── Testimonials.jsx
│   ├── Contact.jsx
│   └── admin/            # Login, Dashboard, CoursesAdmin
├── routes/               # ProtectedRoute
└── services/             # coursesService (Supabase o mock)
```

---

## Páginas del Sitio Público

| Ruta | Descripción |
|---|---|
| `/` | Inicio — Hero, stats, cursos próximos, perfil, testimonios, redes |
| `/cursos` | Listado de cursos con filtros por estado |
| `/nosotros` | Perfil de la doctora, trayectoria, educación, publicaciones |
| `/testimonios` | Testimonios de alumnos |
| `/contacto` | Formulario → WhatsApp, redes sociales, horario |

## Panel Administrativo

| Ruta | Descripción |
|---|---|
| `/admin/login` | Login con Supabase Auth |
| `/admin/dashboard` | Resumen estadístico |
| `/admin/cursos` | CRUD completo de cursos |

---

## Configuración del Entorno

Crea un archivo `.env.local` en la raíz del proyecto:

```env
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=tu-anon-key
```

> Sin estas variables el sitio funciona con datos de demostración incluidos en `src/data/courses.js`.

---

## Instalación y Desarrollo

```bash
# Instalar dependencias
npm install

# Servidor de desarrollo
npm run dev

# Build de producción
npm run build

# Vista previa del build
npm run preview
```

---

## Supabase — Tablas Requeridas

```sql
-- Cursos
create table courses (
  id bigint primary key generated always as identity,
  title text not null,
  slug text,
  short_description text,
  image_url text,
  course_date date,
  modality text,
  status text default 'por_realizar',
  is_visible boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Testimonios
create table testimonials (
  id bigint primary key generated always as identity,
  author_name text not null,
  role text,
  testimonial_text text,
  image_url text,
  is_visible boolean default true,
  created_at timestamptz default now()
);
```

---

## Características

- Diseño corporativo médico con color institucional `#BA0304`
- 100% Responsive (móvil, tablet, desktop)
- Botón WhatsApp flotante en todo el sitio
- Formulario de contacto que abre WhatsApp con el mensaje pre-armado
- Panel admin con autenticación Supabase y rutas protegidas
- Funciona con datos mock sin necesidad de Supabase configurado
- SEO básico (meta tags, lang es, semántica HTML)

---

## Redes Sociales

- **Facebook:** [draluzsotelohealthacademy](https://www.facebook.com/draluzsotelohealthacademy)
- **Instagram:** [@draluzsotelohealthacademy](https://www.instagram.com/draluzsotelohealthacademy/)
- **TikTok:** [@healthacademy.edu](https://www.tiktok.com/@healthacademy.edu)
- **LinkedIn:** [Luz Sotelo Valenzuela](https://www.linkedin.com/in/luz-sotelo-valenzuela-50220b366/)

---

## Contacto

**WhatsApp:** +51 989 019 135  
**Web:** [www.draluzsotelo.com](https://www.draluzsotelo.com)

---

*Desarrollado con React + Vite + Tailwind CSS + Supabase*
