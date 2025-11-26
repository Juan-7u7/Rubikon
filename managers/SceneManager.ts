// managers/SceneManager.ts
// Gestor centralizado de la escena 3D

import * as THREE from 'three';
import { COLORS, FOG, MATERIALS, SIZES } from '../config/constants';

/**
 * Configuración de la escena
 */
export interface SceneConfig {
  background?: number;
  fog?: {
    color: number;
    near: number;
    far: number;
  };
  enableShadows?: boolean;
}

/**
 * Manager para gestionar la escena 3D principal
 */
export class SceneManager {
  private scene: THREE.Scene;
  private renderer: THREE.WebGLRenderer | null = null;

  constructor(config?: SceneConfig) {
    this.scene = new THREE.Scene();
    this.initializeScene(config);
  }

  /**
   * Inicializa la configuración de la escena
   */
  private initializeScene(config?: SceneConfig): void {
    // Configurar fondo
    const bgColor = config?.background || COLORS.SKY;
    this.scene.background = new THREE.Color(bgColor);

    // Configurar niebla
    if (config?.fog !== undefined) {
      this.scene.fog = new THREE.Fog(
        config.fog.color,
        config.fog.near,
        config.fog.far
      );
    } else {
      this.scene.fog = new THREE.Fog(FOG.COLOR, FOG.NEAR, FOG.FAR);
    }
  }

  /**
   * Obtiene la escena
   */
  getScene(): THREE.Scene {
    return this.scene;
  }

  /**
   * Configura el renderer
   */
  setupRenderer(container: HTMLElement, options?: {
    antialias?: boolean;
    alpha?: boolean;
    pixelRatio?: number;
  }): THREE.WebGLRenderer {
    const renderer = new THREE.WebGLRenderer({
      antialias: options?.antialias !== false,
      alpha: options?.alpha || true,
    });

    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(
      Math.min(options?.pixelRatio || window.devicePixelRatio, 2)
    );
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.appendChild(renderer.domElement);
    this.renderer = renderer;

    return renderer;
  }

  /**
   * Crea el suelo circular
   */
  createFloor(): THREE.Mesh {
    const floorGeometry = new THREE.CircleGeometry(SIZES.FLOOR_RADIUS, 64);
    const floorMaterial = new THREE.MeshStandardMaterial({
      color: COLORS.GRASS,
      roughness: MATERIALS.FLOOR_ROUGHNESS,
      metalness: MATERIALS.FLOOR_METALNESS,
    });

    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -0.01;
    floor.receiveShadow = true;

    this.scene.add(floor);
    return floor;
  }

  /**
   * Crea el grid helper
   */
  createGrid(): THREE.GridHelper {
    const gridHelper = new THREE.GridHelper(
      SIZES.GRID_SIZE,
      SIZES.GRID_DIVISIONS,
      COLORS.GRID_PRIMARY,
      COLORS.GRID_SECONDARY
    );

    (gridHelper.material as THREE.Material).opacity = MATERIALS.GRID_OPACITY;
    (gridHelper.material as THREE.Material).transparent = true;

    this.scene.add(gridHelper);
    return gridHelper;
  }

  /**
   * Agrega un objeto a la escena
   */
  add(object: THREE.Object3D): void {
    this.scene.add(object);
  }

  /**
   * Elimina un objeto de la escena
   */
  remove(object: THREE.Object3D): void {
    this.scene.remove(object);
  }

  /**
   * Actualiza el color de fondo
   */
  setBackground(color: number): void {
    this.scene.background = new THREE.Color(color);
  }

  /**
   * Actualiza la niebla
   */
  setFog(color: number, near: number, far: number): void {
    this.scene.fog = new THREE.Fog(color, near, far);
  }

  /**
   * Limpia la escena
   */
  clear(): void {
    while (this.scene.children.length > 0) {
      this.scene.remove(this.scene.children[0]);
    }
  }

  /**
   * Renderiza la escena
   */
  render(camera: THREE.Camera): void {
    if (this.renderer) {
      this.renderer.render(this.scene, camera);
    }
  }

  /**
   * Maneja el resize del renderer
   */
  handleResize(width: number, height: number): void {
    if (this.renderer) {
      this.renderer.setSize(width, height);
    }
  }

  /**
   * Limpia recursos
   */
  dispose(): void {
    this.clear();
    if (this.renderer) {
      this.renderer.dispose();
      this.renderer = null;
    }
  }
}

export default SceneManager;
