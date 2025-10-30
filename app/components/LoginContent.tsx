/**
 * Componente LoginContent
 * Este componente maneja la interfaz y lógica del formulario de inicio de sesión.
 * Utiliza Supabase para la autenticación y el sistema de alertas personalizado
 * para mostrar mensajes de error.
 */

import { useState } from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useAlert } from '../../context/AlertContext';
import { supabase } from '../../lib/supabase';
import { formStyles as styles } from '../../styles/Form.styles';
import { theme } from '../../styles/theme';

/**
 * Props del componente LoginContent
 * @property onLoginSuccess - Función callback que se ejecuta cuando el login es exitoso
 */
interface LoginContentProps {
  onLoginSuccess: () => void;
}

export default function LoginContent({ onLoginSuccess }: LoginContentProps) {
  // Hook para mostrar alertas personalizadas en la aplicación
  const { showAlert } = useAlert();
  
  // Estados para manejar el formulario
  const [email, setEmail] = useState(''); // Estado para el campo de email
  const [password, setPassword] = useState(''); // Estado para el campo de contraseña
  const [loading, setLoading] = useState(false); // Estado para controlar la carga durante el proceso de login

  /**
   * Maneja el proceso de inicio de sesión
   * 1. Activa el estado de carga
   * 2. Intenta autenticar al usuario con Supabase
   * 3. Muestra error si falla, o ejecuta callback de éxito
   * 4. Desactiva el estado de carga al finalizar
   */
  const handleLogin = async () => {
    setLoading(true); // Activar indicador de carga

    // Intentar autenticación con Supabase
    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) {
      // Si hay error, mostrar alerta con el mensaje
      showAlert('Error de Login', error.message);
    } else {
      // Si es exitoso, ejecutar callback de éxito
      onLoginSuccess();
    }
    setLoading(false); // Desactivar indicador de carga
  };

  return (
    <View style={styles.container}>
      {/* Campo de entrada para el email */}
      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor={theme.colors.secondary}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address" // Teclado optimizado para emails
        autoCapitalize="none" // Evita capitalización automática
      />

      {/* Campo de entrada para la contraseña */}
      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        placeholderTextColor={theme.colors.secondary}
        value={password}
        onChangeText={setPassword}
        secureTextEntry // Oculta el texto de la contraseña
      />

      {/* Botón de inicio de sesión */}
      <TouchableOpacity
        style={[
          styles.button,
          loading && styles.buttonDisabled // Aplica estilo de deshabilitado durante la carga
        ]}
        onPress={handleLogin}
        disabled={loading} // Deshabilita el botón durante la carga
      >
        <Text style={styles.buttonText}>
          {loading ? 'Ingresando...' : 'Iniciar Sesión'} {/* Texto dinámico según el estado */}
        </Text>
      </TouchableOpacity>
    </View>
  );
}