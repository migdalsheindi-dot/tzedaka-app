import { Ionicons } from '@expo/vector-icons';
import { Linking, Pressable, PressableStateCallbackType, StyleSheet, Text, View } from 'react-native';
import { colors, fonts, radius, spacing } from '../theme';
import { glass } from './Glass';
import { Container, useIsWide } from './layout';

/** Reseña breve de ISEJ. */
export function AboutIsej() {
  const { isWide } = useIsWide();

  return (
    <Container style={styles.section}>
      <View style={[styles.card, isWide && styles.cardWide]}>
        <Text style={styles.eyebrow}>Sobre ISEJ</Text>
        <View style={[styles.body, isWide && { flex: 1 }]}>
          <Text style={styles.text}>
            ISEJ (Instituto Superior de Estudios Judaicos) es un movimiento juvenil judío de
            Argentina para jóvenes de 18 a 35 años: estudio, encuentros, cenas de Shabat y viajes
            grupales. Más de 6.000 jóvenes participaron desde 2006.
          </Text>
          <Pressable
            accessibilityRole="link"
            onPress={() => Linking.openURL('https://www.isej.com/qu%C3%A9-es-isej')}
            style={({ hovered }: PressableStateCallbackType & { hovered?: boolean }) => [
              styles.link,
              hovered && styles.linkHover,
            ]}
          >
            <Text style={styles.linkText}>Conocer más</Text>
            <Ionicons name="arrow-forward" size={15} color={colors.gold} />
          </Pressable>
        </View>
      </View>
    </Container>
  );
}

export function Footer() {
  return (
    <Container style={styles.footer}>
      <Text style={styles.footerText}>Tzedaká ISEJ</Text>
    </Container>
  );
}

const styles = StyleSheet.create({
  section: {
    paddingTop: spacing.xl,
  },
  card: {
    ...glass,
    borderRadius: radius.lg,
    padding: spacing.lg,
    gap: 14,
  },
  cardWide: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 56,
    paddingVertical: 36,
    paddingHorizontal: 44,
  },
  eyebrow: {
    fontFamily: fonts.bodySemibold,
    fontSize: 12,
    letterSpacing: 1.6,
    textTransform: 'uppercase',
    color: colors.gold,
    minWidth: 110,
    paddingTop: 4,
  },
  body: {
    gap: 16,
  },
  text: {
    fontFamily: fonts.body,
    fontSize: 17,
    lineHeight: 28,
    color: colors.textMuted,
  },
  link: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 8,
    minHeight: 44,
    cursor: 'pointer',
  },
  linkHover: {
    opacity: 0.8,
  },
  linkText: {
    fontFamily: fonts.bodySemibold,
    fontSize: 14,
    color: colors.gold,
  },
  footer: {
    paddingVertical: spacing.xl,
    alignItems: 'center',
  },
  footerText: {
    fontFamily: fonts.display,
    fontSize: 13,
    color: colors.textFaint,
  },
});
