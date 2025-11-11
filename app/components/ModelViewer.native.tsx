// app/components/ModelViewer.native.tsx
// Este archivo SÓLO se usará en Android y iOS

import React from 'react';
import { StyleSheet, View } from 'react-native';
import { WebView } from 'react-native-webview';
import { theme } from '../../styles/theme';

// 1. La URL de tu modelo en Supabase
const modelUrl = "https://ckbuwzhdxmlaarajwtbo.supabase.co/storage/v1/object/public/models/rubik.glb";

// 2. --- ¡AQUÍ ESTÁ LA MODIFICACIÓN! ---
// Añadimos los parámetros para ocultar la interfaz del visor
const params = '&ui=none&grid=false&bg=transparent';

const viewerUrl = `https://gltf-viewer.donmccurdy.com/#model=${encodeURIComponent(modelUrl)}${params}`;
// --- FIN DE LA MODIFICACIÓN ---

export default function ModelViewer() {
  return (
    <View style={styles.container}>
      <WebView
        source={{ uri: viewerUrl }}
        style={styles.webview}
        startInLoadingState={true}
        // El fondo del contenedor se mostrará gracias a '&bg=transparent'
        containerStyle={{ backgroundColor: theme.colors.border }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
    overflow: 'hidden',
  },
  webview: {
    flex: 1,
    backgroundColor: 'transparent',
  },
});