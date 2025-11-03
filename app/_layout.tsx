// app/_layout.tsx
import { useFonts } from 'expo-font';
import { SplashScreen, Stack } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native'; // <-- Añadido StatusBar
import { SafeAreaView } from 'react-native-safe-area-context';
// Componentes
import CustomHeader from './components/CustomHeader'; // <-- Ruta Corregida
import LoginContent from './components/LoginContent'; // <-- Ruta Corregida
import RegisterContent from './components/RegisterContent'; // <-- Ruta Corregida
import ReusableModal from './components/ReusableModal'; // <-- Ruta Corregida
import SettingsContent from './components/SettingsContent'; // <-- Ruta Corregida
import UserContent from './components/UserContent'; // <-- Ruta Corregida
// Contextos y Estilos
import { AlertProvider, useAlert } from '../context/AlertContext';
import { ModalProvider, useModal } from '../context/ModalContext';
import { theme } from '../styles/theme';
// Supabase
import { Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

SplashScreen.preventAutoHideAsync();

// Interfaz de Profile (Con avatar_id)
interface Profile {
  username: string;
  avatar_id: number;
}

function RootLayoutContent() {
  const [fontsLoaded, fontError] = useFonts({
    'Honk': require('../assets/Fonts/Honk.ttf'),
  });

  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);

  const { visibleModal, closeModal } = useModal();
  const { showAlert } = useAlert();

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
    
    // fetchProfile (Con avatar_id)
    const fetchProfile = async (session: Session) => {
       const { data, error } = await supabase
        .from('profiles')
        .select('username, avatar_id') // <-- Pide el avatar
        .eq('id', session.user.id)
        .single();
      if (error) {
        console.warn('Error buscando el perfil:', error.message);
      } else if (data) {
        setProfile(data);
      }
    };
    
    // Lógica de sesión (sin cambios)
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) {
        fetchProfile(session);
      }
    });
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
        fetchProfile(session);
      } else {
        setProfile(null);
      }
    });

    return () => subscription.unsubscribe();
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  const handleLogout = () => {
    supabase.auth.signOut();
    closeModal();
    showAlert('¡Hasta luego!', 'Has cerrado sesión.');
  };

  const handleProfileUpdate = (newUsername: string, newAvatarId: number) => {
    setProfile((prevProfile) => {
      if (prevProfile) {
        return { ...prevProfile, username: newUsername, avatar_id: newAvatarId };
      }
      return null;
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* <StatusBar style="light" /> */}

      <CustomHeader
        title="RUBIKON"
        leftIcon="settings"
        rightIcon="user"
      />

      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: {
            backgroundColor: theme.colors.background, // <-- Restaurado
          },
        }}
      />
      
      <ReusableModal
        title="Ajustes"
        visible={visibleModal === 'settings'}
        onClose={closeModal}
      >
        <SettingsContent />
      </ReusableModal>

      {/* UserContent (Con avatar_id) */}
      <ReusableModal
        title={session ? 'Perfil de Jugador' : 'Bienvenido'}
        visible={visibleModal === 'user'}
        onClose={closeModal}
      >
        <UserContent
          isLoggedIn={!!session}
          username={profile?.username}
          email={session?.user?.email}
          avatar_id={profile?.avatar_id} // <-- Pasando el prop
          onLogoutPress={handleLogout}
          onProfileUpdate={handleProfileUpdate} // <-- Pasar el callback
        />
      </ReusableModal>

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

// Proveedores (Sin cambios)
export default function RootLayout() {
  return (
    <AlertProvider>
      <ModalProvider>
        <RootLayoutContent />
      </ModalProvider>
    </AlertProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
});