import { useCallback, useRef, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { AboutIsej, Footer } from '../components/AboutIsej';
import { Atmosphere } from '../components/Atmosphere';
import { DonationSection } from '../components/DonationSection';
import { IsejHeader } from '../components/IsejHeader';
import { useCoinSound } from '../hooks/useCoinSound';
import { useDonations } from '../hooks/useDonations';
import { colors } from '../theme';
import { impactFeedback } from '../utils/feedback';
import {
  openMercadoPagoCustomAmount,
  openMercadoPagoDonation,
  opensAtTap,
} from '../utils/mercadopago';

const QUICK_AMOUNTS = [500, 1000, 2000, 5000, 10000];

export default function DonateScreen() {
  const { donations, addDonation } = useDonations();
  const insets = useSafeAreaInsets();
  const { playCoinSound } = useCoinSound();

  const [dropTrigger, setDropTrigger] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);

  const nextCoinIndexRef = useRef(0);
  const pendingRedirectRef = useRef<(() => Promise<void>) | null>(null);
  // En celulares el sonido/vibración salen en el toque (no en el impacto).
  const effectsAtImpactRef = useRef(true);

  // El sonido y la vibración se disparan dentro de CoinAnimation, justo en
  // el instante del impacto visual — acá solo se dispara la caída.
  const playDropAnimation = useCallback(() => {
    nextCoinIndexRef.current = donations.length;
    setDropTrigger((prev) => prev + 1);
  }, [donations.length]);

  /**
   * Arranca la donación. En escritorio: animación y, tras el impacto, redirige
   * a Mercado Pago. En celulares y tablets el link se abre AHORA, dentro del
   * gesto del toque (así el sistema lo entrega a la app de Mercado Pago, sin
   * pasar por la web/Mercado Libre); el sonido, la vibración y la moneda
   * arrancan en ese mismo instante.
   */
  const startFlow = useCallback(
    (openLink: () => Promise<void>, save?: () => Promise<unknown>) => {
      if (isProcessing) return;
      setIsProcessing(true);

      const atTap = opensAtTap();
      effectsAtImpactRef.current = !atTap;
      pendingRedirectRef.current = atTap ? null : openLink;

      const saved = save?.(); // guarda la moneda antes de salir de la página
      playDropAnimation();

      if (atTap) {
        impactFeedback();
        playCoinSound();
        openLink();
      }
      return saved;
    },
    [isProcessing, playDropAnimation, playCoinSound]
  );

  const startDonation = useCallback(
    (amount: number) =>
      startFlow(
        () => openMercadoPagoDonation(amount),
        () => addDonation(amount)
      ),
    [startFlow, addDonation]
  );

  // "Otro monto": el monto se ingresa en Mercado Pago, así que solo se anima.
  const startCustomDonation = useCallback(
    () => startFlow(() => openMercadoPagoCustomAmount()),
    [startFlow]
  );

  const handleDropComplete = useCallback(async () => {
    const redirect = pendingRedirectRef.current;
    pendingRedirectRef.current = null;
    if (redirect) {
      await redirect();
    }
    setIsProcessing(false);
  }, []);

  return (
    <View style={styles.root}>
      <Atmosphere />
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        <ScrollView
          contentContainerStyle={{ paddingBottom: Math.max(insets.bottom, 12) + 24 }}
          showsVerticalScrollIndicator={false}
        >
          <IsejHeader />
          <DonationSection
            amounts={QUICK_AMOUNTS}
            coinCount={donations.length}
            dropTrigger={dropTrigger}
            pileIndex={nextCoinIndexRef.current}
            disabled={isProcessing}
            onSelectAmount={startDonation}
            onSelectCustom={startCustomDonation}
            onDropComplete={handleDropComplete}
            withEffects={effectsAtImpactRef.current}
          />
          <AboutIsej />
          <Footer />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  safeArea: {
    flex: 1,
  },
});
