// app/components/Character3D.tsx
// Versión WEB del personaje 3D

import { useFrame } from '@react-three/fiber';
import React, { useRef } from 'react';
import * as THREE from 'three';

interface Character3DProps {
  position: [number, number, number];
  targetPosition: [number, number, number];
}

export default function Character3D({ position, targetPosition }: Character3DProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const currentPosition = useRef(new THREE.Vector3(...position));

  useFrame(() => {
    if (meshRef.current) {
      const target = new THREE.Vector3(...targetPosition);
      currentPosition.current.lerp(target, 0.1);
      
      meshRef.current.position.copy(currentPosition.current);

      const direction = new THREE.Vector3().subVectors(target, currentPosition.current);
      if (direction.length() > 0.01) {
        const angle = Math.atan2(direction.x, direction.z);
        meshRef.current.rotation.y = angle;
      }
    }
  });

  return (
    <group>
      <mesh ref={meshRef} position={position} castShadow>
        <group>
          {/* Cuerpo principal */}
          <mesh position={[0, 0.5, 0]}>
            <cylinderGeometry args={[0.3, 0.3, 1, 16]} />
            <meshStandardMaterial color="#4a9eff" />
          </mesh>
          
          {/* Cabeza */}
          <mesh position={[0, 1.2, 0]}>
            <sphereGeometry args={[0.35, 16, 16]} />
            <meshStandardMaterial color="#4a9eff" />
          </mesh>
          
          {/* Esfera inferior */}
          <mesh position={[0, 0.3, 0]}>
            <sphereGeometry args={[0.3, 16, 16]} />
            <meshStandardMaterial color="#4a9eff" />
          </mesh>

          {/* Ojos */}
          <mesh position={[0.15, 1.3, 0.25]}>
            <sphereGeometry args={[0.08, 8, 8]} />
            <meshStandardMaterial color="#ffffff" />
          </mesh>
          <mesh position={[-0.15, 1.3, 0.25]}>
            <sphereGeometry args={[0.08, 8, 8]} />
            <meshStandardMaterial color="#ffffff" />
          </mesh>

          {/* Pupilas */}
          <mesh position={[0.15, 1.3, 0.32]}>
            <sphereGeometry args={[0.04, 8, 8]} />
            <meshStandardMaterial color="#000000" />
          </mesh>
          <mesh position={[-0.15, 1.3, 0.32]}>
            <sphereGeometry args={[0.04, 8, 8]} />
            <meshStandardMaterial color="#000000" />
          </mesh>
        </group>
      </mesh>

      {/* Sombra */}
      <mesh position={[position[0], 0.01, position[2]]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <circleGeometry args={[0.4, 16]} />
        <meshBasicMaterial color="#000000" opacity={0.3} transparent />
      </mesh>
    </group>
  );
}
