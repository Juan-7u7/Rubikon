// app/game.tsx
// Pantalla del juego de exploración 3D

'use client';

import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import GameMap3D from './components/GameMap3D';
import Joystick from './components/Joystick';

export default function GameScreen() {
  // Estado del joystick
  const [joystickX, setJoystickX] = useState(0);
  const [joystickY, setJoystickY] = useState(0);

  // Callback cuando el joystick se mueve
  const handleJoystickMove = (x: number, y: number) => {
    setJoystickX(x);
    setJoystickY(y);
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      {/* Escena 3D del juego */}
      <GameMap3D joystickX={joystickX} joystickY={joystickY} />

      {/* Joystick posicionado en la esquina inferior izquierda */}
      <View style={styles.joystickContainer}>
        <Joystick onMove={handleJoystickMove} size={120} />
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  joystickContainer: {
    position: 'absolute',
    bottom: 40,
    left: 40,
    zIndex: 10,
  },
});
