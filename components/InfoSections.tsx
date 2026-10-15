import { Ionicons } from '@expo/vector-icons';
import { Image, Linking, Pressable, PressableStateCallbackType, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { colors, fonts, radius, shadows, spacing } from '../theme';
import { Container, SectionHeader, useIsWide } from './layout';

type IconName = keyof typeof Ionicons.glyphMap;

const STEPS: { icon: IconName; title: string; text: string }[] = [
  {
    icon: 'cash-outline',
    title: 'Elegí un monto',
    text: 'Tocá uno de los montos rápidos, o "Otro monto" para aportar la cantidad que quieras.',
  },
  {
    icon: 'card-outline',
    title: 'Pagá con Mercado Pago',
    text: 'Te llevamos directo al checkout, sin registros ni pasos intermedios.',
  },
  {
    icon: 'sparkles-outline',
    title: 'Mirá tu impacto',
    text: 'Tu moneda queda en la Tzedaká y tu aporte se suma en la pestaña Mi Impacto.',
  },
];

/** Tres pasos simples: reduce la fricción explicando el recorrido completo. */
export function HowItWorks() {
  const { isWide } = useIsWide();
  return (
    <Container style={styles.section}>
      <SectionHeader
        eyebrow="Cómo funciona"
        title="Donar toma menos de un minuto"
        subtitle="Sin formularios largos ni cuentas nuevas: elegís, pagás y listo."
      />
      <View style={[styles.row, isWide && styles.rowWide]}>
        {STEPS.map((step, i) => (
          <Animated.View
            key={step.title}
            entering={FadeInUp.duration(500).delay(i * 100)}
            style={[styles.stepCard, isWide && { flex: 1 }]}
          >
            <View style={styles.stepIcon}>
              <Ionicons name={step.icon} size={22} color={colors.navy700} />
            </View>
            <Text style={styles.stepNumber}>Paso {i + 1}</Text>
            <Text style={styles.stepTitle}>{step.title}</Text>
            <Text style={styles.stepText}>{step.text}</Text>
          </Animated.View>
        ))}
      </View>
    </Container>
  );
}

const STATS = [
  { value: '2006', label: 'desde que empezó el programa' },
  { value: '+6.000', label: 'jóvenes participaron' },
  { value: '18–35', label: 'años, la edad de la comunidad' },
];

/** Información de la causa: quién es ISEJ y qué hace. */
export function AboutIsej() {
  const { isWide } = useIsWide();
  return (
    <Container style={styles.section}>
      <View style={[styles.aboutCard, isWide && styles.aboutCardWide]}>
        <View style={[styles.aboutBody, isWide && { flex: 1.1 }]}>
          <Text style={styles.aboutEyebrow}>Sobre ISEJ</Text>
          <Text style={[styles.aboutTitle, isWide && { fontSize: 30, lineHeight: 36 }]}>
            Un espacio para que los jóvenes judíos crezcan en comunidad
          </Text>
          <Text style={styles.aboutText}>
            ISEJ (Instituto Superior de Estudios Judaicos) es un movimiento juvenil judío de
            Argentina. Combina el estudio de fuentes judías con actividades sociales, talleres,
            cenas de Shabat y viajes grupales a Nueva York, Israel y Europa del Este.
          </Text>

          <View style={styles.statsRow}>
            {STATS.map((stat) => (
              <View key={stat.value} style={styles.stat}>
                <Text style={styles.statValue}>{stat.value}</Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
              </View>
            ))}
          </View>

          <Pressable
            accessibilityRole="link"
            onPress={() => Linking.openURL('https://www.isej.com/qu%C3%A9-es-isej')}
            style={({ hovered }: PressableStateCallbackType & { hovered?: boolean }) => [styles.cta, hovered && styles.ctaHover]}
          >
            <Text style={styles.ctaText}>Conocer más sobre ISEJ</Text>
            <Ionicons name="arrow-forward" size={16} color={colors.navy700} />
          </Pressable>
        </View>

        <View style={isWide ? styles.aboutImageWide : styles.aboutImage}>
          <Image
            source={require('../assets/isej/gallery-miami.jpg')}
            style={StyleSheet.absoluteFill}
            resizeMode="cover"
            accessibilityLabel="Jóvenes de ISEJ en el retreat de Miami"
          />
        </View>
      </View>
    </Container>
  );
}

const TRUST: { icon: IconName; title: string; text: string }[] = [
  {
    icon: 'shield-checkmark-outline',
    title: 'Pago seguro',
    text: 'El pago lo procesa Mercado Pago; la app nunca ve tus datos de tarjeta.',
  },
  {
    icon: 'phone-portrait-outline',
    title: 'Tu historial es tuyo',
    text: 'Tus aportes se guardan solo en este dispositivo, sin cuentas ni registros.',
  },
  {
    icon: 'heart-outline',
    title: 'Cada aporte suma',
    text: 'Ningún aporte es demasiado chico: cada moneda cuenta para la comunidad.',
  },
];

/** Señales de confianza y transparencia. */
export function TrustStrip() {
  const { isWide } = useIsWide();
  return (
    <Container style={styles.section}>
      <View style={[styles.trustRow, isWide && styles.rowWide]}>
        {TRUST.map((item) => (
          <View key={item.title} style={[styles.trustItem, isWide && { flex: 1 }]}>
            <View style={styles.trustIcon}>
              <Ionicons name={item.icon} size={22} color={colors.green} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.trustTitle}>{item.title}</Text>
              <Text style={styles.trustText}>{item.text}</Text>
            </View>
          </View>
        ))}
      </View>
    </Container>
  );
}

