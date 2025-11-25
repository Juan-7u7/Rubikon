// types/game.types.ts
// Tipos compartidos para el juego

/**
 * Vector 3D básico
 */
export interface Vector3 {
  x: number;
  y: number;
  z: number;
}

/**
 * Vector 2D básico
 */
export interface Vector2 {
  x: number;
  y: number;
}

/**
 * Modo de cámara disponible
 */
export type CameraMode = 'follow' | 'free';

/**
 * Estado del jugador
 */
export interface PlayerState {
  position: Vector3;
  rotation: number;
  velocity: Vector3;
  isMoving: boolean;
}

/**
 * Estado de la cámara
 */
export interface CameraState {
  mode: CameraMode;
  position: Vector3;
  target: Vector3;
  rotation: {
    theta: number;
    phi: number;
  };
  distance: number;
}

/**
 * Configuración de la cámara
 */
export interface CameraConfig {
  fov: number;
  aspect: number;
  near: number;
  far: number;
}

/**
 * Props del componente Joystick
 */
export interface JoystickProps {
  onMove: (x: number, y: number) => void;
  size?: number;
}

/**
 * Props del componente GameMap3D
 */
export interface GameMap3DProps {
  joystickX: number;
  joystickY: number;
}

/**
 * Configuración de iluminación
 */
export interface LightConfig {
  color: number;
  intensity: number;
  position?: [number, number, number];
}

/**
 * Configuración de material
 */
export interface MaterialConfig {
  color: number;
  opacity?: number;
  transparent?: boolean;
  roughness?: number;
  metalness?: number;
  emissive?: number;
  emissiveIntensity?: number;
}

/**
 * Información del dispositivo
 */
export interface DeviceInfo {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  hasTouch: boolean;
  screenWidth: number;
  screenHeight: number;
}

/**
 * Estado de controles
 */
export interface ControlsState {
  joystickX: number;
  joystickY: number;
  isKeyboardActive: boolean;
  isTouchActive: boolean;
}

/**
 * Evento de movimiento
 */
export interface MovementEvent {
  x: number;
  y: number;
  timestamp: number;
}

/**
 * Evento de cámara
 */
export interface CameraEvent {
  type: 'rotate' | 'zoom' | 'modeChange';
  data: any;
  timestamp: number;
}

/**
 * Configuración del personaje
 */
export interface CharacterConfig {
  colors: {
    body: number;
    armor: number;
    eyes: number;
    crest: number;
    cape: number;
    aura: number;
  };
  sizes: {
    torsoWidth: number;
    torsoHeight: number;
    helmetRadius: number;
    eyeRadius: number;
  };
  materials: {
    bodyOpacity: number;
    armorOpacity: number;
    emissiveIntensity: number;
  };
}

/**
 * Configuración del mundo
 */
export interface WorldConfig {
  background: number;
  fog: {
    color: number;
    near: number;
    far: number;
  };
  floor: {
    radius: number;
    color: number;
  };
  grid: {
    size: number;
    divisions: number;
    colorPrimary: number;
    colorSecondary: number;
  };
}

/**
 * Resultado de carga de modelo
 */
export interface ModelLoadResult {
  success: boolean;
  model?: any;
  error?: string;
}

/**
 * Opciones de renderizado
 */
export interface RenderOptions {
  antialias: boolean;
  alpha: boolean;
  shadowsEnabled: boolean;
  pixelRatio: number;
}

/**
 * Estado del juego
 */
export interface GameState {
  isPlaying: boolean;
  isPaused: boolean;
  player: PlayerState;
  camera: CameraState;
  controls: ControlsState;
}
