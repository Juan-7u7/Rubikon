// styles/EditProfileModal.styles.ts
import { Dimensions, StyleSheet } from 'react-native';
import { theme } from './theme';

const { width } = Dimensions.get('window');

export const styles = StyleSheet.create({
  modalBackdrop: {
    flex: 1,
    backgroundColor: theme.colors.backdrop,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: width * 0.9,
    maxHeight: '90%', // <-- Añadido para limitar la altura máxima
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.medium,
    padding: theme.spacing.xl,
    alignItems: 'center',
    ...theme.shadows.medium,
  },
  avatarContainer: {
    marginBottom: theme.spacing.l,
    position: 'relative',
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: theme.colors.primary,
  },
  // --- Estilos para la selección de avatares ---
  avatarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: theme.spacing.l,
  },
  avatarOption: {
    margin: theme.spacing.s,
  },
  selectedAvatar: {
    borderWidth: 3,
    borderColor: theme.colors.secondary, // Un color que resalte la selección
  },
  editIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: theme.colors.primary,
    borderRadius: 15,
    padding: 5,
  },
  usernameInput: {
    width: '100%',
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    padding: theme.spacing.m,
    fontSize: theme.fontSizes.body,
    fontFamily: theme.fonts.main,
    color: theme.colors.text,
    textAlign: 'center',
    marginBottom: theme.spacing.xl,
  },
  saveButton: {
    backgroundColor: theme.colors.primary,
    paddingVertical: theme.spacing.m,
    paddingHorizontal: theme.spacing.xl,
    borderRadius: theme.borderRadius.small,
  },
  saveButtonText: {
    color: theme.colors.white,
    fontFamily: theme.fonts.main,
    fontSize: theme.fontSizes.body,
  },
  closeButton: {
    position: 'absolute',
    top: theme.spacing.m,
    right: theme.spacing.m,
  },
});