export function Footer() {
  return (
    <Container style={styles.footer}>
      <Text style={styles.footerText}>Tzedaká ISEJ · Hecho con cariño para la comunidad</Text>
    </Container>
  );
}

const styles = StyleSheet.create({
  section: {
    paddingTop: spacing.xl + 8,
  },
  row: {
    gap: spacing.md,
  },
  rowWide: {
    flexDirection: 'row',
  },
  stepCard: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    boxShadow: shadows.card,
  },
  stepIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: colors.goldSoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  stepNumber: {
    fontFamily: fonts.bold,
    fontSize: 11,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    color: colors.red,
    marginBottom: 4,
  },
  stepTitle: {
    fontFamily: fonts.bold,
    fontSize: 18,
    color: colors.ink,
    marginBottom: 6,
  },
  stepText: {
    fontFamily: fonts.regular,
    fontSize: 15,
    lineHeight: 22,
    color: colors.body,
  },
  aboutCard: {
    backgroundColor: colors.card,
    borderRadius: radius.xl,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
    boxShadow: shadows.card,
  },
  aboutCardWide: {
    flexDirection: 'row',
  },
  aboutBody: {
    padding: spacing.lg,
    gap: 14,
  },
  aboutEyebrow: {
    fontFamily: fonts.bold,
    fontSize: 12,
    letterSpacing: 1.4,
    textTransform: 'uppercase',
    color: colors.red,
  },
  aboutTitle: {
    fontFamily: fonts.extrabold,
    fontSize: 24,
    lineHeight: 30,
    letterSpacing: -0.5,
    color: colors.ink,
  },
  aboutText: {
    fontFamily: fonts.regular,
    fontSize: 16,
    lineHeight: 25,
    color: colors.body,
  },
  statsRow: {
    flexDirection: 'row',
    gap: spacing.md,
    paddingVertical: 6,
  },
  stat: {
    flex: 1,
  },
  statValue: {
    fontFamily: fonts.extrabold,
    fontSize: 28,
    letterSpacing: -0.6,
    color: colors.navy700,
  },
  statLabel: {
    fontFamily: fonts.medium,
    fontSize: 13,
    lineHeight: 18,
    color: colors.muted,
    marginTop: 2,
  },
  cta: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: radius.pill,
    backgroundColor: colors.goldSoft,
    borderWidth: 1,
    borderColor: 'transparent',
    cursor: 'pointer',
  },
  ctaHover: {
    borderColor: colors.gold,
  },
  ctaText: {
    fontFamily: fonts.bold,
    fontSize: 14,
    color: colors.navy700,
  },
  aboutImage: {
    height: 220,
  },
  aboutImageWide: {
    flex: 0.9,
    minHeight: 380,
    overflow: 'hidden',
  },
  trustRow: {
    gap: spacing.md,
  },
  trustItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 14,
    backgroundColor: colors.greenSoft,
    borderRadius: radius.lg,
    padding: spacing.md,
  },
  trustIcon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: colors.card,
    alignItems: 'center',
    justifyContent: 'center',
  },
  trustTitle: {
    fontFamily: fonts.bold,
    fontSize: 15,
    color: colors.ink,
    marginBottom: 2,
  },
  trustText: {
    fontFamily: fonts.regular,
    fontSize: 14,
    lineHeight: 20,
    color: colors.body,
  },
  footer: {
    paddingVertical: spacing.xl,
    alignItems: 'center',
  },
  footerText: {
    fontFamily: fonts.medium,
    fontSize: 13,
    color: colors.muted,
  },
});
