import { supabase } from '../lib/supabase';

const READONLY = ['id', 'course_id', 'created_at'];
function strip(obj) {
  const clean = { ...obj };
  READONLY.forEach(k => delete clean[k]);
  return clean;
}

/** Obtener bloques de contenido de un curso.
 *  RLS filtra automáticamente: el admin ve todos, el alumno solo los visibles. */
export async function getContentBlocks(courseId) {
  const { data, error } = await supabase
    .from('course_content_blocks')
    .select('*')
    .eq('course_id', courseId)
    .order('position', { ascending: true })
    .order('created_at', { ascending: true });
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function createContentBlock(courseId, { title, description, video_url, is_visible = true, position = 0 }) {
  const { data, error } = await supabase
    .from('course_content_blocks')
    .insert([{
      course_id: courseId,
      title: title || '',
      description: description || null,
      video_url: video_url || null,
      is_visible,
      position,
    }])
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data;
}

export async function updateContentBlock(id, updates) {
  const payload = { ...strip(updates), updated_at: new Date().toISOString() };
  const { data, error } = await supabase
    .from('course_content_blocks')
    .update(payload)
    .eq('id', id)
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data;
}

export async function deleteContentBlock(id) {
  const { error } = await supabase.from('course_content_blocks').delete().eq('id', id);
  if (error) throw new Error(error.message);
}

const VIDEO_BUCKET = 'course-videos';

/** Sube un archivo de video al bucket de Storage y devuelve su URL pública.
 *  Solo el admin tiene permiso de escritura (RLS sobre storage.objects).
 *  @param {number} courseId  Curso al que pertenece el video (para organizar carpetas).
 *  @param {File}   file      Archivo de video seleccionado en el input.
 *  @returns {Promise<string>} URL pública reproducible del video. */
export async function uploadCourseVideo(courseId, file) {
  if (!file) throw new Error('No se seleccionó ningún archivo.');

  // Nombre único conservando la extensión original (.mp4, .webm, etc.)
  const ext = file.name.split('.').pop()?.toLowerCase() || 'mp4';
  const path = `curso-${courseId}/${Date.now()}-${crypto.randomUUID()}.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from(VIDEO_BUCKET)
    .upload(path, file, { cacheControl: '3600', upsert: false, contentType: file.type });
  if (uploadError) throw new Error(uploadError.message);

  const { data } = supabase.storage.from(VIDEO_BUCKET).getPublicUrl(path);
  return data.publicUrl;
}
