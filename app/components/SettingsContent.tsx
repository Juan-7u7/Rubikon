// app/components/SettingsContent.tsx
import { Feather } from '@expo/vector-icons';
// Importamos 'memo' de React para la optimización.
import React, { memo, useState } from 'react';
import { Switch, Text, TouchableOpacity, View } from 'react-native';
import { styles } from '../../styles/SettingsContent.styles';
import { theme } from '../../styles/theme';

// --- Componente de Fila ---
interface SettingsRowProps {
  title: string;
  leftIcon: React.ComponentProps<typeof Feather>['name'];
  rightContent: React.ReactNode;
}

// Optimizamos el componente de fila con React.memo.
// Esto es muy efectivo porque cada fila solo se volverá a renderizar si sus
// props específicas (title, leftIcon, rightContent) cambian.
const SettingsRow: React.FC<SettingsRowProps> = memo(({ title, leftIcon, rightContent }) => (
  <View style={styles.row}>
    <Feather name={leftIcon} size={22} color={theme.colors.secondary} style={styles.icon} />
    <Text style={styles.rowTitle}>{title}</Text>
    <View style={styles.rightContent}>{rightContent}</View>
  </View>
));
// ---

// Aunque SettingsContent tiene su propio estado, lo envolvemos en React.memo.
// Esto lo protege de re-renders innecesarios si su componente padre se
// actualiza por razones que no le conciernen.
const SettingsContent = memo(() => {
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
              trackColor={{
                false: theme.colors.border,
                true: theme.colors.accent,
              }}
              thumbColor={theme.colors.primary}
            />
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
            rightContent={<Feather name="chevron-right" size={22} color={theme.colors.secondary} />}
          />
        </TouchableOpacity>
        <TouchableOpacity>
          <SettingsRow
            title="Términos de Servicio"
            leftIcon="file-text"
            rightContent={<Feather name="chevron-right" size={22} color={theme.colors.secondary} />}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
});

export default SettingsContent;
