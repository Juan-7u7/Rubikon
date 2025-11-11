// app/components/ModelViewer.tsx
import { OrbitControls, useGLTF } from '@react-three/drei/native';
import { Canvas } from '@react-three/fiber/native';
// 1. Importa 'useEffect'
import React, { Suspense, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';

const modelPath = "https://ckbuwzhdxmlaarajwtbo.supabase.co/storage/v1/object/public/models/rubik.glb";

function Model() {
  const { scene } = useGLTF(modelPath); 
  return <primitive object={scene} />;
}

export default function ModelViewer() {
  
  // 2. Mueve el 'preload' aquí, dentro de un useEffect
  //    para que solo se ejecute una vez en el cliente (navegador)
  useEffect(() => {
    useGLTF.preload(modelPath);
  }, []);

  return (
    <View style={styles.container}>
      <Canvas>
        <Suspense fallback={null}>
          <ambientLight intensity={Math.PI / 2} />
          <directionalLight position={[10, 10, 5]} intensity={2} />
          <Model />
          <OrbitControls />
        </Suspense>
      </Canvas>
    </View>
  );
}

// 3. ELIMINA 'useGLTF.preload(modelPath);' DE AQUÍ

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    backgroundColor: 'transparent',
  },
});