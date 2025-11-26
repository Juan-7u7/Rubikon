// app/components/GameMap3D.refactored.tsx
// Versión refactorizada usando Managers

import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import * as THREE from 'three';
// @ts-ignore
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { MOVEMENT, RESOURCES } from '../../config/constants';
import { CameraMode, CameraSystem } from '../../managers/CameraSystem';
import { CharacterManager } from '../../managers/CharacterManager';
import { LightingManager } from '../../managers/LightingManager';
import { SceneManager } from '../../managers/SceneManager';
import { logger } from '../../utils/logger';

interface GameMap3DProps {
  joystickX: number;
  joystickY: number;
}

export default function GameMap3D({ joystickX, joystickY }: GameMap3DProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [cameraMode, setCameraMode] = useState<CameraMode>('follow');

  // Refs para managers
  const sceneManagerRef = useRef<SceneManager | null>(null);
  const lightingManagerRef = useRef<LightingManager | null>(null);
  const characterManagerRef = useRef<CharacterManager | null>(null);
  const cameraSystemRef = useRef<CameraSystem | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const stopTimer = logger.startTimer('GameMap3D Initialization');

    try {
      // ===== INICIALIZAR SCENE MANAGER =====
      logger.info('Initializing SceneManager');
      const sceneManager = new SceneManager();
      sceneManagerRef.current = sceneManager;

      const scene = sceneManager.getScene();

      // ===== CONFIGURAR RENDERER =====
      logger.info('Setting up Renderer');
      const renderer = sceneManager.setupRenderer(containerRef.current);
      rendererRef.current = renderer;

      // ===== INICIALIZAR LIGHTING MANAGER =====
      logger.info('Initializing LightingManager');
      const lightingManager = new LightingManager(scene);
      lightingManagerRef.current = lightingManager;
      lightingManager.initializeDefaultLighting();

      // ===== CREAR SUELO Y GRID =====
      logger.info('Creating floor and grid');
      sceneManager.createFloor();
      sceneManager.createGrid();

      // ===== INICIALIZAR CHARACTER MANAGER =====
      logger.info('Initializing CharacterManager');
      const characterManager = new CharacterManager(scene);
      characterManagerRef.current = characterManager;

      // ===== INICIALIZAR CAMERA SYSTEM =====
      logger.info('Initializing CameraSystem');
      const cameraSystem = new CameraSystem({
        container: containerRef.current,
        initialMode: cameraMode,
      });
      cameraSystemRef.current = cameraSystem;

      // ===== CARGAR MODELO DEL MAPA =====
      loadMapModel(scene);

      // ===== LOOP DE ANIMACIÓN =====
      const animate = () => {
        requestAnimationFrame(animate);

        if (characterManager && cameraSystem) {
          // Actualizar personaje
          characterManager.update();

          // Actualizar cámara
          const characterPos = characterManager.getPosition();
          cameraSystem.update(characterPos);

          // Renderizar
          sceneManager.render(cameraSystem.getCamera());
        }
      };

      animate();
      stopTimer();
      logger.gameEvent('GameMap3D initialized successfully');

      // ===== MANEJAR RESIZE =====
      const handleResize = () => {
        if (!containerRef.current) return;
        const width = containerRef.current.clientWidth;
        const height = containerRef.current.clientHeight;

        cameraSystem.handleResize(width, height);
        sceneManager.handleResize(width, height);
      };

      window.addEventListener('resize', handleResize);

      // ===== CLEANUP =====
      return () => {
        logger.info('Cleaning up GameMap3D');
        window.removeEventListener('resize', handleResize);

        cameraSystem.dispose();
        characterManager.dispose();
        lightingManager.removeAllLights();
        sceneManager.dispose();

        if (containerRef.current && renderer.domElement) {
          containerRef.current.removeChild(renderer.domElement);
        }
      };
    } catch (error) {
      logger.error('Error initializing GameMap3D', error);
    }
  }, []);

  // ===== ACTUALIZAR MOVIMIENTO DEL PERSONAJE =====
  useEffect(() => {
    if (!characterManagerRef.current) return;

    if (joystickX !== 0 || joystickY !== 0) {
      const currentPos = characterManagerRef.current.getPosition();
      const newX = currentPos.x + joystickX * MOVEMENT.SPEED;
      const newZ = currentPos.z + joystickY * MOVEMENT.SPEED;

      characterManagerRef.current.setTargetPosition(newX, 0, newZ);
    }
  }, [joystickX, joystickY]);

  // ===== CAMBIAR MODO DE CÁMARA =====
  const handleCameraToggle = () => {
    if (cameraSystemRef.current) {
      const newMode = cameraSystemRef.current.toggleMode();
      setCameraMode(newMode);
      logger.gameEvent('Camera mode changed', newMode);
    }
  };

  /**
   * Carga el modelo 3D del mapa
   */
  const loadMapModel = (scene: THREE.Scene) => {
    const loader = new GLTFLoader();
    let attempts = 0;
    const maxRetries = 3;

    const load = () => {
      const loadTimer = logger.startTimer('Map model loading');

      loader.load(
        RESOURCES.MAP_MODEL_URL,
        (gltf: any) => {
          try {
            gltf.scene.scale.set(
              RESOURCES.MAP_MODEL_SCALE,
              RESOURCES.MAP_MODEL_SCALE,
              RESOURCES.MAP_MODEL_SCALE
            );
            gltf.scene.traverse((child: THREE.Object3D) => {
              if ((child as THREE.Mesh).isMesh) {
                child.castShadow = true;
                child.receiveShadow = true;
              }
            });
            scene.add(gltf.scene);
            loadTimer();
            logger.gameEvent('Map model loaded successfully');
          } catch (error) {
            logger.error('Error processing map model', error);
          }
        },
        (progress: ProgressEvent) => {
          if (progress.total > 0) {
            const percent = (progress.loaded / progress.total) * 100;
            logger.debug(`Loading map model: ${percent.toFixed(1)}%`);
          }
        },
        (error: unknown) => {
          logger.error('Error loading map model', error);
          attempts++;

          if (attempts < maxRetries) {
            logger.info(`Retrying... (${attempts}/${maxRetries})`);
            setTimeout(load, 2000);
          } else {
            logger.error('Failed to load map model after multiple attempts');
          }
        }
      );
    };

    load();
  };

  return (
    <View style={styles.container}>
      <div
        // @ts-ignore
        ref={containerRef}
        style={{
          width: '100%',
          height: '100%',
        }}
      />

      {/* Botón para cambiar modo de cámara */}
      <TouchableOpacity style={styles.cameraButton} onPress={handleCameraToggle}>
        <Text style={styles.cameraButtonText}>
          {cameraMode === 'follow' ? '📹' : '🎥'}
        </Text>
      </TouchableOpacity>

      {/* Hint de controles */}
      <View style={styles.hintContainer}>
        <Text style={styles.hintText}>
          {cameraMode === 'follow'
            ? 'Cámara fija - Toca 📹 para modo libre'
            : 'Cámara libre - Arrastra para rotar, scroll/pinch para zoom'}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  cameraButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 30,
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    backdropFilter: 'blur(10px)',
  },
  cameraButtonText: {
    fontSize: 28,
  },
  hintContainer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 12,
    borderRadius: 10,
    backdropFilter: 'blur(10px)',
  },
  hintText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 12,
    textAlign: 'center',
  },
});
