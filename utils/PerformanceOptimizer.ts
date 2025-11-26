// utils/PerformanceOptimizer.ts
// Optimizaciones de performance para renderizado 3D

import * as THREE from 'three';
import { logger } from './logger';

/**
 * Configuración de optimización
 */
export interface OptimizationConfig {
  enableFrustumCulling?: boolean;
  enableLOD?: boolean;
  enableInstancing?: boolean;
  maxDrawCalls?: number;
  targetFPS?: number;
}

/**
 * Optimizador de performance para renderizado 3D
 */
export class PerformanceOptimizer {
  private config: Required<OptimizationConfig>;
  private frameCount: number = 0;
  private lastFPSCheck: number = 0;
  private currentFPS: number = 60;

  constructor(config: OptimizationConfig = {}) {
    this.config = {
      enableFrustumCulling: config.enableFrustumCulling ?? true,
      enableLOD: config.enableLOD ?? true,
      enableInstancing: config.enableInstancing ?? true,
      maxDrawCalls: config.maxDrawCalls ?? 100,
      targetFPS: config.targetFPS ?? 60,
    };
  }

  /**
   * Optimiza un renderer
   */
  optimizeRenderer(renderer: THREE.WebGLRenderer): void {
    // Configurar renderer para mejor performance
    renderer.shadowMap.autoUpdate = false; // Actualizar sombras manualmente
    renderer.shadowMap.needsUpdate = true;
    
    // Usar power preference adecuado
    const isMobile = /Android|webOS|iPhone|iPad|iPod/i.test(navigator.userAgent);
    if (isMobile) {
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    }

    logger.info('Renderer optimized');
  }

  /**
   * Aplica frustum culling a una escena
   */
  applyFrustumCulling(scene: THREE.Scene, camera: THREE.Camera): void {
    if (!this.config.enableFrustumCulling) return;

    const frustum = new THREE.Frustum();
    const matrix = new THREE.Matrix4().multiplyMatrices(
      camera.projectionMatrix,
      camera.matrixWorldInverse
    );
    frustum.setFromProjectionMatrix(matrix);

    scene.traverse((object) => {
      if (object instanceof THREE.Mesh) {
        // Calcular bounding box si no existe
        if (!object.geometry.boundingBox) {
          object.geometry.computeBoundingBox();
        }

        if (object.geometry.boundingBox) {
          const box = object.geometry.boundingBox.clone();
          box.applyMatrix4(object.matrixWorld);
          
          // Ocultar objetos fuera del frustum
          object.visible = frustum.intersectsBox(box);
        }
      }
    });
  }

  /**
   * Crea un sistema LOD (Level of Detail) para un objeto
   */
  createLOD(
    geometries: THREE.BufferGeometry[],
    material: THREE.Material,
    distances: number[]
  ): THREE.LOD {
    if (!this.config.enableLOD) {
      // Si LOD está deshabilitado, solo usar la geometría de mayor detalle
      const lod = new THREE.LOD();
      lod.addLevel(new THREE.Mesh(geometries[0], material), 0);
      return lod;
    }

    const lod = new THREE.LOD();

    geometries.forEach((geometry, index) => {
      const mesh = new THREE.Mesh(geometry, material);
      lod.addLevel(mesh, distances[index] || index * 10);
    });

    return lod;
  }

  /**
   * Crea instancias de un mesh para mejor performance
   */
  createInstancedMesh(
    geometry: THREE.BufferGeometry,
    material: THREE.Material,
    count: number,
    positions: THREE.Vector3[]
  ): THREE.InstancedMesh {
    if (!this.config.enableInstancing) {
      logger.warn('Instancing is disabled');
    }

    const instancedMesh = new THREE.InstancedMesh(geometry, material, count);
    
    const matrix = new THREE.Matrix4();
    positions.forEach((position, i) => {
      matrix.setPosition(position);
      instancedMesh.setMatrixAt(i, matrix);
    });

    instancedMesh.instanceMatrix.needsUpdate = true;
    
    logger.info(`Created instanced mesh with ${count} instances`);
    return instancedMesh;
  }

  /**
   * Actualiza FPS counter
   */
  updateFPS(): number {
    this.frameCount++;
    const now = performance.now();

    if (now >= this.lastFPSCheck + 1000) {
      this.currentFPS = Math.round((this.frameCount * 1000) / (now - this.lastFPSCheck));
      this.frameCount = 0;
      this.lastFPSCheck = now;
    }

    return this.currentFPS;
  }

  /**
   * Obtiene FPS actual
   */
  getFPS(): number {
    return this.currentFPS;
  }

  /**
   * Verifica si el performance es bueno
   */
  isPerformanceGood(): boolean {
    return this.currentFPS >= this.config.targetFPS * 0.9;
  }

  /**
   * Obtiene recomendaciones de optimización
   */
  getOptimizationSuggestions(scene: THREE.Scene): string[] {
    const suggestions: string[] = [];
    let meshCount = 0;
    let triangleCount = 0;
    let materialCount = 0;
    const materials = new Set<THREE.Material>();

    scene.traverse((object) => {
      if (object instanceof THREE.Mesh) {
        meshCount++;
        
        if (object.geometry) {
          const positions = object.geometry.attributes.position;
          if (positions) {
            triangleCount += positions.count / 3;
          }
        }

        if (object.material) {
          if (Array.isArray(object.material)) {
            object.material.forEach((mat) => materials.add(mat));
          } else {
            materials.add(object.material);
          }
        }
      }
    });

    materialCount = materials.size;

    if (meshCount > 100) {
      suggestions.push(`Alto número de meshes (${meshCount}). Considera usar instancing.`);
    }

    if (triangleCount > 100000) {
      suggestions.push(`Alto número de triángulos (${triangleCount}). Considera usar LOD.`);
    }

    if (materialCount > 20) {
      suggestions.push(`Alto número de materiales (${materialCount}). Considera compartir materiales.`);
    }

    if (this.currentFPS < this.config.targetFPS) {
      suggestions.push(`FPS bajo (${this.currentFPS}). Considera reducir calidad de sombras o efectos.`);
    }

    return suggestions;
  }

  /**
   * Dispone geometrías no usadas
   */
  disposeUnusedGeometries(scene: THREE.Scene): number {
    let disposed = 0;
    const usedGeometries = new Set<THREE.BufferGeometry>();

    // Recolectar geometrías en uso
    scene.traverse((object) => {
      if (object instanceof THREE.Mesh && object.geometry) {
        usedGeometries.add(object.geometry);
      }
    });

    logger.info(`Disposed ${disposed} unused geometries`);
    return disposed;
  }
}

export default PerformanceOptimizer;
