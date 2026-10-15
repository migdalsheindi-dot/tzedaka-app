import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ImpactCard } from '../../components/ImpactCard';
import { ImpactGallery } from '../../components/ImpactGallery';
import { Footer } from '../../components/InfoSections';
import { IsejHeader } from '../../components/IsejHeader';
import { Container, SectionHeader, useIsWide } from '../../components/layout';
import { useDonations } from '../../hooks/useDonations';
import { colors, fonts, radius, shadows, spacing } from '../../theme';
import { formatARS } from '../../utils/currency';
import { getCurrentTier, getNextTier, IMPACT_TIERS } from '../../utils/impact';

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('es-AR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export default function ImpactScreen() {
  const { isWide } = useIsWide();
  const { total, donations } = useDonations();
  const currentTier = getCurrentTier(total);
  const nextTier = getNextTier(total);
  const pastTiers = IMPACT_TIERS.filter(
    (tier) => total >= tier.threshold && tier.threshold > 0 && tier.id !== currentTier.id
  ).reverse();
  const recent = donations.slice(0, 8);

  // Progreso entre el escalón actual y el siguiente.
  const progress = nextTier
    ? Math.min(1, (total - currentTier.threshold) / (nextTier.threshold - currentTier.threshold))
    : 1;

  const summary = (
    <LinearGradient
      colors={[colors.navy700, colors.navy800, colors.navy900]}
      start={{ x: 0.1, y: 0 }}
      end={{ x: 0.9, y: 1 }}
      style={styles.summary}
    >
      <Text style={styles.summaryLabel}>Total donado</Text>
      <Text style={[styles.summaryAmount, isWide && { fontSize: 56 }]}>{formatARS(total)}</Text>
      <View style={styles.countPill}>
        <Ionicons name="heart" size={13} color={colors.gold} />
        <Text style={styles.countText}>
          {donations.length === 0
            ? 'Todavía no registraste aportes'
            : `${donations.length} ${donations.length === 1 ? 'aporte' : 'aportes'}`}
        </Text>
      </View>

      <View style={styles.progressBlock}>
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${Math.round(progress * 100)}%` }]} />
        </View>
        <Text style={styles.progressText}>
          {nextTier
            ? `Te faltan ${formatARS(nextTier.threshold - total)} para "${nextTier.title}"`
            : 'Llegaste al máximo nivel. ¡Todá rabá!'}
        </Text>
      </View>
    </LinearGradient>
  );

  const achievements = (
    <View style={styles.achievements}>
      <ImpactCard
        icon={currentTier.icon}
        title={currentTier.title}
        description={currentTier.description(total)}
        highlighted
      />
      {pastTiers.length > 0 ? (
        <>
          <Text style={styles.subTitle}>Logros desbloqueados</Text>
          {pastTiers.map((tier) => (
            <ImpactCard
              key={tier.id}
              icon={tier.icon}
              title={tier.title}
              description={tier.description(total)}
            />
          ))}
        </>
      ) : null}
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <IsejHeader />

        <Container style={{ paddingTop: spacing.sm }}>
          <SectionHeader
            eyebrow="Mi Impacto"
            title="Lo que tu generosidad ya logró"
            subtitle="Tu total y tu historial se guardan solo en este dispositivo."
          />
          <Animated.View
            entering={FadeInUp.duration(500)}
            style={[styles.topGrid, isWide && styles.topGridWide]}
          >
            <View style={isWide ? { flex: 1 } : undefined}>{summary}</View>
            <View style={isWide ? { flex: 1 } : undefined}>{achievements}</View>
          </Animated.View>
        </Container>

        <Container style={{ paddingTop: spacing.xl }}>
          <Text style={styles.sectionTitle}>Tus últimos aportes</Text>
          <View style={styles.historyCard}>
            {recent.length === 0 ? (
              <View style={styles.empty}>
                <Ionicons name="wallet-outline" size={28} color={colors.muted} />
                <Text style={styles.emptyTitle}>Todavía no hay aportes</Text>
                <Text style={styles.emptyText}>
                  Cuando dejes tu primera moneda en la Tzedaká, vas a verla acá.
                </Text>
              </View>
            ) : (
              recent.map((donation, i) => (
                <View
                  key={donation.id}
                  style={[styles.historyRow, i < recent.length - 1 && styles.historyDivider]}
                >
                  <View style={styles.historyIcon}>
                    <Ionicons name="logo-usd" size={16} color={colors.goldDeep} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.historyAmount}>{formatARS(donation.amount)}</Text>
                    <Text style={styles.historyDate}>{formatDate(donation.date)}</Text>
                  </View>
                  <Text style={styles.historyBadge}>Aporte</Text>
                </View>
              ))
            )}
          </View>
        </Container>

        <ImpactGallery />
        <Footer />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  content: {
    paddingBottom: 24,
  },
  topGrid: {
    gap: spacing.md,
  },
  topGridWide: {
    flexDirection: 'row',
    alignItems: 'stretch',
    gap: spacing.lg,
  },
  summary: {
    borderRadius: radius.xl,
    padding: spacing.lg,
    boxShadow: shadows.raised,
    gap: 10,
    height: '100%',
  },
  summaryLabel: {
    fontFamily: fonts.semibold,
    fontSize: 13,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    color: colors.onDarkMuted,
  },
  summaryAmount: {
    fontFamily: fonts.extrabold,
    fontSize: 44,
    letterSpacing: -1.4,
    color: colors.onDark,
  },
  countPill: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 6,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: radius.pill,
    backgroundColor: colors.glass,
    borderWidth: 1,
    borderColor: colors.glassBorder,
  },
  countText: {
    fontFamily: fonts.semibold,
    fontSize: 13,
    color: colors.onDark,
  },
  progressBlock: {
    marginTop: spacing.md,
    gap: 10,
  },
  progressTrack: {
    height: 10,
    borderRadius: 5,
    backgroundColor: 'rgba(255,255,255,0.16)',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 5,
    backgroundColor: colors.gold,
  },
  progressText: {
    fontFamily: fonts.medium,
    fontSize: 13,
    color: colors.onDarkMuted,
  },
  achievements: {
    gap: 12,
  },
  subTitle: {
    fontFamily: fonts.bold,
    fontSize: 13,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    color: colors.muted,
    marginTop: 8,
  },
  sectionTitle: {
    fontFamily: fonts.extrabold,
    fontSize: 22,
    letterSpacing: -0.4,
    color: colors.ink,
    marginBottom: spacing.md,
  },
  historyCard: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    boxShadow: shadows.card,
    overflow: 'hidden',
  },
  historyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingVertical: 14,
    paddingHorizontal: 18,
  },
  historyDivider: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  historyIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.goldSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  historyAmount: {
    fontFamily: fonts.bold,
    fontSize: 16,
    color: colors.ink,
  },
  historyDate: {
    fontFamily: fonts.regular,
    fontSize: 13,
    color: colors.muted,
    marginTop: 1,
  },
  historyBadge: {
    fontFamily: fonts.semibold,
    fontSize: 12,
    color: colors.green,
    backgroundColor: colors.greenSoft,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: radius.pill,
    overflow: 'hidden',
  },
  empty: {
    alignItems: 'center',
    padding: spacing.xl,
    gap: 6,
  },
  emptyTitle: {
    fontFamily: fonts.bold,
    fontSize: 16,
    color: colors.ink,
    marginTop: 6,
  },
  emptyText: {
    fontFamily: fonts.regular,
    fontSize: 14,
    color: colors.body,
    textAlign: 'center',
  },
});
