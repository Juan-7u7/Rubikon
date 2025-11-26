// managers/CameraSystem.ts
// Sistema de cámara con modos follow y free

import * as THREE from 'three';
import { CAMERA } from '../config/constants';

export type CameraMode = 'follow' | 'free';

/**
 * Configuración del sistema de cámara
 */
export interface CameraSystemConfig {
  container: HTMLElement;
  initialMode?: CameraMode;
}

/**
 * Sistema de cámara para el juego
 */
export class CameraSystem {
  private camera: THREE.PerspectiveCamera;
  private mode: CameraMode;
  private container: HTMLElement;

  // Cámara libre
  private freeCameraPosition: THREE.Vector3;
  private freeCameraRotation: { theta: number; phi: number };
  private isDragging: boolean = false;
  private lastMousePos: { x: number; y: number } = { x: 0, y: 0 };
  private lastTouchDistance: number = 0;
  private touchStartPos: { x: number; y: number } = { x: 0, y: 0 };

  constructor(config: CameraSystemConfig) {
    this.container = config.container;
    this.mode = config.initialMode || 'follow';

    // Crear cámara
    const aspect = this.container.clientWidth / this.container.clientHeight;
    this.camera = new THREE.PerspectiveCamera(
      CAMERA.FOV,
      aspect,
      CAMERA.NEAR,
      CAMERA.FAR
    );
    this.camera.position.set(0, 6, 10);

    // Inicializar cámara libre
    this.freeCameraPosition = new THREE.Vector3(0, 10, 15);
    this.freeCameraRotation = {
      theta: CAMERA.FREE_INITIAL_THETA,
      phi: CAMERA.FREE_INITIAL_PHI,
    };

    this.setupEventListeners();
  }

  /**
   * Configura los event listeners para controles de cámara
   */
  private setupEventListeners(): void {
    // Mouse controls (desktop)
    this.container.addEventListener('mousedown', this.handleMouseDown.bind(this));
    this.container.addEventListener('mousemove', this.handleMouseMove.bind(this));
    this.container.addEventListener('mouseup', this.handleMouseUp.bind(this));
    this.container.addEventListener('wheel', this.handleWheel.bind(this), {
      passive: false,
    });
    this.container.addEventListener('contextmenu', (e) => e.preventDefault());

    // Touch controls (mobile)
    this.container.addEventListener('touchstart', this.handleTouchStart.bind(this), {
      passive: false,
    });
    this.container.addEventListener('touchmove', this.handleTouchMove.bind(this), {
      passive: false,
    });
    this.container.addEventListener('touchend', this.handleTouchEnd.bind(this));
  }

  /**
   * Manejo de mouse down
   */
  private handleMouseDown(e: MouseEvent): void {
    if (this.mode !== 'free') return;
    if (e.button === 2 || e.button === 0) {
      this.isDragging = true;
      this.lastMousePos = { x: e.clientX, y: e.clientY };
    }
  }

  /**
   * Manejo de mouse move
   */
  private handleMouseMove(e: MouseEvent): void {
    if (!this.isDragging || this.mode !== 'free') return;

    const deltaX = e.clientX - this.lastMousePos.x;
    const deltaY = e.clientY - this.lastMousePos.y;

    this.freeCameraRotation.theta -= deltaX * 0.005;
    this.freeCameraRotation.phi -= deltaY * 0.005;

    // Limitar phi
    this.freeCameraRotation.phi = Math.max(
      0.1,
      Math.min(Math.PI - 0.1, this.freeCameraRotation.phi)
    );

    this.lastMousePos = { x: e.clientX, y: e.clientY };
  }

  /**
   * Manejo de mouse up
   */
  private handleMouseUp(): void {
    this.isDragging = false;
  }

  /**
   * Manejo de wheel (zoom)
   */
  private handleWheel(e: WheelEvent): void {
    if (this.mode !== 'free') return;
    e.preventDefault();

    const radius = this.freeCameraPosition.length();
    const newRadius = Math.max(
      CAMERA.FREE_MIN_DISTANCE,
      Math.min(CAMERA.FREE_MAX_DISTANCE, radius + e.deltaY * 0.01)
    );
    this.freeCameraPosition.setLength(newRadius);
  }

  /**
   * Calcula distancia entre dos toques
   */
  private getTouchDistance(touches: TouchList): number {
    if (touches.length < 2) return 0;
    const dx = touches[0].clientX - touches[1].clientX;
    const dy = touches[0].clientY - touches[1].clientY;
    return Math.sqrt(dx * dx + dy * dy);
  }

