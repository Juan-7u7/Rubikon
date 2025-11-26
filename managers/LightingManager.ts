// managers/LightingManager.ts
// Gestor centralizado de iluminación para la escena 3D

import * as THREE from 'three';
import { COLORS, LIGHTING } from '../config/constants';

/**
 * Configuración de una luz
 */
export interface LightConfig {
  type: 'ambient' | 'directional' | 'hemisphere' | 'point' | 'spot';
  color: number;
  intensity: number;
  position?: [number, number, number];
  castShadow?: boolean;
  skyColor?: number; // Para HemisphereLight
  groundColor?: number; // Para HemisphereLight
}

/**
 * Manager para gestionar todas las luces de la escena
 */
export class LightingManager {
  private scene: THREE.Scene;
  private lights: Map<string, THREE.Light> = new Map();

  constructor(scene: THREE.Scene) {
    this.scene = scene;
  }

  /**
   * Inicializa la iluminación predeterminada del juego
   */
  initializeDefaultLighting(): void {
    // Luz ambiental
    this.addLight('ambient', {
      type: 'ambient',
      color: 0xffffff,
      intensity: LIGHTING.AMBIENT_INTENSITY,
    });

    // Luz principal (sol)
    this.addLight('main', {
      type: 'directional',
      color: COLORS.MAIN_LIGHT,
      intensity: LIGHTING.MAIN_INTENSITY,
      position: LIGHTING.MAIN_POSITION as [number, number, number],
      castShadow: true,
    });

    // Luz de relleno
    this.addLight('fill', {
      type: 'directional',
      color: COLORS.FILL_LIGHT,
      intensity: LIGHTING.FILL_INTENSITY,
      position: LIGHTING.FILL_POSITION as [number, number, number],
    });

    // Luz de acento
    this.addLight('accent', {
      type: 'directional',
      color: COLORS.ACCENT_LIGHT,
      intensity: LIGHTING.ACCENT_INTENSITY,
      position: LIGHTING.ACCENT_POSITION as [number, number, number],
    });

    // Luz hemisférica
    this.addLight('hemisphere', {
      type: 'hemisphere',
      color: COLORS.SKY,
      intensity: LIGHTING.HEMISPHERE_INTENSITY,
      skyColor: COLORS.SKY,
      groundColor: COLORS.GRASS,
    });
  }

  /**
   * Agrega una luz a la escena
   */
  addLight(name: string, config: LightConfig): THREE.Light {
    let light: THREE.Light;

    switch (config.type) {
      case 'ambient':
        light = new THREE.AmbientLight(config.color, config.intensity);
        break;

      case 'directional':
        light = new THREE.DirectionalLight(config.color, config.intensity);
        if (config.position) {
          light.position.set(...config.position);
        }
        if (config.castShadow) {
          light.castShadow = true;
          const dirLight = light as THREE.DirectionalLight;
          dirLight.shadow.mapSize.width = 2048;
          dirLight.shadow.mapSize.height = 2048;
          dirLight.shadow.camera.near = 0.5;
          dirLight.shadow.camera.far = 50;
        }
        break;

      case 'hemisphere':
        light = new THREE.HemisphereLight(
          config.skyColor || config.color,
          config.groundColor || config.color,
          config.intensity
        );
        break;

      case 'point':
        light = new THREE.PointLight(config.color, config.intensity);
        if (config.position) {
          light.position.set(...config.position);
        }
        break;

      case 'spot':
        light = new THREE.SpotLight(config.color, config.intensity);
        if (config.position) {
          light.position.set(...config.position);
        }
        if (config.castShadow) {
          light.castShadow = true;
        }
        break;

      default:
        throw new Error(`Unknown light type: ${config.type}`);
    }

    this.lights.set(name, light);
    this.scene.add(light);
    return light;
  }

  /**
   * Obtiene una luz por nombre
   */
  getLight(name: string): THREE.Light | undefined {
    return this.lights.get(name);
  }

  /**
   * Actualiza la intensidad de una luz
   */
  setLightIntensity(name: string, intensity: number): void {
    const light = this.lights.get(name);
    if (light) {
      light.intensity = intensity;
    }
  }

  /**
   * Actualiza el color de una luz
   */
  setLightColor(name: string, color: number): void {
    const light = this.lights.get(name);
    if (light) {
      light.color.setHex(color);
    }
  }

  /**
   * Elimina una luz de la escena
   */
  removeLight(name: string): void {
    const light = this.lights.get(name);
    if (light) {
      this.scene.remove(light);
      this.lights.delete(name);
    }
  }

  /**
   * Elimina todas las luces
   */
  removeAllLights(): void {
    this.lights.forEach((light) => {
      this.scene.remove(light);
    });
    this.lights.clear();
  }

  /**
   * Obtiene todas las luces
   */
  getAllLights(): Map<string, THREE.Light> {
    return this.lights;
  }
}

export default LightingManager;
