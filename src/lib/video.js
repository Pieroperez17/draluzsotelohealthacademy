/**
 * Normaliza una URL de video a un formato reproducible.
 * Soporta YouTube, Vimeo y archivos de video directos (.mp4/.webm/.ogg).
 * Devuelve { type: 'iframe' | 'video' | 'link', src } o null si no hay URL.
 */
export function getVideoEmbed(url) {
  if (!url) return null;
  const u = url.trim();

  // YouTube: watch?v=, youtu.be/, embed/, shorts/
  const yt = u.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{11})/);
  if (yt) return { type: 'iframe', src: `https://www.youtube.com/embed/${yt[1]}` };

  // Vimeo
  const vm = u.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  if (vm) return { type: 'iframe', src: `https://player.vimeo.com/video/${vm[1]}` };

  // Archivo de video directo
  if (/\.(mp4|webm|ogg)(\?.*)?$/i.test(u)) return { type: 'video', src: u };

  // Cualquier otra URL → enlace externo
  return { type: 'link', src: u };
}
