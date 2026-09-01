import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { formatARS } from '../utils/currency';

type Props = {
  visible: boolean;
  amount: number;
  onConfirm: () => void;
  onDeny: () => void;
};

export function ConfirmDonationModal({ visible, amount, onConfirm, onDeny }: Props) {
  return (
    <Modal visible={visible} animationType="fade" transparent onRequestClose={onDeny}>
      <View style={styles.overlay}>
        <View style={styles.card}>
          <Text style={styles.icon}>🪙</Text>
          <Text style={styles.title}>¿Completaste tu donación?</Text>
          <Text style={styles.subtitle}>
            Confirmanos si terminaste el pago de {formatARS(amount)} en Mercado Pago. Solo se
            suma a tu Tzedaká cuando confirmás que se completó.
          </Text>

          <Pressable style={styles.confirmButton} onPress={onConfirm}>
            <Text style={styles.confirmLabel}>Sí, ya doné</Text>
          </Pressable>

          <Pressable style={styles.denyButton} onPress={onDeny}>
            <Text style={styles.denyLabel}>Todavía no / Cancelar</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(15, 23, 42, 0.5)',
    paddingHorizontal: 32,
  },
  card: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    paddingHorizontal: 24,
    paddingVertical: 28,
    alignItems: 'center',
  },
  icon: {
    fontSize: 36,
    marginBottom: 8,
  },
  title: {
    fontSize: 19,
    fontWeight: '700',
    color: '#16213E',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7690',
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 22,
    lineHeight: 19,
  },
  confirmButton: {
    backgroundColor: '#2F6FED',
    borderRadius: 18,
    paddingVertical: 15,
    width: '100%',
    alignItems: 'center',
  },
  confirmLabel: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  denyButton: {
    marginTop: 12,
    paddingVertical: 8,
  },
  denyLabel: {
    color: '#6B7690',
    fontSize: 14,
    fontWeight: '600',
  },
});
