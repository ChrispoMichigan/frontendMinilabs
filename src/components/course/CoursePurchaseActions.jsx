import { useApp } from '../../hooks/useApp';

const CoursePurchaseActions = ({ course, className = '' }) => {
  const { addToCart, cart, user, openAuthModal } = useApp();
  
  const isInCart = cart.some(item => item.id === course.id);

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
    // Aquí se puede implementar la lógica de compra directa
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <button
        onClick={handleBuyNow}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-lg font-bold text-lg transition-colors shadow-lg"
      >
        Comprar Ahora
      </button>
      
      <button
        onClick={handleAddToCart}
        disabled={isInCart}
        className={`w-full py-3 rounded-lg font-medium transition-colors ${
          isInCart 
            ? 'bg-green-100 text-green-800 cursor-not-allowed border border-green-300' 
            : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
        }`}
      >
        {isInCart ? 'En Carrito' : 'Agregar al Carrito'}
      </button>
    </div>
  );
};

export default CoursePurchaseActions;
