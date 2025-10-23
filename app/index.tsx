// app/index.tsx (Este es el código que debe ir aquí)

import { StyleSheet, Text, View } from 'react-native';
import { theme } from '../styles/theme'; // Importamos nuestro tema

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bienvenido a RUBIKON</Text>
      <Text style={styles.subtitle}>
        Proximamente mas funciones! :D
      </Text>
    </View>
  );
}

// Estilos específicos para esta pantalla
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // El color de fondo ya lo pone el layout,
    // pero podemos asegurarlo aquí también.
    padding: theme.spacing.l,
  },
  title: {
    fontFamily: theme.fonts.main,
    fontSize: theme.fontSizes.header, // Usa el tamaño del header del tema
    color: theme.colors.primary,
    textAlign: 'center',
    marginBottom: theme.spacing.m,
  },
  subtitle: {
    fontSize: 18, // Deberíamos añadir 'body: 18' al tema
    color: theme.colors.primary,
    textAlign: 'center',
  },
});