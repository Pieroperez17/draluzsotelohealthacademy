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
