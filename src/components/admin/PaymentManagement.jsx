const PaymentManagement = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900">Administración de Pagos</h2>
        <p className="text-gray-600 mt-2">Monitorea y gestiona todas las transacciones</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <div className="text-center">
          <svg className="w-24 h-24 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Gestión de Pagos</h3>
          <p className="text-gray-600 mb-4">Esta sección permitirá:</p>
          <ul className="text-left text-gray-600 space-y-2 max-w-md mx-auto">
            <li>• Ver estado de todos los pagos</li>
            <li>• Verificar transacciones por ID</li>
            <li>• Monitorear montos y fechas</li>
            <li>• Gestionar reembolsos</li>
            <li>• Reportes de ingresos</li>
          </ul>
          <div className="mt-6">
            <span className="inline-flex items-center px-4 py-2 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
              💳 Próximamente
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentManagement;
