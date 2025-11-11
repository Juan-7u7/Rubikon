// app/index.tsx

"use client"; // <--- ¡ESTA ES LA SOLUCIÓN ALTERNATIVA!

import { Suspense } from 'react'; // <--- Suspense sigue siendo una buena idea
import { StyleSheet, Text, View } from 'react-native';
import { theme } from '../styles/theme';

// 2. Vuelve a usar un import normal
import ModelViewer from './components/ModelViewer';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bienvenido a RUBIKON</Text>

      <View style={styles.modelContainer}>
        {/* 3. Usamos Suspense para mostrar un 'fallback' 
            mientras el modelo 3D (que es pesado) carga. 
        */}
        <Suspense fallback={<View style={styles.loadingContainer}><Text style={styles.subtitle}>Cargando modelo 3D...</Text></View>}>
          <ModelViewer />
        </Suspense>
      </View>

      <Text style={styles.subtitle}>
        Toca y arrastra el modelo para rotarlo.
      </Text>
    </View>
  );
}

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