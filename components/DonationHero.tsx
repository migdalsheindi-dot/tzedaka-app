import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown, FadeIn } from 'react-native-reanimated';
import { colors, fonts, radius, shadows, spacing } from '../theme';
import { formatARS } from '../utils/currency';
import { AmountButton } from './AmountButton';
import { JarStage } from './JarStage';
import { Container, useIsWide } from './layout';

type Props = {
  amounts: number[];
  coinCount: number;
  dropTrigger: number;
  pileIndex: number;
  disabled: boolean;
  onSelectAmount: (amount: number) => void;
  onSelectCustom: () => void;
  onDropComplete: () => void;
};

/** Sección principal: propuesta de valor + alcancía + montos de donación. */
export function DonationHero({
  amounts,
  coinCount,
  dropTrigger,
  pileIndex,
  disabled,
  onSelectAmount,
  onSelectCustom,
  onDropComplete,
}: Props) {
  const { width, isWide } = useIsWide();
  const jarSize = isWide ? 300 : Math.min(width * 0.5, 220);

  const copy = (
    <Animated.View entering={FadeInDown.duration(600)} style={isWide ? styles.copyWide : styles.copy}>
      <View style={styles.chip}>
        <View style={styles.chipDot} />
        <Text style={styles.chipText}>Tzedaká diaria</Text>
      </View>
      <Text style={[styles.title, isWide && styles.titleWide]}>
        Sumá tu impacto en la comunidad
      </Text>
      <Text style={[styles.subtitle, !isWide && { textAlign: 'center' }]}>
        {isWide
          ? 'De forma simple y en cualquier momento. Elegí un monto, dejá tu moneda en la Tzedaká y completá el aporte en segundos con Mercado Pago.'
          : 'De forma simple y en cualquier momento. Elegí un monto y completalo en segundos.'}
      </Text>
    </Animated.View>
  );

  const jar = (
    <Animated.View entering={FadeIn.duration(800).delay(150)} style={styles.jarWrap}>
      <JarStage
        jarSize={jarSize}
        coinCount={coinCount}
        dropTrigger={dropTrigger}
        pileIndex={pileIndex}
        onDropComplete={onDropComplete}
      />
    </Animated.View>
  );

  const picker = (
    <Animated.View entering={FadeInDown.duration(600).delay(250)} style={styles.picker}>
      <Text style={styles.pickerLabel}>Elegí cuánto querés aportar</Text>
      <View style={styles.grid}>
        {amounts.map((amount) => (
          <AmountButton
            key={amount}
            label={formatARS(amount)}
            onPress={() => onSelectAmount(amount)}
            disabled={disabled}
          />
        ))}
        <AmountButton label="Otro monto" variant="custom" onPress={onSelectCustom} disabled={disabled} />
      </View>
      <View style={styles.secure}>
        <Ionicons name="lock-closed" size={14} color={colors.onDarkMuted} />
        <Text style={styles.secureText}>Pago seguro, procesado por Mercado Pago</Text>
      </View>
    </Animated.View>
  );

  return (
    <Container style={{ paddingTop: spacing.sm }}>
      <LinearGradient
        colors={[colors.navy700, colors.navy800, colors.navy900]}
        start={{ x: 0.1, y: 0 }}
        end={{ x: 0.9, y: 1 }}
        style={[styles.hero, isWide ? styles.heroWide : styles.heroNarrow]}
      >
        {isWide ? (
          <>
            <View style={styles.leftCol}>
              {copy}
              {picker}
            </View>
            <View style={styles.rightCol}>{jar}</View>
          </>
        ) : (
          <>
            {copy}
            {jar}
            {picker}
          </>
        )}
      </LinearGradient>
    </Container>
  );
}

const styles = StyleSheet.create({
  hero: {
    borderRadius: radius.xl,
    overflow: 'hidden',
    boxShadow: shadows.raised,
  },
  heroNarrow: {
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.md,
    gap: spacing.md,
  },
  heroWide: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 56,
    paddingHorizontal: 56,
    gap: 48,
  },
  leftCol: {
    flex: 1.15,
    gap: spacing.lg,
  },
  rightCol: {
    flex: 0.85,
    alignItems: 'center',
    justifyContent: 'center',
  },
  copy: {
    alignItems: 'center',
    gap: 12,
  },
  copyWide: {
    alignItems: 'flex-start',
    gap: 14,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: radius.pill,
    backgroundColor: colors.glass,
    borderWidth: 1,
    borderColor: colors.glassBorder,
  },
  chipDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.gold,
  },
  chipText: {
    fontFamily: fonts.semibold,
    fontSize: 12,
    letterSpacing: 0.6,
    color: colors.onDark,
    textTransform: 'uppercase',
  },
  title: {
    fontFamily: fonts.extrabold,
    fontSize: 30,
    lineHeight: 36,
    letterSpacing: -0.8,
    color: colors.onDark,
    textAlign: 'center',
  },
  titleWide: {
    fontSize: 46,
    lineHeight: 52,
    textAlign: 'left',
    letterSpacing: -1.4,
  },
  subtitle: {
    fontFamily: fonts.regular,
    fontSize: 16,
    lineHeight: 25,
    color: colors.onDarkMuted,
    maxWidth: 520,
  },
  jarWrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  picker: {
    gap: 14,
  },
  pickerLabel: {
    fontFamily: fonts.semibold,
    fontSize: 13,
    letterSpacing: 0.4,
    textTransform: 'uppercase',
    color: colors.onDarkMuted,
    textAlign: 'center',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  secure: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  secureText: {
    fontFamily: fonts.medium,
    fontSize: 13,
    color: colors.onDarkMuted,
  },
});
