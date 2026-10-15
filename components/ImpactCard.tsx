import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';
import { colors, fonts, radius, shadows } from '../theme';
import type { ImpactIcon } from '../utils/impact';

type Props = {
  icon: ImpactIcon;
  title: string;
  description: string;
  highlighted?: boolean;
};

export function ImpactCard({ icon, title, description, highlighted }: Props) {
  return (
    <View style={[styles.card, highlighted && styles.highlighted]}>
      <View style={[styles.iconWrap, highlighted && styles.iconWrapHighlighted]}>
        <Ionicons name={icon} size={24} color={highlighted ? colors.goldDeep : colors.navy600} />
      </View>
      <View style={styles.textColumn}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{description}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    padding: 18,
    gap: 16,
    borderWidth: 1,
    borderColor: colors.border,
    boxShadow: shadows.card,
  },
  highlighted: {
    borderColor: colors.gold,
    borderWidth: 1.5,
  },
  iconWrap: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: '#EAF0FB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapHighlighted: {
    backgroundColor: colors.goldSoft,
  },
  textColumn: {
    flex: 1,
  },
  title: {
    fontFamily: fonts.bold,
    fontSize: 16,
    color: colors.ink,
    marginBottom: 3,
  },
  description: {
    fontFamily: fonts.regular,
    fontSize: 14,
    lineHeight: 20,
    color: colors.body,
  },
});
