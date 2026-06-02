import { supabase } from '../lib/supabase';

export async function getCourseResources(courseId) {
  const { data, error } = await supabase
    .from('course_resources')
    .select('*')
    .eq('course_id', courseId)
    .order('created_at', { ascending: true });
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function addCourseResource(courseId, { title, url, resource_type }) {
  const { data, error } = await supabase
    .from('course_resources')
    .insert([{ course_id: courseId, title, url, resource_type }])
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data;
}

export async function deleteCourseResource(id) {
  const { error } = await supabase.from('course_resources').delete().eq('id', id);
  if (error) throw new Error(error.message);
}
