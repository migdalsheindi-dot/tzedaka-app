import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';

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

const CARD_WIDTH = 200;
const CARD_HEIGHT = 150;

export function ImpactGallery() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>La comunidad en acción</Text>
      <Text style={styles.subtitle}>
        Así se vive ISEJ: viajes, encuentros y proyectos que tu Tzedaká ayuda a sostener.
      </Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={CARD_WIDTH + 12}
        decelerationRate="fast"
        contentContainerStyle={styles.scrollContent}
      >
        {GALLERY_ITEMS.map((item) => (
          <View key={item.id} style={styles.card}>
            <Image source={item.source} style={styles.image} resizeMode="cover" />
            <View style={styles.captionBar}>
              <Text style={styles.caption}>{item.caption}</Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#16213E',
    paddingHorizontal: 24,
  },
  subtitle: {
    fontSize: 13,
    color: '#6B7690',
    paddingHorizontal: 24,
    marginTop: 4,
    marginBottom: 14,
    lineHeight: 18,
  },
  scrollContent: {
    paddingHorizontal: 24,
    gap: 12,
  },
  card: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#E4D9C2',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  captionBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingVertical: 8,
    paddingHorizontal: 10,
    backgroundColor: 'rgba(22, 33, 62, 0.65)',
  },
  caption: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
});
