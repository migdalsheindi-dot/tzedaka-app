import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { colors, fonts, radius, spacing } from '../theme';
import { formatARS } from '../utils/currency';
import { AmountButton } from './AmountButton';
import { glass } from './Glass';
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
  const [gridWidth, setGridWidth] = useState(0);
  const GAP = 12;
  const columnWidth = gridWidth > 0 ? Math.floor((gridWidth - GAP * 2) / 3) : undefined;

  const copy = (
    <Animated.View entering={FadeInDown.duration(600)} style={styles.copy}>
      <View style={styles.badge}>
        <View style={styles.badgeDot} />
        <Text style={styles.badgeText}>Tzedaká · ISEJ</Text>
      </View>
      <Text style={[styles.title, isWide && styles.titleWide]}>
        Sumá tu <Text style={styles.titleGold}>impacto</Text>
        {'\n'}en la comunidad
      </Text>
      <Text style={styles.subtitle}>
        Una forma simple de aportar, en cualquier momento. Elegí un monto y completalo en
        segundos.
      </Text>
    </Animated.View>
  );

  const stage = (
    <Animated.View entering={FadeIn.duration(800).delay(150)} style={isWide ? styles.stageWide : undefined}>
      <View style={[styles.stage, isWide && styles.stageWideInner]}>
        <JarStage
          jarSize={jarSize}
          coinCount={coinCount}
          dropTrigger={dropTrigger}
          pileIndex={pileIndex}
          onDropComplete={onDropComplete}
        />
      </View>
    </Animated.View>
  );

  const picker = (
    <Animated.View entering={FadeInDown.duration(600).delay(250)} style={styles.picker}>
      <Text style={styles.pickerLabel}>Elegí un monto</Text>
      <View style={styles.grid} onLayout={(e) => setGridWidth(e.nativeEvent.layout.width)}>
        {amounts.map((amount) => (
          <AmountButton
            key={amount}
            label={formatARS(amount)}
            onPress={() => onSelectAmount(amount)}
            disabled={disabled}
            width={columnWidth}
          />
        ))}
        <AmountButton label="Otro monto" variant="custom" onPress={onSelectCustom} disabled={disabled} />
      </View>
      <View style={styles.secure}>
        <Ionicons name="lock-closed" size={13} color={colors.textFaint} />
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
    gap: 16,
  },
  badge: {
    ...glass,
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 8,
    paddingVertical: 7,
    paddingHorizontal: 14,
    borderRadius: radius.pill,
  },
  badgeDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: colors.gold,
    boxShadow: '0px 0px 10px rgba(232, 199, 122, 0.9)',
  },
  badgeText: {
    fontFamily: fonts.bodySemibold,
    fontSize: 12,
    letterSpacing: 1.4,
    textTransform: 'uppercase',
    color: colors.textMuted,
  },
  title: {
    fontFamily: fonts.displayHeavy,
    fontSize: 38,
    lineHeight: 42,
    letterSpacing: -1.4,
    color: colors.text,
  },
  titleWide: {
    fontSize: 60,
    lineHeight: 64,
    letterSpacing: -2.4,
  },
  titleGold: {
    color: colors.gold,
  },
  subtitle: {
    fontFamily: fonts.body,
    fontSize: 17,
    lineHeight: 26,
    color: colors.textMuted,
    maxWidth: 460,
  },
  stage: {
    ...glass,
    borderRadius: radius.xl,
    paddingVertical: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
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
    fontFamily: fonts.bodySemibold,
    fontSize: 12,
    letterSpacing: 1.6,
    textTransform: 'uppercase',
    color: colors.textFaint,
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
    fontFamily: fonts.bodyMedium,
    fontSize: 13,
    color: colors.textFaint,
  },
});
