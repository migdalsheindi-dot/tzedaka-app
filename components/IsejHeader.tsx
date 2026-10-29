import { Image, Linking, Pressable, PressableStateCallbackType, StyleSheet, Text, View } from 'react-native';
import { colors, fonts, radius, spacing } from '../theme';
import { glass } from './Glass';
import { Container } from './layout';

const isejLogo = require('../assets/isej/logo.png');

/** Barra superior mínima: logo de ISEJ + nombre de la app. */
export function IsejHeader() {
  return (
    <Container style={styles.wrapper}>
      <View style={styles.brand}>
        <Image source={isejLogo} style={styles.logo} resizeMode="contain" />
        <Text style={styles.wordmark}>Tzedaká</Text>
      </View>
      <Pressable
        accessibilityRole="link"
        onPress={() => Linking.openURL('https://www.isej.com/')}
        style={({ hovered }: PressableStateCallbackType & { hovered?: boolean }) => [
          styles.link,
          hovered && styles.linkHover,
        ]}
      >
        <Text style={styles.linkText}>isej.com</Text>
      </Pressable>
    </Container>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md + 4,
  },
  brand: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  logo: {
    width: 40,
    height: 40,
    borderRadius: 11,
    backgroundColor: '#FFFFFF',
  },
  wordmark: {
    fontFamily: fonts.displayHeavy,
    fontSize: 22,
    color: colors.text,
    letterSpacing: -0.5,
  },
  link: {
    ...glass,
    minHeight: 40,
    paddingHorizontal: 16,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
  },
  linkHover: {
    borderColor: colors.hairlineStrong,
    backgroundColor: colors.surfaceStrong,
  },
  linkText: {
    fontFamily: fonts.bodySemibold,
    fontSize: 13,
    color: colors.textMuted,
  },
});
