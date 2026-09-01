import { Image, StyleSheet, Text, View } from 'react-native';

const isejLogo = require('../assets/isej/logo.png');

export function IsejHeader() {
  return (
    <View style={styles.container}>
      <View style={styles.brandRow}>
        <Image source={isejLogo} style={styles.logo} resizeMode="contain" />
        <Text style={styles.title}>Tzedaká</Text>
      </View>
      <Text style={styles.tagline}>
        Sumá tu impacto en la comunidad,{'\n'}de forma simple y en cualquier momento
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  logo: {
    width: 34,
    height: 34,
    borderRadius: 8,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: '#16213E',
  },
  tagline: {
    fontSize: 13,
    color: '#6B7690',
    textAlign: 'center',
    marginTop: 4,
    lineHeight: 18,
  },
});
