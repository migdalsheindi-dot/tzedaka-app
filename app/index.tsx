import { useCallback, useRef, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { AboutIsej, Footer } from '../components/AboutIsej';
import { DonationSection } from '../components/DonationSection';
import { BackgroundGlow } from '../components/Glass';
import { IsejHeader } from '../components/IsejHeader';
import { primeCoinSound } from '../hooks/useCoinSound';
import { useDonations } from '../hooks/useDonations';
import { colors } from '../theme';
import { openMercadoPagoCustomAmount, openMercadoPagoDonation } from '../utils/mercadopago';

const QUICK_AMOUNTS = [500, 1000, 2000, 5000, 10000];

export default function DonateScreen() {
  const { donations, addDonation } = useDonations();
  const insets = useSafeAreaInsets();

  const [dropTrigger, setDropTrigger] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);

  const nextCoinIndexRef = useRef(0);
  const pendingRedirectRef = useRef<(() => Promise<void>) | null>(null);

  // El sonido y la vibración se disparan dentro de CoinAnimation, justo en
  // el instante del impacto visual — acá solo se dispara la caída.
  const playDropAnimation = useCallback(() => {
    nextCoinIndexRef.current = donations.length;
    setDropTrigger((prev) => prev + 1);
  }, [donations.length]);

  // Monto fijo: la moneda cae en la pila real y, apenas termina la
  // animación, redirige directo a Mercado Pago.
  const startDonation = useCallback(
    async (amount: number) => {
      if (isProcessing) return;
      setIsProcessing(true);
      primeCoinSound(); // desbloquea el audio dentro del gesto del usuario

      pendingRedirectRef.current = () => openMercadoPagoDonation(amount);
      playDropAnimation();
      await addDonation(amount);
    },
    [isProcessing, playDropAnimation, addDonation]
  );

  // "Otro monto": se muestra la animación y se redirige a Mercado Pago para
  // que la persona ingrese ahí la cantidad.
  const startCustomDonation = useCallback(() => {
    if (isProcessing) return;
    setIsProcessing(true);
    primeCoinSound(); // desbloquea el audio dentro del gesto del usuario

    pendingRedirectRef.current = () => openMercadoPagoCustomAmount();
    playDropAnimation();
  }, [isProcessing, playDropAnimation]);

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
      <BackgroundGlow />
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
