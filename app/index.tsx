// app/index.tsx

"use client"; // Directiva para asegurar que este componente se renderice en el cliente

import { Suspense } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { theme } from '../styles/theme';

// Importación del componente que visualiza el modelo 3D
import ModelViewer from './components/ModelViewer';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bienvenido a RUBIKON</Text>

      {/* Contenedor del modelo 3D */}
      <View style={styles.modelContainer}>
        {/* Suspense muestra un fallback mientras carga el componente pesado (ModelViewer) */}
        <Suspense fallback={
          <View style={styles.loadingContainer}>
            <Text style={styles.subtitle}>Cargando modelo 3D...</Text>
          </View>
        }>
          <ModelViewer />
        </Suspense>
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
    flex: 1, // Ocupa el espacio disponible restante
    backgroundColor: theme.colors.border,
    borderRadius: theme.borderRadius.medium,
    overflow: 'hidden',
    marginVertical: theme.spacing.l,
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