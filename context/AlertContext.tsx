// app/context/AlertContext.tsx
import React, { createContext, useContext, useState } from 'react';
import { Text } from 'react-native';
import ReusableModal from '../app/components/ReusableModal';
import { theme } from '../styles/theme';

// 1. Definimos la forma del contexto
interface AlertContextData {
  showAlert: (title: string, message: string) => void;
}

// 2. Creamos el contexto
const AlertContext = createContext<AlertContextData | undefined>(undefined);

// 3. Creamos el "Proveedor" (el componente que envuelve la app)
export function AlertProvider({ children }: { children: React.ReactNode }) {
  // 4. El estado del modal vive AQUÍ, en el proveedor
  const [alertInfo, setAlertInfo] = useState<{
    title: string;
    message: string;
  } | null>(null);

  // 5. La función que los componentes llamarán
  const showAlert = (title: string, message: string) => {
    setAlertInfo({ title, message });
  };

  const closeAlert = () => {
    setAlertInfo(null);
  };

  return (
    <AlertContext.Provider value={{ showAlert }}>
      {/* 6. Renderizamos el resto de la app */}
      {children}

      {/* 7. ¡AQUÍ ESTÁ LA MAGIA! El Modal de Alerta vive aquí,
          globalmente, esperando a que alertInfo cambie. */}
      {alertInfo && (
        <ReusableModal
          title={alertInfo.title}
          visible={!!alertInfo}
          onClose={closeAlert}
        >
          <Text
            style={{
              color: theme.colors.primary,
              fontSize: theme.fontSizes.body,
            }}
          >
            {alertInfo.message}
          </Text>
        </ReusableModal>
      )}
    </AlertContext.Provider>
  );
}

// 8. Creamos un Hook personalizado para usarlo fácilmente
export const useAlert = () => {
  const context = useContext(AlertContext);
  if (context === undefined) {
    throw new Error('useAlert debe ser usado dentro de un AlertProvider');
  }
  return context;
};