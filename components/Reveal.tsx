import { ReactNode, useEffect, useRef, useState } from 'react';
import { Platform, ViewStyle } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';
import { EASE_OUT } from '../theme';

type Props = {
  children: ReactNode;
  /** Retraso (ms) para escalonar varios elementos. */
  delay?: number;
  /** Cuánto sube (px) mientras aparece. */
  distance?: number;
  style?: ViewStyle;
};

/**
 * Aparece desde abajo con desvanecimiento y una curva suave cuando entra en
 * pantalla al hacer scroll (IntersectionObserver en web; al montar en
 * nativo). Respeta "reducir movimiento".
 */
export function Reveal({ children, delay = 0, distance = 44, style }: Props) {
  const reduce = useReducedMotion();
  const progress = useSharedValue(reduce ? 1 : 0);
  const ref = useRef<unknown>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    if (reduce) return;
    if (Platform.OS !== 'web') {
      setShown(true);
      return;
    }
    const node = ref.current as Element | null;
    if (!node || typeof IntersectionObserver === 'undefined') {
      setShown(true);
      return;
    }
    try {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setShown(true);
            observer.disconnect();
          }
        },
        { threshold: 0.1 }
      );
      observer.observe(node);
      return () => observer.disconnect();
    } catch {
      setShown(true);
    }
  }, [reduce]);

  useEffect(() => {
    if (shown) {
      progress.value = withDelay(
        delay,
        withTiming(1, { duration: 900, easing: Easing.bezier(...EASE_OUT) })
      );
    }
  }, [shown, delay, progress]);

  const animated = useAnimatedStyle(() => ({
    opacity: progress.value,
    transform: [{ translateY: (1 - progress.value) * distance }],
  }));

  return (
    <Animated.View ref={ref as never} style={[style, animated]}>
      {children}
    </Animated.View>
  );
}
