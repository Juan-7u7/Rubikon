// app/components/CustomHeader.tsx
import { Feather } from '@expo/vector-icons';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
// 1. Importamos el hook
import { useModal } from '../../context/ModalContext';
import { styles } from '../../styles/Header.styles';
import { theme } from '../../styles/theme';

// 2. Limpiamos la interfaz. Ya no necesita props 'onPress'
interface CustomHeaderProps {
  title: string;
  leftIcon?: React.ComponentProps<typeof Feather>['name'];
  rightIcon?: React.ComponentProps<typeof Feather>['name'];
}

export default function CustomHeader({
  title,
  leftIcon = 'settings',
  rightIcon = 'user',
}: CustomHeaderProps) {
  // 3. Usamos el hook
  const { openModal } = useModal();

  return (
    <View style={styles.headerContainer}>
      <View style={styles.leftContainer}>
        {/* 4. Llamamos a openModal directamente */}
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => openModal('settings')}
        >
          <Feather
            name={leftIcon}
            size={theme.iconSizes.medium}
            color={theme.colors.primary}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.titleContainer}>
        <Text style={styles.title}>{title}</Text>
      </View>

      <View style={styles.rightContainer}>
        {/* 4. Llamamos a openModal directamente */}
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => openModal('user')}
        >
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