import { useState } from 'react';
import { useApp } from '../hooks/useApp';
import { adminAuthService } from '../services/api';

const AuthModal = () => {
  const { isAuthModalOpen, authMode, closeAuthModal, login, openAuthModal } = useApp();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      if (authMode === 'admin') {
        // Login de administrador usando la API real
        const credentials = {
          user: formData.email, // En admin usamos el campo email como user
          password: formData.password
        };

        const response = await adminAuthService.login(credentials);
        
        if (response.success) {
          const userData = {
            id: response.data.user.id,
            name: response.data.user.name,
            email: response.data.user.user, // El backend devuelve 'user', lo mapeamos a email
            user: response.data.user.user,
            role: response.data.user.role,
            isAdmin: response.data.user.role === 'admin' || response.data.user.role === 'staff'
          };
          
          await login(userData);
          setFormData({ email: '', password: '', name: '', confirmPassword: '' });
        }
      } else {
        // Para usuarios regulares (simulado por ahora)
        setTimeout(() => {
          const userData = {
            id: Date.now(),
            name: formData.name || formData.email.split('@')[0],
            email: formData.email,
            role: 'user',
            isAdmin: false
          };
          
          login(userData);
          setFormData({ email: '', password: '', name: '', confirmPassword: '' });
          setIsLoading(false);
        }, 1000);
        return;
      }
      
    } catch (error) {
      console.error('Error en autenticación:', error);
      setError(error.message || 'Error al iniciar sesión');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const getTitle = () => {
    switch (authMode) {
      case 'register': return 'Crear Cuenta';
      case 'admin': return 'Acceso Administrativo';
      default: return 'Iniciar Sesión';
    }
  };

  const getButtonText = () => {
    if (isLoading) return 'Procesando...';
    switch (authMode) {
      case 'register': return 'Crear Cuenta';
      case 'admin': return 'Acceder como Admin';
      default: return 'Iniciar Sesión';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md relative">
        {/* Botón cerrar */}
        <button
          onClick={closeAuthModal}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Contenido del modal */}
        <div className="p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {getTitle()}
            </h2>
            <p className="text-gray-600">
              {authMode === 'register' 
                ? 'Únete a nuestra comunidad de aprendizaje'
                : authMode === 'admin'
                ? 'Acceso restringido para administradores'
                : 'Accede a tu cuenta para continuar'
              }
            </p>
            
            {/* Mensaje de error */}
            {error && (
              <div className="mt-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded-lg text-sm">
                {error}
              </div>
            )}
          </div>

          {/* Formulario */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Nombre (solo para registro) */}
            {authMode === 'register' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre completo
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  placeholder="Tu nombre completo"
                />
              </div>
            )}

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {authMode === 'admin' ? 'Usuario' : 'Correo electrónico'}
              </label>
              <input
                type={authMode === 'admin' ? 'text' : 'email'}
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                placeholder={authMode === 'admin' ? 'admin' : 'tu@email.com'}
              />
            </div>

            {/* Contraseña */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contraseña
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                placeholder="••••••••"
              />
            </div>

            {/* Confirmar contraseña (solo para registro) */}
            {authMode === 'register' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirmar contraseña
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  placeholder="••••••••"
                />
              </div>
            )}

            {/* Términos y condiciones (solo para registro) */}
            {authMode === 'register' && (
              <div className="flex items-start">
                <input
                  type="checkbox"
                  required
                  className="mt-1 mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label className="text-sm text-gray-600">
                  Acepto los <a href="#" className="text-blue-600 hover:text-blue-800">términos y condiciones</a> y la <a href="#" className="text-blue-600 hover:text-blue-800">política de privacidad</a>
                </label>
              </div>
            )}

            {/* Botón de envío */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 px-4 rounded-lg font-medium text-white transition-all duration-200 ${
                isLoading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : authMode === 'admin'
                  ? 'bg-gray-800 hover:bg-gray-900'
                  : 'bg-blue-600 hover:bg-blue-700 transform hover:scale-[1.02]'
              }`}
            >
              {isLoading && (
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              )}
              {getButtonText()}
            </button>
          </form>

          {/* Enlaces adicionales */}
          {authMode !== 'admin' && (
            <div className="mt-6 text-center">
              {authMode === 'login' ? (
                <p className="text-sm text-gray-600">
                  ¿No tienes cuenta?{' '}
                  <button
                    onClick={() => openAuthModal('register')}
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Crear cuenta
                  </button>
                </p>
              ) : (
                <p className="text-sm text-gray-600">
                  ¿Ya tienes cuenta?{' '}
                  <button
                    onClick={() => openAuthModal('login')}
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Iniciar sesión
                  </button>
                </p>
              )}
            </div>
          )}

          {/* Demostración rápida */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-500 text-center">
              💡 <strong>Demo:</strong> Usa cualquier email y contraseña para probar la aplicación
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
