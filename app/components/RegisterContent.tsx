// app/components/RegisterContent.tsx
// Importamos 'memo' de React para la optimización.
import React, { memo, useState } from 'react';
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useAlert } from '../../context/AlertContext';
import { supabase } from '../../lib/supabase';
import { formStyles } from '../../styles/Form.styles';
import { theme } from '../../styles/theme';

// --- 👇 AQUÍ ESTÁ LA CORRECCIÓN 👇 ---
// Le decimos a TypeScript que 'avatarMap' puede ser indexado por un 'number'
const avatarMap: { [key: number]: any } = {
  1: require('../../assets/images/avatars/avatar1.png'),
  2: require('../../assets/images/avatars/avatar2.png'),
  3: require('../../assets/images/avatars/avatar3.png'),
  4: require('../../assets/images/avatars/avatar4.png'),
};
// --- 👆 FIN DE LA CORRECCIÓN 👆 ---

const avatars = [1, 2, 3, 4]; // Para el .map

interface RegisterContentProps {
  onRegisterSuccess: () => void;
}

// Envolvemos el componente con React.memo para optimizar.
// Al igual que con LoginContent, esto evita re-renders innecesarios cuando
// el componente padre se actualiza pero las props de RegisterContent no cambian.
const RegisterContent = memo(({ onRegisterSuccess }: RegisterContentProps) => {
  const { showAlert } = useAlert();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState(1);
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!email || !password || !username) {
      showAlert('Error', 'Por favor, completa todos los campos.');
      return;
    }
    setLoading(true);

    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: password,
      options: {
        data: {
          username: username.toLowerCase(),
          avatar_id: selectedAvatar,
        },
      },
    });

    if (error) {
      showAlert('Error en el Registro', error.message);
    } else {
      showAlert(
        '¡Revisa tu correo!',
        'Te hemos enviado un enlace de confirmación para activar tu cuenta.'
      );
      onRegisterSuccess();
    }
    setLoading(false);
  };

  return (
    <View style={formStyles.container}>
      {/* Selector de Avatar */}
      <View style={styles.avatarSelector}>
        {avatars.map((avatarId) => (
          <Pressable
            key={avatarId}
            onPress={() => setSelectedAvatar(avatarId)}
            style={[
              styles.avatarPressable,
              selectedAvatar === avatarId && styles.avatarSelected,
            ]}
          >
            {/* Ahora TypeScript entiende esto: */}
            <Image source={avatarMap[avatarId]} style={styles.avatarImage} />
          </Pressable>
        ))}
      </View>

      <TextInput
        style={formStyles.input}
        placeholder="Nombre de jugador (username)"
        value={username}
        onChangeText={setUsername}
        placeholderTextColor={theme.colors.secondary}
        autoCapitalize="none"
      />
      <TextInput
        style={formStyles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        placeholderTextColor={theme.colors.secondary}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={formStyles.input}
        placeholder="Contraseña"
        value={password}
        onChangeText={setPassword}
        placeholderTextColor={theme.colors.secondary}
        secureTextEntry
      />
      <TouchableOpacity
        style={[formStyles.button, loading && formStyles.buttonDisabled]}
        onPress={handleRegister}
        disabled={loading}
      >
        <Text style={formStyles.buttonText}>
          {loading ? 'Creando cuenta...' : 'Crear Cuenta'}
        </Text>
      </TouchableOpacity>
    </View>
  );
});

export default RegisterContent;

// Estilos locales SOLO para el selector de avatares
const styles = StyleSheet.create({
  avatarSelector: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: theme.spacing.m,
  },
  avatarPressable: {
    padding: 4,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  avatarSelected: {
    borderColor: theme.colors.accent,
  },
  avatarImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: theme.colors.border,
  },
});