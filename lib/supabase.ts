// app/lib/supabase.ts
import { createClient } from '@supabase/supabase-js';
import { Platform } from 'react-native'; // 1. Importa Platform
import 'react-native-url-polyfill/auto';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Supabase URL o Anon Key no están definidas. Revisa tu .env'
  );
}

// 2. Declara la variable de storage
let storage: any = undefined;

// 3. Importación condicional
// Si la plataforma NO es web, importa la librería nativa
if (Platform.OS !== 'web') {
  const AsyncStorage =
    require('@react-native-async-storage/async-storage').default;
  storage = AsyncStorage;
}

// 4. Crea el cliente
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    // 5. Asigna el storage
    // En web, 'storage' será 'undefined' (usará localStorage por defecto)
    // En nativo, 'storage' será 'AsyncStorage'
    storage: storage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});