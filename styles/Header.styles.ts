// app/styles/Header.styles.ts
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  // Contenedor principal del header
  headerContainer: {
    width: '100%',
    height: 50, // Altura estándar para un header
    flexDirection: 'row', // Alinear horizontalmente
    alignItems: 'center', // Centrar verticalmente
    justifyContent: 'space-between', // Distribuir el espacio
    backgroundColor: '#1A1A1D', // Mantenemos el fondo negro
    paddingHorizontal: 16, // Espacio a los lados
  },
  
  // Columna Izquierda (1/3 del espacio)
  leftContainer: {
    flex: 1,
    alignItems: 'flex-start', // Alinear botón a la izquierda
  },

  // Columna Central (1/3 del espacio)
  titleContainer: {
    flex: 1,
    alignItems: 'center', // Alinear título al centro
  },

  // Columna Derecha (1/3 del espacio)
  rightContainer: {
    flex: 1,
    alignItems: 'flex-end', // Alinear botón a la derecha
  },

  // Estilo del título
  title: {
    fontFamily: 'Honk', // Tu fuente!
    fontSize: 40,
    color: '#FFFFFF',
  },

  // Estilo para los botones (puedes usar un View o un Pressable/TouchableOpacity)
  iconButton: {
    padding: 8, // Área táctil más grande
  },

  // Botón del juego (centrado debajo del título)
  gameButton: {
    marginTop: 4,
    padding: 4,
  },
});