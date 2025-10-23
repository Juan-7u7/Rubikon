// app/components/ReusableModal.tsx
import { Feather } from '@expo/vector-icons';
import React from 'react';
import { Modal, Pressable, Text, TouchableOpacity, View } from 'react-native';
import { styles } from '../styles/Modal.styles';
import { theme } from '../styles/theme';

// --- ¡AQUÍ ESTABA EL PROBLEMA! ---
// Debes definir las propiedades que el componente espera recibir.
interface ReusableModalProps {
  visible: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode; 
}

export default function ReusableModal({
  visible,
  onClose,
  title,
  children,
}: ReusableModalProps) {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <Pressable style={styles.modalBackdrop} onPress={onClose}>
        <Pressable style={styles.modalContainer} onPress={(e) => e.stopPropagation()}>
          
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{title}</Text>
            <TouchableOpacity onPress={onClose}>
              <Feather 
                name="x" 
                size={theme.iconSizes.medium} 
                color={theme.colors.primary} 
              />
            </TouchableOpacity>
          </View>

          <View style={styles.modalContent}>
            {children}
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}