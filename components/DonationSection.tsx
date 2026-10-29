import { Ionicons } from '@expo/vector-icons';
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
  withEffects?: boolean;
  tapProfile?: 'ios' | 'android' | null;
};

// Alturas aproximadas (px) de los bloques fijos, para que la alcancía se
// ajuste al alto de la pantalla y todos los montos queden a la vista.
const HEADER_H = 80;
const TITLE_BLOCK_H = 100;
const PICKER_H = 232;
const GAPS_H = 40;
/** Alto de la alcancía por unidad de `jarSize` (frasco + halo + sombra). */
const JAR_STAGE_RATIO = 1.55;

/** Sección principal: título centrado arriba, alcancía y montos, todo a la vista. */
export function DonationSection({
  amounts,
  coinCount,
  dropTrigger,
  pileIndex,
  disabled,
  onSelectAmount,
  onSelectCustom,
  onDropComplete,
  withEffects,
  tapProfile,
}: Props) {
  const { height, isWide } = useIsWide();

  let stageHeight: number;
  if (isWide) {
    stageHeight = Math.max(380, Math.min(560, height - HEADER_H - TITLE_BLOCK_H - 48));
  } else {
    stageHeight = Math.max(210, Math.min(500, height - HEADER_H - TITLE_BLOCK_H - PICKER_H - GAPS_H - 20));
  }
  const jarSize = Math.min(isWide ? 340 : 270, Math.max(110, (stageHeight - 30) / JAR_STAGE_RATIO));

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
          {isWide ? ' ' : '\n'}en la comunidad
        </Text>
      </Reveal>
      <Reveal delay={170}>
        <Text style={styles.subtitle}>Elegí un monto y completalo en segundos.</Text>
      </Reveal>
    </View>
  );

  const stage = (
    <Reveal delay={150} distance={50} style={isWide ? styles.stageWide : undefined}>
      <GlassCard
        radius={radius.xl}
        style={isWide ? { flex: 1 } : undefined}
        innerStyle={[styles.stage, { height: stageHeight }]}
      >
        <JarStage
          jarSize={jarSize}
          coinCount={coinCount}
          dropTrigger={dropTrigger}
          pileIndex={pileIndex}
          onDropComplete={onDropComplete}
          withEffects={withEffects}
          tapProfile={tapProfile}
        />
      </GlassCard>
    </Reveal>
  );

  const picker = (
    <View style={styles.picker}>
      <Reveal delay={220}>
        <Text style={styles.pickerLabel}>Elegí un monto</Text>
      </Reveal>
      <View style={styles.grid}>
        {amounts.map((amount, i) => (
          <Reveal
            key={amount}
            delay={280 + i * 60}
            distance={32}
            style={styles.cell}
          >
            <AmountButton
              label={formatARS(amount)}
              onPress={() => onSelectAmount(amount)}
              disabled={disabled}
            />
          </Reveal>
        ))}
        <Reveal delay={280 + amounts.length * 60} distance={32} style={styles.cellFull}>
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
    <Container style={{ paddingTop: 0 }}>
      {copy}
      {isWide ? (
        <View style={styles.wideRow}>
          <View style={styles.leftCol}>{picker}</View>
          {stage}
        </View>
      ) : (
        <View style={styles.narrow}>
          {stage}
          {picker}
        </View>
      )}
    </Container>
  );
}

const styles = StyleSheet.create({
  copy: {
    alignItems: 'center',
    gap: 10,
    paddingBottom: spacing.md + 4,
  },
  badge: {
    ...glass,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 6,
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
    fontSize: 11,
    letterSpacing: 1.4,
    textTransform: 'uppercase',
    color: colors.textMuted,
  },
  title: {
    fontFamily: fonts.displayHeavy,
    fontSize: 22,
    lineHeight: 27,
    letterSpacing: -0.9,
    color: colors.text,
    textAlign: 'center',
  },
  titleWide: {
    fontSize: 32,
    lineHeight: 38,
    letterSpacing: -1.3,
  },
  titleGold: {
    color: colors.gold,
  },
  subtitle: {
    fontFamily: fonts.body,
    fontSize: 14,
    lineHeight: 20,
    color: colors.textMuted,
    textAlign: 'center',
  },
  wideRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 48,
  },
  leftCol: {
    flex: 1,
  },
  narrow: {
    gap: spacing.md,
  },
  stage: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  stageWide: {
    flex: 1,
  },
  picker: {
    gap: 10,
  },
  pickerLabel: {
    fontFamily: fonts.bodySemibold,
    fontSize: 11,
    letterSpacing: 1.6,
    textTransform: 'uppercase',
    color: colors.textFaint,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  // 3 columnas parejas: (100% - 2 gaps) / 3
  cell: {
    flexGrow: 0,
    flexShrink: 0,
    flexBasis: '31%',
    minWidth: 90,
  },
  cellFull: {
    flexBasis: '100%',
  },
  secure: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  secureText: {
    fontFamily: fonts.bodyMedium,
    fontSize: 12,
    color: colors.textFaint,
  },
});
