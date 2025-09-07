import { useApp } from '../hooks/useApp';
import logo from '../assets/img/logo.webp';

const Header = () => {
  const { user, cart, openAuthModal, logout } = useApp();

  return (
    <header className="bg-gradient-to-r from-white via-blue-50 to-[#004aad]/10 backdrop-blur-sm border-b-2 border-[#004aad]/20 sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo y título */}
          <div className="flex items-center space-x-3">
            <img 
              src={logo} 
              alt="MiniLabs Robotics" 
              className="h-8 w-auto"
            />
            <h1 className="text-xl font-bold bg-gradient-to-r from-[#004aad] to-[#0066cc] bg-clip-text text-transparent">
              MiniLabs Robotics
            </h1>
          </div>

          {/* Navegación central */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#" className="text-gray-700 hover:text-[#004aad] font-medium transition-all duration-300 relative group">
              Cursos Educativos
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-[#004aad] to-[#0066cc] group-hover:w-full transition-all duration-300"></span>
            </a>
            <a href="#edades" className="text-gray-700 hover:text-[#004aad] font-medium transition-all duration-300 relative group">
              Por Edades
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-[#004aad] to-[#0066cc] group-hover:w-full transition-all duration-300"></span>
            </a>
          </nav>

          {/* Acciones del usuario */}
          <div className="flex items-center space-x-4">
            {/* Carrito */}
            <button className="relative p-2 text-gray-700 hover:text-[#004aad] transition-all duration-300 hover:bg-[#004aad]/10 rounded-lg">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m8.5-5v5a2 2 0 01-2 2H9a2 2 0 01-2-2v-5" />
              </svg>
              {cart.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center shadow-lg">
                  {cart.length}
                </span>
              )}
            </button>

            {/* Usuario autenticado */}
            {user ? (
              <div className="flex items-center space-x-3">
                <span className="hidden sm:block text-gray-700">
                  Hola, {user.name}
                </span>
                <button
                  onClick={logout}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  Cerrar Sesión
                </button>
              </div>
            ) : (
              /* Usuario no autenticado */
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => openAuthModal('login')}
                  className="text-gray-700 hover:text-[#004aad] font-medium transition-all duration-300 hover:bg-[#004aad]/10 px-3 py-2 rounded-lg"
                >
                  Iniciar Sesión
                </button>
                <button
                  onClick={() => openAuthModal('register')}
                  className="bg-gradient-to-r from-[#004aad] to-[#0066cc] hover:from-[#0066cc] hover:to-[#004aad] text-white px-6 py-2 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  Crear Cuenta
                </button>
              </div>
            )}
          </div>

          {/* Menú móvil */}
          <div className="md:hidden">
            <button className="text-gray-700 hover:text-blue-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
