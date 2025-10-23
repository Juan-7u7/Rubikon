// app/components/UserContent.tsx
import { Feather } from '@expo/vector-icons';
import React from 'react';
// 1. Quita 'StyleSheet' de react-native
import { Text, TouchableOpacity, View } from 'react-native';
// 2. Importa los hooks y estilos nuevos
import { useModal } from '../../context/ModalContext';
import { styles } from '../../styles/UserContent.styles'; // <-- IMPORTA LOS ESTILOS
import { theme } from '../../styles/theme';

interface UserContentProps {
  isLoggedIn: boolean;
  username?: string;
  email?: string;
  onLogoutPress: () => void;
}

export default function UserContent({
  isLoggedIn,
  username,
  email,
  onLogoutPress,
}: UserContentProps) {
  const { openModal } = useModal();

  // --- VISTA PARA INVITADO ---
  const GuestView = () => (
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

  // --- VISTA PARA USUARIO LOGUEADO ---
  const UserView = () => (
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

  return (
    <View style={styles.container}>
      {isLoggedIn ? <UserView /> : <GuestView />}
    </View>
  );
}

// 3. ELIMINA TODO EL BLOQUE 'const styles = StyleSheet.create({...})' DE AQUÍ