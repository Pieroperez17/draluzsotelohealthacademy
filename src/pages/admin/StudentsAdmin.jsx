import { useEffect, useState } from 'react';
import { Users, Plus, Trash2, BookOpen, X, CheckCircle, AlertCircle } from 'lucide-react';
import { getAllStudents, enrollStudent, unenrollStudent } from '../../services/enrollmentService';
import { getCourses } from '../../services/coursesService';

function Toast({ message, type, onClose }) {
  useEffect(() => { const t = setTimeout(onClose, 4000); return () => clearTimeout(t); }, [onClose]);
  return (
    <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3 rounded-sm shadow-card-hover text-white text-sm font-medium ${type === 'error' ? 'bg-red-600' : 'bg-green-600'}`}>
      {type === 'error' ? <AlertCircle size={16} /> : <CheckCircle size={16} />}
      {message}
      <button onClick={onClose}><X size={14} /></button>
    </div>
  );
}

export function StudentsAdmin() {
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null); // student seleccionado para inscribir
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [enrolling, setEnrolling] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => setToast({ message, type });

  const load = async () => {
    const [s, c] = await Promise.all([
      getAllStudents(),
      getCourses({ visibleOnly: false }),
    ]);
    setStudents(s);
    setCourses(c);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleEnroll = async () => {
    if (!selected || !selectedCourseId) return;
    setEnrolling(true);
    try {
      await enrollStudent(selected.id, Number(selectedCourseId));
      showToast(`${selected.full_name || selected.email} inscrito correctamente`);
      setSelected(null);
      setSelectedCourseId('');
      load();
    } catch (err) {
      showToast(`Error: ${err.message}`, 'error');
    } finally {
      setEnrolling(false);
    }
  };

  const handleUnenroll = async (userId, courseId, studentName, courseTitle) => {
    if (!window.confirm(`¿Desinscribir a ${studentName} del curso "${courseTitle}"?`)) return;
    try {
      await unenrollStudent(userId, courseId);
      showToast('Alumno desinscrito');
      load();
    } catch (err) {
      showToast(`Error: ${err.message}`, 'error');
    }
  };

  const enrolledCourseIds = selected
    ? (selected.course_enrollments || []).map(e => e.course_id)
    : [];

  const availableCourses = courses.filter(c => !enrolledCourseIds.includes(c.id));

  return (
    <div>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-brand-dark">Gestión de Estudiantes</h2>
          <p className="text-brand-text text-sm mt-1">{students.length} alumnos registrados</p>
        </div>
      </div>

      {loading ? (
        <div className="card bg-white p-8 text-center text-brand-midgray">Cargando...</div>
      ) : students.length === 0 ? (
        <div className="card bg-white p-12 text-center">
          <Users size={36} className="text-brand-midgray mx-auto mb-3" />
          <p className="text-brand-dark font-semibold">Aún no hay alumnos registrados</p>
          <p className="text-brand-text text-sm mt-1">Aparecerán aquí cuando se registren en la Intranet.</p>
        </div>
      ) : (
        <div className="bg-white card overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-brand-lightgray border-b border-brand-gray">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-brand-dark text-xs uppercase tracking-wide">Alumno</th>
                <th className="text-left px-4 py-3 font-semibold text-brand-dark text-xs uppercase tracking-wide hidden md:table-cell">Cursos inscritos</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-gray">
              {students.map(student => {
                const enrollments = student.course_enrollments || [];
                return (
                  <tr key={student.id} className="hover:bg-brand-lightgray/50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <span className="text-primary font-bold text-sm">
                            {(student.full_name || student.email || '?')[0].toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-brand-dark">{student.full_name || '—'}</p>
                          <p className="text-brand-midgray text-xs">{student.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      {enrollments.length === 0 ? (
                        <span className="text-brand-midgray text-xs">Sin cursos asignados</span>
                      ) : (
                        <div className="flex flex-wrap gap-1.5">
                          {enrollments.map(e => (
                            <span key={e.course_id} className="inline-flex items-center gap-1 bg-brand-lightgray border border-brand-gray text-brand-text text-xs px-2 py-0.5 rounded-full">
                              <BookOpen size={10} />
                              {e.courses?.title || `Curso ${e.course_id}`}
                              <button
                                onClick={() => handleUnenroll(student.id, e.course_id, student.full_name || student.email, e.courses?.title)}
                                className="ml-1 text-brand-midgray hover:text-red-600 transition-colors"
                                title="Desinscribir"
                              >
                                <X size={10} />
                              </button>
                            </span>
                          ))}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => { setSelected(student); setSelectedCourseId(''); }}
                        className="flex items-center gap-1.5 text-xs font-semibold text-primary hover:bg-red-50 px-2.5 py-1.5 rounded-sm transition-colors"
                      >
                        <Plus size={13} />
                        Inscribir
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal inscripción */}
      {selected && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-sm shadow-card-hover w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-brand-dark">Inscribir a un curso</h3>
              <button onClick={() => setSelected(null)}><X size={18} className="text-brand-midgray" /></button>
            </div>
            <p className="text-brand-text text-sm mb-4">
              Alumno: <strong className="text-brand-dark">{selected.full_name || selected.email}</strong>
            </p>
            {availableCourses.length === 0 ? (
              <p className="text-brand-midgray text-sm py-4 text-center">Este alumno ya está inscrito en todos los cursos disponibles.</p>
            ) : (
              <>
                <label className="block text-sm font-medium text-brand-dark mb-1.5">Selecciona el curso</label>
                <select
                  value={selectedCourseId}
                  onChange={e => setSelectedCourseId(e.target.value)}
                  className="w-full border border-brand-gray rounded-sm px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition mb-4"
                >
                  <option value="">— Selecciona un curso —</option>
                  {availableCourses.map(c => (
                    <option key={c.id} value={c.id}>{c.title}</option>
                  ))}
                </select>
                <div className="flex gap-3">
                  <button
                    onClick={() => setSelected(null)}
                    className="flex-1 border border-brand-gray text-brand-text font-medium py-2.5 rounded-sm hover:bg-brand-lightgray transition-colors text-sm"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleEnroll}
                    disabled={!selectedCourseId || enrolling}
                    className="flex-1 bg-primary text-white font-semibold py-2.5 rounded-sm hover:bg-primary-dark disabled:opacity-60 transition-colors text-sm flex items-center justify-center gap-2"
                  >
                    {enrolling && <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
                    Inscribir
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
