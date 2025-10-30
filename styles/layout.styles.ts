import { StyleSheet } from 'react-native';
import { theme } from './theme';

export const layoutStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  contentContainer: {
    flex: 1,
  },
});