import { useContext } from 'react';
import { AppContext } from '../contexts/AppContext';

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp debe ser usado dentro de AppProvider');
  }
  return context;
};
