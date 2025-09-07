
import { AppProvider } from './contexts/AppContext';
import { useApp } from './hooks/useApp';
import HomePage from './pages/HomePage';
import AdminDashboard from './pages/AdminDashboard';
import LoadingSpinner from './components/LoadingSpinner';

function AppContent() {
  const { currentPage, isLoading } = useApp();

  // Mostrar loading mientras se verifica la autenticación
  if (isLoading) {
    return <LoadingSpinner message="Verificando autenticación..." />;
  }

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'admin':
        return <AdminDashboard />;
      case 'home':
      default:
        return <HomePage />;
    }
  };

  return renderCurrentPage();
}

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
