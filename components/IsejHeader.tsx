import { Image, Linking, Pressable, PressableStateCallbackType, StyleSheet, Text, View } from 'react-native';
import { colors, fonts, radius, spacing } from '../theme';
import { Container, useIsWide } from './layout';

const isejLogo = require('../assets/isej/logo.png');

/** Barra superior de marca: logo de ISEJ + nombre de la app. */
export function IsejHeader() {
  const { isWide } = useIsWide();

  return (
    <Container style={styles.wrapper}>
      <View style={styles.brandRow}>
        <Image source={isejLogo} style={styles.logo} resizeMode="contain" />
        <View>
          <Text style={styles.title}>Tzedaká</Text>
          {isWide ? (
            <Text style={styles.subtitle}>Instituto Superior de Estudios Judaicos</Text>
          ) : null}
        </View>
      </View>
      <Pressable
        accessibilityRole="link"
        onPress={() => Linking.openURL('https://www.isej.com/')}
        style={({ hovered }: PressableStateCallbackType & { hovered?: boolean }) => [styles.link, hovered && styles.linkHover]}
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
    paddingVertical: spacing.md,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  logo: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: colors.card,
  },
  title: {
    fontFamily: fonts.extrabold,
    fontSize: 22,
    color: colors.ink,
    letterSpacing: -0.4,
  },
  subtitle: {
    fontFamily: fonts.medium,
    fontSize: 12,
    color: colors.muted,
    marginTop: 1,
  },
  link: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
  },
  linkHover: {
    borderColor: colors.navy600,
  },
  linkText: {
    fontFamily: fonts.semibold,
    fontSize: 13,
    color: colors.navy700,
  },
});
