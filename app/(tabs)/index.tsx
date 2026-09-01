import * as Haptics from 'expo-haptics';
import { useCallback, useEffect, useRef, useState } from 'react';
import { AppState, AppStateStatus, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AmountButton } from '../../components/AmountButton';
import { CoinAnimation } from '../../components/CoinAnimation';
import { ConfirmDonationModal } from '../../components/ConfirmDonationModal';
import { CustomAmountModal } from '../../components/CustomAmountModal';
import { IsejHeader } from '../../components/IsejHeader';
import { TzedakaBox } from '../../components/TzedakaBox';
import { useCoinSound } from '../../hooks/useCoinSound';
import { useDonations } from '../../hooks/useDonations';
import { usePendingDonation } from '../../hooks/usePendingDonation';
import { formatARS } from '../../utils/currency';
import { JAR_VIEWBOX_HEIGHT, JAR_VIEWBOX_WIDTH } from '../../utils/jarGeometry';
import { openMercadoPagoDonation } from '../../utils/mercadopago';

const QUICK_AMOUNTS = [500, 1000, 2000, 5000, 10000];
const JAR_ASPECT_RATIO = JAR_VIEWBOX_HEIGHT / JAR_VIEWBOX_WIDTH;

export default function DonateScreen() {
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();
  const { donations, addDonation } = useDonations();
  const { playCoinSound } = useCoinSound();

  const [dropTrigger, setDropTrigger] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [confirmVisible, setConfirmVisible] = useState(false);
  const { pendingAmount, setPendingAmount, clearPendingAmount, restoredFromStorage } =
    usePendingDonation();

  const nextCoinIndexRef = useRef(0);
  const pendingAmountRef = useRef<number | null>(null);
  const appStateRef = useRef(AppState.currentState);

  // La Tzedaká es el elemento central: ocupa casi todo el ancho disponible,
  // limitada por la altura para que siempre entre en pantalla sin scroll.
  const jarByWidth = (windowWidth - 48) * 0.94;
  const jarByHeight = (windowHeight * 0.46) / JAR_ASPECT_RATIO;
  const jarSize = Math.min(jarByWidth, jarByHeight, 430);
  const jarHeight = jarSize * JAR_ASPECT_RATIO;

  // Mantiene una ref sincronizada para leer el pendiente actual desde
  // listeners que no se vuelven a suscribir en cada render.
  useEffect(() => {
    pendingAmountRef.current = pendingAmount;
  }, [pendingAmount]);

  // Si había una donación pendiente guardada de una sesión anterior (la app
  // se cerró del todo mientras el usuario estaba en Mercado Pago), pedimos
  // la confirmación apenas se abre la app de nuevo.
  useEffect(() => {
    if (restoredFromStorage) {
      setConfirmVisible(true);
    }
  }, [restoredFromStorage]);

  // Detecta cuando el usuario vuelve a la app (por ej. después de Mercado
  // Pago) mientras hay una donación esperando confirmación.
  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextState: AppStateStatus) => {
      const cameToForeground =
        appStateRef.current.match(/inactive|background/) && nextState === 'active';
      appStateRef.current = nextState;
      if (cameToForeground && pendingAmountRef.current !== null) {
        setConfirmVisible(true);
      }
    });
    return () => subscription.remove();
  }, []);

  const startDonation = useCallback(
    async (amount: number) => {
      if (pendingAmountRef.current !== null) return;

      setPendingAmount(amount);

      Haptics.selectionAsync();
      await openMercadoPagoDonation(amount);
    },
    [setPendingAmount]
  );

  const cancelPendingDonation = useCallback(() => {
    clearPendingAmount();
    setConfirmVisible(false);
  }, [clearPendingAmount]);

  const confirmPendingDonation = useCallback(async () => {
    const amount = pendingAmountRef.current;
    if (amount === null) {
      setConfirmVisible(false);
      return;
    }

    setConfirmVisible(false);
    nextCoinIndexRef.current = donations.length;

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    playCoinSound();
    setDropTrigger((prev) => prev + 1);
    await addDonation(amount);

    clearPendingAmount();
  }, [donations.length, playCoinSound, addDonation, clearPendingAmount]);

  const hasPendingDonation = pendingAmount !== null;

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.header}>
        <IsejHeader />
      </View>

      <View style={styles.jarArea}>
        <View style={[styles.boxWrapper, { width: jarSize, height: jarHeight }]}>
          <TzedakaBox size={jarSize} coinCount={donations.length} />
          <CoinAnimation
            jarSize={jarSize}
            trigger={dropTrigger}
            pileIndex={nextCoinIndexRef.current}
          />
        </View>

        {hasPendingDonation && (
          <View style={styles.pendingBanner}>
            <Text style={styles.pendingText}>
              Confirmá tu donación de {formatARS(pendingAmount ?? 0)} cuando vuelvas de Mercado
              Pago
            </Text>
            <Text style={styles.pendingCancel} onPress={cancelPendingDonation}>
              Cancelar
            </Text>
          </View>
        )}
      </View>

      <View style={styles.amountsGrid}>
        {QUICK_AMOUNTS.map((amount) => (
          <AmountButton
            key={amount}
            label={formatARS(amount)}
            onPress={() => startDonation(amount)}
            disabled={hasPendingDonation}
          />
        ))}
        <AmountButton
          label="Otro monto"
          variant="custom"
          onPress={() => setModalVisible(true)}
          disabled={hasPendingDonation}
        />
      </View>

      <CustomAmountModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onConfirm={(amount) => {
          setModalVisible(false);
          startDonation(amount);
        }}
      />

      <ConfirmDonationModal
        visible={confirmVisible}
        amount={pendingAmount ?? 0}
        onConfirm={confirmPendingDonation}
        onDeny={cancelPendingDonation}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F4EFE6',
  },
  header: {
    paddingHorizontal: 24,
    alignItems: 'center',
    marginTop: 8,
  },
  jarArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  boxWrapper: {
    alignSelf: 'center',
  },
  pendingBanner: {
    marginTop: 16,
    alignItems: 'center',
  },
  pendingText: {
    fontSize: 13,
    color: '#6B7690',
    textAlign: 'center',
  },
  pendingCancel: {
    fontSize: 13,
    color: '#2F6FED',
    fontWeight: '700',
    marginTop: 6,
  },
  amountsGrid: {
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingBottom: 20,
  },
});
