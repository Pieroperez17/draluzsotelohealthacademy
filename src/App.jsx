import { Component } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { AdminRoute, StudentRoute } from './routes/ProtectedRoute';
import { PublicLayout } from './layouts/PublicLayout';
import { AdminLayout } from './layouts/AdminLayout';
import { IntranetLayout } from './layouts/IntranetLayout';

// Public pages
import { Home } from './pages/Home';
import { Courses } from './pages/Courses';
import { About } from './pages/About';
import { Testimonials } from './pages/Testimonials';
import { Contact } from './pages/Contact';

// Admin pages
import { Login } from './pages/admin/Login';
import { Dashboard } from './pages/admin/Dashboard';
import { CoursesAdmin } from './pages/admin/CoursesAdmin';
import { CourseDetailAdmin } from './pages/admin/CourseDetailAdmin';
import { StudentsAdmin } from './pages/admin/StudentsAdmin';
import { TestimonialsAdmin } from './pages/admin/TestimonialsAdmin';
import { SettingsAdmin } from './pages/admin/SettingsAdmin';

// Intranet pages
import { IntranetLogin } from './pages/intranet/IntranetLogin';
import { IntranetDashboard } from './pages/intranet/IntranetDashboard';
import { IntranetCourse } from './pages/intranet/IntranetCourse';

class ErrorBoundary extends Component {
  state = { error: null };
  static getDerivedStateFromError(error) { return { error }; }
  render() {
    if (this.state.error) {
      return (
        <div style={{ padding: '2rem', fontFamily: 'sans-serif', color: '#1F2937' }}>
          <h2 style={{ color: '#BA0304' }}>Error en la aplicación</h2>
          <pre style={{ background: '#f8f9fa', padding: '1rem', borderRadius: '4px', fontSize: '13px', overflow: 'auto' }}>
            {this.state.error.message}
          </pre>
          <button onClick={() => window.location.reload()} style={{ marginTop: '1rem', background: '#BA0304', color: 'white', border: 'none', padding: '0.5rem 1rem', cursor: 'pointer', borderRadius: '4px' }}>
            Recargar página
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* ── Sitio público ──────────────────────────── */}
            <Route element={<PublicLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/cursos" element={<Courses />} />
              <Route path="/nosotros" element={<About />} />
              <Route path="/testimonios" element={<Testimonials />} />
              <Route path="/contacto" element={<Contact />} />
            </Route>

            {/* ── Admin ──────────────────────────────────── */}
            <Route path="/admin/login" element={<Login />} />
            <Route
              path="/admin"
              element={<AdminRoute><AdminLayout /></AdminRoute>}
            >
              <Route index element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="cursos" element={<CoursesAdmin />} />
              <Route path="cursos/:id" element={<CourseDetailAdmin />} />
              <Route path="estudiantes" element={<StudentsAdmin />} />
              <Route path="testimonios" element={<TestimonialsAdmin />} />
              <Route path="configuracion" element={<SettingsAdmin />} />
            </Route>

            {/* ── Intranet (estudiantes) ─────────────────── */}
            <Route path="/intranet/login" element={<IntranetLogin />} />
            <Route
              path="/intranet"
              element={<StudentRoute><IntranetLayout /></StudentRoute>}
            >
              <Route index element={<Navigate to="/intranet/dashboard" replace />} />
              <Route path="dashboard" element={<IntranetDashboard />} />
              <Route path="curso/:id" element={<IntranetCourse />} />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ErrorBoundary>
  );
}
