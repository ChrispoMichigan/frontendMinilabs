import { createContext, useContext, useState } from 'react';

const ModalContext = createContext();

export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModal debe usarse dentro de ModalProvider');
  }
  return context;
};

export const ModalProvider = ({ children }) => {
  const [modals, setModals] = useState([]);

  const openModal = (modalId, component) => {
    setModals(prev => [...prev, { id: modalId, component }]);
  };

  const closeModal = (modalId) => {
    setModals(prev => prev.filter(modal => modal.id !== modalId));
  };

  const closeAllModals = () => {
    setModals([]);
  };

  return (
    <ModalContext.Provider value={{ modals, openModal, closeModal, closeAllModals }}>
      {children}
      
      {/* Renderizar modales */}
      {modals.map((modal, index) => (
        <div key={modal.id} style={{ zIndex: 9999 + index }}>
          {modal.component}
        </div>
      ))}
    </ModalContext.Provider>
  );
};

export default ModalContext;
