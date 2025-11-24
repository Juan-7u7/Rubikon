// app/components/GameMap3D.native.tsx
// Versión NATIVA (móvil) de la escena 3D del juego

import { useGLTF } from '@react-three/drei/native';
import { Canvas, useFrame } from '@react-three/fiber/native';
import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import * as THREE from 'three';
import Character3D from './Character3D';

// URL del modelo del mapa en Supabase
const mapModelUrl = "https://ckbuwzhdxmlaarajwtbo.supabase.co/storage/v1/object/public/models/rubik.glb";

interface GameMap3DProps {
  joystickX: number;
  joystickY: number;
}

// Componente del modelo del mapa
function MapModel() {
  const { scene } = useGLTF(mapModelUrl);
  
  return (
    <primitive 
      object={scene} 
      position={[0, 0, 0]} 
      scale={2}
    />
  );
}

// Componente de la cámara que sigue al personaje
function FollowCamera({ targetPosition }: { targetPosition: [number, number, number] }) {
  useFrame(({ camera }) => {
    const offset = new THREE.Vector3(0, 5, 8);
    const targetPos = new THREE.Vector3(...targetPosition);
    const cameraPosition = targetPos.clone().add(offset);

    camera.position.lerp(cameraPosition, 0.1);
    camera.lookAt(targetPos);
  });

  return null;
}

export default function GameMap3D({ joystickX, joystickY }: GameMap3DProps) {
  const [characterPosition, setCharacterPosition] = useState<[number, number, number]>([0, 0, 0]);
  const targetPosition = useRef<[number, number, number]>([0, 0, 0]);

  const moveSpeed = 0.1;

  useEffect(() => {
    const interval = setInterval(() => {
      if (joystickX !== 0 || joystickY !== 0) {
        const newX = targetPosition.current[0] + joystickX * moveSpeed;
        const newZ = targetPosition.current[2] - joystickY * moveSpeed;
        
        const maxDistance = 10;
        const clampedX = Math.max(-maxDistance, Math.min(maxDistance, newX));
        const clampedZ = Math.max(-maxDistance, Math.min(maxDistance, newZ));
        
        targetPosition.current = [clampedX, 0, clampedZ];
        setCharacterPosition([clampedX, 0, clampedZ]);
      }
    }, 16);

    return () => clearInterval(interval);
  }, [joystickX, joystickY]);

  useEffect(() => {
    useGLTF.preload(mapModelUrl);
  }, []);

  return (
    <View style={styles.container}>
      <Canvas
        shadows
        camera={{ position: [0, 5, 8], fov: 60 }}
      >
        <ambientLight intensity={0.5} />
        <directionalLight
          position={[10, 10, 5]}
          intensity={1}
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />

        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 0]} receiveShadow>
          <planeGeometry args={[50, 50]} />
          <meshStandardMaterial color="#2a2a2a" />
        </mesh>

        <gridHelper args={[50, 50, '#444444', '#222222']} position={[0, 0, 0]} />

        <MapModel />

        <Character3D 
          position={characterPosition} 
          targetPosition={targetPosition.current}
        />

        <FollowCamera targetPosition={targetPosition.current} />
      </Canvas>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
});
