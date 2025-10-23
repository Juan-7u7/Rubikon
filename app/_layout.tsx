// app/_layout.tsx
import { useFonts } from 'expo-font';
import { SplashScreen, Stack } from 'expo-router';
import { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
// Imports de Componentes
import CustomHeader from '../app/components/CustomHeader';
import LoginContent from '../app/components/LoginContent';
import RegisterContent from '../app/components/RegisterContent';
import ReusableModal from '../app/components/ReusableModal';
import SettingsContent from '../app/components/SettingsContent';
import UserContent from '../app/components/UserContent';
// Imports de Contexto y Estilos
import { AlertProvider, useAlert } from '../context/AlertContext';
import { theme } from '../styles/theme';
// Imports de Supabase
import { Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

SplashScreen.preventAutoHideAsync();

// Definimos el tipo de dato para el perfil
interface Profile {
  username: string;
}

function RootLayoutContent() {
  const [fontsLoaded, fontError] = useFonts({
    'Honk': require('../assets/Fonts/Honk.ttf'),
  });

  const [session, setSession] = useState<Session | null>(null);
  // 1. NUEVO ESTADO para guardar el perfil del jugador
  const [profile, setProfile] = useState<Profile | null>(null);

  const [visibleModal, setVisibleModal] = useState<
    'settings' | 'user' | 'login' | 'register' | null
  >(null);
  
  const { showAlert } = useAlert();

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }

    // 2. Función para buscar el perfil
    const fetchProfile = async (session: Session) => {
      const { data, error } = await supabase
        .from('profiles')
        .select('username') // Solo traemos el username
        .eq('id', session.user.id) // Donde el ID coincida
        .single(); // Esperamos solo un resultado

      if (error) {
        console.warn('Error buscando el perfil:', error.message);
      } else if (data) {
        setProfile(data); // Guardamos el perfil: { username: '...' }
      }
    };

    // 3. Cargar sesión inicial Y PERFIL
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) {
        fetchProfile(session); // Si hay sesión, busca el perfil
      }
    });

    // 4. Escuchar cambios (Login/Logout) Y BUSCAR PERFIL
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
        fetchProfile(session); // Si el usuario inicia sesión, busca el perfil
      } else {
        setProfile(null); // Si cierra sesión, limpia el perfil
      }
    });

    return () => subscription.unsubscribe();
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  const handleLogout = () => {
    supabase.auth.signOut();
    setVisibleModal(null);
    showAlert('¡Hasta luego!', 'Has cerrado sesión.');
  };

  const openLoginModal = () => setVisibleModal('login');
  const openRegisterModal = () => setVisibleModal('register');
  const closeModal = () => setVisibleModal(null);

  return (
    <SafeAreaView style={styles.container}>
      {/* ... (Tu StatusBar y CustomHeader) ... */}
      <CustomHeader
        title="RUBIKON"
        leftIcon="settings"
        rightIcon="user"
        onPressLeft={() => setVisibleModal('settings')}
        onPressRight={() => setVisibleModal('user')}
      />

      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: {
            backgroundColor: theme.colors.background,
          },
        }}
      />

      {/* ... (Modal de Ajustes) ... */}
       <ReusableModal
        title="Ajustes"
        visible={visibleModal === 'settings'}
        onClose={closeModal}
      >
        <SettingsContent />
      </ReusableModal>

      {/* 5. MODAL DE USUARIO (ACTUALIZADO) */}
      <ReusableModal
        title={session ? 'Perfil de Jugador' : 'Bienvenido'}
        visible={visibleModal === 'user'}
        onClose={closeModal}
      >
        <UserContent
          isLoggedIn={!!session}
          // Pasa los nuevos datos al componente
          username={profile?.username}
          email={session?.user?.email}
          
          onLoginPress={openLoginModal}
          onRegisterPress={openRegisterModal}
          onLogoutPress={handleLogout}
        />
      </ReusableModal>

      {/* ... (Modal de Login y Registro) ... */}
      <ReusableModal
        title="Iniciar Sesión"
        visible={visibleModal === 'login'}
        onClose={closeModal}
      >
        <LoginContent onLoginSuccess={closeModal} />
      </ReusableModal>
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

// El componente exportado envuelve todo en el Provider
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