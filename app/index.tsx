import { useCallback, useRef, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { AboutIsej, Footer } from '../components/AboutIsej';
import { Atmosphere } from '../components/Atmosphere';
import { FAST_IMPACT_MS } from '../components/CoinAnimation';
import { DonationSection } from '../components/DonationSection';
import { IsejHeader } from '../components/IsejHeader';
import { useDonations } from '../hooks/useDonations';
import { colors } from '../theme';
import {
  openMercadoPagoCustomAmount,
  openMercadoPagoDonation,
  opensAtTap,
} from '../utils/mercadopago';

const QUICK_AMOUNTS = [500, 1000, 2000, 5000, 10000];

/** Pausa tras el impacto para que se oiga el "clink" antes de abrir Mercado Pago. */
const MOBILE_REDIRECT_AFTER_IMPACT_MS = 240;

export default function DonateScreen() {
  const { donations, addDonation } = useDonations();
  const insets = useSafeAreaInsets();

  const [dropTrigger, setDropTrigger] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);

  const nextCoinIndexRef = useRef(0);
  const pendingRedirectRef = useRef<(() => Promise<void>) | null>(null);
  // En celulares la caída es rápida para redirigir pegado al toque.
  const fastRef = useRef(false);

  // El sonido y la vibración se disparan dentro de CoinAnimation, justo en
  // el instante del impacto visual — acá solo se dispara la caída.
  const playDropAnimation = useCallback(() => {
    nextCoinIndexRef.current = donations.length;
    setDropTrigger((prev) => prev + 1);
  }, [donations.length]);

  /**
   * Arranca la donación: se ve caer la moneda, suena y vibra en el impacto y
   * recién después se abre Mercado Pago. En celulares y tablets (web) la
   * caída es rápida y la redirección se programa AHORA, dentro del gesto del
   * toque, para que salga a menos de ~1 s: así iOS/Android siguen entregando
   * el link a la app de Mercado Pago en vez de caer en la web.
   */
  const startFlow = useCallback(
    (openLink: () => Promise<void>, save?: () => Promise<unknown>) => {
      if (isProcessing) return;
      setIsProcessing(true);

      const atTap = opensAtTap();
      fastRef.current = atTap;
      // En escritorio/nativo redirige al terminar la animación (CoinAnimation).
      pendingRedirectRef.current = atTap ? null : openLink;

      const saved = save?.(); // guarda la moneda antes de salir de la página
      playDropAnimation();

      if (atTap) {
        setTimeout(() => openLink(), FAST_IMPACT_MS + MOBILE_REDIRECT_AFTER_IMPACT_MS);
      }
      return saved;
    },
    [isProcessing, playDropAnimation]
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
            fast={fastRef.current}
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
