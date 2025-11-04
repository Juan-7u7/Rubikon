import { Dimensions, StyleSheet } from 'react-native';
import { theme } from './theme';

const { width, height } = Dimensions.get('window');
const isSmallDevice = width < 380;

export const styles = StyleSheet.create({
  modalBackdrop: {
    flex: 1,
    backgroundColor: theme.colors.backdrop,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: width * 0.9, // Ajustado para Android
    minHeight: height * 0.6, // Aumentado para mejor distribución
    maxHeight: height * 0.85,
    backgroundColor: theme.colors.modalBackground,
    borderRadius: theme.borderRadius.medium,
    padding: isSmallDevice ? theme.spacing.m : theme.spacing.l,
    alignItems: 'center',
    ...theme.shadows.medium,
    borderColor: 'transparent', // Quitamos el borde para un look más moderno
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'space-between', // Distribuir el espacio uniformemente
    width: '100%',
    alignItems: 'center',
    paddingTop: theme.spacing.xl * 1.5, // Más espacio arriba
    paddingBottom: theme.spacing.xl, 
  },
  title: {
    fontSize: isSmallDevice ? theme.fontSizes.title : theme.fontSizes.title * 1.1,
    fontFamily: theme.fonts.main,
    color: theme.colors.primary,
    fontWeight: '600',
    marginBottom: theme.spacing.l,
    letterSpacing: 0.5,
    textAlign: 'center', // Centrar el título
  },
  avatar: {
    width: isSmallDevice ? 80 : 100,
    height: isSmallDevice ? 80 : 100,
    borderRadius: isSmallDevice ? 40 : 50,
    borderWidth: 3,
    borderColor: theme.colors.accent,
    marginVertical: theme.spacing.l, // Margen vertical en lugar de solo abajo
    ...theme.shadows.medium,
  },
  avatarScrollView: {
    width: '100%',
    marginVertical: theme.spacing.m,
    paddingHorizontal: theme.spacing.m,
    flexGrow: 0, // Evitar que el scroll tome demasiado espacio
  },
  avatarOption: {
    marginHorizontal: theme.spacing.s,
    alignItems: 'center',
  },
  avatarPreview: {
    width: isSmallDevice ? 48 : 64,
    height: isSmallDevice ? 48 : 64,
    borderRadius: isSmallDevice ? 24 : 32,
  },
  selectedAvatar: {
    borderColor: theme.colors.accent,
    borderWidth: 3,
    transform: [{ scale: 1.1 }],
  },
  usernameInput: {
    width: '90%', // Reducido para mejor apariencia
    backgroundColor: theme.colors.inputBackground,
    borderRadius: theme.borderRadius.medium,
    padding: theme.spacing.l,
    fontSize: isSmallDevice ? theme.fontSizes.body : theme.fontSizes.body * 1.1,
    fontFamily: theme.fonts.main,
    color: theme.colors.primary,
    textAlign: 'center',
    marginVertical: theme.spacing.l,
    borderWidth: 0,
    ...theme.shadows.medium,
  },
  saveButton: {
    backgroundColor: theme.colors.accent,
    paddingVertical: theme.spacing.m,
    paddingHorizontal: theme.spacing.xl * 2,
    borderRadius: theme.borderRadius.medium,
    marginTop: theme.spacing.xl,
    ...theme.shadows.medium,
  },
  saveButtonText: {
    color: theme.colors.black,
    fontFamily: theme.fonts.main,
    fontSize: isSmallDevice ? theme.fontSizes.body : theme.fontSizes.body * 1.2,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  closeButton: {
    position: 'absolute',
    top: -5,
    right: -5,
    padding: theme.spacing.s,
  },
  sectionLabel: {
    fontSize: isSmallDevice ? theme.fontSizes.bodySmall : theme.fontSizes.body,
    fontFamily: theme.fonts.main,
    color: theme.colors.secondary,
    alignSelf: 'flex-start',
    marginLeft: '5%',
    marginBottom: theme.spacing.s,
    fontWeight: '500',
  },
});
