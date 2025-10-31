// app/components/CustomHeader.tsx
import { Feather } from '@expo/vector-icons';
// Importamos 'memo' de React para la optimización.
import React, { memo } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { useModal } from '../../context/ModalContext';
import { styles } from '../../styles/Header.styles';
import { theme } from '../../styles/theme';

interface CustomHeaderProps {
  title: string;
  leftIcon?: React.ComponentProps<typeof Feather>['name'];
  rightIcon?: React.ComponentProps<typeof Feather>['name'];
}

// Usamos 'memo' para evitar que el componente se vuelva a renderizar
// si sus props (title, leftIcon, rightIcon) no han cambiado.
// Esto es útil porque el Header podría estar en un layout que se
// renderiza frecuentemente por cambios en otras partes de la UI.
const CustomHeader = memo(
  ({
    title,
    leftIcon = 'settings',
    rightIcon = 'user',
  }: CustomHeaderProps) => {
    const { openModal } = useModal();

    return (
      <View style={styles.headerContainer}>
        <View style={styles.leftContainer}>
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
);

export default CustomHeader;