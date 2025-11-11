// index.js (en la raíz de tu proyecto)

import { decode } from 'base-64';
import { TextDecoder } from 'text-encoding';

// --- El Arreglo Explícito ---
// Forzamos la existencia de 'atob' (Base64)
if (typeof global.atob === 'undefined') {
  console.log('Polyfill: Aplicando global.atob');
  global.atob = decode;
}

// Forzamos la existencia de 'TextDecoder' (el otro polyfill necesario)
if (typeof global.TextDecoder === 'undefined') {
  console.log('Polyfill: Aplicando global.TextDecoder');
  global.TextDecoder = TextDecoder;
}
// --- Fin del Arreglo ---

// Ahora, carga el resto de tu app
import 'expo-router/entry';
