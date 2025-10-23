// app/components/CustomHeader.tsx
import { Feather } from '@expo/vector-icons';
import React from 'react';
// 1. Volvemos a importar TouchableOpacity y Alert
import { Text, TouchableOpacity, View } from 'react-native';
import { styles } from '../../styles/Header.styles';
import { theme } from '../../styles/theme';

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
  // 2. Usamos las funciones onPress que se conectarán al layout
  onPressLeft,
  rightIcon = 'user',
  onPressRight,
}: CustomHeaderProps) {
  return (
    <View style={styles.headerContainer}>
      {/* Columna Izquierda */}
      <View style={styles.leftContainer}>
        {/* 3. Revertimos a TouchableOpacity */}
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
        {/* 3. Revertimos a TouchableOpacity */}
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