// app/_layout.tsx
import { useFonts } from 'expo-font';
import { SplashScreen, Stack } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
// Componentes
import CustomHeader from '../app/components/CustomHeader';
import LoginContent from '../app/components/LoginContent';
import RegisterContent from '../app/components/RegisterContent';
import ReusableModal from '../app/components/ReusableModal';
import SettingsContent from '../app/components/SettingsContent';
import UserContent from '../app/components/UserContent';
// Contextos y Estilos
import { AlertProvider, useAlert } from '../context/AlertContext';
import { ModalProvider, useModal } from '../context/ModalContext'; // <--- 1. IMPORTAR
import { theme } from '../styles/theme';
// Supabase
import { Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

SplashScreen.preventAutoHideAsync();

interface Profile {
  username: string;
}

function RootLayoutContent() {
  const [fontsLoaded, fontError] = useFonts({
    'Honk': require('../assets/Fonts/Honk.ttf'),
  });

  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);

  // 2. OBTENEMOS EL ESTADO Y FUNCIONES DEL HOOK
  const { visibleModal, closeModal } = useModal();
  const { showAlert } = useAlert();

  // 3. ELIMINAMOS el useState de 'visibleModal'

  useEffect(() => {
    // ... (la lógica de useFonts no cambia)
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
    // ... (la lógica de fetchProfile no cambia)
    const fetchProfile = async (session: Session) => {
       const { data, error } = await supabase
        .from('profiles')
        .select('username')
        .eq('id', session.user.id)
        .single();
      if (error) {
        console.warn('Error buscando el perfil:', error.message);
      } else if (data) {
        setProfile(data);
      }
    };
    // ... (la lógica de getSession no cambia)
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) {
        fetchProfile(session);
      }
    });
    // ... (la lógica de onAuthStateChange no cambia)
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
    closeModal(); // <--- 4. Usamos la función del hook
    showAlert('¡Hasta luego!', 'Has cerrado sesión.');
  };

  // 5. ELIMINAMOS openLoginModal y openRegisterModal
  // (closeModal ya lo tenemos del hook)

  return (
    <SafeAreaView style={styles.container}>
      {/* 6. CustomHeader YA NO NECESITA PROPS 'onPress' */}
      <CustomHeader
        title="RUBIKON"
        leftIcon="settings"
        rightIcon="user"
      />

      {/* ... (Stack no cambia) ... */}
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: {
            backgroundColor: theme.colors.background,
          },
        }}
      />
      
      {/* 7. Los modales usan 'visibleModal' y 'closeModal' del hook */}
      <ReusableModal
        title="Ajustes"
        visible={visibleModal === 'settings'} // <-- Del hook
        onClose={closeModal} // <-- Del hook
      >
        <SettingsContent />
      </ReusableModal>

      <ReusableModal
        title={session ? 'Perfil de Jugador' : 'Bienvenido'}
        visible={visibleModal === 'user'} // <-- Del hook
        onClose={closeModal} // <-- Del hook
      >
        {/* 8. UserContent YA NO NECESITA 'onLoginPress' ni 'onRegisterPress' */}
        <UserContent
          isLoggedIn={!!session}
          username={profile?.username}
          email={session?.user?.email}
          onLogoutPress={handleLogout} // <-- Esta sí la pasamos
        />
      </ReusableModal>

      <ReusableModal
        title="Iniciar Sesión"
        visible={visibleModal === 'login'} // <-- Del hook
        onClose={closeModal} // <-- Del hook
      >
        <LoginContent onLoginSuccess={closeModal} />
      </ReusableModal>

      <ReusableModal
        title="Crear Cuenta"
        visible={visibleModal === 'register'} // <-- Del hook
        onClose={closeModal} // <-- Del hook
      >
        <RegisterContent onRegisterSuccess={closeModal} />
      </ReusableModal>
    </SafeAreaView>
  );
}

// 9. Envolvemos la app en AMBOS proveedores
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