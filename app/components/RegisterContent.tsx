// app/components/RegisterContent.tsx

/**
 * Componente RegisterContent
 * Este componente maneja el formulario de registro de nuevos usuarios.
 * Incluye la selección de un avatar predefinido y la creación de la cuenta en Supabase.
 */

// Importamos 'memo' de React para optimización y 'useState' para el manejo del estado local.
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
// Importamos el contexto de alertas para mostrar mensajes al usuario.
import { useAlert } from '../../context/AlertContext';
// Importamos el cliente de Supabase.
import { supabase } from '../../lib/supabase';
// Importamos estilos compartidos y el tema.
import { formStyles } from '../../styles/Form.styles';
import { theme } from '../../styles/theme';

// --- 👇 AQUÍ ESTÁ LA CORRECCIÓN 👇 ---
// Mapa de avatares disponibles.
// Le decimos a TypeScript que 'avatarMap' puede ser indexado por un 'number'.
const avatarMap: { [key: number]: any } = {
  1: require('../../assets/images/avatars/avatar1.png'),
  2: require('../../assets/images/avatars/avatar2.png'),
  3: require('../../assets/images/avatars/avatar3.png'),
  4: require('../../assets/images/avatars/avatar4.png'),
};
// --- 👆 FIN DE LA CORRECCIÓN 👆 ---

const avatars = [1, 2, 3, 4]; // Array de IDs para iterar y renderizar los avatares.

/**
 * Props del componente RegisterContent
 * @property onRegisterSuccess - Callback ejecutado tras un registro exitoso.
 */
interface RegisterContentProps {
  onRegisterSuccess: () => void;
}

// Envolvemos el componente con React.memo para optimizar.
// Al igual que con LoginContent, esto evita re-renders innecesarios cuando
// el componente padre se actualiza pero las props de RegisterContent no cambian.
const RegisterContent = memo(({ onRegisterSuccess }: RegisterContentProps) => {
  const { showAlert } = useAlert();
  
  // Estados para los campos del formulario
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState(1); // Avatar seleccionado por defecto (ID 1)
  const [loading, setLoading] = useState(false); // Estado de carga

  /**
   * Maneja el proceso de registro
   * 1. Valida que todos los campos estén completos.
   * 2. Llama a Supabase para crear el usuario.
   * 3. Guarda metadatos adicionales (username, avatar_id) en la cuenta del usuario.
   * 4. Muestra alertas de éxito o error.
   */
  const handleRegister = async () => {
    // Validación básica de campos vacíos
    if (!email || !password || !username) {
      showAlert('Error', 'Por favor, completa todos los campos.');
      return;
    }
    setLoading(true); // Iniciar carga

    // Crear usuario en Supabase
    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: password,
      options: {
        // Datos adicionales que se guardarán en la tabla de perfiles (si está configurada)
        // o en los metadatos del usuario.
        data: {
          username: username.toLowerCase(), // Guardamos el username en minúsculas
          avatar_id: selectedAvatar,
        },
      },
    });

    if (error) {
      // Mostrar error si falla el registro
      showAlert('Error en el Registro', error.message);
    } else {
      // Mostrar éxito y ejecutar callback
      showAlert(
        '¡Revisa tu correo!',
        'Te hemos enviado un enlace de confirmación para activar tu cuenta.'
      );
      onRegisterSuccess();
    }
    setLoading(false); // Finalizar carga
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
              selectedAvatar === avatarId && styles.avatarSelected, // Estilo condicional si está seleccionado
            ]}
          >
            {/* Renderiza la imagen del avatar desde el mapa */}
            <Image source={avatarMap[avatarId]} style={styles.avatarImage} />
          </Pressable>
        ))}
      </View>

      {/* Campo para el nombre de usuario */}
      <TextInput
        style={formStyles.input}
        placeholder="Nombre de jugador (username)"
        value={username}
        onChangeText={setUsername}
        placeholderTextColor={theme.colors.secondary}
        autoCapitalize="none"
      />
      
      {/* Campo para el email */}
      <TextInput
        style={formStyles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        placeholderTextColor={theme.colors.secondary}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      
      {/* Campo para la contraseña */}
      <TextInput
        style={formStyles.input}
        placeholder="Contraseña"
        value={password}
        onChangeText={setPassword}
        placeholderTextColor={theme.colors.secondary}
        secureTextEntry // Oculta la contraseña
      />
      
      {/* Botón de registro */}
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