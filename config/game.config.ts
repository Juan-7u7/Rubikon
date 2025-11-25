// config/game.config.ts
// Configuración completa del juego

import type { CameraConfig, CharacterConfig, LightConfig, WorldConfig } from '../types/game.types';
import {
  ANIMATIONS,
  CAMERA,
  COLORS,
  CONTROLS,
  FOG,
  LIGHTING,
  MATERIALS,
  MOVEMENT,
  RESOURCES,
  SIZES,
} from './constants';

/**
 * Configuración del personaje (Fantasma de Caballero Medieval)
 */
export const CHARACTER_CONFIG: CharacterConfig = {
  colors: {
    body: COLORS.GHOST_BODY,
    armor: COLORS.ARMOR,
    eyes: COLORS.EYES,
    crest: COLORS.CREST,
    cape: COLORS.CAPE,
    aura: COLORS.AURA,
  },
  sizes: {
    torsoWidth: SIZES.TORSO_WIDTH,
    torsoHeight: SIZES.TORSO_HEIGHT,
    helmetRadius: SIZES.HELMET_RADIUS,
    eyeRadius: SIZES.EYE_RADIUS,
  },
  materials: {
    bodyOpacity: MATERIALS.GHOST_OPACITY,
    armorOpacity: MATERIALS.ARMOR_OPACITY,
    emissiveIntensity: MATERIALS.GHOST_EMISSIVE_INTENSITY,
  },
};

/**
 * Configuración del mundo 3D
 */
export const WORLD_CONFIG: WorldConfig = {
  background: COLORS.SKY,
  fog: {
    color: FOG.COLOR,
    near: FOG.NEAR,
    far: FOG.FAR,
  },
  floor: {
    radius: SIZES.FLOOR_RADIUS,
    color: COLORS.GRASS,
  },
  grid: {
    size: SIZES.GRID_SIZE,
    divisions: SIZES.GRID_DIVISIONS,
    colorPrimary: COLORS.GRID_PRIMARY,
    colorSecondary: COLORS.GRID_SECONDARY,
  },
};

/**
 * Configuración de la cámara
 */
export const CAMERA_CONFIG: CameraConfig = {
  fov: CAMERA.FOV,
  aspect: 1, // Se calcula dinámicamente
  near: CAMERA.NEAR,
  far: CAMERA.FAR,
};

/**
 * Configuración de iluminación
 */
export const LIGHTS_CONFIG = {
  ambient: {
    color: LIGHTING.AMBIENT_INTENSITY,
    intensity: LIGHTING.AMBIENT_INTENSITY,
  } as LightConfig,
  main: {
    color: COLORS.MAIN_LIGHT,
    intensity: LIGHTING.MAIN_INTENSITY,
    position: LIGHTING.MAIN_POSITION,
  } as LightConfig,
  fill: {
    color: COLORS.FILL_LIGHT,
    intensity: LIGHTING.FILL_INTENSITY,
    position: LIGHTING.FILL_POSITION,
  } as LightConfig,
  accent: {
    color: COLORS.ACCENT_LIGHT,
    intensity: LIGHTING.ACCENT_INTENSITY,
    position: LIGHTING.ACCENT_POSITION,
  } as LightConfig,
  hemisphere: {
    color: COLORS.SKY,
    intensity: LIGHTING.HEMISPHERE_INTENSITY,
  } as LightConfig,
};

/**
 * Configuración de movimiento del jugador
 */
export const PLAYER_MOVEMENT_CONFIG = {
  speed: MOVEMENT.SPEED,
  maxDistance: MOVEMENT.MAX_DISTANCE,
  interpolation: MOVEMENT.INTERPOLATION,
  rotationSpeed: MOVEMENT.ROTATION_SPEED,
};

/**
 * Configuración de controles
 */
export const CONTROLS_CONFIG = {
  mobileMaxWidth: CONTROLS.MOBILE_MAX_WIDTH,
  keyboardEnabled: CONTROLS.KEYBOARD_ENABLED,
  touchEnabled: CONTROLS.TOUCH_ENABLED,
  mouseSensitivity: CONTROLS.MOUSE_SENSITIVITY,
  touchSensitivity: CONTROLS.TOUCH_SENSITIVITY,
  zoomSensitivity: CONTROLS.ZOOM_SENSITIVITY,
  pinchSensitivity: CONTROLS.PINCH_SENSITIVITY,
  joystickSize: SIZES.JOYSTICK_DEFAULT_SIZE,
};

/**
 * Configuración de recursos externos
 */
export const ASSETS_CONFIG = {
  mapModelUrl: RESOURCES.MAP_MODEL_URL,
  mapModelScale: RESOURCES.MAP_MODEL_SCALE,
};

/**
 * Configuración de animaciones
 */
export const ANIMATION_CONFIG = {
  springDamping: ANIMATIONS.SPRING_DAMPING,
  springStiffness: ANIMATIONS.SPRING_STIFFNESS,
};

/**
 * Configuración completa del juego
 * Exportación única para fácil acceso
 */
export const GAME_CONFIG = {
  character: CHARACTER_CONFIG,
  world: WORLD_CONFIG,
  camera: CAMERA_CONFIG,
  lights: LIGHTS_CONFIG,
  movement: PLAYER_MOVEMENT_CONFIG,
  controls: CONTROLS_CONFIG,
  assets: ASSETS_CONFIG,
  animations: ANIMATION_CONFIG,
} as const;

/**
 * Configuración de desarrollo vs producción
 */
export const ENV_CONFIG = {
  isDevelopment: __DEV__,
  isProduction: !__DEV__,
  enableDebugLogs: __DEV__,
  enablePerformanceMonitoring: !__DEV__,
};

export default GAME_CONFIG;
