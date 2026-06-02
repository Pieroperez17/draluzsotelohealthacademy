import { supabase } from '../lib/supabase';

/** Cursos a los que el usuario actual está inscrito */
export async function getMyEnrolledCourses() {
  const { data, error } = await supabase
    .from('course_enrollments')
    .select('course_id, enrolled_at, courses(*)')
    .order('enrolled_at', { ascending: false });
  if (error) throw new Error(error.message);
  return (data ?? []).map(e => ({ ...e.courses, enrolled_at: e.enrolled_at }));
}

/** Todos los alumnos inscritos en un curso (admin) */
export async function getEnrollmentsByCourse(courseId) {
  const { data, error } = await supabase
    .from('course_enrollments')
    .select('id, enrolled_at, user_id, user_profiles(full_name, email)')
    .eq('course_id', courseId);
  if (error) throw new Error(error.message);
  return data ?? [];
}

/** Todos los alumnos con sus cursos inscritos (admin) */
export async function getAllStudents() {
  const { data, error } = await supabase
    .from('user_profiles')
    .select('id, full_name, email, created_at, course_enrollments(course_id, courses(title))')
    .eq('role', 'student')
    .order('created_at', { ascending: false });
  if (error) throw new Error(error.message);
  return data ?? [];
}

/** Inscribir alumno a un curso (admin) */
export async function enrollStudent(userId, courseId) {
  const { error } = await supabase
    .from('course_enrollments')
    .insert([{ user_id: userId, course_id: courseId }]);
  if (error) throw new Error(error.message);
}

/** Desinscribir alumno de un curso (admin) */
export async function unenrollStudent(userId, courseId) {
  const { error } = await supabase
    .from('course_enrollments')
    .delete()
    .eq('user_id', userId)
    .eq('course_id', courseId);
  if (error) throw new Error(error.message);
}
