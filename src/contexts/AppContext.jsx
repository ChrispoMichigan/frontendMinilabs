import { createContext, useState, useEffect } from 'react';
import { adminAuthService } from '../services/api';

const AppContext = createContext();

const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login'); // 'login', 'register', 'admin'
  const [cart, setCart] = useState([]);
  const [currentPage, setCurrentPage] = useState('home'); // 'home', 'admin'
  const [isLoading, setIsLoading] = useState(true);

  // Verificar autenticación al cargar la aplicación
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        if (adminAuthService.isAuthenticated()) {
          // Verificar que el token siga siendo válido
          const response = await adminAuthService.verifyToken();
          if (response.success) {
            const userData = adminAuthService.getCurrentUser();
            if (userData) {
              setUser({
                ...userData,
                role: userData.role,
                isAdmin: userData.role === 'admin' || userData.role === 'staff'
              });
              // Si es admin y el token es válido, ir al panel
              if (userData.role === 'admin' || userData.role === 'staff') {
                setCurrentPage('admin');
              }
            }
          }
        }
      } catch (error) {
        console.error('Error al verificar autenticación:', error);
        // Si hay error, limpiar datos
        setUser(null);
        setCurrentPage('home');
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const openAuthModal = (mode = 'login') => {
    setAuthMode(mode);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  const login = async (userData) => {
    try {
      setUser(userData);
      closeAuthModal();
      
      // Si es admin, redirigir al panel
      if (userData.role === 'admin' || userData.role === 'staff') {
        setCurrentPage('admin');
      }
    } catch (error) {
      console.error('Error en login:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      // Si es admin, hacer logout en el servidor
      if (user && (user.role === 'admin' || user.role === 'staff')) {
        await adminAuthService.logout();
      }
      
      setUser(null);
      setCart([]);
      setCurrentPage('home');
    } catch (error) {
      console.error('Error en logout:', error);
      // Incluso si hay error, limpiar estado local
      setUser(null);
      setCart([]);
      setCurrentPage('home');
    }
  };

  const navigateToPage = (page) => {
    setCurrentPage(page);
  };

  const addToCart = (course) => {
    setCart(prev => {
      const exists = prev.find(item => item.id === course.id);
      if (exists) return prev;
      return [...prev, course];
    });
  };

  const removeFromCart = (courseId) => {
    setCart(prev => prev.filter(item => item.id !== courseId));
  };

  const value = {
    user,
    isAuthModalOpen,
    authMode,
    cart,
    currentPage,
    isLoading,
    openAuthModal,
    closeAuthModal,
    login,
    logout,
    addToCart,
    removeFromCart,
    navigateToPage
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export { AppContext, AppProvider };
