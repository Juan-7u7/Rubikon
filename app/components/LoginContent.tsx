/**
 * Componente LoginContent
 * Este componente maneja la interfaz y lógica del formulario de inicio de sesión.
 * Utiliza Supabase para la autenticación y el sistema de alertas personalizado
 * para mostrar mensajes de error.
 */

// Importamos 'memo' de React para la optimización de renderizado.
// 'useState' se utiliza para manejar el estado local del formulario (email, password, loading).
import React, { memo, useState } from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
// Importamos el hook personalizado para mostrar alertas en la app.
import { useAlert } from '../../context/AlertContext';
// Importamos el cliente de Supabase configurado.
import { supabase } from '../../lib/supabase';
// Importamos los estilos compartidos para formularios.
import { formStyles as styles } from '../../styles/Form.styles';
// Importamos el tema para acceder a colores y espaciado.
import { theme } from '../../styles/theme';

/**
 * Props del componente LoginContent
 * @property onLoginSuccess - Función callback que se ejecuta cuando el login es exitoso.
 *                            Permite al componente padre cerrar el modal o navegar.
 */
interface LoginContentProps {
  onLoginSuccess: () => void;
}

// Envolvemos el componente con React.memo.
// Esto previene que se vuelva a renderizar si sus props (onLoginSuccess)
// no han cambiado. Aunque el componente tiene estado interno, esta optimización
// es útil si el componente padre se renderiza por razones que no afectan a LoginContent.
const LoginContent = memo(({ onLoginSuccess }: LoginContentProps) => {
  // Hook para mostrar alertas personalizadas en la aplicación
  const { showAlert } = useAlert();

  // Estados para manejar el formulario
  const [email, setEmail] = useState(''); // Estado para el campo de email
  const [password, setPassword] = useState(''); // Estado para el campo de contraseña
  const [loading, setLoading] = useState(false); // Estado para controlar la carga durante el proceso de login

  /**
   * Maneja el proceso de inicio de sesión
   * 1. Activa el estado de carga para dar feedback visual.
   * 2. Intenta autenticar al usuario con Supabase usando email y contraseña.
   * 3. Si hay error, muestra una alerta con el mensaje de error.
   * 4. Si es exitoso, ejecuta el callback onLoginSuccess.
   * 5. Finalmente, desactiva el estado de carga.
   */
  const handleLogin = async () => {
    setLoading(true); // Activar indicador de carga (spinner o texto)

    // Intentar autenticación con Supabase
    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) {
      // Si hay error, mostrar alerta con el mensaje devuelto por Supabase
      showAlert('Error de Login', error.message);
    } else {
      // Si es exitoso, ejecutar callback de éxito (ej. cerrar modal)
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
        keyboardType="email-address" // Teclado optimizado para emails (con @)
        autoCapitalize="none" // Evita capitalización automática (importante para emails)
      />

      {/* Campo de entrada para la contraseña */}
      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        placeholderTextColor={theme.colors.secondary}
        value={password}
        onChangeText={setPassword}
        secureTextEntry // Oculta el texto de la contraseña para seguridad
      />

      {/* Botón de inicio de sesión */}
      <TouchableOpacity
        style={[
          styles.button,
          loading && styles.buttonDisabled, // Aplica estilo de deshabilitado visualmente durante la carga
        ]}
        onPress={handleLogin}
        disabled={loading} // Deshabilita la interacción del botón durante la carga
      >
        <Text style={styles.buttonText}>
          {loading ? 'Ingresando...' : 'Iniciar Sesión'}{' '}
          {/* Texto dinámico según el estado de carga */}
        </Text>
      </TouchableOpacity>
    </View>
  );
});

export default LoginContent;