// app/components/GameMap3D.tsx
// Escena 3D del juego para WEB usando Three.js directamente

import React, { useEffect, useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

interface GameMap3DProps {
  joystickX: number;
  joystickY: number;
}

export default function GameMap3D({ joystickX, joystickY }: GameMap3DProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const characterRef = useRef<THREE.Group | null>(null);
  const targetPositionRef = useRef(new THREE.Vector3(0, 0, 0));
  const currentPositionRef = useRef(new THREE.Vector3(0, 0, 0));

  useEffect(() => {
    if (!containerRef.current) return;

    // Crear escena
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);
    sceneRef.current = scene;

    // Crear cámara
    const camera = new THREE.PerspectiveCamera(
      60,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 5, 8);
    cameraRef.current = camera;

    // Crear renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.shadowMap.enabled = true;
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Iluminación
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(10, 10, 5);
    directionalLight.castShadow = true;
    scene.add(directionalLight);

    // Suelo
    const floorGeometry = new THREE.PlaneGeometry(50, 50);
    const floorMaterial = new THREE.MeshStandardMaterial({ color: 0x2a2a2a });
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -0.1;
    floor.receiveShadow = true;
    scene.add(floor);

    // Grid
    const gridHelper = new THREE.GridHelper(50, 50, 0x444444, 0x222222);
    scene.add(gridHelper);

    // Crear personaje
    const character = new THREE.Group();
    
    // Cuerpo
    const bodyGeometry = new THREE.CylinderGeometry(0.3, 0.3, 1, 16);
    const bodyMaterial = new THREE.MeshStandardMaterial({ color: 0x4a9eff });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.position.y = 0.5;
    body.castShadow = true;
    character.add(body);

    // Cabeza
    const headGeometry = new THREE.SphereGeometry(0.35, 16, 16);
    const head = new THREE.Mesh(headGeometry, bodyMaterial);
    head.position.y = 1.2;
    head.castShadow = true;
    character.add(head);

    // Base
    const baseGeometry = new THREE.SphereGeometry(0.3, 16, 16);
    const base = new THREE.Mesh(baseGeometry, bodyMaterial);
    base.position.y = 0.3;
    base.castShadow = true;
    character.add(base);

    // Ojos
    const eyeGeometry = new THREE.SphereGeometry(0.08, 8, 8);
    const eyeMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff });
    const leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
    leftEye.position.set(0.15, 1.3, 0.25);
    character.add(leftEye);

    const rightEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
    rightEye.position.set(-0.15, 1.3, 0.25);
    character.add(rightEye);

    // Pupilas
    const pupilGeometry = new THREE.SphereGeometry(0.04, 8, 8);
    const pupilMaterial = new THREE.MeshStandardMaterial({ color: 0x000000 });
    const leftPupil = new THREE.Mesh(pupilGeometry, pupilMaterial);
    leftPupil.position.set(0.15, 1.3, 0.32);
    character.add(leftPupil);

    const rightPupil = new THREE.Mesh(pupilGeometry, pupilMaterial);
    rightPupil.position.set(-0.15, 1.3, 0.32);
    character.add(rightPupil);

    scene.add(character);
    characterRef.current = character;

    // Cargar modelo del mapa
    const loader = new GLTFLoader();
    loader.load(
      'https://ckbuwzhdxmlaarajwtbo.supabase.co/storage/v1/object/public/models/rubik.glb',
      (gltf) => {
        gltf.scene.scale.set(2, 2, 2);
        scene.add(gltf.scene);
      },
      undefined,
      (error) => {
        console.error('Error loading model:', error);
      }
    );

    // Animación
    const animate = () => {
      requestAnimationFrame(animate);

      // Actualizar posición del personaje
      if (characterRef.current) {
        currentPositionRef.current.lerp(targetPositionRef.current, 0.1);
        characterRef.current.position.copy(currentPositionRef.current);

        // Rotar hacia la dirección del movimiento
        const direction = new THREE.Vector3().subVectors(
          targetPositionRef.current,
          currentPositionRef.current
        );
        if (direction.length() > 0.01) {
          const angle = Math.atan2(direction.x, direction.z);
          characterRef.current.rotation.y = angle;
        }

        // Cámara sigue al personaje
        const offset = new THREE.Vector3(0, 5, 8);
        const cameraPosition = currentPositionRef.current.clone().add(offset);
        camera.position.lerp(cameraPosition, 0.1);
        camera.lookAt(currentPositionRef.current);
      }

      renderer.render(scene, camera);
    };

    animate();

    // Manejar resize
    const handleResize = () => {
      if (!containerRef.current) return;
      camera.aspect = containerRef.current.clientWidth / containerRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      if (containerRef.current && renderer.domElement) {
        containerRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  // Actualizar posición objetivo basándose en el joystick
  useEffect(() => {
    const moveSpeed = 0.1;
    const interval = setInterval(() => {
      if (joystickX !== 0 || joystickY !== 0) {
        const newX = targetPositionRef.current.x + joystickX * moveSpeed;
        const newZ = targetPositionRef.current.z - joystickY * moveSpeed;

        const maxDistance = 10;
        const clampedX = Math.max(-maxDistance, Math.min(maxDistance, newX));
        const clampedZ = Math.max(-maxDistance, Math.min(maxDistance, newZ));

        targetPositionRef.current.set(clampedX, 0, clampedZ);
      }
    }, 16);

    return () => clearInterval(interval);
  }, [joystickX, joystickY]);

  return (
    <View style={styles.container}>
      <div ref={containerRef as any} style={{ width: '100%', height: '100%' }} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
});
