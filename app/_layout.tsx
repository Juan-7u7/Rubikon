// app/_layout.tsx
import { useFonts } from 'expo-font';
import { SplashScreen, Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import CustomHeader from './components/CustomHeader';
import ReusableModal from './components/ReusableModal';
import SettingsContent from './components/SettingsContent';
import UserContent from './components/UserContent';
// 1. Imports de Supabase y componentes de Auth
import { Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import LoginContent from './components/LoginContent';
import RegisterContent from './components/RegisterContent';
// 2. Imports de React Native
import { SafeAreaView, StyleSheet } from 'react-native';
// 3. Imports del Contexto de Alertas
import { AlertProvider, useAlert } from '../context/AlertContext';
import { theme } from '../styles/theme';

SplashScreen.preventAutoHideAsync();

// 4. Mueve el layout principal a su propio componente
//    para que pueda usar el hook 'useAlert'
function RootLayoutContent() {
  const [fontsLoaded, fontError] = useFonts({
    'Honk': require('../assets/Fonts/Honk.ttf'),
  });

  const [session, setSession] = useState<Session | null>(null);
  const [visibleModal, setVisibleModal] = useState<
    'settings' | 'user' | 'login' | 'register' | null
  >(null);
  
  // 5. Usa el hook de alertas
  const { showAlert } = useAlert();

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  // --- Funciones de Auth actualizadas ---
  const handleLogout = () => {
    supabase.auth.signOut();
    setVisibleModal(null);
    // 6. Reemplaza Alert.alert() por showAlert()
    showAlert('¡Hasta luego!', 'Has cerrado sesión.');
  };

  const openLoginModal = () => setVisibleModal('login');
  const openRegisterModal = () => setVisibleModal('register');
  const closeModal = () => setVisibleModal(null);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />

      {/* Header (se conecta al modal de 'settings' y 'user') */}
      <CustomHeader
        title="RUBIKON"
        leftIcon="settings"
        rightIcon="user"
        onPressLeft={() => setVisibleModal('settings')}
        onPressRight={() => setVisibleModal('user')}
      />

      {/* El Stack maneja las pantallas (como index.tsx) */}
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: {
            backgroundColor: theme.colors.background,
          },
        }}
      />

      {/* --- MODALES CONECTADOS A SUPABASE --- */}

      {/* Modal de Ajustes */}
      <ReusableModal
        title="Ajustes"
        visible={visibleModal === 'settings'}
        onClose={closeModal}
      >
        <SettingsContent />
      </ReusableModal>

      {/* Modal de Usuario (usa el estado 'session') */}
      <ReusableModal
        title={session ? 'Perfil de Usuario' : 'Bienvenido'}
        visible={visibleModal === 'user'}
        onClose={closeModal}
      >
        <UserContent
          isLoggedIn={!!session}
          onLoginPress={openLoginModal}
          onRegisterPress={openRegisterModal}
          onLogoutPress={handleLogout}
        />
      </ReusableModal>

      {/* Modal de Login (con componente real) */}
      <ReusableModal
        title="Iniciar Sesión"
        visible={visibleModal === 'login'}
        onClose={closeModal}
      >
        <LoginContent onLoginSuccess={closeModal} />
      </ReusableModal>

      {/* Modal de Registro (con componente real) */}
      <ReusableModal
        title="Crear Cuenta"
        visible={visibleModal === 'register'}
        onClose={closeModal}
      >
        <RegisterContent onRegisterSuccess={closeModal} />
      </ReusableModal>
    </SafeAreaView>
  );
}

// 7. El componente exportado envuelve todo en el Provider
export default function RootLayout() {
  return (
    <AlertProvider>
      <RootLayoutContent />
    </AlertProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
});