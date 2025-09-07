const LoadingSpinner = ({ message = "Cargando..." }) => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-300 border-t-[#004aad] mx-auto mb-4"></div>
        <p className="text-gray-600 text-lg">{message}</p>
        <div className="mt-2">
          <div className="flex items-center justify-center space-x-1">
            <div className="w-2 h-2 bg-[#004aad] rounded-full animate-pulse"></div>
            <div className="w-2 h-2 bg-[#0066cc] rounded-full animate-pulse delay-75"></div>
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse delay-150"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingSpinner;
