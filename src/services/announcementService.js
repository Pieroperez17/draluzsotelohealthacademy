import { supabase } from '../lib/supabase';

const READONLY = ['id', 'course_id', 'created_at'];
function strip(obj) {
  const clean = { ...obj };
  READONLY.forEach(k => delete clean[k]);
  return clean;
}

/** Anuncios de un curso (más recientes primero). */
export async function getAnnouncements(courseId) {
  const { data, error } = await supabase
    .from('course_announcements')
    .select('*')
    .eq('course_id', courseId)
    .order('created_at', { ascending: false });
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function createAnnouncement(courseId, { title, body }) {
  const { data, error } = await supabase
    .from('course_announcements')
    .insert([{ course_id: courseId, title: title || null, body: body || '' }])
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data;
}

export async function updateAnnouncement(id, updates) {
  const payload = { ...strip(updates), updated_at: new Date().toISOString() };
  const { data, error } = await supabase
    .from('course_announcements')
    .update(payload)
    .eq('id', id)
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data;
}

export async function deleteAnnouncement(id) {
  const { error } = await supabase.from('course_announcements').delete().eq('id', id);
  if (error) throw new Error(error.message);
}
