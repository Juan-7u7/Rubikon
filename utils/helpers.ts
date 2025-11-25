// utils/helpers.ts
// Funciones de utilidad para el juego

import { Vector2, Vector3 } from '../types/game.types';

/**
 * Clampea un número entre un mínimo y un máximo
 */
export const clamp = (value: number, min: number, max: number): number => {
  return Math.min(Math.max(value, min), max);
};

/**
 * Calcula la distancia entre dos puntos 2D
 */
export const distance2D = (p1: Vector2, p2: Vector2): number => {
  const dx = p1.x - p2.x;
  const dy = p1.y - p2.y;
  return Math.sqrt(dx * dx + dy * dy);
};

/**
 * Calcula la distancia entre dos puntos 3D
 */
export const distance3D = (p1: Vector3, p2: Vector3): number => {
  const dx = p1.x - p2.x;
  const dy = p1.y - p2.y;
  const dz = p1.z - p2.z;
  return Math.sqrt(dx * dx + dy * dy + dz * dz);
};

/**
 * Normaliza un vector 2D
 */
export const normalize2D = (vector: Vector2): Vector2 => {
  const length = Math.sqrt(vector.x * vector.x + vector.y * vector.y);
  if (length === 0) return { x: 0, y: 0 };
  return { x: vector.x / length, y: vector.y / length };
};

/**
 * Interpolación lineal (Lerp)
 */
export const lerp = (start: number, end: number, t: number): number => {
  return start * (1 - t) + end * t;
};

/**
 * Convierte grados a radianes
 */
export const degToRad = (degrees: number): number => {
  return degrees * (Math.PI / 180);
};

/**
 * Convierte radianes a grados
 */
export const radToDeg = (radians: number): number => {
  return radians * (180 / Math.PI);
};

/**
 * Genera un ID único simple
 */
export const generateId = (): string => {
  return Math.random().toString(36).substr(2, 9);
};

/**
 * Detecta si el dispositivo es móvil (basado en User Agent y tamaño)
 */
export const isMobileDevice = (): boolean => {
  if (typeof window === 'undefined') return false;

  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  const isSmallScreen = window.innerWidth <= 1024;
  const mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
  const isMobileUA = mobileRegex.test(navigator.userAgent);

  return (isTouchDevice && isSmallScreen) || isMobileUA;
};

/**
 * Formatea tiempo en mm:ss
 */
export const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};
