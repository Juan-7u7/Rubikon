// app/components/UserContent.tsx
import { Feather } from '@expo/vector-icons';
import React, { memo, useState } from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import { useModal } from '../../context/ModalContext';
import { supabase } from '../../lib/supabase';
import { styles } from '../../styles/UserContent.styles';
import { theme } from '../../styles/theme';
import EditProfileModal from './EditProfileModal';

// --- CONSTANTES Y TIPOS ---

// El mapa de avatares se mantiene fuera de los componentes para no recrearlo en cada render.
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
  // Callback para notificar al componente padre que el perfil se ha actualizado.
  // Esto es clave para la escalabilidad, ya que el padre puede decidir cómo
  // y cuándo refrescar los datos de la UI.
  onProfileUpdate?: (newUsername: string, newAvatarId: number) => void;
}

// --- COMPONENTES DE VISTA ---

// `memo` evita que este componente se vuelva a renderizar si sus props no cambian.
// Es una optimización importante para componentes puramente visuales.
/**
 * Componente GuestView
 * Muestra la vista para usuarios no autenticados (invitados).
 * Ofrece las opciones para iniciar sesión o registrarse, actuando como punto de entrada al flujo de autenticación.
 */
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
        {/* Botón para abrir el modal de Login */}
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
        
        {/* Botón para abrir el modal de Registro */}
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

// `memo` también optimiza esta vista. Solo se re-renderizará si los datos del usuario cambian.
const UserView = memo(
  ({
    username,
    email,
    avatar_id,
    onLogoutPress,
    onEditPress,
  }: Omit<UserContentProps, 'isLoggedIn' | 'onProfileUpdate'> & { onEditPress: () => void }) => {
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
          <TouchableOpacity style={styles.actionButton} onPress={onEditPress}>
            <Feather
              name="edit-3"
              size={theme.iconSizes.medium}
              color={theme.colors.primary}
              style={styles.actionIcon}
            />
            <Text style={styles.actionText}>Editar</Text>
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

// --- COMPONENTE PRINCIPAL ---

// Este es el componente "contenedor" o "inteligente".
// Gestiona el estado (como la visibilidad del modal) y la lógica (guardar perfil),
// pero delega la presentación a los componentes de vista más simples.
const UserContent = memo(
  ({
    isLoggedIn,
    username,
    email,
    avatar_id,
    onLogoutPress,
    onProfileUpdate,
  }: UserContentProps) => {
    const [isEditProfileModalVisible, setEditProfileModalVisible] =
      useState(false);

    // La lógica de guardado se mantiene aquí, pero ahora notifica al padre.
    const handleSaveProfile = async (
      newUsername: string,
      newAvatarId: number
    ) => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('No user logged in');

        const { error } = await supabase
          .from('profiles')
          .update({ username: newUsername, avatar_id: newAvatarId })
          .eq('id', user.id);

        if (error) throw error;

        // Notificamos al componente padre que los datos han cambiado.
        onProfileUpdate?.(newUsername, newAvatarId);

        // Cerramos el modal después de un guardado exitoso.
        setEditProfileModalVisible(false);

      } catch (error) {
        console.error('Error updating profile:', error);
        // Aquí podrías mostrar una alerta al usuario.
      }
    };

    return (
      <View style={styles.container}>
        {isLoggedIn ? (
          <UserView
            username={username}
            email={email}
            avatar_id={avatar_id}
            onLogoutPress={onLogoutPress}
            onEditPress={() => setEditProfileModalVisible(true)}
          />
        ) : (
          <GuestView />
        )}

        {/* El modal se renderiza aquí, pero solo es visible cuando el estado cambia. */}
        <EditProfileModal
          visible={isEditProfileModalVisible}
          onClose={() => setEditProfileModalVisible(false)}
          username={username || ''}
          avatarId={avatar_id || 1}
          onSave={handleSaveProfile}
        />
      </View>
    );
  }
);

export default UserContent;