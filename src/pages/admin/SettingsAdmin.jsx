import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  Settings, Link2, Save, Plus, Trash2, ToggleLeft, ToggleRight,
  CheckCircle, AlertCircle, X, Phone, Mail, Clock,
} from 'lucide-react';
import {
  getSiteSettings, upsertSiteSetting,
  getAllSocialLinks, updateSocialLink, createSocialLink, deleteSocialLink,
} from '../../services/adminService';

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

// ── SITE SETTINGS ─────────────────────────────────────────────────────────────
const SETTINGS_FIELDS = [
  { key: 'whatsapp_number', label: 'Número WhatsApp', placeholder: '51989019135', icon: Phone, hint: 'Solo números, sin + ni espacios. Ej: 51989019135' },
  { key: 'contact_email', label: 'Correo de contacto', placeholder: 'contacto@healthacademy.com', icon: Mail, hint: 'Correo que se muestra en la sección de Contacto' },
  { key: 'business_hours', label: 'Horario de atención', placeholder: 'Lun – Dom: 7:00 – 22:00', icon: Clock, hint: 'Texto libre que se muestra en la página de Contacto' },
];

function SiteSettingsSection({ showToast }) {
  const [settings, setSettings] = useState({});
  const [saving, setSaving] = useState({});
  const [values, setValues] = useState({});

  useEffect(() => {
    getSiteSettings().then(s => { setSettings(s); setValues(s); });
  }, []);

  const handleSave = async (key) => {
    setSaving(p => ({ ...p, [key]: true }));
    try {
      await upsertSiteSetting(key, values[key] ?? '');
      setSettings(p => ({ ...p, [key]: values[key] }));
      showToast(`"${key}" guardado correctamente`);
    } catch (err) {
      showToast(`Error: ${err.message}`, 'error');
    } finally {
      setSaving(p => ({ ...p, [key]: false }));
    }
  };

  return (
    <div className="bg-white card p-6">
      <div className="flex items-center gap-2 mb-6">
        <Settings size={18} className="text-primary" />
        <h3 className="font-bold text-brand-dark text-lg">Configuración general</h3>
      </div>
      <div className="space-y-5">
        {SETTINGS_FIELDS.map(({ key, label, placeholder, icon: Icon, hint }) => (
          <div key={key}>
            <label className="block text-sm font-medium text-brand-dark mb-1.5 flex items-center gap-1.5">
              <Icon size={13} className="text-primary" />
              {label}
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={values[key] ?? ''}
                onChange={e => setValues(p => ({ ...p, [key]: e.target.value }))}
                placeholder={placeholder}
                className="flex-1 border border-brand-gray rounded-sm px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
              />
              <button
                onClick={() => handleSave(key)}
                disabled={saving[key] || values[key] === settings[key]}
                className="flex items-center gap-1.5 bg-primary text-white font-semibold px-4 py-2.5 rounded-sm hover:bg-primary-dark disabled:opacity-50 transition-colors text-sm flex-shrink-0"
              >
                {saving[key]
                  ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  : <Save size={14} />
                }
                Guardar
              </button>
            </div>
            {hint && <p className="text-brand-midgray text-xs mt-1">{hint}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}

// ── SOCIAL LINKS ──────────────────────────────────────────────────────────────
const PLATFORM_ICONS = { facebook: '📘', instagram: '📸', tiktok: '🎵', linkedin: '💼', youtube: '▶️', twitter: '🐦' };

function SocialLinksSection({ showToast }) {
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editValues, setEditValues] = useState({});

  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm({
    defaultValues: { platform: '', url: '', is_active: true },
  });

  const load = () => {
    getAllSocialLinks().then(d => { setLinks(d); setLoading(false); });
  };
  useEffect(() => { load(); }, []);

  const handleAdd = async (data) => {
    try {
      await createSocialLink({ ...data, is_active: true });
      showToast('Red social agregada');
      reset(); setAdding(false); load();
    } catch (err) { showToast(`Error: ${err.message}`, 'error'); }
  };

  const handleUpdate = async (id) => {
    try {
      await updateSocialLink(id, editValues[id]);
      showToast('Enlace actualizado');
      setEditingId(null); load();
    } catch (err) { showToast(`Error: ${err.message}`, 'error'); }
  };

  const toggleActive = async (link) => {
    try {
      await updateSocialLink(link.id, { is_active: !link.is_active });
      load();
    } catch (err) { showToast(`Error: ${err.message}`, 'error'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Eliminar esta red social?')) return;
    try {
      await deleteSocialLink(id);
      showToast('Red social eliminada');
      load();
    } catch (err) { showToast(`Error: ${err.message}`, 'error'); }
  };

  return (
    <div className="bg-white card p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Link2 size={18} className="text-primary" />
          <h3 className="font-bold text-brand-dark text-lg">Redes sociales</h3>
        </div>
        <button
          onClick={() => setAdding(!adding)}
          className="flex items-center gap-1.5 text-sm font-semibold text-primary hover:bg-red-50 px-3 py-1.5 rounded-sm transition-colors"
        >
          <Plus size={15} /> Agregar
        </button>
      </div>

      {/* Add form */}
      {adding && (
        <form onSubmit={handleSubmit(handleAdd)} className="mb-5 p-4 bg-brand-lightgray rounded-sm space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <select
              className="border border-brand-gray rounded-sm px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
              {...register('platform', { required: true })}
            >
              <option value="">Plataforma...</option>
              {['facebook','instagram','tiktok','linkedin','youtube','twitter'].map(p => (
                <option key={p} value={p}>{PLATFORM_ICONS[p]} {p.charAt(0).toUpperCase()+p.slice(1)}</option>
              ))}
            </select>
            <input
              type="url"
              placeholder="https://..."
              className="sm:col-span-2 border border-brand-gray rounded-sm px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
              {...register('url', { required: true })}
            />
          </div>
          <div className="flex gap-2">
            <button type="button" onClick={() => setAdding(false)}
              className="border border-brand-gray text-brand-text font-medium px-4 py-2 rounded-sm hover:bg-white transition-colors text-sm">
              Cancelar
            </button>
            <button type="submit" disabled={isSubmitting}
              className="flex items-center gap-1.5 bg-primary text-white font-semibold px-4 py-2 rounded-sm hover:bg-primary-dark disabled:opacity-60 transition-colors text-sm">
              <Plus size={14} /> Guardar
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <p className="text-brand-midgray text-sm">Cargando...</p>
      ) : links.length === 0 ? (
        <p className="text-brand-midgray text-sm text-center py-6">No hay redes sociales configuradas.</p>
      ) : (
        <div className="space-y-2">
          {links.map(link => (
            <div key={link.id} className="flex items-center gap-3 p-3 border border-brand-gray rounded-sm hover:bg-brand-lightgray/50 transition-colors">
              <span className="text-lg w-7 text-center flex-shrink-0">{PLATFORM_ICONS[link.platform] || '🔗'}</span>

              {editingId === link.id ? (
                <>
                  <input
                    type="url"
                    value={editValues[link.id]?.url ?? link.url}
                    onChange={e => setEditValues(p => ({ ...p, [link.id]: { ...p[link.id], url: e.target.value } }))}
                    className="flex-1 border border-brand-gray rounded-sm px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                  />
                  <button onClick={() => handleUpdate(link.id)}
                    className="text-xs font-semibold bg-primary text-white px-3 py-1.5 rounded-sm hover:bg-primary-dark transition-colors">
                    Guardar
                  </button>
                  <button onClick={() => setEditingId(null)}
                    className="text-xs text-brand-midgray hover:text-brand-dark px-2 py-1.5">
                    Cancelar
                  </button>
                </>
              ) : (
                <>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-brand-dark text-sm capitalize">{link.platform}</p>
                    <a href={link.url} target="_blank" rel="noopener noreferrer"
                      className="text-brand-midgray text-xs hover:text-primary truncate block">{link.url}</a>
                  </div>
                  <button onClick={() => toggleActive(link)} title={link.is_active ? 'Desactivar' : 'Activar'}
                    className={`flex-shrink-0 ${link.is_active ? 'text-green-600' : 'text-brand-midgray'}`}>
                    {link.is_active ? <ToggleRight size={24} /> : <ToggleLeft size={24} />}
                  </button>
                  <button onClick={() => { setEditingId(link.id); setEditValues(p => ({ ...p, [link.id]: { url: link.url } })); }}
                    className="p-1.5 text-brand-midgray hover:text-primary hover:bg-red-50 rounded transition-colors flex-shrink-0">
                    <Save size={14} />
                  </button>
                  <button onClick={() => handleDelete(link.id)}
                    className="p-1.5 text-brand-midgray hover:text-red-600 hover:bg-red-50 rounded transition-colors flex-shrink-0">
                    <Trash2 size={14} />
                  </button>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── MAIN PAGE ─────────────────────────────────────────────────────────────────
export function SettingsAdmin() {
  const [toast, setToast] = useState(null);
  const showToast = (message, type = 'success') => setToast({ message, type });

  return (
    <div>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-brand-dark">Configuración del sitio</h2>
        <p className="text-brand-text text-sm mt-1">Edita los datos de contacto y las redes sociales del sitio.</p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SiteSettingsSection showToast={showToast} />
        <SocialLinksSection showToast={showToast} />
      </div>
    </div>
  );
}
