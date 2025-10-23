// app/styles/theme.ts
export const theme = {
  // 🎨 COLORES
  // 🎨 COLORES
  colors: {
    background: '#1A1A1D',
    primary: '#FFFFFF',
    border: '#333333',
    backdrop: 'rgba(0, 0, 0, 0.6)',
    black: '#000000',
    secondary: '#AAAAAA',
    danger: '#FF6B6B',
    accent: '#ff3dae', // <-- AÑADE ESTE (un azul brillante)
  },

  // 🖋️ FUENTES
  fonts: {
    main: 'Honk',
  },

  // 📏 TAMAÑOS DE FUENTE
  fontSizes: {
    header: 40,
    title: 22,
    body: 16,       // <-- AÑADE ESTE (para texto normal)
    bodySmall: 14, // <-- AÑADE ESTE (para texto pequeño)
  },

  // 🖼️ TAMAÑOS DE ICONOS
  iconSizes: {
    medium: 24,
    large: 28,
  },

  // 📐 ESPACIADO
  spacing: {
    s: 8,
    m: 12,
    l: 16,
    xl: 20,
  },

  // 🏠 LAYOUT
  layout: {
    headerHeight: 110,
  },

  // ✨ BORDES Y SOMBRAS
  borderRadius: {
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