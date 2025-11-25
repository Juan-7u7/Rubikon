// types/schemas.ts
// Esquemas de validación Zod para el proyecto

import { z } from 'zod';

/**
 * Esquema para las props del Joystick
 */
export const JoystickPropsSchema = z.object({
  // Usamos una validación más simple para la función para evitar errores de tipos
  onMove: z.function(),
  size: z.number().min(50).max(300).optional(),
});

/**
 * Esquema para las props de GameMap3D
 */
export const GameMap3DPropsSchema = z.object({
  joystickX: z.number().min(-1).max(1),
  joystickY: z.number().min(-1).max(1),
});

/**
 * Esquema para configuración de cámara
 */
export const CameraConfigSchema = z.object({
  fov: z.number().min(1).max(180),
  near: z.number().positive(),
  far: z.number().positive(),
});

/**
 * Esquema para configuración de iluminación
 */
export const LightConfigSchema = z.object({
  color: z.union([z.number(), z.string()]),
  intensity: z.number().nonnegative(),
  position: z.tuple([z.number(), z.number(), z.number()]).optional(),
});
