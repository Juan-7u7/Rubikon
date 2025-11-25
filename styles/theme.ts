// app/styles/theme.ts
export const theme = {
  colors: {
    background: '#1A1A1D',
    primary: '#FFFFFF',
    border: '#333333',
    backdrop: 'rgba(0, 0, 0, 0.8)',
    black: '#000000',
    white: '#FFFFFF',
    secondary: '#AAAAAA',
    danger: '#FF6B6B',
    accent: '#ff3dae',
    modalBackground: '#2C2C2E',
    inputBackground: '#3B3B3D',
  },

  fonts: {
    main: 'Honk',
  },

  fontSizes: {
    header: 40,
    title: 22,
    body: 16,
    bodySmall: 14,
  },

  iconSizes: {
    medium: 24,
    large: 28,
  },

  spacing: {
    s: 8,
    m: 12,
    l: 16,
    xl: 20,
  },

  layout: {
    headerHeight: 110,
  },

  borderRadius: {
    small: 8,
    medium: 12,
  },
  shadows: {
    medium: {
      shadowColor: '#000000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
    },
  },
};
