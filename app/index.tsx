// app/index.tsx

"use client"; // Directiva para asegurar que este componente se renderice en el cliente

import { Suspense } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { theme } from '../styles/theme';

// Importación del componente que visualiza el modelo 3D
import ModelViewer from './components/ModelViewer';
// app/index.tsx

"use client"; // Directiva para asegurar que este componente se renderice en el cliente


// Importación del componente que visualiza el modelo 3D

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bienvenido a RUBIKON</Text>

      {/* Contenedor del modelo 3D */}
      <View style={styles.modelContainer}>
        <View style={styles.modelWrapper}>
          {/* Suspense muestra un fallback mientras carga el componente pesado (ModelViewer) */}
          <Suspense fallback={
            <View style={styles.loadingContainer}>
              <Text style={styles.subtitle}>Cargando modelo 3D...</Text>
            </View>
          }>
            <ModelViewer />
          </Suspense>
        </View>
      </View>

      <Text style={styles.subtitle}>
        Toca y arrastra el modelo para rotarlo.
      </Text>
    </View>
  );
}

// Estilos para la pantalla principal
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: theme.spacing.l,
    paddingTop: theme.spacing.xl,
  },
  modelContainer: {
    width: '100%',
    flex: 1,
    marginVertical: theme.spacing.l,
    // Sombra para efecto de "borde difuminado" (Glow)
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 5,
  },
  modelWrapper: {
    flex: 1,
    borderRadius: 20, // Esquinas redondeadas más pronunciadas
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)', // Borde sutil
    backgroundColor: 'rgba(0,0,0,0.2)', // Fondo semitransparente
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontFamily: theme.fonts.main,
    fontSize: theme.fontSizes.header,
    color: theme.colors.primary,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: theme.colors.secondary,
    textAlign: 'center',
  },
});