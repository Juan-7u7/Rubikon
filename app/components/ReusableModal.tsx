// app/components/ReusableModal.tsx
import { Feather } from '@expo/vector-icons';
// Importamos 'memo' de React para la optimización.
import React, { memo } from 'react';
import { Modal, Pressable, Text, TouchableOpacity, View } from 'react-native';
import { styles } from '../../styles/Modal.styles';
import { theme } from '../../styles/theme';

interface ReusableModalProps {
  visible: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

// Envolvemos el componente con React.memo.
// Esto es especialmente importante para un modal, ya que evita que se
// vuelva a renderizar innecesariamente cuando está oculto (visible={false})
// o cuando los componentes padres se actualizan por razones no relacionadas.
const ReusableModal = memo(({ visible, onClose, title, children }: ReusableModalProps) => {
  // Si el modal no es visible, no renderizamos nada.
  // Esto es una optimización adicional para no ocupar recursos.
  if (!visible) {
    return null;
  }

  return (
    <Modal animationType="fade" transparent={true} visible={visible} onRequestClose={onClose}>
      <Pressable style={styles.modalBackdrop} onPress={onClose}>
        <Pressable style={styles.modalContainer} onPress={(e) => e.stopPropagation()}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{title}</Text>
            <TouchableOpacity onPress={onClose}>
              <Feather name="x" size={theme.iconSizes.medium} color={theme.colors.primary} />
            </TouchableOpacity>
          </View>

          <View style={styles.modalContent}>{children}</View>
        </Pressable>
      </Pressable>
    </Modal>
  );
});

export default ReusableModal;
