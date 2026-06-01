import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Plus, Pencil, Trash2, Eye, EyeOff, X, Save, AlertCircle, CheckCircle } from 'lucide-react';
import { getCourses, createCourse, updateCourse, deleteCourse } from '../../services/coursesService';
import { Badge } from '../../components/ui/Badge';

function formatDate(dateStr) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('es-PE', { year: 'numeric', month: 'short', day: 'numeric' });
}


function Toast({ message, type, onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 4000);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3 rounded-sm shadow-card-hover text-white text-sm font-medium transition-all ${type === 'error' ? 'bg-red-600' : 'bg-green-600'}`}>
      {type === 'error' ? <AlertCircle size={16} /> : <CheckCircle size={16} />}
      {message}
      <button onClick={onClose} className="ml-2 opacity-70 hover:opacity-100"><X size={14} /></button>
    </div>
  );
}

function CourseForm({ course, onSave, onCancel }) {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    defaultValues: course || {
      title: '',
      short_description: '',
      course_date: '',
      modality: 'Presencial',
      status: 'por_realizar',
      is_visible: true,
      image_url: '',
    },
  });

  const onSubmit = async (data) => {
    await onSave({ ...data, is_visible: data.is_visible === 'true' || data.is_visible === true });
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-sm shadow-card-hover w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-brand-gray sticky top-0 bg-white">
          <h3 className="font-bold text-brand-dark text-lg">
            {course ? 'Editar curso' : 'Nuevo curso'}
          </h3>
          <button onClick={onCancel} className="text-brand-midgray hover:text-brand-dark transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-brand-dark mb-1.5">
              Título del curso <span className="text-primary">*</span>
            </label>
            <input
              type="text"
              className={`w-full border rounded-sm px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition ${errors.title ? 'border-red-400' : 'border-brand-gray'}`}
              {...register('title', { required: 'El título es obligatorio' })}
            />
            {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-brand-dark mb-1.5">Descripción breve</label>
            <textarea
              rows={3}
              className="w-full border border-brand-gray rounded-sm px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition resize-none"
              {...register('short_description')}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-brand-dark mb-1.5">Fecha del curso</label>
              <input
                type="date"
                className="w-full border border-brand-gray rounded-sm px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
                {...register('course_date')}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-brand-dark mb-1.5">Modalidad</label>
              <select
                className="w-full border border-brand-gray rounded-sm px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
                {...register('modality')}
              >
                <option>Presencial</option>
                <option>Virtual</option>
                <option>Presencial + Virtual</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-brand-dark mb-1.5">Estado</label>
              <select
                className="w-full border border-brand-gray rounded-sm px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
                {...register('status')}
              >
                <option value="por_realizar">Próximo</option>
                <option value="realizado">Realizado</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-brand-dark mb-1.5">Visibilidad</label>
              <select
                className="w-full border border-brand-gray rounded-sm px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
                {...register('is_visible')}
              >
                <option value="true">Visible en el sitio</option>
                <option value="false">Oculto</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-brand-dark mb-1.5">URL de imagen (opcional)</label>
            <input
              type="url"
              placeholder="https://..."
              className="w-full border border-brand-gray rounded-sm px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
              {...register('image_url')}
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 border border-brand-gray text-brand-text font-medium py-2.5 rounded-sm hover:bg-brand-lightgray transition-colors text-sm"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 flex items-center justify-center gap-2 bg-primary text-white font-semibold py-2.5 rounded-sm hover:bg-primary-dark disabled:opacity-60 disabled:cursor-not-allowed transition-colors text-sm"
            >
              {isSubmitting ? (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Save size={15} />
              )}
              {isSubmitting ? 'Guardando...' : 'Guardar curso'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export function CoursesAdmin() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => setToast({ message, type });
  const hideToast = () => setToast(null);

  const loadCourses = () => {
    getCourses({ visibleOnly: false }).then(data => {
      setCourses(data);
      setLoading(false);
    });
  };

  useEffect(() => { loadCourses(); }, []);

  const handleSave = async (data) => {
    try {
      if (editing) {
        await updateCourse(editing.id, data);
        showToast('Curso actualizado correctamente');
      } else {
        await createCourse(data);
        showToast('Curso creado correctamente');
      }
      setFormOpen(false);
      setEditing(null);
      loadCourses();
    } catch (err) {
      showToast(`Error al guardar: ${err.message}`, 'error');
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteCourse(id);
      setDeleteConfirm(null);
      showToast('Curso eliminado');
      loadCourses();
    } catch (err) {
      showToast(`Error al eliminar: ${err.message}`, 'error');
      setDeleteConfirm(null);
    }
  };

  const toggleVisibility = async (course) => {
    try {
      await updateCourse(course.id, { is_visible: !course.is_visible });
      loadCourses();
    } catch (err) {
      showToast(`Error: ${err.message}`, 'error');
    }
  };

  return (
    <div>
      {toast && <Toast message={toast.message} type={toast.type} onClose={hideToast} />}

      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-2xl font-bold text-brand-dark">Gestión de Cursos</h2>
          <p className="text-brand-text text-sm mt-1">{courses.length} cursos registrados</p>
        </div>
        <button
          onClick={() => { setEditing(null); setFormOpen(true); }}
          className="flex items-center gap-2 bg-primary text-white font-semibold px-4 py-2.5 rounded-sm hover:bg-primary-dark transition-colors text-sm"
        >
          <Plus size={16} />
          Nuevo curso
        </button>
      </div>

      {/* Table */}
      <div className="bg-white card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-brand-lightgray border-b border-brand-gray">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-brand-dark text-xs uppercase tracking-wide">Curso</th>
                <th className="text-left px-4 py-3 font-semibold text-brand-dark text-xs uppercase tracking-wide hidden md:table-cell">Fecha</th>
                <th className="text-left px-4 py-3 font-semibold text-brand-dark text-xs uppercase tracking-wide hidden sm:table-cell">Modalidad</th>
                <th className="text-left px-4 py-3 font-semibold text-brand-dark text-xs uppercase tracking-wide">Estado</th>
                <th className="text-left px-4 py-3 font-semibold text-brand-dark text-xs uppercase tracking-wide hidden lg:table-cell">Visible</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-gray">
              {loading ? (
                <tr><td colSpan={6} className="px-4 py-8 text-center text-brand-midgray">Cargando...</td></tr>
              ) : courses.length === 0 ? (
                <tr><td colSpan={6} className="px-4 py-8 text-center text-brand-midgray">No hay cursos registrados.</td></tr>
              ) : (
                courses.map(course => (
                  <tr key={course.id} className="hover:bg-brand-lightgray/50 transition-colors">
                    <td className="px-4 py-3">
                      <p className="font-medium text-brand-dark line-clamp-1">{course.title}</p>
                      <p className="text-brand-midgray text-xs line-clamp-1 mt-0.5 hidden sm:block">{course.short_description}</p>
                    </td>
                    <td className="px-4 py-3 text-brand-text hidden md:table-cell whitespace-nowrap">{formatDate(course.course_date)}</td>
                    <td className="px-4 py-3 text-brand-text hidden sm:table-cell">{course.modality}</td>
                    <td className="px-4 py-3">
                      <Badge variant={course.status}>
                        {course.status === 'realizado' ? 'Realizado' : 'Próximo'}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell">
                      <button
                        onClick={() => toggleVisibility(course)}
                        className={`inline-flex items-center gap-1.5 text-xs font-medium px-2 py-1 rounded-full transition-colors ${course.is_visible ? 'bg-green-50 text-green-700 hover:bg-green-100' : 'bg-brand-gray text-brand-midgray hover:bg-brand-lightgray'}`}
                      >
                        {course.is_visible ? <Eye size={12} /> : <EyeOff size={12} />}
                        {course.is_visible ? 'Visible' : 'Oculto'}
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1 justify-end">
                        <button
                          onClick={() => { setEditing(course); setFormOpen(true); }}
                          className="p-1.5 text-brand-midgray hover:text-primary hover:bg-red-50 rounded transition-colors"
                          title="Editar"
                        >
                          <Pencil size={15} />
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(course)}
                          className="p-1.5 text-brand-midgray hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                          title="Eliminar"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Form modal */}
      {formOpen && (
        <CourseForm
          course={editing}
          onSave={handleSave}
          onCancel={() => { setFormOpen(false); setEditing(null); }}
        />
      )}

      {/* Delete confirm */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-sm shadow-card-hover w-full max-w-sm p-6">
            <h3 className="font-bold text-brand-dark mb-2">Eliminar curso</h3>
            <p className="text-brand-text text-sm mb-6">
              ¿Estás seguro de que deseas eliminar <strong>"{deleteConfirm.title}"</strong>? Esta acción no se puede deshacer.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 border border-brand-gray text-brand-text font-medium py-2.5 rounded-sm hover:bg-brand-lightgray transition-colors text-sm"
              >
                Cancelar
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm.id)}
                className="flex-1 bg-red-600 text-white font-semibold py-2.5 rounded-sm hover:bg-red-700 transition-colors text-sm"
              >
                Sí, eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
