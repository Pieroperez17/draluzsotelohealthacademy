import { supabase } from '../lib/supabase';

/** Obtener mensajes del chat de un curso */
export async function getCourseMessages(courseId) {
  const { data, error } = await supabase
    .from('course_messages')
    .select('*')
    .eq('course_id', courseId)
    .order('created_at', { ascending: true });
  if (error) throw new Error(error.message);
  return data ?? [];
}

/** Enviar mensaje */
export async function sendMessage(courseId, userId, userName, message) {
  const { error } = await supabase
    .from('course_messages')
    .insert([{ course_id: courseId, user_id: userId, user_name: userName, message }]);
  if (error) throw new Error(error.message);
}

/** Suscribirse al canal Realtime del chat */
export function subscribeToCourseChat(courseId, onNewMessage) {
  const channel = supabase
    .channel(`course-chat-${courseId}`)
    .on('postgres_changes', {
      event: 'INSERT',
      schema: 'public',
      table: 'course_messages',
      filter: `course_id=eq.${courseId}`,
    }, (payload) => onNewMessage(payload.new))
    .subscribe();
  return channel;
}

/** Cancelar suscripción */
export function unsubscribeFromChat(channel) {
  if (channel) supabase.removeChannel(channel);
}
