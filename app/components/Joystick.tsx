// app/components/Joystick.tsx
// Joystick virtual con diseño minimalista y moderno

import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSpring,
} from 'react-native-reanimated';

interface JoystickProps {
  onMove: (x: number, y: number) => void;
  size?: number;
}

export default function Joystick({ onMove, size = 100 }: JoystickProps) {
  // Tamaño del botón central (45% del tamaño total)
  const knobSize = size * 0.45;
  // Distancia máxima que puede moverse el knob desde el centro
  const maxDistance = (size - knobSize) / 2;

  // Valores animados para la posición del knob
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      // Calcular distancia desde el centro
      const distance = Math.sqrt(event.translationX ** 2 + event.translationY ** 2);
      
      if (distance <= maxDistance) {
        // Si está dentro del límite, usar posición directa
        translateX.value = event.translationX;
        translateY.value = event.translationY;
      } else {
        // Si excede el límite, limitar al borde circular
        const angle = Math.atan2(event.translationY, event.translationX);
        translateX.value = Math.cos(angle) * maxDistance;
        translateY.value = Math.sin(angle) * maxDistance;
      }

      // Normalizar valores a rango -1 a 1
      const normalizedX = translateX.value / maxDistance;
      const normalizedY = translateY.value / maxDistance;
      onMove(normalizedX, normalizedY);
    })
    .onEnd(() => {
      // Regresar al centro con animación spring
      translateX.value = withSpring(0, { damping: 15, stiffness: 150 });
      translateY.value = withSpring(0, { damping: 15, stiffness: 150 });
      onMove(0, 0);
    });

  const knobStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
    ],
  }));

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      {/* Base del joystick - Glassmorphism */}
      <View style={[styles.base, { width: size, height: size, borderRadius: size / 2 }]}>
        {/* Anillo interior decorativo */}
        <View style={[styles.innerRing, { 
          width: size * 0.7, 
          height: size * 0.7, 
          borderRadius: (size * 0.7) / 2 
        }]} />
      </View>
      
      {/* Knob del joystick */}
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
        >
          {/* Centro del knob */}
          <View style={[styles.knobCenter, {
            width: knobSize * 0.4,
            height: knobSize * 0.4,
            borderRadius: (knobSize * 0.4) / 2,
          }]} />
        </Animated.View>
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
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    // Glassmorphism effect
    backdropFilter: 'blur(10px)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  innerRing: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: '-50%' }, { translateY: '-50%' }],
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    borderStyle: 'dashed',
  },
  knob: {
    backgroundColor: 'rgba(74, 158, 255, 0.9)',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    // Glow effect
    shadowColor: '#4a9eff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 12,
    elevation: 8,
  },
  knobCenter: {
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
  },
});
