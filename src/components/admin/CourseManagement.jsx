import React, { useState, useEffect, useCallback } from 'react';
import { Plus, Search, Filter, Package, BookOpen, DollarSign, Clock } from 'lucide-react';
import AddCourseForm from './AddCourseForm';
import CoursesList from './CoursesList';

const CourseManagement = () => {
  const [activeTab, setActiveTab] = useState('list');
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterDifficulty, setFilterDifficulty] = useState('');
  const [categories, setCategories] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    categories: 0,
    avgPrice: 0
  });

  // Calcular estadísticas
  const calculateStats = useCallback((coursesData) => {
    const activeCourses = coursesData.filter(course => course.is_active);
    const uniqueCategories = [...new Set(coursesData.map(course => course.category))];
    const avgPrice = coursesData.length > 0 
      ? coursesData.reduce((sum, course) => sum + parseFloat(course.price), 0) / coursesData.length 
      : 0;

    setStats({
      total: coursesData.length,
      active: activeCourses.length,
      categories: uniqueCategories.length,
      avgPrice: avgPrice
    });
  }, []);

  // Cargar cursos
  const loadCourses = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('adminToken');
      
      const params = new URLSearchParams();
      if (filterCategory) params.append('category', filterCategory);
      if (filterDifficulty) params.append('difficulty', filterDifficulty);
      params.append('include_inactive', 'true');

      const response = await fetch(`http://localhost:3001/api/courses?${params}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      
      if (data.success) {
        setCourses(data.data);
        calculateStats(data.data);
      } else {
        console.error('Error al cargar cursos:', data.message);
      }
    } catch (error) {
      console.error('Error al cargar cursos:', error);
    } finally {
      setLoading(false);
    }
  }, [filterCategory, filterDifficulty, calculateStats]);

  // Cargar categorías
  const loadCategories = useCallback(async () => {
    try {
      const response = await fetch('http://localhost:3001/api/courses/categories');
      const data = await response.json();
      
      if (data.success) {
        setCategories(data.data);
      }
    } catch (error) {
      console.error('Error al cargar categorías:', error);
    }
  }, []);

  // Cargar datos iniciales
  useEffect(() => {
    loadCourses();
    loadCategories();
  }, [loadCourses, loadCategories]);

  // Filtrar cursos por búsqueda
  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  // Manejar cambios de filtros
  useEffect(() => {
    loadCourses();
  }, [filterCategory, filterDifficulty, loadCourses]);

  // Callback cuando se crea un curso
  const handleCourseCreated = () => {
    loadCourses();
    setActiveTab('list');
  };

  // Función para ver detalles de un curso (vista cliente)
  const handleViewCourse = (course) => {
    // Abrir la vista previa del curso en una nueva pestaña
    const previewUrl = `/course-preview.html?courseId=${course.id}`;
    window.open(previewUrl, '_blank', 'width=1200,height=800');
  };

  // Función para editar un curso
  const handleEditCourse = (course) => {
    console.log('Editar curso:', course);
    // Aquí podrías abrir un formulario de edición
  };

  // Función para eliminar un curso
  const handleDeleteCourse = async (courseId) => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`http://localhost:3001/api/courses/${courseId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      
      if (data.success) {
        loadCourses(); // Recargar la lista
      } else {
        alert('Error al eliminar el curso: ' + data.message);
      }
    } catch (error) {
      console.error('Error al eliminar curso:', error);
      alert('Error al eliminar el curso');
    }
  };

  // Función para cambiar estado de un curso
  const handleToggleStatus = async (courseId, newStatus) => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`http://localhost:3001/api/courses/${courseId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });

      const data = await response.json();
      
      if (data.success) {
        loadCourses(); // Recargar la lista
      } else {
        alert('Error al actualizar el estado: ' + data.message);
      }
    } catch (error) {
      console.error('Error al actualizar estado:', error);
      alert('Error al actualizar el estado del curso');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestión de Cursos</h1>
          <p className="text-gray-600 mt-1">
            Administra los kits educativos y cursos disponibles
          </p>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('list')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'list'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Package className="w-4 h-4 inline mr-2" />
            Ver Cursos
          </button>
          <button
            onClick={() => setActiveTab('add')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'add'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Plus className="w-4 h-4 inline mr-2" />
            Añadir Curso
          </button>
        </div>
      </div>

      {/* Estadísticas */}
      {activeTab === 'list' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Package className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total de Cursos</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <BookOpen className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Cursos Activos</p>
                <p className="text-2xl font-bold text-gray-900">{stats.active}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Filter className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Categorías</p>
                <p className="text-2xl font-bold text-gray-900">{stats.categories}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <DollarSign className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Precio Promedio</p>
                <p className="text-2xl font-bold text-gray-900">
                  ${stats.avgPrice.toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Contenido principal */}
      <div className="bg-white rounded-lg shadow-sm border">
        {activeTab === 'list' && (
          <div className="p-6">
            {/* Filtros de búsqueda */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Buscar cursos..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Todas las categorías</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>

              <select
                value={filterDifficulty}
                onChange={(e) => setFilterDifficulty(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Todas las dificultades</option>
                <option value="beginner">Principiante</option>
                <option value="intermediate">Intermedio</option>
                <option value="advanced">Avanzado</option>
              </select>
            </div>

            {/* Lista de cursos */}
            <CoursesList
              courses={filteredCourses}
              loading={loading}
              onEdit={handleEditCourse}
              onDelete={handleDeleteCourse}
              onView={handleViewCourse}
              onToggleStatus={handleToggleStatus}
            />
          </div>
        )}

        {activeTab === 'add' && (
          <div className="p-6">
            <AddCourseForm
              onCourseCreated={handleCourseCreated}
              categories={categories}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseManagement;
