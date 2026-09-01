import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ImpactCard } from '../../components/ImpactCard';
import { ImpactGallery } from '../../components/ImpactGallery';
import { useDonations } from '../../hooks/useDonations';
import { formatARS } from '../../utils/currency';
import { getCurrentTier, getNextTier, IMPACT_TIERS } from '../../utils/impact';

export default function ImpactScreen() {
  const { total, donations } = useDonations();
  const currentTier = getCurrentTier(total);
  const nextTier = getNextTier(total);
  const pastTiers = IMPACT_TIERS.filter(
    (tier) => total >= tier.threshold && tier.threshold > 0 && tier.id !== currentTier.id
  ).reverse();

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.heading}>Mi Impacto</Text>

        <View style={styles.totalCard}>
          <Text style={styles.totalLabel}>Total donado</Text>
          <Text style={styles.totalAmount}>{formatARS(total)}</Text>
          <Text style={styles.totalCount}>
            {donations.length === 0
              ? 'Todavía no registraste donaciones'
              : `${donations.length} ${donations.length === 1 ? 'donación' : 'donaciones'}`}
          </Text>
        </View>

        <ImpactCard
          icon={currentTier.icon}
          title={currentTier.title}
          description={currentTier.description(total)}
          highlighted
        />

        {nextTier && (
          <Text style={styles.nextTierHint}>
            Te faltan {formatARS(nextTier.threshold - total)} para "{nextTier.title}"
          </Text>
        )}

        {pastTiers.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Logros desbloqueados</Text>
            {pastTiers.map((tier) => (
              <ImpactCard
                key={tier.id}
                icon={tier.icon}
                title={tier.title}
                description={tier.description(total)}
              />
            ))}
          </>
        )}

        <View style={styles.galleryBreakout}>
          <ImpactGallery />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F4EFE6',
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  heading: {
    fontSize: 28,
    fontWeight: '800',
    color: '#16213E',
    marginTop: 12,
    marginBottom: 20,
  },
  totalCard: {
    backgroundColor: '#2F6FED',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    marginBottom: 20,
  },
  totalLabel: {
    color: '#D9E4FF',
    fontSize: 14,
    fontWeight: '600',
  },
  totalAmount: {
    color: '#FFFFFF',
    fontSize: 36,
    fontWeight: '800',
    marginTop: 6,
  },
  totalCount: {
    color: '#D9E4FF',
    fontSize: 13,
    marginTop: 8,
  },
  nextTierHint: {
    color: '#6B7690',
    fontSize: 13,
    textAlign: 'center',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#16213E',
    marginBottom: 12,
  },
  galleryBreakout: {
    marginHorizontal: -24,
    marginTop: 12,
  },
});
