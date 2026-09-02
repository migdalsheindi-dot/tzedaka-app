import { useCallback, useRef, useState } from 'react';
import { StyleSheet, View, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AmountButton } from '../../components/AmountButton';
import { CoinAnimation } from '../../components/CoinAnimation';
import { IsejHeader } from '../../components/IsejHeader';
import { TzedakaBox } from '../../components/TzedakaBox';
import { useDonations } from '../../hooks/useDonations';
import { formatARS } from '../../utils/currency';
import { JAR_VIEWBOX_HEIGHT, JAR_VIEWBOX_WIDTH } from '../../utils/jarGeometry';
import { openMercadoPagoCustomAmount, openMercadoPagoDonation } from '../../utils/mercadopago';

const QUICK_AMOUNTS = [500, 1000, 2000, 5000, 10000];
const JAR_ASPECT_RATIO = JAR_VIEWBOX_HEIGHT / JAR_VIEWBOX_WIDTH;

export default function DonateScreen() {
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();
  const { donations, addDonation } = useDonations();

  const [dropTrigger, setDropTrigger] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);

  const nextCoinIndexRef = useRef(0);
  const pendingRedirectRef = useRef<(() => Promise<void>) | null>(null);

  // La Tzedaká es el elemento central: ocupa casi todo el ancho disponible,
  // limitada por la altura para que siempre entre en pantalla sin scroll.
  const jarByWidth = (windowWidth - 48) * 0.94;
  const jarByHeight = (windowHeight * 0.46) / JAR_ASPECT_RATIO;
  const jarSize = Math.min(jarByWidth, jarByHeight, 430);
  const jarHeight = jarSize * JAR_ASPECT_RATIO;

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
            onDropComplete={handleDropComplete}
          />
        </View>
      </View>

      <View style={styles.amountsGrid}>
        {QUICK_AMOUNTS.map((amount) => (
          <AmountButton
            key={amount}
            label={formatARS(amount)}
            onPress={() => startDonation(amount)}
            disabled={isProcessing}
          />
        ))}
        <AmountButton
          label="Otro monto"
          variant="custom"
          onPress={startCustomDonation}
          disabled={isProcessing}
        />
      </View>
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
