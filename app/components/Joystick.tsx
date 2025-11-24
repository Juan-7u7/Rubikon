// app/components/Joystick.tsx
// Componente de joystick virtual para controlar el movimiento del personaje

import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSpring,
} from 'react-native-reanimated';

interface JoystickProps {
  onMove: (x: number, y: number) => void; // Valores normalizados entre -1 y 1
  size?: number; // Tamaño del joystick
}

export default function Joystick({ onMove, size = 120 }: JoystickProps) {
  const knobSize = size * 0.4; // El knob es 40% del tamaño total
  const maxDistance = (size - knobSize) / 2; // Distancia máxima que puede moverse el knob

  // Posición del knob (relativa al centro)
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  // Gesto de pan para mover el joystick
  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      // Calcular la distancia desde el centro
      const distance = Math.sqrt(event.translationX ** 2 + event.translationY ** 2);
      
      if (distance <= maxDistance) {
        // Si está dentro del límite, mover libremente
        translateX.value = event.translationX;
        translateY.value = event.translationY;
      } else {
        // Si está fuera del límite, limitar al borde del círculo
        const angle = Math.atan2(event.translationY, event.translationX);
        translateX.value = Math.cos(angle) * maxDistance;
        translateY.value = Math.sin(angle) * maxDistance;
      }

      // Normalizar valores entre -1 y 1 y enviar al callback
      const normalizedX = translateX.value / maxDistance;
      const normalizedY = translateY.value / maxDistance;
      onMove(normalizedX, normalizedY);
    })
    .onEnd(() => {
      // Volver al centro con animación
      translateX.value = withSpring(0);
      translateY.value = withSpring(0);
      onMove(0, 0);
    });

  // Estilo animado para el knob
  const knobStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
    ],
  }));

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      {/* Base del joystick */}
      <View style={[styles.base, { width: size, height: size, borderRadius: size / 2 }]} />
      
      {/* Knob del joystick (la parte que se mueve) */}
      <GestureDetector gesture={panGesture}>
        <Animated.View
          style={[
            styles.knob,
            {
              width: knobSize,
              height: knobSize,
              borderRadius: knobSize / 2,
            },
            knobStyle,
          ]}
        />
      </GestureDetector>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  base: {
    position: 'absolute',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  knob: {
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.8)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
});
