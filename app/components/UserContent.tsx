// app/components/UserContent.tsx
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

// Este componente solo se preocupa por el contenido de "Usuario"
export default function UserContent() {
  return (
    <View>
      <Text style={styles.text}>
        Aquí irá el formulario de perfil, foto, y botón de cerrar sesión.
      </Text>
    </View>
  );
}

// TODO: Mover estos estilos a un archivo de tema global
const styles = StyleSheet.create({
  text: {
    color: 'white', // <-- El estilo "quemado" ahora vive aquí
  }
});