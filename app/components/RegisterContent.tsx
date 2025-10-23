// app/components/RegisterContent.tsx
import { useState } from 'react';
// 1. Quita 'Alert' de 'react-native'
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
// 2. Importa el hook de alertas
import { useAlert } from '../../context/AlertContext';
import { supabase } from '../../lib/supabase';
import { formStyles as styles } from '../../styles/Form.styles';
import { theme } from '../../styles/theme';

// app/components/RegisterContent.tsx
// import { useState } from 'react';
// import { Text, TextInput, TouchableOpacity, View } from 'react-native';
// import { useAlert } from '../context/AlertContext';
// import { supabase } from '../lib/supabase';
// import { formStyles as styles } from '../styles/Form.styles';
// import { theme } from '../styles/theme';

interface RegisterContentProps {
  onRegisterSuccess: () => void;
}

export default function RegisterContent({
  onRegisterSuccess,
}: RegisterContentProps) {
  const { showAlert } = useAlert();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // 1. Añade el estado para el username
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    // 2. Valida el username también
    if (!email || !password || !username) {
      showAlert('Error', 'Por favor, completa todos los campos.');
      return;
    }
    setLoading(true);

    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: password,
      // 3. ¡LA CLAVE ESTÁ AQUÍ!
      // Pasamos el username en el campo 'options.data'
      // El "Trigger" en la BD se encargará del resto.
      options: {
        data: {
          username: username.toLowerCase(), // Guardamos en minúsculas
        },
      },
    });

    if (error) {
      // Esto ahora también te avisará si el 'username' ya existe
      // gracias a la restricción 'UNIQUE' de la tabla 'profiles'
      showAlert('Error en el Registro', error.message);
    } else {
      showAlert('¡Éxito!', 'Tu cuenta ha sido creada.');
      onRegisterSuccess();
    }
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      {/* 4. Añade el nuevo campo de texto */}
      <TextInput
        style={styles.input}
        placeholder="Nombre de jugador (username)"
        placeholderTextColor={theme.colors.secondary}
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
      />
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