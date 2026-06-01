import { supabase, isSupabaseReady } from '../lib/supabase';
import { TESTIMONIALS_DATA } from '../data/courses';

export async function getTestimonials({ visibleOnly = true } = {}) {
  if (!isSupabaseReady) {
    return visibleOnly ? TESTIMONIALS_DATA.filter(t => t.is_visible) : [...TESTIMONIALS_DATA];
  }
  try {
    let query = supabase.from('testimonials').select('*').order('created_at', { ascending: false });
    if (visibleOnly) query = query.eq('is_visible', true);
    const { data, error } = await query;
    if (error) throw error;
    return data ?? [];
  } catch {
    return visibleOnly ? TESTIMONIALS_DATA.filter(t => t.is_visible) : [...TESTIMONIALS_DATA];
  }
}
