import { useCallback, useRef, useState } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { DonationHero } from '../../components/DonationHero';
import { ImpactGallery } from '../../components/ImpactGallery';
import { AboutIsej, Footer, HowItWorks, TrustStrip } from '../../components/InfoSections';
import { IsejHeader } from '../../components/IsejHeader';
import { useDonations } from '../../hooks/useDonations';
import { colors } from '../../theme';
import { openMercadoPagoCustomAmount, openMercadoPagoDonation } from '../../utils/mercadopago';

const QUICK_AMOUNTS = [500, 1000, 2000, 5000, 10000];

export default function DonateScreen() {
  const { donations, addDonation } = useDonations();

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

  // Monto fijo: se registra el aporte de inmediato (la moneda ya cae en la
  // pila real) y, apenas termina la animación, redirige a Mercado Pago.
  const startDonation = useCallback(
    async (amount: number) => {
      if (isProcessing) return;
      setIsProcessing(true);

      pendingRedirectRef.current = () => openMercadoPagoDonation(amount);
      playDropAnimation();
      await addDonation(amount);
    },
    [isProcessing, playDropAnimation, addDonation]
  );

  // "Otro monto": no se conoce el monto dentro de la app, así que no se
  // registra en Mi Impacto — solo se muestra la animación como feedback y
  // se redirige a Mercado Pago para que la persona lo complete ahí.
  const startCustomDonation = useCallback(() => {
    if (isProcessing) return;
    setIsProcessing(true);

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
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <IsejHeader />
        <DonationHero
          amounts={QUICK_AMOUNTS}
          coinCount={donations.length}
          dropTrigger={dropTrigger}
          pileIndex={nextCoinIndexRef.current}
          disabled={isProcessing}
          onSelectAmount={startDonation}
          onSelectCustom={startCustomDonation}
          onDropComplete={handleDropComplete}
        />
        <HowItWorks />
        <AboutIsej />
        <ImpactGallery />
        <TrustStrip />
        <Footer />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  content: {
    paddingBottom: 24,
  },
});
