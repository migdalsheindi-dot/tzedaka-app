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

export function CoinAnimation({ jarSize, trigger, pileIndex, onDropComplete }: Props) {
  const scale = jarSize / JAR_VIEWBOX_WIDTH;

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

    // Fase 1: cae en línea recta y entra por la ranura de la tapa.
    translateY.value = withSequence(
      withTiming(slotY, { duration: 260, easing: Easing.in(Easing.quad) }),
      // Fase 2: sigue cayendo hasta su lugar dentro de la pila, con un rebote leve al asentarse.
      withTiming(targetY, { duration: 300, easing: Easing.out(Easing.quad) }),
      withTiming(targetY - 4, { duration: 70 }),
      withTiming(targetY, { duration: 70 })
    );

    // El desplazamiento horizontal hacia su lugar final empieza recién al entrar por la ranura.
    translateX.value = withDelay(
      260,
      withTiming(targetX, { duration: 300, easing: Easing.out(Easing.quad) })
    );

    rotate.value = withTiming(360 * 2, { duration: 560, easing: Easing.linear });

    coinScale.value = withDelay(560, withTiming(0.85, { duration: 90 }));

    // La moneda "voladora" se desvanece justo al asentarse, dejando ver la
    // moneda ya guardada (estática, detrás del vidrio) en el mismo lugar.
    opacity.value = withDelay(
      640,
      withTiming(0, { duration: 160 }, (finished) => {
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
