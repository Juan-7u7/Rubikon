// app/components/ModelViewer.native.tsx
import { OrbitControls, useGLTF } from '@react-three/drei/native';
import { Canvas } from '@react-three/fiber/native';
import React, { Suspense, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';

const modelPath = "https://ckbuwzhdxmlaarajwtbo.supabase.co/storage/v1/object/public/models/rubik.glb";

function Model() {
  const { scene } = useGLTF(modelPath); 
  return <primitive object={scene} />;
}

export default function ModelViewer() {
  
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

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    backgroundColor: 'transparent',
  },
});