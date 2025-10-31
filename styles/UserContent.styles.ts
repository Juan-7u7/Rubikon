// styles/UserContent.styles.ts
import { StyleSheet } from 'react-native';
import { theme } from './theme';

export const styles = StyleSheet.create({
  container: {
    paddingBottom: theme.spacing.s,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  avatarContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: theme.colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userInfo: {
    marginLeft: theme.spacing.l,
  },
  userName: {
    fontFamily: theme.fonts.main,
    fontSize: theme.fontSizes.title,
    color: theme.colors.primary,
    marginBottom: theme.spacing.s / 2,
    textTransform: 'capitalize',
  },
  userEmail: {
    fontSize: theme.fontSizes.bodySmall,
    color: theme.colors.secondary,
  },
  
  // --- Estilos de Usuario Logueado ---
  actionsContainer: {
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing.l,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  actionIcon: {
    marginRight: theme.spacing.m,
  },
  actionText: {
    fontSize: theme.fontSizes.body,
    color: theme.colors.primary,
  },
  dangerText: {
    color: theme.colors.danger,
  },

  // --- NUEVOS Estilos de Invitado ---
  guestActionsContainer: {
    gap: theme.spacing.m,
  },
  guestButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.m,
    borderRadius: theme.borderRadius.medium,
  },
  guestButtonText: {
    fontSize: theme.fontSizes.body,
    fontWeight: 'bold',
  },
  primaryButton: {
    backgroundColor: theme.colors.accent,
  },
  primaryButtonText: {
    color: theme.colors.primary,
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: theme.colors.primary,
  },
  secondaryButtonText: {
    color: theme.colors.primary,
  },
  // ... (tus otros estilos)
  
  // 👇 AÑADE ESTE BLOQUE DE CÓDIGO 👇
  avatarImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: theme.colors.border,
  },
  // 👆 AÑADE ESTE BLOQUE DE CÓDIGO 👆

});