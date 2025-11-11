// babel.config.js
module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      // Esta línea es OBLIGATORIA para que 'drei' y las animaciones 3D funcionen
      'react-native-reanimated/plugin', 
    ],
  };
};