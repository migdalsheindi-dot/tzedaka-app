import * as Haptics from 'expo-haptics';
import { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import Animated, {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { Coin } from './Coin';
import { useCoinSound } from '../hooks/useCoinSound';
import {
  JAR_ENTRY_POINT,
  JAR_SLOT_POINT,
  JAR_VIEWBOX_WIDTH,
  getCoinPileSlot,
} from '../utils/jarGeometry';

type Props = {
  /** Ancho renderizado del frasco (mismo `size` que se le pasa a TzedakaBox). */
  jarSize: number;
  /** Incrementar este número dispara una nueva caída de moneda. */
  trigger: number;
  /** Índice que ocupará esta moneda dentro de la pila (0-based). */
  pileIndex: number;
  onDropComplete?: () => void;
};

const COIN_SIZE = 34;

// Duración total ~1.6s (el doble que la versión anterior): una caída más
// pausada y visual antes de redirigir a Mercado Pago.
const FALL_TO_SLOT_MS = 520;
const FALL_TO_PILE_MS = 600;
const BOUNCE_UP_MS = 140;
const BOUNCE_SETTLE_MS = 140;
const SQUASH_DELAY_MS = FALL_TO_SLOT_MS + FALL_TO_PILE_MS;
const SQUASH_MS = 180;
const FADE_DELAY_MS = SQUASH_DELAY_MS + BOUNCE_UP_MS;
const FADE_MS = 320;

export function CoinAnimation({ jarSize, trigger, pileIndex, onDropComplete }: Props) {
  const scale = jarSize / JAR_VIEWBOX_WIDTH;
  const { playCoinSound } = useCoinSound();

  const startX = JAR_ENTRY_POINT.x * scale;
  const startY = JAR_ENTRY_POINT.y * scale;
  const slotX = JAR_SLOT_POINT.x * scale;
  const slotY = JAR_SLOT_POINT.y * scale;

  const translateX = useSharedValue(startX);
  const translateY = useSharedValue(startY);
  const coinScale = useSharedValue(1);
  const opacity = useSharedValue(0);
  const rotate = useSharedValue(0);

  useEffect(() => {
    if (trigger === 0) return;

    const target = getCoinPileSlot(pileIndex);
    const targetX = target.x * scale;
    const targetY = target.y * scale;

    translateX.value = startX;
    translateY.value = startY;
    coinScale.value = 1;
    opacity.value = 1;
    rotate.value = 0;

    const handleImpact = (finished?: boolean) => {
      if (!finished) return;
      runOnJS(Haptics.impactAsync)(Haptics.ImpactFeedbackStyle.Medium);
      runOnJS(playCoinSound)();
    };

    // Fase 1: cae en línea recta y entra por la ranura de la tapa.
    translateY.value = withSequence(
      withTiming(slotY, { duration: FALL_TO_SLOT_MS, easing: Easing.in(Easing.quad) }),
      // Fase 2: sigue cayendo hasta su lugar dentro de la pila. El impacto
      // (sonido + vibración) se dispara justo cuando llega a destino.
      withTiming(
        targetY,
        { duration: FALL_TO_PILE_MS, easing: Easing.out(Easing.quad) },
        handleImpact
      ),
      withTiming(targetY - 4, { duration: BOUNCE_UP_MS }),
      withTiming(targetY, { duration: BOUNCE_SETTLE_MS })
    );

    // El desplazamiento horizontal hacia su lugar final empieza recién al entrar por la ranura.
    translateX.value = withDelay(
      FALL_TO_SLOT_MS,
      withTiming(targetX, { duration: FALL_TO_PILE_MS, easing: Easing.out(Easing.quad) })
    );

    rotate.value = withTiming(360 * 2, { duration: SQUASH_DELAY_MS, easing: Easing.linear });

    coinScale.value = withDelay(SQUASH_DELAY_MS, withTiming(0.85, { duration: SQUASH_MS }));

    // La moneda "voladora" se desvanece justo al asentarse, dejando ver la
    // moneda ya guardada (estática, detrás del vidrio) en el mismo lugar.
    opacity.value = withDelay(
      FADE_DELAY_MS,
      withTiming(0, { duration: FADE_MS }, (finished) => {
        if (finished && onDropComplete) {
          runOnJS(onDropComplete)();
        }
      })
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trigger]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [
      { translateX: translateX.value - COIN_SIZE / 2 },
      { translateY: translateY.value - COIN_SIZE / 2 },
      { scale: coinScale.value },
      { rotate: `${rotate.value}deg` },
    ],
  }));

  return (
    <Animated.View pointerEvents="none" style={[styles.coinWrapper, animatedStyle]}>
      <Coin size={COIN_SIZE} />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  coinWrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
});
