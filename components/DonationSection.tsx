import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, fonts, radius, spacing } from '../theme';
import { formatARS } from '../utils/currency';
import { AmountButton } from './AmountButton';
import { glass, GlassCard } from './Glass';
import { JarStage } from './JarStage';
import { Container, useIsWide } from './layout';
import { Reveal } from './Reveal';

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
    <View style={styles.copy}>
      <Reveal delay={0}>
        <View style={styles.badge}>
        <View style={styles.badgeDot} />
        <Text style={styles.badgeText}>Tzedaká · ISEJ</Text>
        </View>
      </Reveal>
      <Reveal delay={90}>
        <Text style={[styles.title, isWide && styles.titleWide]}>
          Sumá tu <Text style={styles.titleGold}>impacto</Text>
          {'\n'}en la comunidad
        </Text>
      </Reveal>
      <Reveal delay={180}>
        <Text style={styles.subtitle}>
          Una forma simple de aportar, en cualquier momento. Elegí un monto y completalo en
          segundos.
        </Text>
      </Reveal>
    </View>
  );

  const stage = (
    <Reveal delay={150} distance={60} style={isWide ? styles.stageWide : undefined}>
      <GlassCard
        radius={radius.xl}
        style={isWide ? { flex: 1 } : undefined}
        innerStyle={[styles.stage, isWide && styles.stageWideInner]}
      >
        <JarStage
          jarSize={jarSize}
          coinCount={coinCount}
          dropTrigger={dropTrigger}
          pileIndex={pileIndex}
          onDropComplete={onDropComplete}
        />
      </GlassCard>
    </Reveal>
  );

  const picker = (
    <View style={styles.picker}>
      <Reveal delay={240}>
        <Text style={styles.pickerLabel}>Elegí un monto</Text>
      </Reveal>
      <View style={styles.grid} onLayout={(e) => setGridWidth(e.nativeEvent.layout.width)}>
        {amounts.map((amount, i) => (
          <Reveal
            key={amount}
            delay={300 + i * 70}
            distance={36}
            style={columnWidth ? { width: columnWidth } : { flexGrow: 1, flexBasis: '30%' }}
          >
            <AmountButton
              label={formatARS(amount)}
              onPress={() => onSelectAmount(amount)}
              disabled={disabled}
            />
          </Reveal>
        ))}
        <Reveal delay={300 + amounts.length * 70} distance={36} style={{ flexBasis: '100%' }}>
          <AmountButton label="Otro monto" variant="custom" onPress={onSelectCustom} disabled={disabled} />
        </Reveal>
      </View>
      <View style={styles.secure}>
        <Ionicons name="lock-closed" size={13} color={colors.textFaint} />
        <Text style={styles.secureText}>Pago seguro con Mercado Pago</Text>
      </View>
    </View>
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
    gap: 48,
    paddingVertical: spacing.lg,
  },
  leftCol: {
    flex: 1.45,
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
    fontSize: 46,
    lineHeight: 48,
    letterSpacing: -2.2,
    color: colors.text,
  },
  titleWide: {
    fontSize: 56,
    lineHeight: 58,
    letterSpacing: -2.6,
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
    paddingVertical: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stageWide: {
    flex: 0.8,
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
