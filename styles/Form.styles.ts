// app/styles/Form.styles.ts
import { StyleSheet } from 'react-native';
import { theme } from './theme';

// Exportamos los estilos para poder importarlos en cualquier formulario
export const formStyles = StyleSheet.create({
  container: {
    gap: theme.spacing.m, // Espacio entre los elementos
  },
  input: {
    backgroundColor: theme.colors.border,
    color: theme.colors.primary,
    padding: theme.spacing.m,
    borderRadius: theme.borderRadius.medium,
    fontSize: theme.fontSizes.body,
  },
  button: {
    backgroundColor: theme.colors.accent,
    padding: theme.spacing.m,
    borderRadius: theme.borderRadius.medium,
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: theme.colors.secondary,
  },
  buttonText: {
    color: theme.colors.primary,
    fontWeight: 'bold',
    fontSize: theme.fontSizes.body,
  },
});