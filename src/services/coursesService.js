import { supabase, isSupabaseReady } from '../lib/supabase';
import { COURSES_DATA } from '../data/courses';

export async function getCourses({ visibleOnly = true } = {}) {
  if (!isSupabaseReady) {
    return visibleOnly ? COURSES_DATA.filter(c => c.is_visible) : COURSES_DATA;
  }
  const query = supabase.from('courses').select('*').order('course_date', { ascending: false });
  if (visibleOnly) query.eq('is_visible', true);
  const { data, error } = await query;
  if (error) throw error;
  return data;
}

export async function createCourse(course) {
  if (!isSupabaseReady) return { ...course, id: Date.now() };
  const { data, error } = await supabase.from('courses').insert([course]).select().single();
  if (error) throw error;
  return data;
}

export async function updateCourse(id, updates) {
  if (!isSupabaseReady) return { id, ...updates };
  const { data, error } = await supabase.from('courses').update(updates).eq('id', id).select().single();
  if (error) throw error;
  return data;
}

export async function deleteCourse(id) {
  if (!isSupabaseReady) return;
  const { error } = await supabase.from('courses').delete().eq('id', id);
  if (error) throw error;
}
