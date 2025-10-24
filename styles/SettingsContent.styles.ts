// styles/SettingsContent.styles.ts
import { StyleSheet } from 'react-native';
import { theme } from './theme';

export const styles = StyleSheet.create({
  container: {
    paddingBottom: theme.spacing.s,
  },
  sectionTitle: {
    fontFamily: theme.fonts.main,
    fontSize: theme.fontSizes.body,
    color: theme.colors.secondary,
    textTransform: 'uppercase',
    marginTop: theme.spacing.xl,
    marginBottom: theme.spacing.s,
    marginLeft: theme.spacing.s,
  },
  section: {
    backgroundColor: theme.colors.border, // Un fondo ligeramente diferente
    borderRadius: theme.borderRadius.medium,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing.m,
    paddingHorizontal: theme.spacing.l,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.2)', // Divisor sutil
  },
  rowTitle: {
    color: theme.colors.primary,
    fontSize: theme.fontSizes.body,
  },
  icon: {
    marginRight: theme.spacing.m,
  },
  rightContent: {
    marginLeft: 'auto', // Empuja el contenido a la derecha
  },
  rowValue: {
    color: theme.colors.secondary,
    fontSize: theme.fontSizes.body,
    marginRight: theme.spacing.s,
  },
});