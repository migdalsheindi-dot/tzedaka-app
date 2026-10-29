import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import Svg, { Circle, Defs, RadialGradient, Stop } from 'react-native-svg';

type OrbProps = {
  color: string;
  size: number;
  opacity: number;
  /** Posición inicial en % del contenedor. */
  left: `${number}%`;
  top: `${number}%`;
  /** Cuánto deriva (px) y cada cuánto (ms). */
  drift: number;
  duration: number;
  phase?: number;
};

/** Una luz ambiental difusa que deriva muy despacio. */
function Orb({ color, size, opacity, left, top, drift, duration, phase = 0 }: OrbProps) {
  const reduce = useReducedMotion();
  const t = useSharedValue(phase);

  useEffect(() => {
    if (reduce) return;
    t.value = phase;
    t.value = withRepeat(
      withTiming(1 - phase, { duration, easing: Easing.inOut(Easing.sin) }),
      -1,
      true
    );
  }, [reduce, duration, phase, t]);

  const style = useAnimatedStyle(() => ({
    transform: [
      { translateX: (t.value - 0.5) * 2 * drift },
      { translateY: (0.5 - t.value) * 1.4 * drift },
      { scale: 1 + t.value * 0.14 },
    ],
  }));

  return (
    <Animated.View
      pointerEvents="none"
      style={[{ position: 'absolute', left, top, width: size, height: size, marginLeft: -size / 2, marginTop: -size / 2 }, style]}
    >
      <Svg width={size} height={size} viewBox="0 0 100 100">
        <Defs>
          <RadialGradient id="orb" cx="50" cy="50" r="50" gradientUnits="userSpaceOnUse">
            <Stop offset="0" stopColor={color} stopOpacity={opacity} />
            <Stop offset="1" stopColor={color} stopOpacity={0} />
          </RadialGradient>
        </Defs>
        <Circle cx="50" cy="50" r="50" fill="url(#orb)" />
      </Svg>
    </Animated.View>
  );
}

/** Fondo inmersivo: luces ambientales difusas y animadas sobre #050507. */
export function Atmosphere() {
  return (
    <View pointerEvents="none" style={[StyleSheet.absoluteFill, { overflow: 'hidden' }]}>
      <Orb color="#3A3FD0" size={900} opacity={0.42} left="8%" top="6%" drift={70} duration={16000} />
      <Orb color="#C9A24B" size={760} opacity={0.34} left="92%" top="30%" drift={60} duration={21000} phase={0.4} />
      <Orb color="#6B2FA8" size={820} opacity={0.26} left="30%" top="78%" drift={80} duration={25000} phase={0.7} />
    </View>
  );
}
