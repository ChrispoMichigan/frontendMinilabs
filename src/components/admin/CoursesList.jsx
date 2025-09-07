import React, { useState } from 'react';
import { Edit, Trash2, Eye, Users, Clock, DollarSign, Settings, MoreVertical } from 'lucide-react';

const CoursesList = ({ 
  courses = [], 
  loading = false, 
  onEdit, 
  onDelete, 
  onView,
  onToggleStatus 
}) => {
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showOptionsMenu, setShowOptionsMenu] = useState(null);

  // Confirmar eliminación
  const handleDeleteConfirm = () => {
    if (selectedCourse && onDelete) {
      onDelete(selectedCourse.id);
      setShowDeleteConfirm(false);
      setSelectedCourse(null);
    }
  };

  // Formatear precio
  const formatPrice = (price) => {
    return price ? `$${parseFloat(price).toFixed(2)}` : 'Gratis';
  };

  // Formatear fecha
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Obtener color del estado
  const getStatusColor = (status) => {
    switch (status) {
      case 'published':
        return 'bg-green-100 text-green-800';
      case 'draft':
        return 'bg-yellow-100 text-yellow-800';
      case 'archived':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Obtener texto del estado
  const getStatusText = (status) => {
    switch (status) {
      case 'published':
        return 'Publicado';
      case 'draft':
        return 'Borrador';
      case 'archived':
        return 'Archivado';
      default:
        return status;
    }
  };

  // Obtener color del nivel de dificultad
  const getDifficultyColor = (level) => {
    switch (level) {
      case 'beginner':
        return 'bg-green-100 text-green-800';
      case 'intermediate':
        return 'bg-blue-100 text-blue-800';
      case 'advanced':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Obtener texto del nivel
  const getDifficultyText = (level) => {
    switch (level) {
      case 'beginner':
        return 'Principiante';
      case 'intermediate':
        return 'Intermedio';
      case 'advanced':
        return 'Avanzado';
      default:
        return level;
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, index) => (
          <div key={index} className="bg-white rounded-lg border border-gray-200 p-6 animate-pulse">
            <div className="w-full h-40 bg-gray-200 rounded-lg mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-2/3 mb-4"></div>
            <div className="flex justify-between items-center">
              <div className="h-6 bg-gray-200 rounded w-20"></div>
              <div className="h-8 bg-gray-200 rounded w-24"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (courses.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 mx-auto mb-4 text-gray-400">
          <Settings className="w-full h-full" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          No hay cursos disponibles
        </h3>
        <p className="text-gray-500">
          Comienza creando tu primer curso de robótica.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <div
            key={course.id}
            className="bg-white rounded-lg border border-gray-200 hover:shadow-lg transition-shadow duration-200"
          >
            {/* Imagen del curso */}
            <div className="relative">
              {course.cover_image_url ? (
                <img
                  src={course.cover_image_url}
                  alt={course.title}
                  className="w-full h-40 object-cover rounded-t-lg"
                />
              ) : (
                <div className="w-full h-40 bg-gradient-to-br from-blue-400 to-purple-500 rounded-t-lg flex items-center justify-center">
                  <Settings className="w-12 h-12 text-white opacity-80" />
                </div>
              )}

              {/* Estado del curso */}
              <div className="absolute top-3 right-3">
                <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(course.status)}`}>
                  {getStatusText(course.status)}
                </span>
              </div>

              {/* Menú de opciones */}
              <div className="absolute top-3 left-3">
                <button
                  onClick={() => setShowOptionsMenu(showOptionsMenu === course.id ? null : course.id)}
                  className="p-1 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors"
                >
                  <MoreVertical className="w-4 h-4 text-gray-600" />
                </button>

                {showOptionsMenu === course.id && (
                  <div className="absolute top-8 left-0 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10 min-w-[140px]">
                    <button
                      onClick={() => {
                        onView && onView(course);
                        setShowOptionsMenu(null);
                      }}
                      className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                    >
                      <Eye className="w-4 h-4" />
                      Vista Cliente
                    </button>
                    <button
                      onClick={() => {
                        onEdit && onEdit(course);
                        setShowOptionsMenu(null);
                      }}
                      className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                    >
                      <Edit className="w-4 h-4" />
                      Editar
                    </button>
                    {onToggleStatus && (
                      <button
                        onClick={() => {
                          onToggleStatus(course.id, course.status === 'published' ? 'draft' : 'published');
                          setShowOptionsMenu(null);
                        }}
                        className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                      >
                        <Settings className="w-4 h-4" />
                        {course.status === 'published' ? 'Despublicar' : 'Publicar'}
                      </button>
                    )}
                    <hr className="my-1" />
                    <button
                      onClick={() => {
                        setSelectedCourse(course);
                        setShowDeleteConfirm(true);
                        setShowOptionsMenu(null);
                      }}
                      className="w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                    >
                      <Trash2 className="w-4 h-4" />
                      Eliminar
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Contenido de la tarjeta */}
            <div className="p-4">
              {/* Título y categoría */}
              <div className="mb-3">
                <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">
                  {course.title}
                </h3>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                    {course.category}
                  </span>
                  <span className={`text-xs px-2 py-1 rounded ${getDifficultyColor(course.difficulty_level)}`}>
                    {getDifficultyText(course.difficulty_level)}
                  </span>
                </div>
              </div>

              {/* Descripción */}
              <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                {course.description}
              </p>

              {/* Estadísticas */}
              <div className="grid grid-cols-2 gap-4 mb-4 text-xs text-gray-500">
                <div className="flex items-center gap-1">
                  <Users className="w-3 h-3" />
                  <span>{course.age_min}-{course.age_max} años</span>
                </div>
                {course.duration_hours > 0 && (
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{course.duration_hours}h</span>
                  </div>
                )}
                {course.activities_count > 0 && (
                  <div className="flex items-center gap-1">
                    <Settings className="w-3 h-3" />
                    <span>{course.activities_count} actividades</span>
                  </div>
                )}
                <div className="flex items-center gap-1">
                  <DollarSign className="w-3 h-3" />
                  <span className="font-medium text-gray-900">
                    {formatPrice(course.price)}
                  </span>
                </div>
              </div>

              {/* Información adicional */}
              <div className="text-xs text-gray-400 mb-4">
                Creado el {formatDate(course.created_at)}
              </div>

              {/* Botones de acción */}
              <div className="flex gap-2">
                <button
                  onClick={() => onView && onView(course)}
                  className="flex-1 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
                >
                  Vista Cliente
                </button>
                <button
                  onClick={() => onEdit && onEdit(course)}
                  className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Edit className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal de confirmación de eliminación */}
      {showDeleteConfirm && selectedCourse && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              ¿Eliminar curso?
            </h3>
            <p className="text-gray-600 mb-6">
              ¿Estás seguro de que quieres eliminar el curso "{selectedCourse.title}"? 
              Esta acción no se puede deshacer.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setSelectedCourse(null);
                }}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Click outside para cerrar menús */}
      {showOptionsMenu && (
        <div 
          className="fixed inset-0 z-0"
          onClick={() => setShowOptionsMenu(null)}
        />
      )}
    </>
  );
};

export default CoursesList;
