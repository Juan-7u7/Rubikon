// app/index.tsx
// Pantalla principal con controles adaptativos: teclado para desktop, joystick para móvil

"use client";

import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import GameMap3D from './components/GameMap3D';
import Joystick from './components/Joystick';

export default function HomeScreen() {
  const [joystickX, setJoystickX] = useState(0);
  const [joystickY, setJoystickY] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  // Detectar si es dispositivo móvil o tablet
  useEffect(() => {
    const checkIfMobile = () => {
      const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      const isSmallScreen = window.innerWidth <= 1024;
      const mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
      const isMobileUA = mobileRegex.test(navigator.userAgent);
      
      setIsMobile((isTouchDevice && isSmallScreen) || isMobileUA);
    };

    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  // Controles de teclado para desktop
  useEffect(() => {
    if (isMobile) return;

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

      // Normalizar diagonal
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
  }, [isMobile]);

  const handleJoystickMove = (x: number, y: number) => {
    // Invertir el eje Y del joystick también
    setJoystickX(x);
    setJoystickY(-y); // Invertido
  };

  return (
    <View style={styles.container}>
      {/* Escena 3D del juego */}
      <View style={styles.gameContainer}>
        <GameMap3D joystickX={joystickX} joystickY={joystickY} />
      </View>

      {/* Joystick solo en móvil/tablet */}
      {isMobile && (
        <View style={styles.joystickContainer}>
          <Joystick onMove={handleJoystickMove} size={100} />
        </View>
      )}

      {/* Indicador de controles para desktop */}
      {!isMobile && (
        <View style={styles.controlsHint}>
          <div style={styles.hintText}>
            Usa <strong>WASD</strong> o <strong>Flechas</strong> para mover
          </div>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: '#0a0a0a',
    overflow: 'hidden',
  },
  gameContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
  },
  joystickContainer: {
    position: 'absolute',
    bottom: 30,
    left: 30,
    zIndex: 100,
  },
  controlsHint: {
    position: 'absolute',
    bottom: 30,
    left: '50%',
    transform: [{ translateX: '-50%' }],
    zIndex: 100,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(10px)',
  } as any,
  hintText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
    fontFamily: 'system-ui, -apple-system, sans-serif',
    textAlign: 'center',
  } as any,
});