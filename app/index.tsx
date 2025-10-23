import { StyleSheet, Text, View } from 'react-native';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>RUBIKON</Text>
      <Text style={styles.subtitle}>Esto usa la fuente Honk</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000000', // (Heredado de _layout, pero es bueno tenerlo)
  },
  title: {
    fontFamily: 'Honk', // <-- ¡AQUÍ LA USAS!
    fontSize: 60,
    color: '#FFFFFF',
  },
  subtitle: {
    fontFamily: 'Honk',
    fontSize: 30,
    color: '#AAAAAA',
  },
});