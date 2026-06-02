import { useEffect, useRef, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Video, Link2, FileText, Send, MessageCircle } from 'lucide-react';
import { getCourseMessages, sendMessage, subscribeToCourseChat, unsubscribeFromChat } from '../../services/chatService';
import { getCourseResources } from '../../services/resourceService';
import { getMyEnrolledCourses } from '../../services/enrollmentService';
import { useAuth } from '../../contexts/AuthContext';

const RESOURCE_ICONS = { link: Link2, guide: FileText, video: Video, document: FileText };
const RESOURCE_LABELS = { link: 'Enlace', guide: 'Guía', video: 'Video', document: 'Documento' };

function formatTime(ts) {
  return new Date(ts).toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' });
}
function formatDateFull(ts) {
  return new Date(ts).toLocaleDateString('es-PE', { weekday: 'short', day: 'numeric', month: 'short' });
}

export function IntranetCourse() {
  const { id } = useParams();
  const { session } = useAuth();
  const courseId = Number(id);

  const [course, setCourse] = useState(null);
  const [resources, setResources] = useState([]);
  const [messages, setMessages] = useState([]);
  const [newMsg, setNewMsg] = useState('');
  const [sending, setSending] = useState(false);
  const [tab, setTab] = useState('chat'); // 'chat' | 'recursos'
  const messagesEndRef = useRef(null);
  const channelRef = useRef(null);

  const userName = session?.user?.user_metadata?.full_name || session?.user?.email || 'Alumno';
  const userId = session?.user?.id;

  useEffect(() => {
    // Cargar datos del curso
    getMyEnrolledCourses().then(all => {
      const found = all.find(c => c.id === courseId);
      setCourse(found || null);
    });
    // Cargar recursos
    getCourseResources(courseId).then(setResources);
    // Cargar mensajes iniciales
    getCourseMessages(courseId).then(setMessages);

    // Suscribir al chat en tiempo real
    channelRef.current = subscribeToCourseChat(courseId, (newMessage) => {
      setMessages(prev => [...prev, newMessage]);
    });

    return () => unsubscribeFromChat(channelRef.current);
  }, [courseId]);

  // Scroll automático al nuevo mensaje
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMsg.trim() || sending) return;
    setSending(true);
    try {
      await sendMessage(courseId, userId, userName, newMsg.trim());
      setNewMsg('');
    } catch (err) {
      console.error(err);
    } finally {
      setSending(false);
    }
  };

  if (!course) {
    return (
      <div className="container-site py-16 text-center">
        <p className="text-brand-midgray">Cargando curso...</p>
      </div>
    );
  }

  return (
    <div className="container-site py-8">
      {/* Back */}
      <Link to="/intranet/dashboard" className="inline-flex items-center gap-1.5 text-brand-text hover:text-primary text-sm mb-6 transition-colors">
        <ArrowLeft size={15} />
        Mis cursos
      </Link>

      {/* Course header */}
      <div className="bg-white card p-6 mb-6">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div>
            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full mb-2 inline-block ${course.status === 'por_realizar' ? 'bg-blue-50 text-blue-700' : 'bg-green-50 text-green-700'}`}>
              {course.status === 'por_realizar' ? 'En curso' : 'Finalizado'}
            </span>
            <h1 className="text-2xl font-bold text-brand-dark mt-1">{course.title}</h1>
            <p className="text-brand-text text-sm mt-1">{course.short_description}</p>
          </div>
          {/* Meeting link */}
          {course.meeting_link && (
            <a
              href={course.meeting_link}
              target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 bg-primary text-white font-semibold px-5 py-3 rounded-sm hover:bg-primary-dark transition-colors whitespace-nowrap flex-shrink-0"
            >
              <Video size={18} />
              Unirse a la reunión
            </a>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-brand-gray bg-white rounded-t-sm">
        {[['chat', 'Chat del grupo', MessageCircle], ['recursos', 'Recursos', FileText]].map(([key, label, Icon]) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`flex items-center gap-2 px-6 py-3.5 text-sm font-semibold border-b-2 transition-colors ${
              tab === key ? 'border-primary text-primary' : 'border-transparent text-brand-midgray hover:text-brand-dark'
            }`}
          >
            <Icon size={15} />
            {label}
            {key === 'chat' && messages.length > 0 && (
              <span className="bg-primary/10 text-primary text-xs px-1.5 py-0.5 rounded-full">{messages.length}</span>
            )}
          </button>
        ))}
      </div>

      {/* CHAT */}
      {tab === 'chat' && (
        <div className="bg-white card rounded-t-none border-t-0 flex flex-col" style={{ height: '520px' }}>
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.length === 0 && (
              <div className="text-center text-brand-midgray py-16">
                <MessageCircle size={32} className="mx-auto mb-3 opacity-30" />
                <p className="text-sm">Aún no hay mensajes. ¡Sé el primero en escribir!</p>
              </div>
            )}
            {messages.map((msg, i) => {
              const isMe = msg.user_id === userId;
              const showDate = i === 0 || formatDateFull(messages[i - 1]?.created_at) !== formatDateFull(msg.created_at);
              return (
                <div key={msg.id}>
                  {showDate && (
                    <div className="text-center my-3">
                      <span className="bg-brand-gray text-brand-midgray text-xs px-3 py-1 rounded-full">
                        {formatDateFull(msg.created_at)}
                      </span>
                    </div>
                  )}
                  <div className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[75%] ${isMe ? 'items-end' : 'items-start'} flex flex-col`}>
                      {!isMe && (
                        <span className="text-xs font-semibold text-primary mb-1 ml-1">{msg.user_name}</span>
                      )}
                      <div className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                        isMe
                          ? 'bg-primary text-white rounded-br-sm'
                          : 'bg-brand-lightgray text-brand-dark rounded-bl-sm'
                      }`}>
                        {msg.message}
                      </div>
                      <span className="text-xs text-brand-midgray mt-1 mx-1">{formatTime(msg.created_at)}</span>
                    </div>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={handleSend} className="border-t border-brand-gray p-3 flex gap-2">
            <input
              type="text"
              value={newMsg}
              onChange={e => setNewMsg(e.target.value)}
              placeholder="Escribe un mensaje..."
              className="flex-1 border border-brand-gray rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
            />
            <button
              type="submit"
              disabled={!newMsg.trim() || sending}
              className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center hover:bg-primary-dark disabled:opacity-50 transition-colors flex-shrink-0"
            >
              <Send size={16} />
            </button>
          </form>
        </div>
      )}

      {/* RECURSOS */}
      {tab === 'recursos' && (
        <div className="bg-white card rounded-t-none border-t-0 p-6">
          {resources.length === 0 ? (
            <div className="text-center py-12 text-brand-midgray">
              <FileText size={32} className="mx-auto mb-3 opacity-30" />
              <p className="text-sm">El administrador aún no ha agregado recursos para este curso.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {resources.map(res => {
                const Icon = RESOURCE_ICONS[res.resource_type] || Link2;
                return (
                  <a
                    key={res.id}
                    href={res.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-start gap-3 p-4 border border-brand-gray rounded-sm hover:border-primary hover:bg-red-50 group transition-all"
                  >
                    <div className="w-9 h-9 rounded-sm bg-brand-lightgray group-hover:bg-primary/10 flex items-center justify-center flex-shrink-0 transition-colors">
                      <Icon size={16} className="text-primary" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-brand-dark text-sm group-hover:text-primary transition-colors line-clamp-1">{res.title}</p>
                      <p className="text-brand-midgray text-xs mt-0.5">{RESOURCE_LABELS[res.resource_type]}</p>
                    </div>
                  </a>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
