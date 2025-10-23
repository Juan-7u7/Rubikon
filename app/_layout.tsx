import { useFonts } from 'expo-font'; // 1. Importar useFonts
import { SplashScreen, Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';

// 2. Evita que la pantalla de carga se oculte automáticamente
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  // 3. Cargar el mapa de fuentes
  const [fontsLoaded, fontError] = useFonts({
    'Honk': require('../assets/Fonts/Honk.ttf'),
    // 'Honk-Bold': require('../assets/fonts/Honk-Bold.ttf'), // (Si tuvieras otras...)
  });

  // 4. Ocultar la pantalla de carga cuando las fuentes estén listas
  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  // 5. No mostrar nada hasta que las fuentes carguen (o si hay un error)
  if (!fontsLoaded && !fontError) {
    return null;
  }

  // 6. Ahora que las fuentes están cargadas, renderizamos la app
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: {
            backgroundColor: '#000000',
          },
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
});