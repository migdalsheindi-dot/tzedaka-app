import { StyleSheet, Text, View } from 'react-native';

type Props = {
  icon: string;
  title: string;
  description: string;
  highlighted?: boolean;
};

export function ImpactCard({ icon, title, description, highlighted }: Props) {
  return (
    <View style={[styles.card, highlighted && styles.highlighted]}>
      <Text style={styles.icon}>{icon}</Text>
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
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    gap: 14,
    marginBottom: 12,
    shadowColor: '#16213E',
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 1,
  },
  highlighted: {
    borderWidth: 1.5,
    borderColor: '#2F6FED',
  },
  icon: {
    fontSize: 30,
  },
  textColumn: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#16213E',
    marginBottom: 2,
  },
  description: {
    fontSize: 14,
    color: '#6B7690',
    lineHeight: 19,
  },
});
