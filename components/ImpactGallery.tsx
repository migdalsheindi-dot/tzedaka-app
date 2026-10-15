import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { colors, fonts, radius, shadows, spacing } from '../theme';
import { Container, SectionHeader, useIsWide } from './layout';

type GalleryItem = {
  id: string;
  source: ReturnType<typeof require>;
  caption: string;
};

const GALLERY_ITEMS: GalleryItem[] = [
  { id: 'europa', source: require('../assets/isej/gallery-europa.jpg'), caption: 'Viaje a Europa' },
  { id: 'newyork', source: require('../assets/isej/gallery-newyork.jpg'), caption: 'Viaje a Nueva York' },
  { id: 'miami', source: require('../assets/isej/gallery-miami.jpg'), caption: 'Retreat en Miami' },
  { id: 'extra1', source: require('../assets/isej/gallery-extra1.jpg'), caption: 'Being Jewish' },
  { id: 'extra2', source: require('../assets/isej/gallery-extra2.jpg'), caption: 'Encuentros ISEJ' },
];

/** Carrusel de fotos reales de las actividades de ISEJ. */
export function ImpactGallery() {
  const { isWide } = useIsWide();
  const cardWidth = isWide ? 300 : 232;
  const cardHeight = isWide ? 380 : 300;
  const gutter = isWide ? spacing.xl : spacing.md;

  return (
    <Container style={styles.section}>
      <SectionHeader
        eyebrow="Impacto visual"
        title="La comunidad en acción"
        subtitle="Así se vive ISEJ: viajes, encuentros y proyectos que tu Tzedaká ayuda a sostener."
      />
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={cardWidth + 14}
        decelerationRate="fast"
        style={{ marginHorizontal: -gutter }}
        contentContainerStyle={{ paddingHorizontal: gutter, gap: 14, paddingBottom: 24 }}
      >
        {GALLERY_ITEMS.map((item) => (
          <View key={item.id} style={[styles.card, { width: cardWidth, height: cardHeight }]}>
            <Image source={item.source} style={styles.image} resizeMode="cover" />
            <View style={styles.captionBar}>
              <Text style={styles.caption}>{item.caption}</Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </Container>
  );
}

const styles = StyleSheet.create({
  section: {
    paddingTop: spacing.xl + 8,
  },
  card: {
    borderRadius: radius.lg,
    overflow: 'hidden',
    backgroundColor: colors.border,
    boxShadow: shadows.card,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  captionBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: 'rgba(10, 22, 48, 0.72)',
  },
  caption: {
    fontFamily: fonts.bold,
    fontSize: 14,
    color: colors.onDark,
  },
});
