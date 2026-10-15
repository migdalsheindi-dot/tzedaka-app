import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, Text, View } from 'react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
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

/** Sección principal: título, alcancía y montos de donación. */
export function DonationSection({
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
  const jarSize = isWide ? 270 : Math.min(width * 0.5, 210);

  const copy = (
    <Animated.View entering={FadeInDown.duration(600)} style={styles.copy}>
      <View style={styles.eyebrowRow}>
        <View style={styles.eyebrowLine} />
        <Text style={styles.eyebrow}>Tzedaká · ISEJ</Text>
      </View>
      <Text style={[styles.title, isWide && styles.titleWide]}>
        Sumá tu impacto{'\n'}en la comunidad
      </Text>
      <Text style={styles.subtitle}>
        Una forma simple de aportar, en cualquier momento. Elegí un monto y completalo en
        segundos.
      </Text>
    </Animated.View>
  );

  const stage = (
    <Animated.View entering={FadeIn.duration(800).delay(150)} style={isWide ? styles.stageWide : undefined}>
      <LinearGradient
        colors={[colors.midnight2, colors.midnight]}
        start={{ x: 0.2, y: 0 }}
        end={{ x: 0.8, y: 1 }}
        style={[styles.stage, isWide && styles.stageWideInner]}
      >
        <JarStage
          jarSize={jarSize}
          coinCount={coinCount}
          dropTrigger={dropTrigger}
          pileIndex={pileIndex}
          onDropComplete={onDropComplete}
        />
      </LinearGradient>
    </Animated.View>
  );

  const picker = (
    <Animated.View entering={FadeInDown.duration(600).delay(250)} style={styles.picker}>
      <Text style={styles.pickerLabel}>Elegí un monto</Text>
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
        <Ionicons name="lock-closed" size={13} color={colors.muted} />
        <Text style={styles.secureText}>Pago seguro con Mercado Pago</Text>
      </View>
    </Animated.View>
  );

  return (
    <Container style={{ paddingTop: spacing.sm }}>
      {isWide ? (
        <View style={styles.wideRow}>
          <View style={styles.leftCol}>
            {copy}
            {picker}
          </View>
          {stage}
        </View>
      ) : (
        <View style={styles.narrow}>
          {copy}
          {stage}
          {picker}
        </View>
      )}
    </Container>
  );
}

const styles = StyleSheet.create({
  wideRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 64,
    paddingVertical: spacing.lg,
  },
  leftCol: {
    flex: 1,
    gap: 36,
  },
  narrow: {
    gap: spacing.lg,
  },
  copy: {
    gap: 14,
  },
  eyebrowRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  eyebrowLine: {
    width: 28,
    height: 2,
    backgroundColor: colors.gold,
  },
  eyebrow: {
    fontFamily: fonts.semibold,
    fontSize: 12,
    letterSpacing: 1.8,
    textTransform: 'uppercase',
    color: colors.goldDeep,
  },
  title: {
    fontFamily: fonts.serifBold,
    fontSize: 38,
    lineHeight: 42,
    letterSpacing: -1,
    color: colors.ink,
  },
  titleWide: {
    fontSize: 58,
    lineHeight: 62,
    letterSpacing: -1.8,
  },
  subtitle: {
    fontFamily: fonts.regular,
    fontSize: 17,
    lineHeight: 26,
    color: colors.body,
    maxWidth: 460,
  },
  stage: {
    borderRadius: radius.xl,
    paddingVertical: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    boxShadow: shadows.raised,
  },
  stageWide: {
    flex: 1,
  },
  stageWideInner: {
    minHeight: 500,
  },
  picker: {
    gap: 14,
  },
  pickerLabel: {
    fontFamily: fonts.semibold,
    fontSize: 12,
    letterSpacing: 1.6,
    textTransform: 'uppercase',
    color: colors.muted,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  secure: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  secureText: {
    fontFamily: fonts.medium,
    fontSize: 13,
    color: colors.muted,
  },
});
