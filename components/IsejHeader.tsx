import { Image, Linking, Pressable, PressableStateCallbackType, StyleSheet, Text, View } from 'react-native';
import { colors, fonts, spacing } from '../theme';
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
    borderRadius: 10,
    backgroundColor: colors.card,
  },
  wordmark: {
    fontFamily: fonts.serifBold,
    fontSize: 24,
    color: colors.ink,
    letterSpacing: -0.4,
  },
  link: {
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: 'transparent',
    cursor: 'pointer',
  },
  linkHover: {
    borderBottomColor: colors.gold,
  },
  linkText: {
    fontFamily: fonts.semibold,
    fontSize: 14,
    color: colors.body,
  },
});
