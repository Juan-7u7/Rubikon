// context/ModalContext.tsx
import React, { createContext, useContext, useState } from 'react';

// 1. Definimos los nombres de todos los modales posibles
type ModalType = 'settings' | 'user' | 'login' | 'register' | null;

// 2. Definimos qué va a proveer nuestro contexto
interface ModalContextData {
  visibleModal: ModalType;
  openModal: (modal: ModalType) => void;
  closeModal: () => void;
}

// 3. Creamos el contexto
const ModalContext = createContext<ModalContextData | undefined>(undefined);

// 4. Creamos el "Proveedor" que envolverá la app
export function ModalProvider({ children }: { children: React.ReactNode }) {
  // ¡Aquí vive el estado!
  const [visibleModal, setVisibleModal] = useState<ModalType>(null);

  const openModal = (modal: ModalType) => {
    setVisibleModal(modal);
  };

  const closeModal = () => {
    setVisibleModal(null);
  };

  return (
    <ModalContext.Provider value={{ visibleModal, openModal, closeModal }}>
      {children}
    </ModalContext.Provider>
  );
}

// 5. Creamos el Hook para usarlo fácilmente
export const useModal = () => {
  const context = useContext(ModalContext);
  if (context === undefined) {
    throw new Error('useModal debe ser usado dentro de un ModalProvider');
  }
  return context;
};
