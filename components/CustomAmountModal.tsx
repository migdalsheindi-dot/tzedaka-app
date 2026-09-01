import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { formatARS, parseARSInput } from '../utils/currency';

type Props = {
  visible: boolean;
  onClose: () => void;
  onConfirm: (amount: number) => void;
};

export function CustomAmountModal({ visible, onClose, onConfirm }: Props) {
  const [raw, setRaw] = useState('');
  const amount = parseARSInput(raw);

  function handleClose() {
    setRaw('');
    onClose();
  }

  function handleConfirm() {
    if (amount <= 0) return;
    onConfirm(amount);
    setRaw('');
  }

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={handleClose}>
      <KeyboardAvoidingView
        style={styles.overlay}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <Pressable style={StyleSheet.absoluteFill} onPress={handleClose} />
        <View style={styles.sheet}>
          <View style={styles.handle} />
          <Text style={styles.title}>Otro monto</Text>
          <Text style={styles.subtitle}>Ingresá el monto que querés donar</Text>

          <View style={styles.inputRow}>
            <Text style={styles.currencyPrefix}>$</Text>
            <TextInput
              style={styles.input}
              keyboardType="number-pad"
              placeholder="0"
              placeholderTextColor="#B9C2D6"
              value={raw}
              onChangeText={setRaw}
              autoFocus
              maxLength={9}
            />
          </View>

          {amount > 0 && <Text style={styles.preview}>{formatARS(amount)}</Text>}

          <Pressable
            style={[styles.confirmButton, amount <= 0 && styles.confirmButtonDisabled]}
            onPress={handleConfirm}
            disabled={amount <= 0}
          >
            <Text style={styles.confirmLabel}>Donar {amount > 0 ? formatARS(amount) : ''}</Text>
          </Pressable>

          <Pressable style={styles.cancelButton} onPress={handleClose}>
            <Text style={styles.cancelLabel}>Cancelar</Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(15, 23, 42, 0.45)',
  },
  sheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 36,
    alignItems: 'center',
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#E1E6F0',
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#16213E',
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7690',
    marginTop: 4,
    marginBottom: 20,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  currencyPrefix: {
    fontSize: 34,
    fontWeight: '700',
    color: '#16213E',
    marginRight: 4,
  },
  input: {
    fontSize: 44,
    fontWeight: '800',
    color: '#16213E',
    minWidth: 80,
    textAlign: 'left',
  },
  preview: {
    marginTop: 8,
    color: '#6B7690',
    fontSize: 14,
  },
  confirmButton: {
    marginTop: 28,
    backgroundColor: '#2F6FED',
    borderRadius: 18,
    paddingVertical: 16,
    width: '100%',
    alignItems: 'center',
  },
  confirmButtonDisabled: {
    opacity: 0.4,
  },
  confirmLabel: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '700',
  },
  cancelButton: {
    marginTop: 14,
    paddingVertical: 8,
  },
  cancelLabel: {
    color: '#6B7690',
    fontSize: 15,
    fontWeight: '600',
  },
});
