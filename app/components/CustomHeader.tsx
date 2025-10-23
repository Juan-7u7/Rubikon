// app/components/CustomHeader.tsx
import { Feather } from '@expo/vector-icons';
import React from 'react';
import { Alert, Text, TouchableOpacity, View } from 'react-native';
import { styles } from '../styles/Header.styles';
import { theme } from '../styles/theme';

// --- ¡AQUÍ ESTABA EL PROBLEMA! ---
// Debes definir las propiedades que el componente espera recibir.
interface CustomHeaderProps {
  title: string;
  leftIcon?: React.ComponentProps<typeof Feather>['name'];
  onPressLeft?: () => void;
  rightIcon?: React.ComponentProps<typeof Feather>['name'];
  onPressRight?: () => void;
}

export default function CustomHeader({
  title,
  leftIcon = 'settings',
  onPressLeft = () => Alert.alert('Ajustes presionado'),
  rightIcon = 'user',
  onPressRight = () => Alert.alert('Usuario presionado'),
}: CustomHeaderProps) {

  return (
    <View style={styles.headerContainer}>
      {/* Columna Izquierda */}
      <View style={styles.leftContainer}>
        <TouchableOpacity style={styles.iconButton} onPress={onPressLeft}>
          <Feather 
            name={leftIcon} 
            size={theme.iconSizes.medium} 
            color={theme.colors.primary} 
          />
        </TouchableOpacity>
      </View>

      {/* Columna Central */}
      <View style={styles.titleContainer}>
        <Text style={styles.title}>{title}</Text>
      </View>

      {/* Columna Derecha */}
      <View style={styles.rightContainer}>
        <TouchableOpacity style={styles.iconButton} onPress={onPressRight}>
          <Feather 
            name={rightIcon} 
            size={theme.iconSizes.medium} 
            color={theme.colors.primary} 
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}