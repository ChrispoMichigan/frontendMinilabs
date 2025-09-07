// Configuración base de la API
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

// Función para manejar respuestas de la API
const handleResponse = async (response) => {
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.message || `HTTP error! status: ${response.status}`);
  }
  
  return data;
};

// Función para hacer peticiones HTTP con configuración común
const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  // Agregar token de autorización si existe
  const token = localStorage.getItem('adminToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  try {
    const response = await fetch(url, config);
    return await handleResponse(response);
  } catch (error) {
    console.error(`API Error [${endpoint}]:`, error.message);
    throw error;
  }
};

// Servicio de autenticación de administradores
export const adminAuthService = {
  // Login de administrador
  login: async (credentials) => {
    try {
      const response = await apiRequest('/api/admin/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
      });

      // Guardar token en localStorage
      if (response.success && response.data.token) {
        localStorage.setItem('adminToken', response.data.token);
        localStorage.setItem('adminUser', JSON.stringify(response.data.user));
      }

      return response;
    } catch (error) {
      throw new Error(error.message || 'Error al iniciar sesión');
    }
  },

  // Logout de administrador
  logout: async () => {
    try {
      await apiRequest('/api/admin/auth/logout', {
        method: 'POST',
      });
      
      // Limpiar localStorage
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminUser');
      
      return { success: true };
    } catch (error) {
      // Incluso si falla la petición, limpiar localStorage
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminUser');
      throw new Error(error.message || 'Error al cerrar sesión');
    }
  },

  // Verificar token
  verifyToken: async () => {
    try {
      const response = await apiRequest('/api/admin/auth/verify');
      return response;
    } catch (error) {
      // Si el token no es válido, limpiar localStorage
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminUser');
      throw new Error(error.message || 'Token inválido');
    }
  },

  // Obtener perfil del administrador
  getProfile: async () => {
    try {
      const response = await apiRequest('/api/admin/auth/profile');
      return response;
    } catch (error) {
      throw new Error(error.message || 'Error al obtener perfil');
    }
  },

  // Verificar si el usuario está autenticado
  isAuthenticated: () => {
    const token = localStorage.getItem('adminToken');
    const user = localStorage.getItem('adminUser');
    return !!(token && user);
  },

  // Obtener datos del usuario desde localStorage
  getCurrentUser: () => {
    try {
      const userStr = localStorage.getItem('adminUser');
      return userStr ? JSON.parse(userStr) : null;
    } catch (error) {
      console.error('Error parsing user data:', error);
      return null;
    }
  },

  // Obtener token desde localStorage
  getToken: () => {
    return localStorage.getItem('adminToken');
  }
};

// Servicio general de API para otras funcionalidades
export const apiService = {
  // Health check del servidor
  healthCheck: async () => {
    try {
      const response = await apiRequest('/health');
      return response;
    } catch (error) {
      throw new Error('Servidor no disponible');
    }
  },

  // Obtener documentación de la API
  getDocs: async () => {
    try {
      const response = await apiRequest('/api/docs');
      return response;
    } catch (error) {
      throw new Error('Error al obtener documentación');
    }
  }
};

// Servicio de cursos públicos (para usuarios finales)
export const coursesService = {
  // Obtener todos los cursos públicos
  getAllCourses: async (filters = {}) => {
    try {
      let endpoint = '/api/courses';
      const params = new URLSearchParams();
      
      // Agregar filtros como parámetros de consulta
      if (filters.category && filters.category !== 'Todos') {
        params.append('category', filters.category);
      }
      if (filters.level && filters.level !== 'Todos') {
        params.append('level', filters.level);
      }
      if (filters.search) {
        params.append('search', filters.search);
      }
      if (filters.minPrice !== undefined) {
        params.append('minPrice', filters.minPrice);
      }
      if (filters.maxPrice !== undefined) {
        params.append('maxPrice', filters.maxPrice);
      }
      
      if (params.toString()) {
        endpoint += `?${params.toString()}`;
      }
      
      const response = await apiRequest(endpoint, { method: 'GET' });
      return response;
    } catch (error) {
      console.error('Error fetching courses:', error);
      throw new Error('Error al obtener cursos');
    }
  },

  // Obtener un curso específico por ID
  getCourseById: async (id) => {
    try {
      const response = await apiRequest(`/api/courses/${id}`, { method: 'GET' });
      return response;
    } catch (error) {
      console.error('Error fetching course:', error);
      throw new Error('Error al obtener detalles del curso');
    }
  },

  // Obtener lecciones de un curso
  getCourseLessons: async (courseId) => {
    try {
      const response = await apiRequest(`/api/courses/${courseId}/lessons`, { method: 'GET' });
      return response;
    } catch (error) {
      console.error('Error fetching lessons:', error);
      throw new Error('Error al obtener lecciones del curso');
    }
  }
};

export default { adminAuthService, apiService, coursesService };
