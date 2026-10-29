import { useEffect, useMemo } from 'react';
import { StyleSheet } from 'react-native';
import Animated, {
  Easing,
  SharedValue,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { useCoinSound } from '../hooks/useCoinSound';
import { impactFeedback } from '../utils/feedback';
import { JAR_SLOT_POINT, JAR_VIEWBOX_WIDTH, getCoinPileSlot } from '../utils/jarGeometry';
import { Coin } from './Coin';

type Props = {
  /** Ancho renderizado del frasco (mismo `size` que se le pasa a TzedakaBox). */
  jarSize: number;
  /** Incrementar este número dispara una nueva caída de moneda. */
  trigger: number;
  /** Índice que ocupará esta moneda dentro de la pila (0-based). */
  pileIndex: number;
  onDropComplete?: () => void;
  /** Si es false, no suena ni vibra en el impacto (ya se hizo en el toque). */
  withEffects?: boolean;
  /** Perfil de celular (web): define la duración de la caída. Sin perfil: caída pausada. */
  tapProfile?: 'ios' | 'android' | null;
};

const COIN_SIZE = 34;
const HALF = COIN_SIZE / 2;

// Línea de tiempo (ms). El impacto —sonido y vibración— ocurre en `impactAt`.
type Timeline = {
  flight: number; // cruza la pantalla hasta la ranura
  drop: number; // cae dentro hasta la pila
  impactAt: number;
  bounceUp: number;
  bounceSettle: number;
  squash: number;
  fadeDelay: number;
  fade: number;
  ring: number;
};

function timeline(flight: number, drop: number, bounce: number, squash: number, fade: number, ring: number): Timeline {
  const impactAt = flight + drop;
  return { flight, drop, impactAt, bounceUp: bounce, bounceSettle: bounce, squash, fadeDelay: impactAt + bounce, fade, ring };
}

/** Escritorio y app nativa: caída pausada y vistosa. */
const NORMAL_TIMELINE = timeline(720, 520, 140, 90, 320, 560);
/**
 * iPhone/iPad (web): la redirección a Mercado Pago tiene que salir a menos de
 * ~1 s del toque para que iOS entregue el link a la app, así que la caída
 * dura lo máximo que lo permite: impacto a los 0,82 s.
 */
const IOS_TIMELINE = timeline(440, 380, 100, 80, 220, 420);
/** Android (web): Chrome tolera hasta ~5 s, así que la caída es bien visible: impacto a 1,1 s. */
const ANDROID_TIMELINE = timeline(580, 520, 130, 90, 280, 520);
/** Instante del impacto (ms desde el toque) en cada perfil de celular. */
export const TAP_IMPACT_MS = { ios: IOS_TIMELINE.impactAt, android: ANDROID_TIMELINE.impactAt } as const;

// Aviso (a `onDropComplete`) apenas después del impacto.
const REDIRECT_AFTER_IMPACT_MS = 150;

const TRAIL_PARTICLES = 14;

type Geometry = { x0: number; y0: number; slotX: number; slotY: number };

/** Posición de la moneda en el vuelo (p: 0 → 1): arco de lanzamiento hacia la ranura. */
function flightPoint(p: number, g: Geometry) {
  'worklet';
  const clamped = Math.min(1, Math.max(0, p));
  return {
    x: g.x0 + (g.slotX - g.x0) * (1 - Math.pow(1 - clamped, 1.6)),
    y: g.y0 + (g.slotY - g.y0) * Math.pow(clamped, 1.8),
  };
}

type SparkProps = {
  index: number;
  flight: SharedValue<number>;
  drop: SharedValue<number>;
  geometry: Geometry;
};

/** Partícula dorada del rastro: sigue el mismo arco que la moneda, con retraso. */
function Spark({ index, flight, drop, geometry }: SparkProps) {
  const lag = (index + 1) * 0.04;
  const seed = Math.sin((index + 1) * 12.9898) * 43758.5453;
  const rand = seed - Math.floor(seed);
  const offsetX = (rand - 0.5) * 26;
  const offsetY = (((rand * 7.3) % 1) - 0.5) * 26;
  const size = 3 + Math.round(rand * 4);
  const fade = 1 - index / TRAIL_PARTICLES;

  const style = useAnimatedStyle(() => {
    const p = flight.value - lag;
    const { x, y } = flightPoint(p, geometry);
    const visible = p > 0 && drop.value === 0 ? 1 : 0;
    return {
      opacity: visible * fade * 0.95,
      transform: [
        { translateX: x + offsetX },
        { translateY: y + offsetY },
        { scale: 1.2 - fade * 0.7 },
      ],
    };
  });

  return (
    <Animated.View
      pointerEvents="none"
      style={[styles.spark, { width: size, height: size, borderRadius: size / 2 }, style]}
    />
  );
}

export function CoinAnimation({ jarSize, trigger, pileIndex, onDropComplete, withEffects = true, tapProfile = null }: Props) {
  const scale = jarSize / JAR_VIEWBOX_WIDTH;
  const tl =
    tapProfile === 'ios' ? IOS_TIMELINE : tapProfile === 'android' ? ANDROID_TIMELINE : NORMAL_TIMELINE;
  const { playCoinSound } = useCoinSound();

  const slotX = JAR_SLOT_POINT.x * scale;
  const slotY = JAR_SLOT_POINT.y * scale;
  // La moneda entra "desde afuera de la pantalla": arriba a la izquierda del frasco.
  const geometry = useMemo<Geometry>(
    () => ({ x0: -jarSize * 1.25, y0: -jarSize * 0.95, slotX, slotY }),
    [jarSize, slotX, slotY]
  );

  const flight = useSharedValue(0);
  const drop = useSharedValue(0);
  const targetX = useSharedValue(slotX);
  const targetY = useSharedValue(slotY);
  const bounce = useSharedValue(0);
  const squash = useSharedValue(1);
  const rotate = useSharedValue(0);
  const opacity = useSharedValue(0);
  const flash = useSharedValue(0);
  const ring = useSharedValue(0);
  const redirectSignal = useSharedValue(0);

  useEffect(() => {
    if (trigger === 0) return;

    const target = getCoinPileSlot(pileIndex);
    targetX.value = target.x * scale;
    targetY.value = target.y * scale;

    flight.value = 0;
    drop.value = 0;
    bounce.value = 0;
    squash.value = 1;
    rotate.value = 0;
    flash.value = 0;
    ring.value = 0;
    redirectSignal.value = 0;
    opacity.value = 1;

    const handleImpact = (finished?: boolean) => {
      'worklet';
      if (!finished || !withEffects) return;
      runOnJS(impactFeedback)();
      runOnJS(playCoinSound)();
    };

    flight.value = withTiming(1, { duration: tl.flight, easing: Easing.linear });
    drop.value = withDelay(
      tl.flight,
      withTiming(1, { duration: tl.drop, easing: Easing.linear }, handleImpact)
    );
    rotate.value = withTiming(360 * 3, { duration: tl.impactAt, easing: Easing.linear });

    // Destello al cruzar la ranura y onda dorada al golpear la pila.
    flash.value = withDelay(
      tl.flight - 80,
      withSequence(withTiming(1, { duration: 160 }), withTiming(0, { duration: 420 }))
    );
    ring.value = withDelay(tl.impactAt, withTiming(1, { duration: tl.ring, easing: Easing.out(Easing.cubic) }));

    bounce.value = withDelay(
      tl.impactAt,
      withSequence(withTiming(-4, { duration: tl.bounceUp }), withTiming(0, { duration: tl.bounceSettle }))
    );
    squash.value = withDelay(tl.impactAt, withTiming(0.85, { duration: tl.squash }));

    opacity.value = withDelay(tl.fadeDelay, withTiming(0, { duration: tl.fade }));

    redirectSignal.value = withDelay(
      tl.impactAt + REDIRECT_AFTER_IMPACT_MS,
      withTiming(1, { duration: 1 }, (finished) => {
        if (finished && onDropComplete) {
          runOnJS(onDropComplete)();
        }
      })
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trigger]);

  const coinStyle = useAnimatedStyle(() => {
    let x: number;
    let y: number;
    let s: number;
    if (drop.value > 0) {
      const e = 1 - (1 - drop.value) * (1 - drop.value);
      x = slotX + (targetX.value - slotX) * e;
      y = slotY + (targetY.value - slotY) * e + bounce.value;
      s = 1;
    } else {
      const point = flightPoint(flight.value, geometry);
      x = point.x;
      y = point.y;
      s = 1.55 - 0.55 * flight.value; // más grande cuanto más lejos del frasco
    }
    return {
      opacity: opacity.value,
      transform: [
        { translateX: x - HALF },
        { translateY: y - HALF },
        { scale: s * squash.value },
        { rotate: `${rotate.value}deg` },
      ],
    };
  });

  const flashStyle = useAnimatedStyle(() => ({
    opacity: flash.value,
    transform: [
      { translateX: slotX - 45 },
      { translateY: slotY - 45 },
      { scale: 0.3 + flash.value * 1.5 },
    ],
  }));

  const ringStyle = useAnimatedStyle(() => ({
    opacity: (1 - ring.value) * (ring.value > 0 ? 1 : 0),
    transform: [
      { translateX: targetX.value - 30 },
      { translateY: targetY.value - 30 },
      { scale: 0.3 + ring.value * 1.9 },
    ],
  }));

  return (
    <>
      {Array.from({ length: TRAIL_PARTICLES }).map((_, index) => (
        <Spark key={index} index={index} flight={flight} drop={drop} geometry={geometry} />
      ))}
      <Animated.View pointerEvents="none" style={[styles.flash, flashStyle]} />
      <Animated.View pointerEvents="none" style={[styles.ring, ringStyle]} />
      <Animated.View pointerEvents="none" style={[styles.coinWrapper, coinStyle]}>
        <Animated.View style={styles.coinGlow} />
        <Coin size={COIN_SIZE} />
      </Animated.View>
    </>
  );
}

const styles = StyleSheet.create({
  coinWrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: COIN_SIZE,
    height: COIN_SIZE,
  },
  coinGlow: {
    position: 'absolute',
    top: -14,
    left: -14,
    right: -14,
    bottom: -14,
    borderRadius: 40,
    backgroundColor: 'rgba(232, 199, 122, 0.18)',
    boxShadow: '0px 0px 28px rgba(232, 199, 122, 0.85)',
  },
  spark: {
    position: 'absolute',
    top: 0,
    left: 0,
    backgroundColor: '#F6E2A4',
    boxShadow: '0px 0px 8px rgba(232, 199, 122, 0.95)',
  },
  flash: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: 'rgba(255, 244, 205, 0.95)',
    boxShadow: '0px 0px 60px rgba(246, 226, 164, 1)',
  },
  ring: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: 'rgba(246, 226, 164, 0.95)',
  },
});
