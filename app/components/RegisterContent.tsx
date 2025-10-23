// app/components/RegisterContent.tsx
import { useState } from 'react';
// 1. Quita 'Alert' de 'react-native'
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
// 2. Importa el hook de alertas
import { useAlert } from '../../context/AlertContext';
import { supabase } from '../../lib/supabase';
import { formStyles as styles } from '../../styles/Form.styles';
import { theme } from '../../styles/theme';

interface RegisterContentProps {
  onRegisterSuccess: () => void;
}

export default function RegisterContent({
  onRegisterSuccess,
}: RegisterContentProps) {
  // 3. Usa el hook
  const { showAlert } = useAlert();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!email || !password) {
      // 4. Reemplaza Alert.alert()
      showAlert('Error', 'Por favor, completa todos los campos.');
      return;
    }
    setLoading(true);

    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: password,
    });

    if (error) {
      // 4. Reemplaza Alert.alert()
      showAlert('Error en el Registro', error.message);
    } else {
      // 4. Reemplaza Alert.alert()
      showAlert('¡Éxito!', 'Tu cuenta ha sido creada.');
      onRegisterSuccess();
    }
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor={theme.colors.secondary}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        placeholderTextColor={theme.colors.secondary}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TouchableOpacity
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={handleRegister}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? 'Creando cuenta...' : 'Crear Cuenta'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}