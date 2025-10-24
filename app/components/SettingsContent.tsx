// app/components/SettingsContent.tsx
import { Feather } from '@expo/vector-icons';
import React, { useState } from 'react';
// 1. Quita 'StyleSheet'
import { Switch, Text, TouchableOpacity, View } from 'react-native';
// 2. Importa tus estilos desde el nuevo archivo
import { styles } from '../../styles/SettingsContent.styles';
import { theme } from '../../styles/theme';

// --- Componente de Fila ---
interface SettingsRowProps {
  title: string;
  leftIcon: React.ComponentProps<typeof Feather>['name'];
  rightContent: React.ReactNode;
}

const SettingsRow: React.FC<SettingsRowProps> = ({
  title,
  leftIcon,
  rightContent,
}) => (
  <View style={styles.row}>
    <Feather
      name={leftIcon}
      size={22}
      color={theme.colors.secondary}
      style={styles.icon}
    />
    <Text style={styles.rowTitle}>{title}</Text>
    <View style={styles.rightContent}>{rightContent}</View>
  </View>
);
// ---

export default function SettingsContent() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  return (
    <View style={styles.container}>
      {/* --- Sección de Notificaciones --- */}
      <Text style={styles.sectionTitle}>Notificaciones</Text>
      <View style={styles.section}>
        <SettingsRow
          title="Permitir Notificaciones"
          leftIcon="bell"
          rightContent={
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ false: theme.colors.border, true: theme.colors.accent }}
              thumbColor={theme.colors.primary}
            />
          }
        />
      </View>

      {/* --- Sección de Apariencia --- */}
      <Text style={styles.sectionTitle}>Apariencia</Text>
      <View style={styles.section}>
        <SettingsRow
          title="Tema"
          leftIcon="moon"
          rightContent={
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={styles.rowValue}>Oscuro</Text>
              <Feather
                name="chevron-right"
                size={22}
                color={theme.colors.secondary}
              />
            </View>
          }
        />
      </View>

      {/* --- Sección "Acerca de" --- */}
      <Text style={styles.sectionTitle}>Acerca de</Text>
      <View style={styles.section}>
        <TouchableOpacity>
          <SettingsRow
            title="Política de Privacidad"
            leftIcon="shield"
            rightContent={
              <Feather
                name="chevron-right"
                size={22}
                color={theme.colors.secondary}
              />
            }
          />
        </TouchableOpacity>
        <TouchableOpacity>
          <SettingsRow
            title="Términos de Servicio"
            leftIcon="file-text"
            rightContent={
              <Feather
                name="chevron-right"
                size={22}
                color={theme.colors.secondary}
              />
            }
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

// 3. ELIMINA todo el bloque 'const styles = StyleSheet.create({...})' de aquí