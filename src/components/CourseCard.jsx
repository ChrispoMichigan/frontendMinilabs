import { Eye, Clock, Book } from 'lucide-react';
import { useApp } from '../hooks/useApp';

const CourseCard = ({ course, onViewDetails }) => {
  const { addToCart, cart, user, openAuthModal } = useApp();

  const isInCart = cart.some(item => item.id === course.id);
  
  // Calcular descuento basado en precio original vs precio actual
  const discount = course.original_price && course.original_price > course.price ? 
    Math.round(((course.original_price - course.price) / course.original_price) * 100) : 0;

  // Formatear precio
  const formatPrice = (price) => {
    return price > 0 ? `$${parseFloat(price).toFixed(2)}` : 'Gratis';
  };

  // Obtener texto de dificultad
  const getDifficultyText = (level) => {
    switch (level) {
      case 'beginner': return 'Principiante';
      case 'intermediate': return 'Intermedio';
      case 'advanced': return 'Avanzado';
      default: return level || 'No definido';
    }
  };

  const handleAddToCart = () => {
    if (!user) {
      openAuthModal('login');
      return;
    }
    addToCart(course);
  };

  const handleBuyNow = () => {
    if (!user) {
      openAuthModal('login');
      return;
    }
    // Lógica de compra directa
    console.log('Comprando curso:', course.title);
  };

  const handleViewDetails = () => {
    if (onViewDetails) {
      onViewDetails(course);
    }
  };

  return (
    <div className="bg-gradient-to-br from-white via-blue-50/30 to-[#004aad]/5 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden group border border-[#004aad]/10 hover:border-[#004aad]/30">
      {/* Imagen del curso */}
      <div className="relative overflow-hidden">
        <img 
          src={course.cover_image_url || '/api/placeholder/400/240'} 
          alt={course.title}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        
        {/* Badge de descuento */}
        {discount > 0 && (
          <div className="absolute top-3 left-3 bg-gradient-to-r from-red-500 to-pink-500 text-white px-2 py-1 rounded-full text-sm font-bold shadow-lg">
            -{discount}%
          </div>
        )}

        {/* Badge de nivel */}
        <div className="absolute top-3 right-3 bg-gradient-to-r from-[#004aad] to-[#0066cc] text-white px-2 py-1 rounded-full text-xs font-medium shadow-lg">
          {getDifficultyText(course.difficulty_level)} • {course.age_min}-{course.age_max} años
        </div>

        {/* Overlay de acción rápida */}
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <button 
            onClick={handleViewDetails}
            className="bg-yellow-400 hover:bg-yellow-500 text-blue-900 px-6 py-2 rounded-lg font-bold transform scale-95 hover:scale-100 transition-all duration-200"
          >
            Ver Detalles
          </button>
        </div>
      </div>

      {/* Contenido del curso */}
      <div className="p-6">
        {/* Tags */}
        <div className="flex flex-wrap gap-1 mb-3">
          <span className="bg-gradient-to-r from-[#004aad]/20 to-[#0066cc]/20 text-[#004aad] px-2 py-1 rounded-full text-xs font-medium border border-[#004aad]/30">
            {course.category}
          </span>
          <span className="bg-gradient-to-r from-[#004aad]/20 to-[#0066cc]/20 text-[#004aad] px-2 py-1 rounded-full text-xs font-medium border border-[#004aad]/30">
            {getDifficultyText(course.difficulty_level)}
          </span>
        </div>

        {/* Título */}
        <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-2">
          {course.title}
        </h3>

        {/* Descripción */}
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {course.description}
        </p>

        {/* Objetivo general como instructor */}
        <p className="text-sm text-gray-500 mb-3">
          <span className="font-medium text-gray-700">{course.general_objective}</span>
        </p>

        {/* Componentes del kit */}
        {course.components_included && (
          <div className="mb-3">
            <p className="text-xs text-gray-500 mb-1">Incluye:</p>
            <div className="flex flex-wrap gap-1">
              {course.components_included.split('\n').slice(0, 3).map((component, index) => (
                <span 
                  key={index}
                  className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs"
                >
                  {component.trim()}
                </span>
              ))}
              {course.components_included.split('\n').length > 3 && (
                <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">
                  +{course.components_included.split('\n').length - 3} más
                </span>
              )}
            </div>
          </div>
        )}

        {/* Información del curso */}
        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
          <span className="flex items-center">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {course.duration_hours || 0}h
          </span>
          <span className="flex items-center">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
            </svg>
            {course.activities_count || 0} actividades
          </span>
        </div>

        {/* Rating simulado - los datos reales no tienen rating aún */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <div className="flex text-yellow-400">
              {[...Array(5)].map((_, i) => (
                <svg 
                  key={i} 
                  className={`w-4 h-4 ${i < 4 ? 'fill-current' : 'text-gray-300 fill-current'}`} 
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                </svg>
              ))}
            </div>
            <span className="ml-1 text-sm text-gray-600">
              (4.0) • Nuevo curso
            </span>
          </div>
        </div>

        {/* Precio */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="text-2xl font-bold text-gray-900">
              {formatPrice(course.price)}
            </span>
            {course.original_price && course.original_price > course.price && (
              <span className="ml-2 text-sm text-gray-500 line-through">
                {formatPrice(course.original_price)}
              </span>
            )}
          </div>
        </div>

        {/* Botones de acción */}
        <div className="flex gap-2">
          <button
            onClick={handleAddToCart}
            disabled={isInCart}
            className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all duration-300 ${
              isInCart 
                ? 'bg-gradient-to-r from-green-100 to-green-200 text-green-800 cursor-not-allowed border border-green-300' 
                : 'bg-gradient-to-r from-[#004aad] to-[#0066cc] hover:from-[#0066cc] hover:to-[#004aad] text-white shadow-lg hover:shadow-xl transform hover:scale-105'
            }`}
          >
            {isInCart ? 'En Carrito' : 'Agregar al Carrito'}
          </button>
          <button
            onClick={handleBuyNow}
            className="bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-[#004aad] py-2 px-4 rounded-lg font-medium transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            Comprar
          </button>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
