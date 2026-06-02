import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Video, Plus, Trash2, Save, Link2, FileText, X, CheckCircle, AlertCircle, MapPin } from 'lucide-react';
import { getCourses, updateCourse } from '../../services/coursesService';
import { getCourseResources, addCourseResource, deleteCourseResource } from '../../services/resourceService';
import { getEnrollmentsByCourse } from '../../services/enrollmentService';
import { LocationPicker } from '../../components/ui/LocationPicker';
import { useForm } from 'react-hook-form';

function Toast({ message, type, onClose }) {
  useEffect(() => { const t = setTimeout(onClose, 4000); return () => clearTimeout(t); }, [onClose]);
  return (
    <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3 rounded-sm shadow-card-hover text-white text-sm font-medium ${type === 'error' ? 'bg-red-600' : 'bg-green-600'}`}>
      {type === 'error' ? <AlertCircle size={16} /> : <CheckCircle size={16} />}
      {message}
      <button onClick={onClose}><X size={14} /></button>
    </div>
  );
}

export function CourseDetailAdmin() {
  const { id } = useParams();
  const courseId = Number(id);
  const [course, setCourse] = useState(null);
  const [resources, setResources] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [toast, setToast] = useState(null);
  const [savingLink, setSavingLink] = useState(false);
  const [location, setLocation] = useState(null);
  const [savingLocation, setSavingLocation] = useState(false);
  const showToast = (message, type = 'success') => setToast({ message, type });

  const { register: regLink, handleSubmit: handleLink, reset: resetLink } = useForm();
  const { register: regRes, handleSubmit: handleRes, reset: resetRes, formState: { isSubmitting: addingRes } } = useForm({
    defaultValues: { title: '', url: '', resource_type: 'link' }
  });

  const load = async () => {
    // Cargar curso
    try {
      const all = await getCourses({ visibleOnly: false });
      const found = all.find(c => c.id === courseId);
      setCourse(found || null);
      if (found) {
        resetLink({ meeting_link: found.meeting_link || '' });
        // Cargar ubicación guardada
        if (found.location_lat && found.location_lng) {
          setLocation({
            address: found.location_address || '',
            lat: found.location_lat,
            lng: found.location_lng,
          });
        } else {
          setLocation(null);
        }
      }
    } catch (err) {
      showToast(`Error cargando curso: ${err.message}`, 'error');
    }

    // Cargar recursos (independiente)
    try {
      const r = await getCourseResources(courseId);
      setResources(r);
    } catch (err) {
      showToast(`Error cargando recursos: ${err.message}`, 'error');
    }

    // Cargar alumnos inscritos (independiente)
    try {
      const e = await getEnrollmentsByCourse(courseId);
      setEnrollments(e);
    } catch (err) {
      showToast(`Error cargando alumnos: ${err.message}`, 'error');
    }
  };

  useEffect(() => { load(); }, [courseId]);

  const saveMeetingLink = async ({ meeting_link }) => {
    setSavingLink(true);
    try {
      await updateCourse(courseId, { meeting_link: meeting_link || null });
      showToast('Enlace de reunión guardado');
      load();
    } catch (err) {
      showToast(`Error: ${err.message}`, 'error');
    } finally {
      setSavingLink(false);
    }
  };

  const saveLocation = async () => {
    setSavingLocation(true);
    try {
      await updateCourse(courseId, {
        location_address: location?.address ?? null,
        location_lat: location?.lat ?? null,
        location_lng: location?.lng ?? null,
      });
      showToast(location ? 'Ubicación guardada correctamente' : 'Ubicación eliminada');
      load();
    } catch (err) {
      showToast(`Error: ${err.message}`, 'error');
    } finally {
      setSavingLocation(false);
    }
  };

  const handleAddResource = async (data) => {
    try {
      await addCourseResource(courseId, data);
      showToast('Recurso agregado');
      resetRes({ title: '', url: '', resource_type: 'link' });
      load();
    } catch (err) {
      showToast(`Error: ${err.message}`, 'error');
    }
  };

  const handleDeleteResource = async (resId) => {
    if (!window.confirm('¿Eliminar este recurso?')) return;
    try {
      await deleteCourseResource(resId);
      showToast('Recurso eliminado');
      load();
    } catch (err) {
      showToast(`Error: ${err.message}`, 'error');
    }
  };

  if (!course) return <div className="py-16 text-center text-brand-midgray">Cargando...</div>;

  return (
    <div>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <Link to="/admin/cursos" className="inline-flex items-center gap-1.5 text-brand-text hover:text-primary text-sm mb-6 transition-colors">
        <ArrowLeft size={15} />
        Volver a cursos
      </Link>

      <div className="mb-6">
        <h2 className="text-2xl font-bold text-brand-dark">{course.title}</h2>
        <p className="text-brand-text text-sm mt-1">{course.short_description}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Meeting link */}
        <div className="bg-white card p-6">
          <div className="flex items-center gap-2 mb-4">
            <Video size={18} className="text-primary" />
            <h3 className="font-semibold text-brand-dark">Enlace de reunión</h3>
          </div>
          <form onSubmit={handleLink(saveMeetingLink)} className="space-y-3">
            <input
              type="url"
              placeholder="https://zoom.us/j/... o meet.google.com/..."
              className="w-full border border-brand-gray rounded-sm px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
              {...regLink('meeting_link')}
            />
            <button type="submit" disabled={savingLink}
              className="flex items-center gap-2 bg-primary text-white font-semibold px-4 py-2.5 rounded-sm hover:bg-primary-dark disabled:opacity-60 transition-colors text-sm">
              {savingLink ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save size={15} />}
              {savingLink ? 'Guardando...' : 'Guardar enlace'}
            </button>
          </form>
          {course.meeting_link && (
            <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-sm">
              <p className="text-green-700 text-xs font-semibold mb-1">Enlace activo:</p>
              <a href={course.meeting_link} target="_blank" rel="noopener noreferrer"
                className="text-green-700 text-xs underline break-all">{course.meeting_link}</a>
            </div>
          )}
        </div>

        {/* Enrolled students */}
        <div className="bg-white card p-6">
          <div className="flex items-center gap-2 mb-4">
            <FileText size={18} className="text-primary" />
            <h3 className="font-semibold text-brand-dark">Alumnos inscritos ({enrollments.length})</h3>
          </div>
          {enrollments.length === 0 ? (
            <p className="text-brand-midgray text-sm">Sin alumnos inscritos aún.</p>
          ) : (
            <ul className="space-y-2">
              {enrollments.map(e => (
                <li key={e.id} className="flex items-center gap-2 text-sm text-brand-text border-b border-brand-gray pb-2 last:border-0">
                  <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-primary text-xs font-bold">
                      {(e.user_profiles?.full_name || e.user_profiles?.email || '?')[0].toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-brand-dark">{e.user_profiles?.full_name || '—'}</p>
                    <p className="text-brand-midgray text-xs">{e.user_profiles?.email}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Resources */}
      <div className="bg-white card p-6 mt-6">
        <div className="flex items-center gap-2 mb-5">
          <Link2 size={18} className="text-primary" />
          <h3 className="font-semibold text-brand-dark">Recursos del curso</h3>
        </div>

        {/* Add resource form */}
        <form onSubmit={handleRes(handleAddResource)} className="grid grid-cols-1 sm:grid-cols-4 gap-3 mb-6 p-4 bg-brand-lightgray rounded-sm">
          <input
            placeholder="Título del recurso"
            className="sm:col-span-1 border border-brand-gray rounded-sm px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
            {...regRes('title', { required: true })}
          />
          <input
            type="url"
            placeholder="https://..."
            className="sm:col-span-2 border border-brand-gray rounded-sm px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
            {...regRes('url', { required: true })}
          />
          <div className="flex gap-2">
            <select
              className="flex-1 border border-brand-gray rounded-sm px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
              {...regRes('resource_type')}
            >
              <option value="link">Enlace</option>
              <option value="guide">Guía</option>
              <option value="video">Video</option>
              <option value="document">Documento</option>
            </select>
            <button type="submit" disabled={addingRes}
              className="bg-primary text-white px-3 py-2 rounded-sm hover:bg-primary-dark disabled:opacity-60 transition-colors flex items-center gap-1 text-sm font-semibold">
              <Plus size={15} />
              Agregar
            </button>
          </div>
        </form>

        {/* Resource list */}
        {resources.length === 0 ? (
          <p className="text-brand-midgray text-sm text-center py-6">No hay recursos agregados aún.</p>
        ) : (
          <div className="space-y-2">
            {resources.map(res => (
              <div key={res.id} className="flex items-center gap-3 p-3 border border-brand-gray rounded-sm hover:bg-brand-lightgray transition-colors">
                <Link2 size={14} className="text-primary flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-brand-dark text-sm truncate">{res.title}</p>
                  <a href={res.url} target="_blank" rel="noopener noreferrer"
                    className="text-brand-midgray text-xs hover:text-primary truncate block">{res.url}</a>
                </div>
                <span className="text-xs text-brand-midgray capitalize hidden sm:block">{res.resource_type}</span>
                <button onClick={() => handleDeleteResource(res.id)}
                  className="p-1.5 text-brand-midgray hover:text-red-600 hover:bg-red-50 rounded transition-colors">
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Location */}
      <div className="bg-white card p-6 mt-6">
        <div className="flex items-center gap-2 mb-5">
          <MapPin size={18} className="text-primary" />
          <h3 className="font-semibold text-brand-dark">Ubicación del curso <span className="text-brand-midgray text-sm font-normal">(opcional)</span></h3>
        </div>

        <LocationPicker value={location} onChange={setLocation} />

        <div className="flex justify-end mt-4">
          <button
            type="button"
            onClick={saveLocation}
            disabled={savingLocation}
            className="flex items-center gap-2 bg-primary text-white font-semibold px-5 py-2.5 rounded-sm hover:bg-primary-dark disabled:opacity-60 transition-colors text-sm"
          >
            {savingLocation
              ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              : <Save size={15} />
            }
            {savingLocation ? 'Guardando...' : 'Guardar ubicación'}
          </button>
        </div>
      </div>
    </div>
  );
}
