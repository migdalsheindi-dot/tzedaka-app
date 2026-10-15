import { Ionicons } from '@expo/vector-icons';
import { Linking, Pressable, PressableStateCallbackType, StyleSheet, Text, View } from 'react-native';
import { colors, fonts, radius, shadows, spacing } from '../theme';
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
            <Ionicons name="arrow-forward" size={15} color={colors.goldDeep} />
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
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    gap: 14,
    boxShadow: shadows.card,
  },
  cardWide: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 56,
    paddingVertical: 36,
    paddingHorizontal: 44,
  },
  eyebrow: {
    fontFamily: fonts.semibold,
    fontSize: 12,
    letterSpacing: 1.8,
    textTransform: 'uppercase',
    color: colors.goldDeep,
    minWidth: 110,
    paddingTop: 4,
  },
  body: {
    gap: 16,
  },
  text: {
    fontFamily: fonts.regular,
    fontSize: 17,
    lineHeight: 28,
    color: colors.body,
  },
  link: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 8,
    paddingBottom: 3,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    cursor: 'pointer',
  },
  linkHover: {
    borderBottomColor: colors.gold,
  },
  linkText: {
    fontFamily: fonts.semibold,
    fontSize: 14,
    color: colors.goldDeep,
  },
  footer: {
    paddingVertical: spacing.xl,
    alignItems: 'center',
  },
  footerText: {
    fontFamily: fonts.serif,
    fontSize: 14,
    color: colors.muted,
  },
});
