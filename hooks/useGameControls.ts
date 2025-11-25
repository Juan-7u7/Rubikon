// hooks/useGameControls.ts
// Custom hook para manejar los controles del juego (teclado y joystick)

import { useCallback, useEffect, useState } from 'react';

/**
 * Configuración de los controles del juego
 */
interface GameControlsConfig {
  /** Habilitar controles de teclado */
  enableKeyboard?: boolean;
  /** Habilitar controles táctiles */
  enableTouch?: boolean;
}

/**
 * Estado de los controles del juego
 */
interface GameControlsState {
  /** Movimiento en eje X (-1 a 1) */
  x: number;
  /** Movimiento en eje Y (-1 a 1) */
  y: number;
  /** Si el dispositivo es móvil */
  isMobile: boolean;
}

/**
 * Custom hook para gestionar los controles del juego
 * Maneja tanto controles de teclado (desktop) como joystick (móvil)
 *
 * @param config - Configuración de los controles
 * @returns Estado y funciones de los controles
 *
 * @example
 * ```tsx
 * const { x, y, isMobile, handleJoystickMove } = useGameControls();
 *
 * return (
 *   <>
 *     <GameMap3D joystickX={x} joystickY={y} />
 *     {isMobile && <Joystick onMove={handleJoystickMove} />}
 *   </>
 * );
 * ```
 */
export function useGameControls(config: GameControlsConfig = {}) {
  const { enableKeyboard = true, enableTouch = true } = config;

  const [joystickX, setJoystickX] = useState(0);
  const [joystickY, setJoystickY] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  // Detectar si es dispositivo móvil o tablet
  useEffect(() => {
    const checkIfMobile = () => {
      // Verificar si tiene pantalla táctil
      const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      // Verificar tamaño de pantalla (tablets y móviles)
      const isSmallScreen = window.innerWidth <= 1024;
      // Verificar user agent del navegador
      const mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
      const isMobileUA = mobileRegex.test(navigator.userAgent);

      // Es móvil si cumple touch + pantalla pequeña O es detectado por user agent
      setIsMobile((isTouchDevice && isSmallScreen) || isMobileUA);
    };

    checkIfMobile();
    // Revisar de nuevo si cambia el tamaño de ventana
    window.addEventListener('resize', checkIfMobile);

    // Limpiar evento al desmontar componente
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  // Controles de teclado para desktop
  useEffect(() => {
    // Solo activar controles de teclado en desktop
    if (isMobile || !enableKeyboard) return;

    // Objeto para rastrear qué teclas están presionadas
    const keyState: { [key: string]: boolean } = {};

    const handleKeyDown = (e: KeyboardEvent) => {
      keyState[e.key.toLowerCase()] = true;
      updateMovementFromKeys();
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keyState[e.key.toLowerCase()] = false;
      updateMovementFromKeys();
    };

    const updateMovementFromKeys = () => {
      let x = 0;
      let y = 0;

      // WASD o Flechas (INVERTIDOS: W/↑ = adelante, S/↓ = atrás)
      if (keyState['w'] || keyState['arrowup']) y = 1;
      if (keyState['s'] || keyState['arrowdown']) y = -1;
      if (keyState['a'] || keyState['arrowleft']) x = -1;
      if (keyState['d'] || keyState['arrowright']) x = 1;

      // Normalizar movimiento diagonal para que no sea más rápido
      if (x !== 0 && y !== 0) {
        const length = Math.sqrt(x * x + y * y);
        x /= length;
        y /= length;
      }

      setJoystickX(x);
      setJoystickY(y);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [isMobile, enableKeyboard]);

  // Callback cuando el joystick se mueve
  const handleJoystickMove = useCallback(
    (x: number, y: number) => {
      if (!enableTouch) return;

      setJoystickX(x);
      // Invertir Y para que arriba sea adelante
      setJoystickY(-y);
    },
    [enableTouch]
  );

  // Resetear controles
  const reset = useCallback(() => {
    setJoystickX(0);
    setJoystickY(0);
  }, []);

  return {
    /** Movimiento en eje X (-1 a 1) */
    x: joystickX,
    /** Movimiento en eje Y (-1 a 1) */
    y: joystickY,
    /** Si el dispositivo es móvil */
    isMobile,
    /** Callback para manejar movimiento del joystick */
    handleJoystickMove,
    /** Resetear controles a 0 */
    reset,
  };
}

export default useGameControls;
