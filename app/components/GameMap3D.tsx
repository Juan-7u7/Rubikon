// app/components/GameMap3D.tsx
// Escena 3D minimalista y estética

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

    // Crear escena con gradiente de fondo
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0a0a);
    scene.fog = new THREE.Fog(0x0a0a0a, 10, 50); // Niebla para profundidad
    sceneRef.current = scene;

    // Cámara
    const camera = new THREE.PerspectiveCamera(
      60,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 6, 10);
    cameraRef.current = camera;

    // Renderer con antialiasing
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true,
      alpha: true,
    });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Optimización
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap; // Sombras suaves
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Iluminación mejorada y minimalista
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);

    const mainLight = new THREE.DirectionalLight(0xffffff, 0.8);
    mainLight.position.set(5, 10, 7);
    mainLight.castShadow = true;
    mainLight.shadow.mapSize.width = 2048;
    mainLight.shadow.mapSize.height = 2048;
    mainLight.shadow.camera.near = 0.5;
    mainLight.shadow.camera.far = 50;
    scene.add(mainLight);

    // Luz de relleno suave
    const fillLight = new THREE.DirectionalLight(0x4a9eff, 0.3);
    fillLight.position.set(-5, 3, -5);
    scene.add(fillLight);

    // Suelo minimalista con gradiente
    const floorGeometry = new THREE.CircleGeometry(25, 64);
    const floorMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x1a1a1a,
      roughness: 0.8,
      metalness: 0.2,
    });
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -0.01;
    floor.receiveShadow = true;
    scene.add(floor);

    // Grid minimalista y sutil
    const gridHelper = new THREE.GridHelper(30, 30, 0x2a2a2a, 0x1a1a1a);
    gridHelper.material.opacity = 0.3;
    gridHelper.material.transparent = true;
    scene.add(gridHelper);

    // Crear personaje minimalista
    const character = new THREE.Group();
    
    // Material del personaje con efecto suave
    const characterMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x4a9eff,
      roughness: 0.3,
      metalness: 0.1,
      emissive: 0x4a9eff,
      emissiveIntensity: 0.1,
    });

    // Cuerpo principal - cápsula suave
    const bodyGeometry = new THREE.CapsuleGeometry(0.25, 0.8, 16, 32);
    const body = new THREE.Mesh(bodyGeometry, characterMaterial);
    body.position.y = 0.9;
    body.castShadow = true;
    character.add(body);

    // Cabeza - esfera suave
    const headGeometry = new THREE.SphereGeometry(0.3, 32, 32);
    const head = new THREE.Mesh(headGeometry, characterMaterial);
    head.position.y = 1.5;
    head.castShadow = true;
    character.add(head);

    // Ojos minimalistas
    const eyeMaterial = new THREE.MeshStandardMaterial({ 
      color: 0xffffff,
      emissive: 0xffffff,
      emissiveIntensity: 0.5,
    });
    const eyeGeometry = new THREE.SphereGeometry(0.06, 16, 16);
    
    const leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
    leftEye.position.set(0.12, 1.55, 0.22);
    character.add(leftEye);

    const rightEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
    rightEye.position.set(-0.12, 1.55, 0.22);
    character.add(rightEye);

    // Sombra suave debajo del personaje
    const shadowGeometry = new THREE.CircleGeometry(0.35, 32);
    const shadowMaterial = new THREE.MeshBasicMaterial({ 
      color: 0x000000, 
      opacity: 0.2, 
      transparent: true,
      depthWrite: false,
    });
    const shadow = new THREE.Mesh(shadowGeometry, shadowMaterial);
    shadow.rotation.x = -Math.PI / 2;
    shadow.position.y = 0.02;
    character.add(shadow);

    scene.add(character);
    characterRef.current = character;

    // Cargar modelo del mapa
    const loader = new GLTFLoader();
    loader.load(
      'https://ckbuwzhdxmlaarajwtbo.supabase.co/storage/v1/object/public/models/rubik.glb',
      (gltf) => {
        gltf.scene.scale.set(2, 2, 2);
        gltf.scene.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
          }
        });
        scene.add(gltf.scene);
      },
      undefined,
      (error) => {
        console.error('Error loading model:', error);
      }
    );

    // Animación suave
    const animate = () => {
      requestAnimationFrame(animate);

      if (characterRef.current) {
        // Movimiento suave del personaje
        currentPositionRef.current.lerp(targetPositionRef.current, 0.08);
        characterRef.current.position.copy(currentPositionRef.current);

        // Rotación suave hacia la dirección
        const direction = new THREE.Vector3().subVectors(
          targetPositionRef.current,
          currentPositionRef.current
        );
        if (direction.length() > 0.01) {
          const targetAngle = Math.atan2(direction.x, direction.z);
          const currentAngle = characterRef.current.rotation.y;
          let angleDiff = targetAngle - currentAngle;
          
          // Normalizar el ángulo
          while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
          while (angleDiff < -Math.PI) angleDiff += Math.PI * 2;
          
          characterRef.current.rotation.y += angleDiff * 0.1;
        }

        // Cámara sigue suavemente
        const offset = new THREE.Vector3(0, 6, 10);
        const cameraTarget = currentPositionRef.current.clone().add(offset);
        camera.position.lerp(cameraTarget, 0.05);
        
        const lookAtTarget = currentPositionRef.current.clone();
        lookAtTarget.y += 1;
        camera.lookAt(lookAtTarget);
      }

      renderer.render(scene, camera);
    };

    animate();

    // Manejar resize
    const handleResize = () => {
      if (!containerRef.current) return;
      const width = containerRef.current.clientWidth;
      const height = containerRef.current.clientHeight;
      
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
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

  // Actualizar posición con el joystick
  useEffect(() => {
    const moveSpeed = 0.12;
    const interval = setInterval(() => {
      if (joystickX !== 0 || joystickY !== 0) {
        const newX = targetPositionRef.current.x + joystickX * moveSpeed;
        const newZ = targetPositionRef.current.z - joystickY * moveSpeed;

        const maxDistance = 12;
        const clampedX = Math.max(-maxDistance, Math.min(maxDistance, newX));
        const clampedZ = Math.max(-maxDistance, Math.min(maxDistance, newZ));

        targetPositionRef.current.set(clampedX, 0, clampedZ);
      }
    }, 16);

    return () => clearInterval(interval);
  }, [joystickX, joystickY]);

  return (
    <View style={styles.container}>
      <div 
        ref={containerRef as any} 
        style={{ 
          width: '100%', 
          height: '100%',
          position: 'absolute',
          top: 0,
          left: 0,
        }} 
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: '#0a0a0a',
    overflow: 'hidden',
  },
});
