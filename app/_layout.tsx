// app/_layout.tsx (Este es el código que debe ir aquí)

import { useFonts } from 'expo-font';
import { SplashScreen, Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import CustomHeader from './components/CustomHeader';
import ReusableModal from './components/ReusableModal';
import SettingsContent from './components/SettingsContent';
import UserContent from './components/UserContent';
import { theme } from './styles/theme'; // Importar el Tema

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    'Honk': require('../assets/Fonts/Honk.ttf'),
  });
  
  const [visibleModal, setVisibleModal] = useState<'settings' | 'user' | null>(null);

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />

      {/* Header personalizado con conexión a los modales */}
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
            backgroundColor: theme.colors.background, // Usar el Tema
          },
        }}
      />

      {/* Modales */}
      <ReusableModal
        title="Ajustes"
        visible={visibleModal === 'settings'}
        onClose={() => setVisibleModal(null)}
      >
        <SettingsContent />
      </ReusableModal>

      <ReusableModal
        title="Perfil de Usuario"
        visible={visibleModal === 'user'}
        onClose={() => setVisibleModal(null)}
      >
        <UserContent />
      </ReusableModal>
      
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, // ¡NECESARIO para que la app ocupe la pantalla!
    backgroundColor: theme.colors.background, // ¡NECESARIO para el color del "notch"!
  },
});