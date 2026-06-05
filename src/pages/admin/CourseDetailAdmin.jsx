import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Video, Plus, Trash2, Save, Link2, FileText, X, CheckCircle, AlertCircle, MapPin, PlayCircle, Megaphone, Eye, EyeOff } from 'lucide-react';
import { getCourses, updateCourse } from '../../services/coursesService';
import { getCourseResources, addCourseResource, deleteCourseResource } from '../../services/resourceService';
import { getContentBlocks, createContentBlock, updateContentBlock, deleteContentBlock } from '../../services/contentService';
import { getAnnouncements, createAnnouncement, updateAnnouncement, deleteAnnouncement } from '../../services/announcementService';
import { getEnrollmentsByCourse } from '../../services/enrollmentService';
import { LocationPicker } from '../../components/ui/LocationPicker';
import { useForm } from 'react-hook-form';

/** Editor de un bloque de contenido existente (título, descripción, video, visibilidad). */
function ContentBlockRow({ block, onSave, onDelete }) {
  const [title, setTitle] = useState(block.title || '');
  const [description, setDescription] = useState(block.description || '');
  const [videoUrl, setVideoUrl] = useState(block.video_url || '');
  const [visible, setVisible] = useState(block.is_visible);
  const [saving, setSaving] = useState(false);

  const dirty =
    title !== (block.title || '') ||
    description !== (block.description || '') ||
    videoUrl !== (block.video_url || '') ||
    visible !== block.is_visible;

  const save = async () => {
    setSaving(true);
    try {
      await onSave(block.id, { title, description, video_url: videoUrl, is_visible: visible });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="border border-brand-gray rounded-sm p-4 space-y-3">
      <div className="flex items-center gap-2">
        <input
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="Título del bloque"
          className="flex-1 border border-brand-gray rounded-sm px-3 py-2 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
        />
        <button
          type="button"
          onClick={() => setVisible(v => !v)}
          title={visible ? 'Visible para alumnos' : 'Oculto'}
          className={`flex items-center gap-1 px-2.5 py-2 rounded-sm text-xs font-semibold transition-colors ${
            visible ? 'bg-green-50 text-green-700 hover:bg-green-100' : 'bg-brand-gray text-brand-midgray hover:bg-brand-lightgray'
          }`}
        >
          {visible ? <Eye size={14} /> : <EyeOff size={14} />}
          {visible ? 'Visible' : 'Oculto'}
        </button>
      </div>
      <textarea
        value={description}
        onChange={e => setDescription(e.target.value)}
        placeholder="Descripción / contenido del bloque (opcional)"
        rows={2}
        className="w-full border border-brand-gray rounded-sm px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition resize-y"
      />
      <input
        type="url"
        value={videoUrl}
        onChange={e => setVideoUrl(e.target.value)}
        placeholder="URL del video (YouTube, Vimeo o .mp4)"
        className="w-full border border-brand-gray rounded-sm px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
      />
      <div className="flex items-center justify-end gap-2">
        <button
          type="button"
          onClick={() => onDelete(block.id)}
          className="flex items-center gap-1.5 px-3 py-2 text-brand-midgray hover:text-red-600 hover:bg-red-50 rounded-sm transition-colors text-sm"
        >
          <Trash2 size={14} /> Eliminar
        </button>
        <button
          type="button"
          onClick={save}
          disabled={!dirty || saving}
          className="flex items-center gap-1.5 bg-primary text-white px-4 py-2 rounded-sm hover:bg-primary-dark disabled:opacity-50 transition-colors text-sm font-semibold"
        >
          {saving ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save size={14} />}
          Guardar
        </button>
      </div>
    </div>
  );
}

/** Editor de un anuncio existente. */
function AnnouncementRow({ announcement, onSave, onDelete }) {
  const [title, setTitle] = useState(announcement.title || '');
  const [body, setBody] = useState(announcement.body || '');
  const [saving, setSaving] = useState(false);

  const dirty = title !== (announcement.title || '') || body !== (announcement.body || '');

  const save = async () => {
    setSaving(true);
    try {
      await onSave(announcement.id, { title, body });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="border border-brand-gray rounded-sm p-4 space-y-3">
      <input
        value={title}
        onChange={e => setTitle(e.target.value)}
        placeholder="Título (opcional)"
        className="w-full border border-brand-gray rounded-sm px-3 py-2 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
      />
      <textarea
        value={body}
        onChange={e => setBody(e.target.value)}
        placeholder="Mensaje del anuncio"
        rows={3}
        className="w-full border border-brand-gray rounded-sm px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition resize-y"
      />
      <div className="flex items-center justify-end gap-2">
        <button
          type="button"
          onClick={() => onDelete(announcement.id)}
          className="flex items-center gap-1.5 px-3 py-2 text-brand-midgray hover:text-red-600 hover:bg-red-50 rounded-sm transition-colors text-sm"
        >
          <Trash2 size={14} /> Eliminar
        </button>
        <button
          type="button"
          onClick={save}
          disabled={!dirty || saving || !body.trim()}
          className="flex items-center gap-1.5 bg-primary text-white px-4 py-2 rounded-sm hover:bg-primary-dark disabled:opacity-50 transition-colors text-sm font-semibold"
        >
          {saving ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save size={14} />}
          Guardar
        </button>
      </div>
    </div>
  );
}

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
  const [contentBlocks, setContentBlocks] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [toast, setToast] = useState(null);
  const [savingLink, setSavingLink] = useState(false);
  const [location, setLocation] = useState(null);
  const [savingLocation, setSavingLocation] = useState(false);
  // Formularios para agregar contenido / anuncios
  const [newBlock, setNewBlock] = useState({ title: '', description: '', video_url: '' });
  const [addingBlock, setAddingBlock] = useState(false);
  const [newAnnouncement, setNewAnnouncement] = useState({ title: '', body: '' });
  const [addingAnnouncement, setAddingAnnouncement] = useState(false);
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

    // Cargar bloques de contenido (independiente)
    try {
      setContentBlocks(await getContentBlocks(courseId));
    } catch (err) {
      showToast(`Error cargando contenido: ${err.message}`, 'error');
    }

    // Cargar anuncios (independiente)
    try {
      setAnnouncements(await getAnnouncements(courseId));
    } catch (err) {
      showToast(`Error cargando anuncios: ${err.message}`, 'error');
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

  // ── Contenido (bloques) ──────────────────────────────────────────────────
  const handleAddBlock = async (e) => {
    e.preventDefault();
    if (!newBlock.title.trim()) { showToast('El bloque necesita un título', 'error'); return; }
    setAddingBlock(true);
    try {
      await createContentBlock(courseId, { ...newBlock, position: contentBlocks.length });
      showToast('Bloque de contenido agregado');
      setNewBlock({ title: '', description: '', video_url: '' });
      load();
    } catch (err) {
      showToast(`Error: ${err.message}`, 'error');
    } finally {
      setAddingBlock(false);
    }
  };

  const handleSaveBlock = async (id, updates) => {
    try {
      await updateContentBlock(id, updates);
      showToast('Bloque actualizado');
      load();
    } catch (err) {
      showToast(`Error: ${err.message}`, 'error');
    }
  };

  const handleDeleteBlock = async (id) => {
    if (!window.confirm('¿Eliminar este bloque de contenido?')) return;
    try {
      await deleteContentBlock(id);
      showToast('Bloque eliminado');
      load();
    } catch (err) {
      showToast(`Error: ${err.message}`, 'error');
    }
  };

  // ── Anuncios ─────────────────────────────────────────────────────────────
  const handleAddAnnouncement = async (e) => {
    e.preventDefault();
    if (!newAnnouncement.body.trim()) { showToast('El anuncio no puede estar vacío', 'error'); return; }
    setAddingAnnouncement(true);
    try {
      await createAnnouncement(courseId, newAnnouncement);
      showToast('Anuncio publicado');
      setNewAnnouncement({ title: '', body: '' });
      load();
    } catch (err) {
      showToast(`Error: ${err.message}`, 'error');
    } finally {
      setAddingAnnouncement(false);
    }
  };

  const handleSaveAnnouncement = async (id, updates) => {
    try {
      await updateAnnouncement(id, updates);
      showToast('Anuncio actualizado');
      load();
    } catch (err) {
      showToast(`Error: ${err.message}`, 'error');
    }
  };

  const handleDeleteAnnouncement = async (id) => {
    if (!window.confirm('¿Eliminar este anuncio?')) return;
    try {
      await deleteAnnouncement(id);
      showToast('Anuncio eliminado');
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

      {/* Contenido (bloques tipo acordeón) */}
      <div className="bg-white card p-6 mt-6">
        <div className="flex items-center gap-2 mb-1">
          <PlayCircle size={18} className="text-primary" />
          <h3 className="font-semibold text-brand-dark">Contenido del curso</h3>
        </div>
        <p className="text-brand-midgray text-sm mb-5">Bloques con título y video (YouTube, Vimeo o .mp4) que el alumno verá como acordeón.</p>

        {/* Agregar bloque */}
        <form onSubmit={handleAddBlock} className="space-y-3 mb-6 p-4 bg-brand-lightgray rounded-sm">
          <input
            placeholder="Título del bloque (ej. Módulo 1: Introducción)"
            value={newBlock.title}
            onChange={e => setNewBlock(b => ({ ...b, title: e.target.value }))}
            className="w-full border border-brand-gray rounded-sm px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
          />
          <textarea
            placeholder="Descripción / contenido (opcional)"
            rows={2}
            value={newBlock.description}
            onChange={e => setNewBlock(b => ({ ...b, description: e.target.value }))}
            className="w-full border border-brand-gray rounded-sm px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition resize-y"
          />
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="url"
              placeholder="URL del video (https://youtube.com/... o .mp4)"
              value={newBlock.video_url}
              onChange={e => setNewBlock(b => ({ ...b, video_url: e.target.value }))}
              className="flex-1 border border-brand-gray rounded-sm px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
            />
            <button type="submit" disabled={addingBlock}
              className="bg-primary text-white px-4 py-2 rounded-sm hover:bg-primary-dark disabled:opacity-60 transition-colors flex items-center justify-center gap-1.5 text-sm font-semibold whitespace-nowrap">
              {addingBlock ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Plus size={15} />}
              Agregar bloque
            </button>
          </div>
        </form>

        {/* Lista de bloques */}
        {contentBlocks.length === 0 ? (
          <p className="text-brand-midgray text-sm text-center py-6">No hay bloques de contenido aún.</p>
        ) : (
          <div className="space-y-3">
            {contentBlocks.map(block => (
              <ContentBlockRow key={block.id} block={block} onSave={handleSaveBlock} onDelete={handleDeleteBlock} />
            ))}
          </div>
        )}
      </div>

      {/* Anuncios */}
      <div className="bg-white card p-6 mt-6">
        <div className="flex items-center gap-2 mb-1">
          <Megaphone size={18} className="text-primary" />
          <h3 className="font-semibold text-brand-dark">Anuncios</h3>
        </div>
        <p className="text-brand-midgray text-sm mb-5">Mensajes para todos los alumnos inscritos en este curso.</p>

        {/* Agregar anuncio */}
        <form onSubmit={handleAddAnnouncement} className="space-y-3 mb-6 p-4 bg-brand-lightgray rounded-sm">
          <input
            placeholder="Título (opcional)"
            value={newAnnouncement.title}
            onChange={e => setNewAnnouncement(a => ({ ...a, title: e.target.value }))}
            className="w-full border border-brand-gray rounded-sm px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
          />
          <textarea
            placeholder="Escribe el anuncio para los alumnos..."
            rows={3}
            value={newAnnouncement.body}
            onChange={e => setNewAnnouncement(a => ({ ...a, body: e.target.value }))}
            className="w-full border border-brand-gray rounded-sm px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition resize-y"
          />
          <div className="flex justify-end">
            <button type="submit" disabled={addingAnnouncement}
              className="bg-primary text-white px-4 py-2 rounded-sm hover:bg-primary-dark disabled:opacity-60 transition-colors flex items-center gap-1.5 text-sm font-semibold">
              {addingAnnouncement ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Plus size={15} />}
              Publicar anuncio
            </button>
          </div>
        </form>

        {/* Lista de anuncios */}
        {announcements.length === 0 ? (
          <p className="text-brand-midgray text-sm text-center py-6">No hay anuncios publicados aún.</p>
        ) : (
          <div className="space-y-3">
            {announcements.map(a => (
              <AnnouncementRow key={a.id} announcement={a} onSave={handleSaveAnnouncement} onDelete={handleDeleteAnnouncement} />
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
