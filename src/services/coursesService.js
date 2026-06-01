import { supabase, isSupabaseReady } from '../lib/supabase';
import { COURSES_DATA } from '../data/courses';

export async function getCourses({ visibleOnly = true } = {}) {
  if (!isSupabaseReady) {
    return visibleOnly ? COURSES_DATA.filter(c => c.is_visible) : [...COURSES_DATA];
  }
  try {
    let query = supabase.from('courses').select('*').order('course_date', { ascending: false });
    if (visibleOnly) query = query.eq('is_visible', true);
    const { data, error } = await query;
    if (error) throw error;
    return data ?? [];
  } catch {
    // Fallback a mock si la lectura falla
    return visibleOnly ? COURSES_DATA.filter(c => c.is_visible) : [...COURSES_DATA];
  }
}

export async function createCourse(course) {
  if (!isSupabaseReady) return { ...course, id: Date.now() };
  const { data, error } = await supabase
    .from('courses')
    .insert([{ ...course, updated_at: new Date().toISOString() }])
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data;
}

export async function updateCourse(id, updates) {
  if (!isSupabaseReady) return { id, ...updates };
  const { data, error } = await supabase
    .from('courses')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data;
}

export async function deleteCourse(id) {
  if (!isSupabaseReady) return;
  const { error } = await supabase.from('courses').delete().eq('id', id);
  if (error) throw new Error(error.message);
}
