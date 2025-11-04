
// app/components/EditProfileModal.tsx
import { Feather } from '@expo/vector-icons';
import React, { useEffect, useRef, useState } from 'react';
import {
    Animated,
    Image,
    Modal,
    Pressable,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity
} from 'react-native';
import { styles } from '../../styles/EditProfileModal.styles';
import { theme } from '../../styles/theme';

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
  avatarId: number;
  onSave: (newUsername: string, newAvatarId: number) => void;
}

const EditProfileModal = ({
  visible,
  onClose,
  username,
  avatarId,
  onSave,
}: EditProfileModalProps) => {
  const [newUsername, setNewUsername] = useState(username);
  const [newAvatarId, setNewAvatarId] = useState(avatarId);
  const scaleAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      setNewUsername(username);
      setNewAvatarId(avatarId);
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 6, // Un poco más de rebote
        useNativeDriver: true,
      }).start();
    } else {
      scaleAnim.setValue(0);
    }
  }, [visible, username, avatarId, scaleAnim]);

  const handleSave = () => {
    onSave(newUsername, newAvatarId);
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
            <ScrollView contentContainerStyle={styles.contentContainer}>
              <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                <Feather
                  name="x-circle"
                  size={theme.iconSizes.large} // Icono más grande
                  color={theme.colors.secondary}
                />
              </TouchableOpacity>

              <Text style={styles.title}>Editar Perfil</Text>

              <Text style={styles.sectionLabel}>Avatar actual</Text>
              <Image
                source={avatarMap[newAvatarId]}
                style={styles.avatar}
              />

              <Text style={styles.sectionLabel}>Escoge tu nuevo avatar</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.avatarScrollView}
              >
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
                          styles.avatarPreview,
                          newAvatarId === id && styles.selectedAvatar,
                        ]}
                      />
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>

              <Text style={styles.sectionLabel}>Nombre de usuario</Text>
              <TextInput
                style={styles.usernameInput}
                value={newUsername}
                onChangeText={setNewUsername}
                placeholder="Ingresa tu nombre de usuario"
                placeholderTextColor={theme.colors.secondary}
              />

              <TouchableOpacity
                style={styles.saveButton}
                onPress={handleSave}
              >
                <Text style={styles.saveButtonText}>Guardar</Text>
              </TouchableOpacity>
            </ScrollView>
          </Animated.View>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

export default EditProfileModal;
