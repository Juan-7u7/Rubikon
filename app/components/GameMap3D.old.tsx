// app/components/GameMap3D.tsx
// Escena 3D minimalista y estética con cámara libre (desktop y móvil)

import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import * as THREE from 'three';
// @ts-ignore - GLTFLoader no tiene tipos completos en algunos entornos
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

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

  // Estados de la cámara
  const [cameraMode, setCameraMode] = useState<'follow' | 'free'>('follow');
  const freeCameraPosition = useRef(new THREE.Vector3(0, 10, 15));
  const freeCameraRotation = useRef({ theta: 0, phi: Math.PI / 4 });
  const isDragging = useRef(false);
  const lastMousePos = useRef({ x: 0, y: 0 });

  // Estados para gestos táctiles (móvil)
  const lastTouchDistance = useRef(0);
  const touchStartPos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (!containerRef.current) return;

    // ===== CONFIGURACIÓN DE ESCENA 3D =====
    const scene = new THREE.Scene();
    // Fondo más claro y alegre (azul cielo suave)
    scene.background = new THREE.Color(0x87ceeb);
    scene.fog = new THREE.Fog(0x87ceeb, 30, 80);
    sceneRef.current = scene;

    // ===== CÁMARA =====
    const camera = new THREE.PerspectiveCamera(
      60,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 6, 10);
    cameraRef.current = camera;

    // ===== RENDERER =====
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // ===== ILUMINACIÓN =====
    // Luz ambiental más brillante
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    // Luz principal (sol) más brillante
    const mainLight = new THREE.DirectionalLight(0xfff8dc, 1.2);
    mainLight.position.set(10, 15, 10);
    mainLight.castShadow = true;
    mainLight.shadow.mapSize.width = 2048;
    mainLight.shadow.mapSize.height = 2048;
    mainLight.shadow.camera.near = 0.5;
    mainLight.shadow.camera.far = 50;
    scene.add(mainLight);

    // Luz de relleno azul suave
    const fillLight = new THREE.DirectionalLight(0x87ceeb, 0.5);
    fillLight.position.set(-8, 5, -8);
    scene.add(fillLight);

    // Luz de acento rosa/morada
    const accentLight = new THREE.DirectionalLight(0xff69b4, 0.3);
    accentLight.position.set(0, 8, -10);
    scene.add(accentLight);

    // Luz hemisférica para simular luz del cielo
    const hemiLight = new THREE.HemisphereLight(0x87ceeb, 0x90ee90, 0.6);
    scene.add(hemiLight);

    // ===== SUELO Y GRID =====
    const floorGeometry = new THREE.CircleGeometry(25, 64);
    const floorMaterial = new THREE.MeshStandardMaterial({
      color: 0x90ee90, // Verde pasto claro
      roughness: 0.9,
      metalness: 0.1,
    });
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -0.01;
    floor.receiveShadow = true;
    scene.add(floor);

    // Grid más visible y alegre
    const gridHelper = new THREE.GridHelper(30, 30, 0x4a9eff, 0x87ceeb);
    (gridHelper.material as THREE.Material).opacity = 0.4;
    (gridHelper.material as THREE.Material).transparent = true;
    scene.add(gridHelper);

    // ========== CREAR PERSONAJE: FANTASMA DE CABALLERO MEDIEVAL ==========
    const character = new THREE.Group();

    // Material fantasmal con transparencia y brillo
    const ghostMaterial = new THREE.MeshStandardMaterial({
      color: 0xadd8e6, // Azul claro fantasmal
      roughness: 0.2,
      metalness: 0.3,
      transparent: true,
      opacity: 0.7,
      emissive: 0x4169e1, // Azul real brillante
      emissiveIntensity: 0.4,
    });

    // Material metálico para la armadura
    const armorMaterial = new THREE.MeshStandardMaterial({
      color: 0xc0c0c0, // Plata
      roughness: 0.3,
      metalness: 0.9,
      transparent: true,
      opacity: 0.6,
      emissive: 0x4169e1,
      emissiveIntensity: 0.2,
    });

    // CUERPO - Torso de armadura
    const torsoGeometry = new THREE.BoxGeometry(0.6, 0.8, 0.4);
    const torso = new THREE.Mesh(torsoGeometry, armorMaterial);
    torso.position.y = 1.0;
    torso.castShadow = true;
    character.add(torso);

    // Peto (placa frontal)
    const chestPlate = new THREE.BoxGeometry(0.55, 0.7, 0.05);
    const chest = new THREE.Mesh(chestPlate, armorMaterial);
    chest.position.set(0, 1.0, 0.23);
    character.add(chest);

    // CABEZA - Casco de caballero
    const helmetGeometry = new THREE.CylinderGeometry(0.25, 0.3, 0.4, 8);
    const helmet = new THREE.Mesh(helmetGeometry, armorMaterial);
    helmet.position.y = 1.7;
    helmet.castShadow = true;
    character.add(helmet);

    // Visera del casco
    const visorGeometry = new THREE.BoxGeometry(0.5, 0.15, 0.35);
    const visor = new THREE.Mesh(visorGeometry, armorMaterial);
    visor.position.set(0, 1.65, 0.15);
    character.add(visor);

    // Cresta del casco
    const crestGeometry = new THREE.BoxGeometry(0.1, 0.3, 0.4);
    const crest = new THREE.Mesh(
      crestGeometry,
      new THREE.MeshStandardMaterial({
        color: 0xff0000, // Rojo
        emissive: 0xff0000,
        emissiveIntensity: 0.3,
        transparent: true,
        opacity: 0.7,
      })
    );
    crest.position.set(0, 1.95, 0);
    character.add(crest);

    // OJOS BRILLANTES (efecto fantasmal)
    const eyeMaterial = new THREE.MeshStandardMaterial({
      color: 0x00ffff, // Cyan brillante
      emissive: 0x00ffff,
      emissiveIntensity: 1.5,
      transparent: true,
      opacity: 0.9,
    });
    const eyeGeometry = new THREE.SphereGeometry(0.08, 16, 16);

    const leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
    leftEye.position.set(0.12, 1.7, 0.25);
    character.add(leftEye);

    const rightEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
    rightEye.position.set(-0.12, 1.7, 0.25);
    character.add(rightEye);

    // BRAZOS - Hombreras y brazos
    const shoulderGeometry = new THREE.SphereGeometry(0.2, 16, 16);

    const leftShoulder = new THREE.Mesh(shoulderGeometry, armorMaterial);
    leftShoulder.position.set(0.4, 1.3, 0);
    character.add(leftShoulder);

    const rightShoulder = new THREE.Mesh(shoulderGeometry, armorMaterial);
    rightShoulder.position.set(-0.4, 1.3, 0);
    character.add(rightShoulder);

    // Brazos fantasmales
    const armGeometry = new THREE.CapsuleGeometry(0.1, 0.5, 8, 16);

    const leftArm = new THREE.Mesh(armGeometry, ghostMaterial);
    leftArm.position.set(0.4, 0.8, 0);
    character.add(leftArm);

    const rightArm = new THREE.Mesh(armGeometry, ghostMaterial);
    rightArm.position.set(-0.4, 0.8, 0);
    character.add(rightArm);

    // PIERNAS - Parte inferior fantasmal
    const legGeometry = new THREE.CylinderGeometry(0.12, 0.08, 0.6, 8);

    const leftLeg = new THREE.Mesh(legGeometry, ghostMaterial);
    leftLeg.position.set(0.15, 0.3, 0);
    character.add(leftLeg);

    const rightLeg = new THREE.Mesh(legGeometry, ghostMaterial);
    rightLeg.position.set(-0.15, 0.3, 0);
    character.add(rightLeg);

    // CAPA FANTASMAL (efecto flotante)
    const capeGeometry = new THREE.ConeGeometry(0.5, 1.2, 8);
    const capeMaterial = new THREE.MeshStandardMaterial({
      color: 0x191970, // Azul medianoche
      transparent: true,
      opacity: 0.5,
      emissive: 0x4169e1,
      emissiveIntensity: 0.2,
      side: THREE.DoubleSide,
    });
    const cape = new THREE.Mesh(capeGeometry, capeMaterial);
    cape.position.set(0, 1.2, -0.3);
    cape.rotation.x = Math.PI;
    character.add(cape);

    // AURA FANTASMAL (partículas de luz)
    const auraGeometry = new THREE.SphereGeometry(0.8, 16, 16);
    const auraMaterial = new THREE.MeshBasicMaterial({
      color: 0x4169e1,
      transparent: true,
      opacity: 0.1,
      side: THREE.BackSide,
    });
    const aura = new THREE.Mesh(auraGeometry, auraMaterial);
    aura.position.y = 1.0;
    character.add(aura);

    // Sombra debajo del personaje
    const shadowGeometry = new THREE.CircleGeometry(0.5, 32);
    const shadowMaterial = new THREE.MeshBasicMaterial({
      color: 0x000000,
      opacity: 0.3,
      transparent: true,
      depthWrite: false,
    });
    const shadow = new THREE.Mesh(shadowGeometry, shadowMaterial);
    shadow.rotation.x = -Math.PI / 2;
    shadow.position.y = 0.02;
    character.add(shadow);

    scene.add(character);
    characterRef.current = character;

    // Interfaz para el resultado de GLTFLoader
    interface GLTFResult {
      scene: THREE.Group;
      scenes: THREE.Group[];
      cameras: THREE.Camera[];
      animations: THREE.AnimationClip[];
      asset: any;
    }

    // Cargar modelo del mapa con manejo de errores
    const loader = new GLTFLoader();
    let modelLoadAttempts = 0;
    const maxRetries = 3;

    const loadModel = () => {
      loader.load(
        'https://ckbuwzhdxmlaarajwtbo.supabase.co/storage/v1/object/public/models/rubik.glb',
        // Éxito
        (gltf: GLTFResult) => {
          try {
            gltf.scene.scale.set(2, 2, 2);
            gltf.scene.traverse((child: THREE.Object3D) => {
              if ((child as THREE.Mesh).isMesh) {
                child.castShadow = true;
                child.receiveShadow = true;
              }
            });
            scene.add(gltf.scene);
            console.log('✅ Modelo 3D cargado exitosamente');
          } catch (error) {
            console.error('❌ Error procesando modelo 3D:', error);
          }
        },
        // Progreso
        (progress: ProgressEvent) => {
          if (progress.total > 0) {
            const percentComplete = (progress.loaded / progress.total) * 100;
            console.log(`⏳ Cargando modelo: ${percentComplete.toFixed(1)}%`);
          }
        },
        // Error
        (error: unknown) => {
          console.error('❌ Error cargando modelo 3D:', error);
          modelLoadAttempts++;

          if (modelLoadAttempts < maxRetries) {
            console.log(`🔄 Reintentando... (${modelLoadAttempts}/${maxRetries})`);
            setTimeout(loadModel, 2000); // Reintentar después de 2 segundos
          } else {
            console.error('❌ No se pudo cargar el modelo después de varios intentos');
          }
        }
      );
    };

    loadModel();

    // ========== CONTROLES DE MOUSE (Desktop) ==========
    const handleMouseDown = (e: MouseEvent) => {
      if (cameraMode !== 'free') return;
      if (e.button === 2 || e.button === 0) {
        isDragging.current = true;
        lastMousePos.current = { x: e.clientX, y: e.clientY };
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging.current || cameraMode !== 'free') return;

      const deltaX = e.clientX - lastMousePos.current.x;
      const deltaY = e.clientY - lastMousePos.current.y;

      freeCameraRotation.current.theta -= deltaX * 0.005;
      freeCameraRotation.current.phi -= deltaY * 0.005;

      freeCameraRotation.current.phi = Math.max(
        0.1,
        Math.min(Math.PI - 0.1, freeCameraRotation.current.phi)
      );

      lastMousePos.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseUp = () => {
      isDragging.current = false;
    };

    const handleWheel = (e: WheelEvent) => {
      if (cameraMode !== 'free') return;
      e.preventDefault();
      const radius = freeCameraPosition.current.length();
      const newRadius = Math.max(5, Math.min(30, radius + e.deltaY * 0.01));
      freeCameraPosition.current.setLength(newRadius);
    };

    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
    };

    // ========== CONTROLES TÁCTILES (Móvil/Tablet) ==========
    const getTouchDistance = (touches: TouchList) => {
      if (touches.length < 2) return 0;
      const dx = touches[0].clientX - touches[1].clientX;
      const dy = touches[0].clientY - touches[1].clientY;
      return Math.sqrt(dx * dx + dy * dy);
    };

    const handleTouchStart = (e: TouchEvent) => {
      if (cameraMode !== 'free') return;

      if (e.touches.length === 1) {
        // Un dedo: rotar
        isDragging.current = true;
        touchStartPos.current = {
          x: e.touches[0].clientX,
          y: e.touches[0].clientY,
        };
      } else if (e.touches.length === 2) {
        // Dos dedos: zoom (pinch)
        isDragging.current = false;
        lastTouchDistance.current = getTouchDistance(e.touches);
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (cameraMode !== 'free') return;
      e.preventDefault();

      if (e.touches.length === 1 && isDragging.current) {
        // Rotar con un dedo
        const deltaX = e.touches[0].clientX - touchStartPos.current.x;
        const deltaY = e.touches[0].clientY - touchStartPos.current.y;

        freeCameraRotation.current.theta -= deltaX * 0.005;
        freeCameraRotation.current.phi -= deltaY * 0.005;

        freeCameraRotation.current.phi = Math.max(
          0.1,
          Math.min(Math.PI - 0.1, freeCameraRotation.current.phi)
        );

        touchStartPos.current = {
          x: e.touches[0].clientX,
          y: e.touches[0].clientY,
        };
      } else if (e.touches.length === 2) {
        // Zoom con dos dedos (pinch)
        const currentDistance = getTouchDistance(e.touches);
        const delta = currentDistance - lastTouchDistance.current;

        const radius = freeCameraPosition.current.length();
        const newRadius = Math.max(5, Math.min(30, radius - delta * 0.05));
        freeCameraPosition.current.setLength(newRadius);

        lastTouchDistance.current = currentDistance;
      }
    };

    const handleTouchEnd = () => {
      isDragging.current = false;
      lastTouchDistance.current = 0;
    };

    // Agregar event listeners
    renderer.domElement.addEventListener('mousedown', handleMouseDown);
    renderer.domElement.addEventListener('mousemove', handleMouseMove);
    renderer.domElement.addEventListener('mouseup', handleMouseUp);
    renderer.domElement.addEventListener('wheel', handleWheel, { passive: false });
    renderer.domElement.addEventListener('contextmenu', handleContextMenu);

    renderer.domElement.addEventListener('touchstart', handleTouchStart, { passive: false });
    renderer.domElement.addEventListener('touchmove', handleTouchMove, { passive: false });
    renderer.domElement.addEventListener('touchend', handleTouchEnd);

    // Animación
    const animate = () => {
      requestAnimationFrame(animate);

      if (characterRef.current) {
        currentPositionRef.current.lerp(targetPositionRef.current, 0.08);
        characterRef.current.position.copy(currentPositionRef.current);

        const direction = new THREE.Vector3().subVectors(
          targetPositionRef.current,
          currentPositionRef.current
        );
        if (direction.length() > 0.01) {
          const targetAngle = Math.atan2(direction.x, direction.z);
          const currentAngle = characterRef.current.rotation.y;
          let angleDiff = targetAngle - currentAngle;

          while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
          while (angleDiff < -Math.PI) angleDiff += Math.PI * 2;

          characterRef.current.rotation.y += angleDiff * 0.1;
        }

        // Actualizar cámara según el modo
        if (cameraMode === 'follow') {
          // Cámara fija: vista estándar desde atrás
          const offset = new THREE.Vector3(0, 6, 10);
          const cameraTarget = currentPositionRef.current.clone().add(offset);
          camera.position.lerp(cameraTarget, 0.05);

          const lookAtTarget = currentPositionRef.current.clone();
          lookAtTarget.y += 1;
          camera.lookAt(lookAtTarget);
        } else {
          // Cámara libre: orbita alrededor del personaje
          const theta = freeCameraRotation.current.theta;
          const phi = freeCameraRotation.current.phi;
          const radius = freeCameraPosition.current.length();

          // Calcular posición de la cámara relativa al personaje
          const offsetX = radius * Math.sin(phi) * Math.cos(theta);
          const offsetY = radius * Math.cos(phi);
          const offsetZ = radius * Math.sin(phi) * Math.sin(theta);

          // Posicionar cámara alrededor del personaje
          const targetCameraPos = currentPositionRef.current.clone();
          targetCameraPos.x += offsetX;
          targetCameraPos.y += offsetY;
          targetCameraPos.z += offsetZ;

          camera.position.lerp(targetCameraPos, 0.1);

          // Siempre mirar al personaje
          const lookAtTarget = currentPositionRef.current.clone();
          lookAtTarget.y += 1;
          camera.lookAt(lookAtTarget);
        }
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
      renderer.domElement.removeEventListener('mousedown', handleMouseDown);
      renderer.domElement.removeEventListener('mousemove', handleMouseMove);
      renderer.domElement.removeEventListener('mouseup', handleMouseUp);
      renderer.domElement.removeEventListener('wheel', handleWheel);
      renderer.domElement.removeEventListener('contextmenu', handleContextMenu);
      renderer.domElement.removeEventListener('touchstart', handleTouchStart);
      renderer.domElement.removeEventListener('touchmove', handleTouchMove);
      renderer.domElement.removeEventListener('touchend', handleTouchEnd);
      if (containerRef.current && renderer.domElement) {
        containerRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [cameraMode]);

  // Actualizar posición con el joystick o teclado
  useEffect(() => {
    const moveSpeed = 0.12;
    const interval = setInterval(() => {
      if (joystickX !== 0 || joystickY !== 0) {
        const newX = targetPositionRef.current.x + joystickX * moveSpeed;
        const newZ = targetPositionRef.current.z - joystickY * moveSpeed;

        const maxDistance = 96;
        const clampedX = Math.max(-maxDistance, Math.min(maxDistance, newX));
        const clampedZ = Math.max(-maxDistance, Math.min(maxDistance, newZ));

        targetPositionRef.current.set(clampedX, 0, clampedZ);
      }
    }, 16);

    return () => clearInterval(interval);
  }, [joystickX, joystickY]);

  const toggleCameraMode = () => {
    setCameraMode((prev) => (prev === 'follow' ? 'free' : 'follow'));
  };

  return (
    <View style={styles.container}>
      <div
        // @ts-ignore
        ref={containerRef}
        style={{
          width: '100%',
          height: '100%',
          position: 'absolute',
          top: 0,
          left: 0,
        }}
      />

      {/* Botón para alternar modo de cámara */}
      <TouchableOpacity style={styles.cameraButton} onPress={toggleCameraMode}>
        <Text style={styles.cameraButtonText}>
          {cameraMode === 'follow' ? '📹 Cámara Fija' : '🎥 Cámara Libre'}
        </Text>
      </TouchableOpacity>

      {/* Instrucciones de cámara libre */}
      {cameraMode === 'free' && (
        <View style={styles.cameraHint}>
          <Text style={styles.hintText}>� Arrastra para rotar • ✌️ Pinch para zoom</Text>
        </View>
      )}
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
  cameraButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    zIndex: 100,
  },
  cameraButtonText: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 14,
    fontWeight: '600',
  },
  cameraHint: {
    position: 'absolute',
    top: 70,
    right: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    zIndex: 100,
  },
  hintText: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 12,
  },
});