  /**
   * Manejo de touch start
   */
  private handleTouchStart(e: TouchEvent): void {
    if (this.mode !== 'free') return;

    if (e.touches.length === 1) {
      this.isDragging = true;
      this.touchStartPos = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
      };
    } else if (e.touches.length === 2) {
      this.isDragging = false;
      this.lastTouchDistance = this.getTouchDistance(e.touches);
    }
  }

  /**
   * Manejo de touch move
   */
  private handleTouchMove(e: TouchEvent): void {
    if (this.mode !== 'free') return;
    e.preventDefault();

    if (e.touches.length === 1 && this.isDragging) {
      // Rotar con un dedo
      const deltaX = e.touches[0].clientX - this.touchStartPos.x;
      const deltaY = e.touches[0].clientY - this.touchStartPos.y;

      this.freeCameraRotation.theta -= deltaX * 0.005;
      this.freeCameraRotation.phi -= deltaY * 0.005;

      this.freeCameraRotation.phi = Math.max(
        0.1,
        Math.min(Math.PI - 0.1, this.freeCameraRotation.phi)
      );

      this.touchStartPos = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
      };
    } else if (e.touches.length === 2) {
      // Zoom con pinch
      const currentDistance = this.getTouchDistance(e.touches);
      const delta = currentDistance - this.lastTouchDistance;

      const radius = this.freeCameraPosition.length();
      const newRadius = Math.max(
        CAMERA.FREE_MIN_DISTANCE,
        Math.min(CAMERA.FREE_MAX_DISTANCE, radius - delta * 0.05)
      );
      this.freeCameraPosition.setLength(newRadius);

      this.lastTouchDistance = currentDistance;
    }
  }

  /**
   * Manejo de touch end
   */
  private handleTouchEnd(): void {
    this.isDragging = false;
    this.lastTouchDistance = 0;
  }

  /**
   * Actualiza la cámara (llamar en el loop de animación)
   */
  update(targetPosition: THREE.Vector3): void {
    if (this.mode === 'follow') {
      this.updateFollowCamera(targetPosition);
    } else {
      this.updateFreeCamera(targetPosition);
    }
  }

  /**
   * Actualiza cámara en modo follow
   */
  private updateFollowCamera(targetPosition: THREE.Vector3): void {
    const offset = new THREE.Vector3(
      CAMERA.FOLLOW_OFFSET_X,
      CAMERA.FOLLOW_OFFSET_Y,
      CAMERA.FOLLOW_OFFSET_Z
    );
    const cameraTarget = targetPosition.clone().add(offset);
    this.camera.position.lerp(cameraTarget, CAMERA.FOLLOW_INTERPOLATION);

    const lookAtTarget = targetPosition.clone();
    lookAtTarget.y += 1;
    this.camera.lookAt(lookAtTarget);
  }

  /**
   * Actualiza cámara en modo free
   */
  private updateFreeCamera(targetPosition: THREE.Vector3): void {
    const theta = this.freeCameraRotation.theta;
    const phi = this.freeCameraRotation.phi;
    const radius = this.freeCameraPosition.length();

    // Calcular posición de la cámara relativa al personaje
    const offsetX = radius * Math.sin(phi) * Math.cos(theta);
    const offsetY = radius * Math.cos(phi);
    const offsetZ = radius * Math.sin(phi) * Math.sin(theta);

    // Posicionar cámara alrededor del personaje
    const targetCameraPos = targetPosition.clone();
    targetCameraPos.x += offsetX;
    targetCameraPos.y += offsetY;
    targetCameraPos.z += offsetZ;

    this.camera.position.lerp(targetCameraPos, CAMERA.FREE_INTERPOLATION);

    // Siempre mirar al personaje
    const lookAtTarget = targetPosition.clone();
    lookAtTarget.y += 1;
    this.camera.lookAt(lookAtTarget);
  }

  /**
   * Cambia el modo de cámara
   */
  setMode(mode: CameraMode): void {
    this.mode = mode;
  }

  /**
   * Obtiene el modo actual
   */
  getMode(): CameraMode {
    return this.mode;
  }

  /**
   * Alterna entre modos
   */
  toggleMode(): CameraMode {
    this.mode = this.mode === 'follow' ? 'free' : 'follow';
    return this.mode;
  }

  /**
   * Obtiene la cámara
   */
  getCamera(): THREE.PerspectiveCamera {
    return this.camera;
  }

  /**
   * Maneja el resize
   */
  handleResize(width: number, height: number): void {
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
  }

  /**
   * Limpia recursos
   */
  dispose(): void {
    // Remover event listeners
    this.container.removeEventListener('mousedown', this.handleMouseDown.bind(this));
    this.container.removeEventListener('mousemove', this.handleMouseMove.bind(this));
    this.container.removeEventListener('mouseup', this.handleMouseUp.bind(this));
    this.container.removeEventListener('wheel', this.handleWheel.bind(this));
    this.container.removeEventListener('touchstart', this.handleTouchStart.bind(this));
    this.container.removeEventListener('touchmove', this.handleTouchMove.bind(this));
    this.container.removeEventListener('touchend', this.handleTouchEnd.bind(this));
  }
}

export default CameraSystem;
