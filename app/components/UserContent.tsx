// app/components/UserContent.tsx
import { Feather } from '@expo/vector-icons';
// Importamos 'memo' de React para la optimización.
import React, { memo } from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import { useModal } from '../../context/ModalContext';
import { styles } from '../../styles/UserContent.styles';
import { theme } from '../../styles/theme';

const avatarMap: { [key: number]: any } = {
  1: require('../../assets/images/avatars/avatar1.png'),
  2: require('../../assets/images/avatars/avatar2.png'),
  3: require('../../assets/images/avatars/avatar3.png'),
  4: require('../../assets/images/avatars/avatar4.png'),
};

interface UserContentProps {
  isLoggedIn: boolean;
  username?: string;
  email?: string;
  avatar_id?: number;
  onLogoutPress: () => void;
}

// --- VISTA PARA INVITADO ---
// Se convierte en un componente memorizado. No se volverá a renderizar
// a menos que sus props (en este caso, ninguna) cambien.
const GuestView = memo(() => {
  const { openModal } = useModal();
  return (
    <View>
      <View style={styles.profileHeader}>
        <View style={styles.avatarContainer}>
          <Feather
            name="user"
            size={theme.iconSizes.large}
            color={theme.colors.primary}
          />
        </View>
        <View style={styles.userInfo}>
          <Text style={styles.userName}>Invitado</Text>
          <Text style={styles.userEmail}>Inicia sesión para ver tu perfil</Text>
        </View>
      </View>
      <View style={styles.guestActionsContainer}>
        <TouchableOpacity
          style={[styles.guestButton, styles.primaryButton]}
          onPress={() => openModal('login')}
        >
          <Feather
            name="log-in"
            size={theme.iconSizes.medium}
            color={theme.colors.primary}
            style={styles.actionIcon}
          />
          <Text style={[styles.guestButtonText, styles.primaryButtonText]}>
            Iniciar Sesión
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.guestButton, styles.secondaryButton]}
          onPress={() => openModal('register')}
        >
          <Feather
            name="plus-circle"
            size={theme.iconSizes.medium}
            color={theme.colors.primary}
            style={styles.actionIcon}
          />
          <Text style={[styles.guestButtonText, styles.secondaryButtonText]}>
            Registrarse
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
});

// --- VISTA PARA USUARIO LOGUEADO ---
// También se memoriza. Solo se renderizará de nuevo si 'username', 'email',
// 'avatar_id' o 'onLogoutPress' cambian.
const UserView = memo(
  ({ username, email, avatar_id, onLogoutPress }: Omit<UserContentProps, 'isLoggedIn'>) => {
    const avatarSource = avatar_id ? avatarMap[avatar_id] : avatarMap[1];

    return (
      <View>
        <View style={styles.profileHeader}>
          <Image source={avatarSource} style={styles.avatarImage} />
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{username || 'Cargando...'}</Text>
            <Text style={styles.userEmail}>{email || '...'}</Text>
          </View>
        </View>

        <View style={styles.actionsContainer}>
          <TouchableOpacity style={styles.actionButton}>
            <Feather
              name="edit-3"
              size={theme.iconSizes.medium}
              color={theme.colors.primary}
              style={styles.actionIcon}
            />
            <Text style={styles.actionText}>Editar Perfil</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={onLogoutPress}>
            <Feather
              name="log-out"
              size={theme.iconSizes.medium}
              color={theme.colors.danger}
              style={styles.actionIcon}
            />
            <Text style={[styles.actionText, styles.dangerText]}>
              Cerrar Sesión
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
);

// El componente principal también se memoriza. Decide qué vista mostrar
// pero no se renderizará de nuevo si las props no cambian.
const UserContent = memo(
  ({
    isLoggedIn,
    username,
    email,
    avatar_id,
    onLogoutPress,
  }: UserContentProps) => {
    return (
      <View style={styles.container}>
        {isLoggedIn ? (
          <UserView
            username={username}
            email={email}
            avatar_id={avatar_id}
            onLogoutPress={onLogoutPress}
          />
        ) : (
          <GuestView />
        )}
      </View>
    );
  }
);

export default UserContent;