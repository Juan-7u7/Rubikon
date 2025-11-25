// config/constants.ts
// Constantes globales del proyecto

/**
 * Colores principales del juego
 */
export const COLORS = {
  // Personaje
  GHOST_BODY: 0xadd8e6, // Azul claro fantasmal
  ARMOR: 0xc0c0c0, // Plata
  EYES: 0x00ffff, // Cyan brillante
  CREST: 0xff0000, // Rojo
  CAPE: 0x191970, // Azul medianoche
  AURA: 0x4169e1, // Azul real

  // Mundo
  SKY: 0x87ceeb, // Azul cielo
  GRASS: 0x90ee90, // Verde pasto
  GRID_PRIMARY: 0x4a9eff, // Azul brillante
  GRID_SECONDARY: 0x87ceeb, // Azul cielo

  // Iluminación
  AMBIENT_LIGHT: 0xffffff, // Blanco
  MAIN_LIGHT: 0xfff8dc, // Dorado suave
  FILL_LIGHT: 0x87ceeb, // Azul cielo
  ACCENT_LIGHT: 0xff69b4, // Rosa
} as const;

/**
 * Tamaños y dimensiones
 */
export const SIZES = {
  // Personaje
  TORSO_WIDTH: 0.6,
  TORSO_HEIGHT: 0.8,
  TORSO_DEPTH: 0.4,
  HELMET_RADIUS: 0.25,
  HELMET_HEIGHT: 0.4,
  EYE_RADIUS: 0.08,
  SHOULDER_RADIUS: 0.2,
  ARM_RADIUS: 0.1,
  ARM_LENGTH: 0.5,
  LEG_TOP_RADIUS: 0.12,
  LEG_BOTTOM_RADIUS: 0.08,
  LEG_HEIGHT: 0.6,
  CAPE_RADIUS: 0.5,
  CAPE_HEIGHT: 1.2,
  AURA_RADIUS: 0.8,
  SHADOW_RADIUS: 0.5,

  // Mundo
  FLOOR_RADIUS: 25,
  GRID_SIZE: 30,
  GRID_DIVISIONS: 30,

  // UI
  JOYSTICK_DEFAULT_SIZE: 100,
} as const;

/**
 * Configuración de movimiento
 */
export const MOVEMENT = {
  SPEED: 0.12, // Velocidad de movimiento
  MAX_DISTANCE: 96, // Distancia máxima desde el centro
  INTERPOLATION: 0.08, // Factor de suavizado (lerp)
  ROTATION_SPEED: 0.1, // Velocidad de rotación
} as const;

/**
 * Configuración de cámara
 */
export const CAMERA = {
  FOV: 60, // Field of view
  NEAR: 0.1, // Plano cercano
  FAR: 1000, // Plano lejano

  // Cámara fija (follow)
  FOLLOW_OFFSET_X: 0,
  FOLLOW_OFFSET_Y: 6,
  FOLLOW_OFFSET_Z: 10,
  FOLLOW_INTERPOLATION: 0.05,

  // Cámara libre
  FREE_INITIAL_DISTANCE: 15,
  FREE_INITIAL_THETA: 0,
  FREE_INITIAL_PHI: Math.PI / 4,
  FREE_MIN_DISTANCE: 5,
  FREE_MAX_DISTANCE: 30,
  FREE_INTERPOLATION: 0.1,
} as const;

/**
 * Configuración de iluminación
 */
export const LIGHTING = {
  AMBIENT_INTENSITY: 0.7,
  MAIN_INTENSITY: 1.2,
  FILL_INTENSITY: 0.5,
  ACCENT_INTENSITY: 0.3,
  HEMISPHERE_INTENSITY: 0.6,

  // Posiciones
  MAIN_POSITION: [10, 15, 10] as const,
  FILL_POSITION: [-8, 5, -8] as const,
  ACCENT_POSITION: [0, 8, -10] as const,
} as const;

/**
 * Configuración de niebla
 */
export const FOG = {
  COLOR: 0x87ceeb,
  NEAR: 30,
  FAR: 80,
} as const;

/**
 * Configuración de sombras
 */
export const SHADOWS = {
  MAP_SIZE: 2048,
  CAMERA_NEAR: 0.5,
  CAMERA_FAR: 50,
} as const;

/**
 * Configuración de materiales
 */
export const MATERIALS = {
  // Personaje fantasmal
  GHOST_OPACITY: 0.7,
  GHOST_ROUGHNESS: 0.2,
  GHOST_METALNESS: 0.3,
  GHOST_EMISSIVE_INTENSITY: 0.4,

  // Armadura
  ARMOR_OPACITY: 0.6,
  ARMOR_ROUGHNESS: 0.3,
  ARMOR_METALNESS: 0.9,
  ARMOR_EMISSIVE_INTENSITY: 0.2,

  // Ojos
  EYES_EMISSIVE_INTENSITY: 1.5,
  EYES_OPACITY: 0.9,

  // Suelo
  FLOOR_ROUGHNESS: 0.9,
  FLOOR_METALNESS: 0.1,

  // Grid
  GRID_OPACITY: 0.4,
} as const;

/**
 * Configuración de controles
 */
export const CONTROLS = {
  MOBILE_MAX_WIDTH: 1024, // Ancho máximo para considerar móvil
  KEYBOARD_ENABLED: true,
  TOUCH_ENABLED: true,
  MOUSE_SENSITIVITY: 0.005,
  TOUCH_SENSITIVITY: 0.005,
  ZOOM_SENSITIVITY: 0.01,
  PINCH_SENSITIVITY: 0.05,
} as const;

/**
 * URLs y recursos
 */
export const RESOURCES = {
  MAP_MODEL_URL:
    'https://ckbuwzhdxmlaarajwtbo.supabase.co/storage/v1/object/public/models/rubik.glb',
  MAP_MODEL_SCALE: 2,
} as const;

/**
 * Configuración de animaciones
 */
export const ANIMATIONS = {
  SPRING_DAMPING: 15,
  SPRING_STIFFNESS: 150,
} as const;
