
// app/components/EditProfileModal.tsx
import { Feather } from '@expo/vector-icons';
import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Image,
  Modal,
  Pressable,
  ScrollView, // <-- 1. Importar ScrollView
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { styles } from '../../styles/EditProfileModal.styles';
import { theme } from '../../styles/theme';

// Importamos el mapa de avatares para poder iterarlo
const avatarMap: { [key: number]: any } = {
  1: require('../../assets/images/avatars/avatar1.png'),
  2: require('../../assets/images/avatars/avatar2.png'),
  3: require('../../assets/images/avatars/avatar3.png'),
  4: require('../../assets/images/avatars/avatar4.png'),
};

interface EditProfileModalProps {
  visible: boolean;
  onClose: () => void;
  username: string;
  avatarId: number; // <-- 2. Cambiado de avatarUrl a avatarId
  onSave: (newUsername: string, newAvatarId: number) => void; // <-- 2.
}

const EditProfileModal = ({
  visible,
  onClose,
  username,
  avatarId,
  onSave,
}: EditProfileModalProps) => {
  const [newUsername, setNewUsername] = useState(username);
  const [newAvatarId, setNewAvatarId] = useState(avatarId); // <-- 3. Estado para el ID
  const scaleAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      setNewUsername(username);
      setNewAvatarId(avatarId); // <-- 4. Actualizar el ID del avatar
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 5,
        useNativeDriver: true,
      }).start();
    } else {
      scaleAnim.setValue(0);
    }
  }, [visible, username, avatarId, scaleAnim]);

  const handleSave = () => {
    onSave(newUsername, newAvatarId); // <-- 5. Guardar el ID
    onClose();
  };

  if (!visible) {
    return null;
  }

  return (
    <Modal
      animationType="none"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <Pressable style={styles.modalBackdrop} onPress={onClose}>
        <Pressable style={{ width: '90%' }} onPress={(e) => e.stopPropagation()}>
          <Animated.View
            style={[
              styles.modalContainer,
              { transform: [{ scale: scaleAnim }] },
            ]}
          >
            <ScrollView style={{ width: '100%' }}>
              <View style={{ alignItems: 'center', width: '100%' }}>
                <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                  <Feather
                    name="x"
                    size={theme.iconSizes.medium}
                    color={theme.colors.primary}
                  />
                </TouchableOpacity>

                <View style={styles.avatarContainer}>
                  <Image
                    source={avatarMap[newAvatarId]} // Usar el ID para mostrar el avatar
                    style={styles.avatar}
                  />
                </View>

                {/* --- 6. Grid de Avatares --- */}
                <View style={styles.avatarGrid}>
                  {Object.keys(avatarMap).map((key) => {
                    const id = Number(key);
                    return (
                      <TouchableOpacity
                        key={id}
                        style={styles.avatarOption}
                        onPress={() => setNewAvatarId(id)}
                      >
                        <Image
                          source={avatarMap[id]}
                          style={[
                            styles.avatar,
                            { width: 60, height: 60, borderRadius: 30 }, // Tamaño más pequeño
                            newAvatarId === id && styles.selectedAvatar, // Estilo si está seleccionado
                          ]}
                        />
                      </TouchableOpacity>
                    );
                  })}
                </View>

                <TextInput
                  style={styles.usernameInput}
                  value={newUsername}
                  onChangeText={setNewUsername}
                  placeholder="Nombre de usuario"
                />

                <TouchableOpacity
                  style={styles.saveButton}
                  onPress={handleSave}
                >
                  <Text style={styles.saveButtonText}>Guardar</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </Animated.View>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

export default EditProfileModal;
