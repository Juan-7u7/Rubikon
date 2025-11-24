// app/index.tsx
// Pantalla principal con juego 3D - Diseño minimalista y estético

"use client";

import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import GameMap3D from './components/GameMap3D';
import Joystick from './components/Joystick';

export default function HomeScreen() {
  const [joystickX, setJoystickX] = useState(0);
  const [joystickY, setJoystickY] = useState(0);

  const handleJoystickMove = (x: number, y: number) => {
    setJoystickX(x);
    setJoystickY(y);
  };

  return (
    <View style={styles.container}>
      {/* Escena 3D del juego */}
      <View style={styles.gameContainer}>
        <GameMap3D joystickX={joystickX} joystickY={joystickY} />
      </View>

      {/* Joystick con diseño mejorado */}
      <View style={styles.joystickContainer}>
        <Joystick onMove={handleJoystickMove} size={100} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: '#0a0a0a',
    overflow: 'hidden', // Prevenir scroll
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
});