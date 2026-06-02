import { supabase } from '../lib/supabase';

/** Cursos a los que el usuario actual está inscrito */
export async function getMyEnrolledCourses() {
  // Obtener el uid del usuario autenticado actual
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from('course_enrollments')
    .select('course_id, enrolled_at, courses(*)')
    .eq('user_id', user.id)           // ← filtro por usuario actual
    .order('enrolled_at', { ascending: false });
  if (error) throw new Error(error.message);
  return (data ?? []).map(e => ({ ...e.courses, enrolled_at: e.enrolled_at }));
}

/** Todos los alumnos con sus cursos inscritos (admin) */
export async function getAllStudents() {
  // Paso 1: traer todos los perfiles de estudiantes
  const { data: profiles, error: profilesError } = await supabase
    .from('user_profiles')
    .select('id, full_name, email, created_at')
    .eq('role', 'student')
    .order('created_at', { ascending: false });

  if (profilesError) throw new Error(profilesError.message);
  if (!profiles || profiles.length === 0) return [];

  // Paso 2: traer todas las inscripciones con info del curso
  const { data: enrollments, error: enrollError } = await supabase
    .from('course_enrollments')
    .select('user_id, course_id, courses(id, title)');

  if (enrollError) throw new Error(enrollError.message);

  // Paso 3: combinar en memoria
  return profiles.map(profile => ({
    ...profile,
    course_enrollments: (enrollments ?? []).filter(e => e.user_id === profile.id),
  }));
}

/** Todos los alumnos inscritos en un curso (admin) — 2 queries para evitar join con RLS */
export async function getEnrollmentsByCourse(courseId) {
  // Paso 1: inscripciones del curso
  const { data: enrolls, error: e1 } = await supabase
    .from('course_enrollments')
    .select('id, enrolled_at, user_id')
    .eq('course_id', courseId);
  if (e1) throw new Error(e1.message);
  if (!enrolls || enrolls.length === 0) return [];

  // Paso 2: perfiles de los alumnos inscritos
  const userIds = enrolls.map(e => e.user_id);
  const { data: profiles, error: e2 } = await supabase
    .from('user_profiles')
    .select('id, full_name, email')
    .in('id', userIds);
  if (e2) throw new Error(e2.message);

  // Combinar en memoria
  const profileMap = Object.fromEntries((profiles ?? []).map(p => [p.id, p]));
  return enrolls.map(e => ({
    ...e,
    user_profiles: profileMap[e.user_id] ?? { full_name: '—', email: '—' },
  }));
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

/** Eliminar cuenta de alumno completamente (admin) — llama Edge Function con service_role */
export async function deleteStudent(userId) {
  const { data: { session } } = await supabase.auth.getSession();
  const res = await fetch(
    `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/delete-user`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session.access_token}`,
        apikey: import.meta.env.VITE_SUPABASE_ANON_KEY,
      },
      body: JSON.stringify({ userId }),
    }
  );
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Error al eliminar usuario');
}
