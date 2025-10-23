// app/components/SettingsContent.tsx
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

// Este componente solo se preocupa por el contenido de "Ajustes"
export default function SettingsContent() {
  return (
    <View>
      <Text style={styles.text}>
        Aquí irán todas las opciones de configuración de la app.
      </Text>
      <Text style={styles.textItem}>
        - Notificaciones
      </Text>
      <Text style={styles.text}>
        - Tema
      </Text>
    </View>
  );
}

// TODO: Mover estos estilos a un archivo de tema global
const styles = StyleSheet.create({
  text: {
    color: 'white', // <-- El estilo "quemado" ahora vive aquí
  },
  textItem: {
    color: 'white',
    marginTop: 10,
  }
});