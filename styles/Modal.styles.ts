// app/styles/Modal.styles.ts
import { Dimensions, StyleSheet } from 'react-native';
import { theme } from './theme'; // <--- 1. Importamos el tema

const { width, height } = Dimensions.get('window');

export const styles = StyleSheet.create({
  // Fondo oscuro semitransparente
  modalBackdrop: {
    flex: 1,
    backgroundColor: theme.colors.backdrop, // <--- 2. Usamos el tema
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Contenedor del modal
  modalContainer: {
    width: '90%',
    maxHeight: '80%',
    backgroundColor: theme.colors.background, // <--- 2. Usamos el tema
    borderRadius: theme.borderRadius.medium, // <--- 2. Usamos el tema
    padding: theme.spacing.xl, // <--- 2. Usamos el tema
    ...theme.shadows.medium, // <--- 3. ¡Forma limpia de aplicar la sombra!
  },

  // Header del modal
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border, // <--- 2. Usamos el tema
    paddingBottom: theme.spacing.m, // <--- 2. Estandarizado de 10 a 12
    marginBottom: theme.spacing.l, // <--- 2. Estandarizado de 15 a 16
  },

  // Título del modal
  modalTitle: {
    fontFamily: theme.fonts.main, // <--- 2. Usamos el tema
    fontSize: theme.fontSizes.title, // <--- 2. Usamos el tema
    color: theme.colors.primary, // <--- 2. Usamos el tema
  },

  // Contenido
  modalContent: {
    flexShrink: 1,
  },
});
