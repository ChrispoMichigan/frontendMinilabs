import { useState, useEffect, useCallback } from 'react';
import { 
  Clock, 
  Users, 
  BookOpen, 
  Star
} from 'lucide-react';
import { coursesService } from '../../services/api';
import CoursePurchaseActions from './CoursePurchaseActions';
import CourseInfo from './CourseInfo';
import CourseLessons from './CourseLessons';

const CourseDetailsModal = ({ course, isOpen, onClose }) => {
  const [courseDetails, setCourseDetails] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(false);

  // Cargar detalles completos del curso cuando se abre el modal
  const loadCourseDetails = useCallback(async () => {
    try {
      setLoading(true);
      
      // Cargar detalles del curso y lecciones en paralelo
      const [courseResponse, lessonsResponse] = await Promise.all([
        coursesService.getCourseById(course.id),
        coursesService.getCourseLessons(course.id)
      ]);

      if (courseResponse.success) {
        setCourseDetails(courseResponse.data);
      }
      
      if (lessonsResponse.success) {
        setLessons(lessonsResponse.data || []);
      }
    } catch (error) {
      console.error('Error loading course details:', error);
    } finally {
      setLoading(false);
    }
  }, [course?.id]);

  useEffect(() => {
    if (isOpen && course?.id) {
      loadCourseDetails();
    }
  }, [isOpen, course?.id, loadCourseDetails]);

  const formatPrice = (price) => {
    return price > 0 ? `$${parseFloat(price).toFixed(2)} USD` : 'Gratis';
  };

  const getDifficultyText = (level) => {
    switch (level) {
      case 'beginner': return 'Principiante';
      case 'intermediate': return 'Intermedio';
      case 'advanced': return 'Avanzado';
      default: return level || 'No definido';
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

  if (loading) {
    return (
      <div className="p-8 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Cargando detalles del curso...</p>
      </div>
    );
  }

  const displayCourse = courseDetails || course;

  return (
    <div className="w-full h-full">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-purple-800 text-white">
        <div className="p-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            {/* Información del curso */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(displayCourse.difficulty_level)}`}>
                  {getDifficultyText(displayCourse.difficulty_level)}
                </span>
                <span className="px-3 py-1 bg-white bg-opacity-20 rounded-full text-sm">
                  {displayCourse.category}
                </span>
              </div>
              
              <h1 className="text-3xl lg:text-4xl font-bold mb-4 leading-tight">
                {displayCourse.title}
              </h1>
              
              <p className="text-lg text-blue-100 mb-6 leading-relaxed">
                {displayCourse.description}
              </p>

              {/* Estadísticas */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="text-center">
                  <Users className="w-6 h-6 mx-auto mb-2" />
                  <div className="text-sm text-blue-200">Edades</div>
                  <div className="font-semibold">{displayCourse.age_min}-{displayCourse.age_max} años</div>
                </div>
                <div className="text-center">
                  <Clock className="w-6 h-6 mx-auto mb-2" />
                  <div className="text-sm text-blue-200">Duración</div>
                  <div className="font-semibold">{displayCourse.duration_hours || 0}h</div>
                </div>
                <div className="text-center">
                  <BookOpen className="w-6 h-6 mx-auto mb-2" />
                  <div className="text-sm text-blue-200">Lecciones</div>
                  <div className="font-semibold">{lessons.length}</div>
                </div>
                <div className="text-center">
                  <Star className="w-6 h-6 mx-auto mb-2" />
                  <div className="text-sm text-blue-200">Actividades</div>
                  <div className="font-semibold">{displayCourse.activities_count || 0}</div>
                </div>
              </div>

              {/* Precio */}
              <div className="flex items-center gap-6">
                <div className="text-3xl font-bold text-yellow-300">
                  {formatPrice(displayCourse.price)}
                </div>
                <button className="bg-yellow-500 hover:bg-yellow-400 text-yellow-900 px-6 py-3 rounded-lg font-bold text-lg transition-colors shadow-lg">
                  Obtener Curso
                </button>
              </div>
            </div>

            {/* Imagen del curso */}
            <div className="relative">
              {displayCourse.cover_image_url ? 
                <img 
                  src={displayCourse.cover_image_url} 
                  alt={displayCourse.title} 
                  className="w-full h-64 object-cover rounded-2xl shadow-2xl"
                /> :
                <div className="w-full h-64 bg-gradient-to-br from-blue-400 to-purple-500 rounded-2xl shadow-2xl flex items-center justify-center">
                  <BookOpen className="w-16 h-16 text-white opacity-50" />
                </div>
              }
            </div>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="p-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contenido principal */}
          <div className="lg:col-span-2 space-y-8">
            {/* Objetivo General */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                🎯 ¿Qué aprenderás?
              </h2>
              <p className="text-gray-700 leading-relaxed text-lg">
                {displayCourse.general_objective}
              </p>
            </section>

            {/* Componentes Incluidos */}
            {displayCourse.components_included && (
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  🔧 Componentes Incluidos
                </h2>
                <div className="bg-gray-50 rounded-lg p-4">
                  {displayCourse.components_included.split('\n').map((line, index) => (
                    <p key={index} className="mb-2 text-gray-700">{line}</p>
                  ))}
                </div>
              </section>
            )}

            {/* Lecciones */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                📚 Contenido del Curso
              </h2>
              
              <CourseLessons lessons={lessons} />
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Card de compra */}
            <div className="bg-white border border-gray-200 rounded-lg p-6 sticky top-6">
              <div className="text-center mb-6">
                <div className="text-3xl font-bold text-gray-900 mb-2">
                  {formatPrice(displayCourse.price)}
                </div>
                <p className="text-gray-600">Acceso completo de por vida</p>
              </div>
              
              <CoursePurchaseActions course={displayCourse} />
            </div>

            {/* Información adicional */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="font-bold text-gray-900 mb-4">📋 Detalles del Curso</h3>
              <CourseInfo course={displayCourse} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetailsModal;
