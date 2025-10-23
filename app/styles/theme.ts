// app/styles/theme.ts
export const theme = {
  // 🎨 COLORES
  colors: {
    background: '#1A1A1D',
    primary: '#FFFFFF',
    border: '#333333',         // <-- NUEVO
    backdrop: 'rgba(0, 0, 0, 0.6)', // <-- NUEVO
    black: '#000000',           // <-- NUEVO
  },

  // 🖋️ FUENTES
  fonts: {
    main: 'Honk',
  },

  // 📏 TAMAÑOS DE FUENTE
  fontSizes: {
    header: 40,
    title: 22,               // <-- NUEVO
  },

  // 🖼️ TAMAÑOS DE ICONOS
  iconSizes: {
    medium: 24,
    large: 28,
  },

  // 📐 ESPACIADO (Sistema de espaciado actualizado)
  spacing: {
    s: 8,      // Pequeño (antes 'small')
    m: 12,     // Medio (para tu padding de 10 y 12)
    l: 16,     // Grande (antes 'medium')
    xl: 20,    // Extra Grande (para tu padding de 20)
  },

  // 🏠 LAYOUT
  layout: {
    headerHeight: 110,
  },

  // ✨ BORDES Y SOMBRAS
  borderRadius: {
    medium: 12, // <-- NUEVO
  },
  shadows: {
    // <-- NUEVO
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