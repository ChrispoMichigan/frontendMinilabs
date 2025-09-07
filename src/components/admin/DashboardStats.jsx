import { useState, useEffect } from 'react';

const DashboardStats = () => {
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    totalUsers: 0,
    pendingPayments: 0,
    loading: true
  });

  // Simular carga de datos (aquí irían las llamadas a la API)
  useEffect(() => {
    const loadStats = async () => {
      // Simular delay de carga
      setTimeout(() => {
        setStats({
          totalRevenue: 45250.50,
          totalOrders: 128,
          totalUsers: 94,
          pendingPayments: 7,
          loading: false
        });
      }, 1000);
    };
    
    loadStats();
  }, []);

  const statsCards = [
    {
      title: 'Ingresos Totales',
      value: stats.loading ? 'Cargando...' : `$${stats.totalRevenue.toLocaleString()}`,
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
        </svg>
      ),
      color: 'bg-green-500',
      change: '+12.5%'
    },
    {
      title: 'Pedidos Totales',
      value: stats.loading ? 'Cargando...' : stats.totalOrders,
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
      ),
      color: 'bg-blue-500',
      change: '+8.2%'
    },
    {
      title: 'Usuarios Registrados',
      value: stats.loading ? 'Cargando...' : stats.totalUsers,
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
        </svg>
      ),
      color: 'bg-purple-500',
      change: '+15.3%'
    },
    {
      title: 'Pagos Pendientes',
      value: stats.loading ? 'Cargando...' : stats.pendingPayments,
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: 'bg-yellow-500',
      change: '-2.1%'
    }
  ];

  const recentOrders = [
    { id: 'ORD-001', customer: 'María González', amount: 299.99, status: 'Completado', date: '2025-09-07' },
    { id: 'ORD-002', customer: 'Carlos Ruiz', amount: 599.99, status: 'Pendiente', date: '2025-09-07' },
    { id: 'ORD-003', customer: 'Ana Martínez', amount: 399.99, status: 'Procesando', date: '2025-09-06' },
    { id: 'ORD-004', customer: 'Luis Pérez', amount: 799.99, status: 'Completado', date: '2025-09-06' },
    { id: 'ORD-005', customer: 'Sofia López', amount: 199.99, status: 'Completado', date: '2025-09-05' }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completado':
        return 'bg-green-100 text-green-800';
      case 'Pendiente':
        return 'bg-yellow-100 text-yellow-800';
      case 'Procesando':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-gray-900">Panel Principal</h2>
        <p className="text-gray-600 mt-2">Resumen de estadísticas y actividad reciente</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6">
        {statsCards.map((card, index) => (
          <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-600 truncate">{card.title}</p>
                <p className="text-xl sm:text-2xl font-bold text-gray-900 mt-2">{card.value}</p>
                <div className="flex items-center mt-2 flex-wrap">
                  <span className={`text-sm font-medium ${
                    card.change.startsWith('+') ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {card.change}
                  </span>
                  <span className="text-gray-500 text-xs sm:text-sm ml-2">vs mes anterior</span>
                </div>
              </div>
              <div className={`${card.color} p-2 sm:p-3 rounded-lg text-white flex-shrink-0 ml-3`}>
                {card.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Orders Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="px-4 sm:px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Pedidos Recientes</h3>
          <p className="text-gray-600 text-sm">Últimas transacciones realizadas</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID Pedido
                </th>
                <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cliente
                </th>
                <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Monto
                </th>
                <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th className="hidden sm:table-cell px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fecha
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {recentOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {order.id}
                  </td>
                  <td className="px-3 sm:px-6 py-4 text-sm text-gray-900">
                    <div className="truncate max-w-32 sm:max-w-none">
                      {order.customer}
                    </div>
                  </td>
                  <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${order.amount}
                  </td>
                  <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="hidden sm:table-cell px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(order.date).toLocaleDateString('es-ES')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-4 sm:px-6 py-4 border-t border-gray-200">
          <button className="text-[#004aad] hover:text-[#0066cc] font-medium text-sm">
            Ver todos los pedidos →
          </button>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Revenue Chart Placeholder */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Ingresos del Mes</h3>
          <div className="h-48 sm:h-64 bg-gradient-to-br from-[#004aad]/10 to-[#0066cc]/10 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <svg className="w-12 sm:w-16 h-12 sm:h-16 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <p className="text-gray-500 text-sm sm:text-base">Gráfico de ingresos</p>
              <p className="text-gray-400 text-xs sm:text-sm">Próximamente</p>
            </div>
          </div>
        </div>

        {/* Popular Courses Placeholder */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Kits Más Vendidos</h3>
          <div className="space-y-4">
            {[
              { name: 'Robot Básico 5-8 años', sales: 45, percentage: 85 },
              { name: 'Kit Solar Junior', sales: 32, percentage: 60 },
              { name: 'Electrónica Divertida', sales: 28, percentage: 53 },
              { name: 'Robótica Avanzada', sales: 19, percentage: 36 }
            ].map((kit, index) => (
              <div key={index} className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">{kit.name}</p>
                  <p className="text-sm text-gray-500">{kit.sales} vendidos</p>
                </div>
                <div className="w-24">
                  <div className="bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-[#004aad] to-[#0066cc] h-2 rounded-full"
                      style={{ width: `${kit.percentage}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardStats;
