import { useState, useMemo, useEffect } from 'react';
import CourseCard from './CourseCard';
import CourseFilters from './CourseFilters';
import { coursesService } from '../services/api';
import { useCoursePreview } from '../hooks/useCoursePreview';
import CoursePreviewModal from './course/CoursePreviewModal';

const CoursesGrid = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { showPreview, selectedCourse, openPreview, closePreview } = useCoursePreview();
  const [filters, setFilters] = useState({
    category: 'Todos',
    level: 'Todos',
    age: 'Todos',
    search: '',
    priceRange: [0, 300]
  });
  const [sortBy, setSortBy] = useState('popularity'); // 'popularity', 'price-low', 'price-high', 'rating'

  // Cargar cursos desde la API
  useEffect(() => {
    const loadCourses = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await coursesService.getAllCourses();
        
        if (response.success) {
          setCourses(response.data || []);
        } else {
          setError('Error al cargar los cursos');
        }
      } catch (err) {
        console.error('Error loading courses:', err);
        setError('Error al conectar con el servidor');
      } finally {
        setLoading(false);
      }
    };

    loadCourses();
  }, []);

  const filteredAndSortedCourses = useMemo(() => {
    let filtered = courses.filter(course => {
      // Filtro por categoría
      if (filters.category !== 'Todos') {
        if (course.category && !course.category.toLowerCase().includes(filters.category.toLowerCase())) {
          return false;
        }
      }

      // Filtro por nivel
      if (filters.level !== 'Todos') {
        const levelMap = {
          'Principiante': 'beginner',
          'Intermedio': 'intermediate',
          'Avanzado': 'advanced'
        };
        const filterLevel = levelMap[filters.level] || filters.level.toLowerCase();
        if (course.difficulty_level !== filterLevel) {
          return false;
        }
      }

      // Filtro por edad
      if (filters.age !== 'Todos') {
        const ageRange = filters.age.split('-').map(a => parseInt(a.replace(' años', '')));
        if (ageRange.length === 2) {
          const courseAgeMin = course.age_min || 0;
          const courseAgeMax = course.age_max || 100;
          // Verificar si hay overlap en los rangos de edad
          const overlap = ageRange[0] <= courseAgeMax && ageRange[1] >= courseAgeMin;
          if (!overlap) return false;
        }
      }

      // Filtro por búsqueda
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const matchesSearch = 
          course.title.toLowerCase().includes(searchLower) ||
          course.description.toLowerCase().includes(searchLower) ||
          (course.category && course.category.toLowerCase().includes(searchLower)) ||
          (course.general_objective && course.general_objective.toLowerCase().includes(searchLower));
        if (!matchesSearch) return false;
      }

      // Filtro por precio
      if (course.price > filters.priceRange[1]) {
        return false;
      }

      return true;
    });

    // Ordenamiento
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => (a.price || 0) - (b.price || 0));
        break;
      case 'price-high':
        filtered.sort((a, b) => (b.price || 0) - (a.price || 0));
        break;
      case 'rating':
        // Como no tenemos rating real, ordenar por actividades
        filtered.sort((a, b) => (b.activities_count || 0) - (a.activities_count || 0));
        break;
      case 'popularity':
      default:
        // Ordenar por fecha de creación (más recientes primero)
        filtered.sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));
        break;
    }

    return filtered;
  }, [courses, filters, sortBy]);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  return (
    <section id="kits" className="py-16 bg-gradient-to-br from-gray-50 via-blue-50/30 to-[#004aad]/5 relative overflow-hidden">
      {/* Elementos decorativos de fondo */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-0 w-72 h-72 bg-[#004aad]/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-0 w-96 h-96 bg-[#0066cc]/8 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-yellow-400/5 rounded-full blur-3xl"></div>
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Título de la sección */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#004aad] to-[#0066cc] bg-clip-text text-transparent mb-4">
            Cursos Educativos de Robótica
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Descubre nuestra colección de cursos educativos diseñados para que los niños aprendan ciencia y tecnología de forma divertida y segura
          </p>
        </div>

        {/* Filtros */}
        <CourseFilters onFilterChange={handleFilterChange} />

        {/* Barra de herramientas */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8">
          <div className="text-gray-600 mb-4 sm:mb-0">
            {loading ? (
              'Cargando cursos...'
            ) : (
              `Mostrando ${filteredAndSortedCourses.length} de ${courses.length} cursos educativos`
            )}
          </div>
          
          <div className="flex items-center space-x-4">
            <label className="text-sm font-medium text-gray-700">
              Ordenar por:
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="popularity">Más Popular</option>
              <option value="rating">Mejor Valorado</option>
              <option value="price-low">Precio: Menor a Mayor</option>
              <option value="price-high">Precio: Mayor a Menor</option>
            </select>
          </div>
        </div>

        {/* Grid de cursos */}
        {loading ? (
          /* Estado de carga */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-lg overflow-hidden animate-pulse">
                <div className="w-full h-48 bg-gray-200"></div>
                <div className="p-6">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3 mb-4"></div>
                  <div className="flex justify-between items-center">
                    <div className="h-6 bg-gray-200 rounded w-20"></div>
                    <div className="h-8 bg-gray-200 rounded w-24"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          /* Estado de error */
          <div className="text-center py-16">
            <svg className="mx-auto h-24 w-24 text-red-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Error al cargar los cursos
            </h3>
            <p className="text-gray-600 mb-6">
              {error}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="bg-gradient-to-r from-[#004aad] to-[#0066cc] hover:from-[#0066cc] hover:to-[#004aad] text-white px-6 py-3 rounded-lg font-medium transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Reintentar
            </button>
          </div>
        ) : filteredAndSortedCourses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredAndSortedCourses.map(course => (
              <CourseCard 
                key={course.id} 
                course={course} 
                onViewDetails={openPreview}
              />
            ))}
          </div>
        ) : (
          /* Estado vacío */
          <div className="text-center py-16">
            <svg className="mx-auto h-24 w-24 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.467.901-6.063 2.383l1.119.727A6.966 6.966 0 0112 17a6.966 6.966 0 014.944 1.11l1.119-.727z"/>
            </svg>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No se encontraron cursos educativos
            </h3>
            <p className="text-gray-600 mb-6">
              Intenta ajustar tus filtros de búsqueda para encontrar más Cursos
            </p>
            <button
              onClick={() => handleFilterChange({
                category: 'Todos',
                level: 'Todos',
                age: 'Todos',
                search: '',
                priceRange: [0, 300]
              })}
              className="bg-gradient-to-r from-[#004aad] to-[#0066cc] hover:from-[#0066cc] hover:to-[#004aad] text-white px-6 py-3 rounded-lg font-medium transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Ver Todos los Cursos
            </button>
          </div>
        )}

        {/* Botón cargar más (placeholder para paginación futura) */}
        {!loading && !error && filteredAndSortedCourses.length > 0 && filteredAndSortedCourses.length >= 6 && (
          <div className="text-center mt-12">
            <button className="bg-gradient-to-r from-white to-blue-50 hover:from-blue-50 hover:to-white text-gray-900 border border-[#004aad]/30 hover:border-[#004aad]/50 px-8 py-3 rounded-lg font-medium transition-all duration-300 shadow-md hover:shadow-lg">
              Cargar Más Cursos
            </button>
          </div>
        )}
      </div>

      {/* Modal de vista previa */}
      {showPreview && selectedCourse && (
        <CoursePreviewModal 
          course={selectedCourse}
          isOpen={showPreview}
          onClose={closePreview}
        />
      )}
    </section>
  );
};

export default CoursesGrid;
