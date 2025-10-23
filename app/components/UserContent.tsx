// app/components/UserContent.tsx
import { Feather } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { theme } from '../../styles/theme';

// 1. Definimos las props que el componente necesita
interface UserContentProps {
  isLoggedIn: boolean;
  onLoginPress: () => void;
  onRegisterPress: () => void;
  onLogoutPress: () => void;
  // (Puedes añadir más props para "Editar Perfil" etc. luego)
}

export default function UserContent({
  isLoggedIn,
  onLoginPress,
  onRegisterPress,
  onLogoutPress,
}: UserContentProps) {

  // ---------------------------------------------
  // VISTA PARA INVITADO
  // ---------------------------------------------
  const GuestView = () => (
    <View>
      {/* Cabecera de Invitado */}
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

      {/* Acciones de Invitado */}
      <View style={styles.guestActionsContainer}>
        <TouchableOpacity
          style={[styles.guestButton, styles.primaryButton]}
          onPress={onLoginPress}
        >
          <Feather
            name="log-in"
            size={theme.iconSizes.medium}
            color={theme.colors.primary} // Texto blanco
            style={styles.actionIcon}
          />
          <Text style={[styles.guestButtonText, styles.primaryButtonText]}>
            Iniciar Sesión
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.guestButton, styles.secondaryButton]}
          onPress={onRegisterPress}
        >
          <Feather
            name="plus-circle"
            size={theme.iconSizes.medium}
            color={theme.colors.primary} // Texto blanco
            style={styles.actionIcon}
          />
          <Text style={[styles.guestButtonText, styles.secondaryButtonText]}>
            Registrarse
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  // ---------------------------------------------
  // VISTA PARA USUARIO LOGUEADO
  // ---------------------------------------------
  const UserView = () => (
    <View>
      {/* Cabecera de Perfil (la que ya tenías) */}
      <View style={styles.profileHeader}>
        <View style={styles.avatarContainer}>
          <Feather
            name="user"
            size={theme.iconSizes.large}
            color={theme.colors.primary}
          />
        </View>
        <View style={styles.userInfo}>
          <Text style={styles.userName}>Nombre de Usuario</Text>
          <Text style={styles.userEmail}>usuario@email.com</Text>
        </View>
      </View>

      {/* Lista de Acciones (la que ya tenías) */}
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
        
        {/* ... (otras acciones como "Cuenta y Seguridad") ... */}

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

  // ---------------------------------------------
  // RENDERIZADO CONDICIONAL
  // ---------------------------------------------
  return (
    <View style={styles.container}>
      {isLoggedIn ? <UserView /> : <GuestView />}
    </View>
  );
}

// 4. Estilos actualizados (con estilos de "Invitado" añadidos)
const styles = StyleSheet.create({
  container: {
    paddingBottom: theme.spacing.s,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  avatarContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: theme.colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userInfo: {
    marginLeft: theme.spacing.l,
  },
  userName: {
    fontFamily: theme.fonts.main,
    fontSize: theme.fontSizes.title,
    color: theme.colors.primary,
    marginBottom: theme.spacing.s / 2,
  },
  userEmail: {
    fontSize: theme.fontSizes.bodySmall,
    color: theme.colors.secondary,
  },
  
  // --- Estilos de Usuario Logueado ---
  actionsContainer: {
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing.l,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  actionIcon: {
    marginRight: theme.spacing.m,
  },
  actionText: {
    fontSize: theme.fontSizes.body,
    color: theme.colors.primary,
  },
  dangerText: {
    color: theme.colors.danger,
  },

  // --- NUEVOS Estilos de Invitado ---
  guestActionsContainer: {
    gap: theme.spacing.m, // Espacio entre los botones
  },
  guestButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.m,
    borderRadius: theme.borderRadius.medium,
  },
  guestButtonText: {
    fontSize: theme.fontSizes.body,
    fontWeight: 'bold',
  },
  primaryButton: {
    backgroundColor: theme.colors.accent, // Botón azul
  },
  primaryButtonText: {
    color: theme.colors.primary, // Texto blanco
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: theme.colors.primary, // Borde blanco
  },
  secondaryButtonText: {
    color: theme.colors.primary, // Texto blanco
  },
});