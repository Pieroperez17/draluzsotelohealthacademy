import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Plus, Pencil, Trash2, Eye, EyeOff, X, Save, CheckCircle, AlertCircle, Quote } from 'lucide-react';
import { getAllTestimonials, createTestimonial, updateTestimonial, deleteTestimonial } from '../../services/adminService';

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

function TestimonialForm({ testimonial, onSave, onCancel }) {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    defaultValues: testimonial || {
      author_name: '', role: '', testimonial_text: '', image_url: '', is_visible: true,
    },
  });

  const onSubmit = async (data) => {
    await onSave({ ...data, is_visible: data.is_visible === 'true' || data.is_visible === true });
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-sm shadow-card-hover w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-brand-gray sticky top-0 bg-white">
          <h3 className="font-bold text-brand-dark text-lg">{testimonial ? 'Editar testimonio' : 'Nuevo testimonio'}</h3>
          <button onClick={onCancel}><X size={20} className="text-brand-midgray" /></button>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-brand-dark mb-1.5">Nombre <span className="text-primary">*</span></label>
              <input
                type="text"
                placeholder="Dr. Juan García"
                className={`w-full border rounded-sm px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition ${errors.author_name ? 'border-red-400' : 'border-brand-gray'}`}
                {...register('author_name', { required: 'Obligatorio' })}
              />
              {errors.author_name && <p className="text-red-500 text-xs mt-1">{errors.author_name.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-brand-dark mb-1.5">Cargo / Especialidad</label>
              <input
                type="text"
                placeholder="Médico Anestesiólogo"
                className="w-full border border-brand-gray rounded-sm px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
                {...register('role')}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-brand-dark mb-1.5">Testimonio <span className="text-primary">*</span></label>
            <textarea
              rows={4}
              placeholder="Escribe el testimonio aquí..."
              className={`w-full border rounded-sm px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition resize-none ${errors.testimonial_text ? 'border-red-400' : 'border-brand-gray'}`}
              {...register('testimonial_text', { required: 'Obligatorio' })}
            />
            {errors.testimonial_text && <p className="text-red-500 text-xs mt-1">{errors.testimonial_text.message}</p>}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-brand-dark mb-1.5">URL de foto (opcional)</label>
              <input
                type="url"
                placeholder="https://..."
                className="w-full border border-brand-gray rounded-sm px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
                {...register('image_url')}
              />
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
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onCancel}
              className="flex-1 border border-brand-gray text-brand-text font-medium py-2.5 rounded-sm hover:bg-brand-lightgray transition-colors text-sm">
              Cancelar
            </button>
            <button type="submit" disabled={isSubmitting}
              className="flex-1 flex items-center justify-center gap-2 bg-primary text-white font-semibold py-2.5 rounded-sm hover:bg-primary-dark disabled:opacity-60 transition-colors text-sm">
              {isSubmitting ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save size={15} />}
              {isSubmitting ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export function TestimonialsAdmin() {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => setToast({ message, type });

  const load = () => {
    getAllTestimonials().then(data => { setTestimonials(data); setLoading(false); }).catch(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleSave = async (data) => {
    try {
      if (editing) {
        await updateTestimonial(editing.id, data);
        showToast('Testimonio actualizado');
      } else {
        await createTestimonial(data);
        showToast('Testimonio creado');
      }
      setFormOpen(false); setEditing(null); load();
    } catch (err) { showToast(`Error: ${err.message}`, 'error'); }
  };

  const handleDelete = async (id) => {
    try {
      await deleteTestimonial(id);
      showToast('Testimonio eliminado');
      setDeleteConfirm(null); load();
    } catch (err) { showToast(`Error: ${err.message}`, 'error'); setDeleteConfirm(null); }
  };

  const toggleVisibility = async (t) => {
    try {
      await updateTestimonial(t.id, { is_visible: !t.is_visible });
      load();
    } catch (err) { showToast(`Error: ${err.message}`, 'error'); }
  };

  return (
    <div>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-brand-dark">Testimonios</h2>
          <p className="text-brand-text text-sm mt-1">{testimonials.length} testimonios registrados</p>
        </div>
        <button onClick={() => { setEditing(null); setFormOpen(true); }}
          className="flex items-center gap-2 bg-primary text-white font-semibold px-4 py-2.5 rounded-sm hover:bg-primary-dark transition-colors text-sm">
          <Plus size={16} /> Nuevo testimonio
        </button>
      </div>

      {loading ? (
        <div className="card bg-white p-8 text-center text-brand-midgray">Cargando...</div>
      ) : testimonials.length === 0 ? (
        <div className="card bg-white p-12 text-center">
          <Quote size={36} className="text-brand-midgray mx-auto mb-3 opacity-40" />
          <p className="text-brand-dark font-semibold">Sin testimonios aún</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {testimonials.map(t => (
            <div key={t.id} className="bg-white card p-5">
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-2">
                  {t.image_url ? (
                    <img src={t.image_url} alt={t.author_name} className="w-10 h-10 rounded-full object-cover flex-shrink-0" />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-primary font-bold text-sm">{t.author_name?.[0]?.toUpperCase()}</span>
                    </div>
                  )}
                  <div>
                    <p className="font-semibold text-brand-dark text-sm">{t.author_name}</p>
                    {t.role && <p className="text-brand-midgray text-xs">{t.role}</p>}
                  </div>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <button onClick={() => toggleVisibility(t)}
                    className={`p-1.5 rounded transition-colors text-xs ${t.is_visible ? 'text-green-600 hover:bg-green-50' : 'text-brand-midgray hover:bg-brand-lightgray'}`}
                    title={t.is_visible ? 'Ocultar' : 'Mostrar'}>
                    {t.is_visible ? <Eye size={15} /> : <EyeOff size={15} />}
                  </button>
                  <button onClick={() => { setEditing(t); setFormOpen(true); }}
                    className="p-1.5 text-brand-midgray hover:text-primary hover:bg-red-50 rounded transition-colors">
                    <Pencil size={15} />
                  </button>
                  <button onClick={() => setDeleteConfirm(t)}
                    className="p-1.5 text-brand-midgray hover:text-red-600 hover:bg-red-50 rounded transition-colors">
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
              <p className="text-brand-text text-sm leading-relaxed italic line-clamp-3">
                "{t.testimonial_text}"
              </p>
              <div className="mt-3 flex justify-between items-center">
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${t.is_visible ? 'bg-green-50 text-green-700' : 'bg-brand-gray text-brand-midgray'}`}>
                  {t.is_visible ? 'Visible' : 'Oculto'}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {formOpen && (
        <TestimonialForm
          testimonial={editing}
          onSave={handleSave}
          onCancel={() => { setFormOpen(false); setEditing(null); }}
        />
      )}

      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-sm shadow-card-hover w-full max-w-sm p-6">
            <h3 className="font-bold text-brand-dark mb-2">Eliminar testimonio</h3>
            <p className="text-brand-text text-sm mb-6">
              ¿Eliminar el testimonio de <strong>"{deleteConfirm.author_name}"</strong>?
            </p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirm(null)}
                className="flex-1 border border-brand-gray text-brand-text font-medium py-2.5 rounded-sm hover:bg-brand-lightgray transition-colors text-sm">
                Cancelar
              </button>
              <button onClick={() => handleDelete(deleteConfirm.id)}
                className="flex-1 bg-red-600 text-white font-semibold py-2.5 rounded-sm hover:bg-red-700 transition-colors text-sm">
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
