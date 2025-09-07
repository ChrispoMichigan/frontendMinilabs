import React, { useState, useEffect, useCallback } from 'react';
import { Clock, Users, BookOpen, Download, ArrowLeft, Play, FileText, Star } from 'lucide-react';

const CoursePreview = ({ courseId, onClose }) => {
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedLesson, setExpandedLesson] = useState(null);

  const loadCourseDetails = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:3001/api/courses/${courseId}`);
      const data = await response.json();
      
      if (data.success) {
        setCourse(data.data);
      } else {
        setError('Error al cargar el curso');
      }
    } catch (error) {
      console.error('Error al cargar curso:', error);
      setError('Error al conectar con el servidor');
    } finally {
      setLoading(false);
    }
  }, [courseId]);

  useEffect(() => {
    if (courseId) {
      loadCourseDetails();
    }
  }, [courseId, loadCourseDetails]);

  const formatPrice = (price) => {
    return price > 0 ? `$${parseFloat(price).toFixed(2)} USD` : 'Gratis';
  };

  const getDifficultyText = (level) => {
    switch (level) {
      case 'beginner': return 'Principiante';
      case 'intermediate': return 'Intermedio';
      case 'advanced': return 'Avanzado';
      default: return level;
    }
  };

  const getDifficultyColor = (level) => {
    switch (level) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-blue-100 text-blue-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const toggleLesson = (lessonId) => {
    setExpandedLesson(expandedLesson === lessonId ? null : lessonId);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando curso...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 mb-4">❌</div>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Curso no encontrado</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header con botón de cerrar */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <button
            onClick={onClose}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Volver al Panel
          </button>
          <span className="text-sm text-gray-500 bg-blue-100 px-3 py-1 rounded-full">
            Vista Previa - Como lo ve el Cliente
          </span>
        </div>
      </div>

      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-900 via-blue-800 to-purple-900 text-white">
        <div className="max-w-6xl mx-auto px-4 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Información del curso */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(course.difficulty_level)} text-opacity-90`}>
                  {getDifficultyText(course.difficulty_level)}
                </span>
                <span className="px-3 py-1 bg-white bg-opacity-20 rounded-full text-sm">
                  {course.category}
                </span>
              </div>
              
              <h1 className="text-4xl lg:text-5xl font-bold mb-6 leading-tight">
                {course.title}
              </h1>
              
              <p className="text-xl text-blue-100 mb-8 leading-relaxed">
                {course.description}
              </p>

              {/* Estadísticas */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="text-center">
                  <Users className="w-6 h-6 mx-auto mb-2 text-blue-300" />
                  <div className="text-sm text-blue-200">Edades</div>
                  <div className="font-semibold">{course.age_min}-{course.age_max} años</div>
                </div>
                <div className="text-center">
                  <Clock className="w-6 h-6 mx-auto mb-2 text-blue-300" />
                  <div className="text-sm text-blue-200">Duración</div>
                  <div className="font-semibold">{course.duration_hours || 0}h</div>
                </div>
                <div className="text-center">
                  <BookOpen className="w-6 h-6 mx-auto mb-2 text-blue-300" />
                  <div className="text-sm text-blue-200">Lecciones</div>
                  <div className="font-semibold">{course.lessons?.length || 0}</div>
                </div>
                <div className="text-center">
                  <Star className="w-6 h-6 mx-auto mb-2 text-blue-300" />
                  <div className="text-sm text-blue-200">Actividades</div>
                  <div className="font-semibold">{course.activities_count || 0}</div>
                </div>
              </div>

              {/* Precio y CTA */}
              <div className="flex items-center gap-6">
                <div className="text-3xl font-bold text-yellow-300">
                  {formatPrice(course.price)}
                </div>
                <button className="bg-yellow-500 hover:bg-yellow-400 text-yellow-900 px-8 py-3 rounded-lg font-bold text-lg transition-colors shadow-lg">
                  Obtener Curso
                </button>
              </div>
            </div>

            {/* Imagen del curso */}
            <div className="relative">
              {course.cover_image_url ? (
                <img
                  src={course.cover_image_url}
                  alt={course.title}
                  className="w-full h-80 object-cover rounded-2xl shadow-2xl"
                />
              ) : (
                <div className="w-full h-80 bg-gradient-to-br from-blue-400 to-purple-500 rounded-2xl shadow-2xl flex items-center justify-center">
                  <BookOpen className="w-24 h-24 text-white opacity-50" />
                </div>
              )}
              <div className="absolute -bottom-4 -right-4 bg-yellow-500 text-yellow-900 p-4 rounded-xl shadow-lg">
                <FileText className="w-8 h-8" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Contenido principal */}
          <div className="lg:col-span-2 space-y-12">
            {/* Objetivo General */}
            <section className="bg-white rounded-2xl p-8 shadow-lg">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                ¿Qué aprenderás?
              </h2>
              <p className="text-gray-700 leading-relaxed text-lg">
                {course.general_objective}
              </p>
            </section>

            {/* Componentes Incluidos */}
            {course.components_included && (
              <section className="bg-white rounded-2xl p-8 shadow-lg">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  🔧 Componentes Incluidos
                </h2>
                <div className="text-gray-700 leading-relaxed">
                  {course.components_included.split('\n').map((line, index) => (
                    <p key={index} className="mb-2">{line}</p>
                  ))}
                </div>
              </section>
            )}

            {/* Lecciones */}
            <section className="bg-white rounded-2xl p-8 shadow-lg">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                📚 Contenido del Curso
              </h2>
              
              {course.lessons && course.lessons.length > 0 ? (
                <div className="space-y-4">
                  {course.lessons.map((lesson, index) => (
                    <div key={lesson.id} className="border border-gray-200 rounded-lg overflow-hidden">
                      <button
                        onClick={() => toggleLesson(lesson.id)}
                        className="w-full p-4 text-left hover:bg-gray-50 transition-colors flex items-center justify-between"
                      >
                        <div className="flex items-center gap-4">
                          <div className="flex-shrink-0 w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold">
                            {index + 1}
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900 mb-1">
                              {lesson.title}
                            </h3>
                            <div className="flex items-center gap-3 text-sm text-gray-500">
                              <span className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                {lesson.duration_minutes} min
                              </span>
                              <span className="flex items-center gap-1">
                                <FileText className="w-4 h-4" />
                                Material incluido
                              </span>
                            </div>
                          </div>
                        </div>
                        <Play className={`w-5 h-5 text-gray-400 transition-transform ${expandedLesson === lesson.id ? 'rotate-90' : ''}`} />
                      </button>
                      
                      {expandedLesson === lesson.id && (
                        <div className="px-4 pb-4 border-t bg-gray-50">
                          <div className="pt-4">
                            <p className="text-gray-700 mb-4">
                              {lesson.description || 'Descripción de la lección disponible una vez que comiences el curso.'}
                            </p>
                            <div className="flex items-center gap-2 text-sm text-blue-600">
                              <Download className="w-4 h-4" />
                              Material descargable disponible
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <BookOpen className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p>El contenido se publicará pronto</p>
                </div>
              )}
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Card de compra */}
            <div className="bg-white rounded-2xl p-6 shadow-lg sticky top-24">
              <div className="text-center mb-6">
                <div className="text-3xl font-bold text-gray-900 mb-2">
                  {formatPrice(course.price)}
                </div>
                <p className="text-gray-600">Acceso completo de por vida</p>
              </div>
              
              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-lg font-bold text-lg transition-colors mb-4">
                Comprar Ahora
              </button>
              
              <button className="w-full border border-gray-300 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors">
                Agregar al Carrito
              </button>

              <div className="mt-6 space-y-3 text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  <span>Acceso de por vida</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  <span>Todos los materiales incluidos</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  <span>Soporte técnico</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  <span>Certificado de completación</span>
                </div>
              </div>
            </div>

            {/* Información adicional */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h3 className="font-bold text-gray-900 mb-4">Detalles del Curso</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Nivel:</span>
                  <span className="font-medium">{getDifficultyText(course.difficulty_level)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Duración:</span>
                  <span className="font-medium">{course.duration_hours || 0} horas</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Lecciones:</span>
                  <span className="font-medium">{course.lessons?.length || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Edad:</span>
                  <span className="font-medium">{course.age_min}-{course.age_max} años</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoursePreview;
