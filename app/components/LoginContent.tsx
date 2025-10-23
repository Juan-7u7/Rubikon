// app/components/LoginContent.tsx
import { useState } from 'react';
// 1. Quita 'Alert' de 'react-native'
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
// 2. Importa el hook de alertas
import { useAlert } from '../../context/AlertContext';
import { supabase } from '../../lib/supabase';
import { formStyles as styles } from '../../styles/Form.styles';
import { theme } from '../../styles/theme';

interface LoginContentProps {
  onLoginSuccess: () => void;
}

export default function LoginContent({ onLoginSuccess }: LoginContentProps) {
  // 3. Usa el hook
  const { showAlert } = useAlert();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) {
      // 4. Reemplaza Alert.alert()
      showAlert('Error de Login', error.message);
    } else {
      onLoginSuccess();
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
        onPress={handleLogin}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? 'Ingresando...' : 'Iniciar Sesión'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}